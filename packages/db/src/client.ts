import "@crm/env/load";

import { PrismaPg } from "@prisma/adapter-pg";
import { type Prisma, PrismaClient } from "./generated/prisma/client";

// ─── Connection string helpers ────────────────────────────────────────────────
// NOTE: These are called INSIDE createPrismaClient(), not at module load time.
// This makes the module safely importable without DATABASE_URL (e.g. during
// Next.js build static analysis) while still throwing clearly at runtime when
// the DB is actually first accessed.

function liveDatabase(): string {
	const url = process.env.DATABASE_URL;

	if (!url) {
		throw new Error(
			"DATABASE_URL is not set. Copy .env.example to .env at the root of the repo and fill it in, or set DATABASE_URL in the environment.",
		);
	}

	return url;
}

function testDatabase(): string {
	const url = process.env.TEST_DATABASE_URL;

	if (!url) {
		throw new Error(
			[
				"TEST_DATABASE_URL is not set, and the suite will not fall back to DATABASE_URL.",
				"",
				"These are real integration tests. They delete every workspace member and the",
				"organization row and put them back when the run finishes — so a run that is",
				"interrupted leaves everybody locked out of whatever database it was pointed at.",
				"The pre-push hook runs them, so that is one `git push` away from a database you",
				"care about.",
				"",
				"Make a throwaway one and point TEST_DATABASE_URL at it:",
				"",
				"    bun run db:test",
				"",
			].join("\n"),
		);
	}

	if (!databaseName(url).endsWith("_test")) {
		throw new Error(
			`TEST_DATABASE_URL must name a database ending in _test, so it cannot be one somebody is using. It names "${databaseName(url)}".`,
		);
	}

	return url;
}

function databaseName(url: string): string {
	try {
		return new URL(url).pathname.replace(/^\//, "");
	} catch {
		return url;
	}
}

// ─── Logging ──────────────────────────────────────────────────────────────────

export interface PrismaLogRecord {
	level: Prisma.LogLevel;
	message: string;
	target: string;
	durationMs?: number;
}

export type PrismaLogSink = (record: PrismaLogRecord) => void;

const consoleSink: PrismaLogSink = ({ level, message, target, durationMs }) => {
	const suffix = durationMs === undefined ? "" : ` (+${durationMs}ms)`;
	const line = `[prisma:${level}] ${message}${suffix} [${target}]`;

	if (level === "error") {
		console.error(line);
	} else if (level === "warn") {
		console.warn(line);
	} else {
		console.log(line);
	}
};

let sink: PrismaLogSink = consoleSink;

export function setPrismaLogSink(next: PrismaLogSink | null): void {
	sink = next ?? consoleSink;
}

// ─── Client factory ───────────────────────────────────────────────────────────

const logQueries = process.env.PRISMA_LOG_QUERIES === "true";

const logDefinitions: Prisma.LogDefinition[] = [
	{ level: "warn", emit: "event" },
	{ level: "error", emit: "event" },
	...(logQueries
		? ([
				{ level: "query", emit: "event" },
				{ level: "info", emit: "event" },
			] satisfies Prisma.LogDefinition[])
		: []),
];

const createPrismaClient = () => {
	// Computed here (lazily) so that importing this module does not throw when
	// DATABASE_URL is absent — which happens during Next.js build analysis.
	const connectionString =
		process.env.NODE_ENV === "test" ? testDatabase() : liveDatabase();

	const client = new PrismaClient({
		adapter: new PrismaPg({ connectionString }),
		log: logDefinitions,
	});

	client.$on("error", ({ message, target }) => {
		sink({ level: "error", message, target });
	});
	client.$on("warn", ({ message, target }) => {
		sink({ level: "warn", message, target });
	});
	client.$on("info", ({ message, target }) => {
		sink({ level: "info", message, target });
	});
	client.$on("query", ({ query, duration, target }) => {
		sink({ level: "query", message: query, target, durationMs: duration });
	});

	return client;
};

// ─── Lazy singleton ───────────────────────────────────────────────────────────
// We use a Proxy so that `db` can be imported at module level anywhere in the
// codebase without triggering client creation (and therefore without requiring
// DATABASE_URL to be present at import time).  The underlying PrismaClient is
// only instantiated on the first property access.

declare global {
	var prisma: ReturnType<typeof createPrismaClient> | undefined;
}

type DbClient = ReturnType<typeof createPrismaClient>;

function getOrCreate(): DbClient {
	if (globalThis.prisma) return globalThis.prisma;
	const instance = createPrismaClient();
	if (process.env.NODE_ENV !== "production") {
		globalThis.prisma = instance;
	}
	return instance;
}

export const db = new Proxy({} as DbClient, {
	get(_, prop: string | symbol) {
		return Reflect.get(getOrCreate(), prop);
	},
	set(_, prop: string | symbol, value: unknown) {
		return Reflect.set(getOrCreate(), prop, value);
	},
}) as DbClient;

export type Db = typeof db;
