import { Inject } from "@nestjs/common";
import {
	Ctx,
	Input,
	Mutation,
	Query,
	Router,
	UseMiddlewares,
} from "nestjs-trpc";
import { z } from "zod";
import type { AuthedTrpcContext } from "../trpc/context.types";
import { AuthMiddleware } from "../trpc/middlewares/auth.middleware";
import { restMeta } from "../trpc/openapi";
import { AutoInsuranceService } from "./auto-insurance.service";
import {
	SivLookupInputSchema,
	CreateVehicleInputSchema,
	CreateDriverProfileInputSchema,
	CreateInsuranceDossierInputSchema,
	UpdateDossierStatusInputSchema,
	ImportCommissionStatementInputSchema,
	DossierStatusSchema,
} from "@crm/validation";

@Router({ alias: "auto" })
@UseMiddlewares(AuthMiddleware)
export class AutoInsuranceRouter {
	constructor(
		@Inject(AutoInsuranceService)
		private readonly autoService: AutoInsuranceService,
	) {}

	// ==========================================
	// SIV & VÉHICULES
	// ==========================================

	@Query({
		input: SivLookupInputSchema,
		meta: restMeta("GET", "/auto/siv/{licensePlate}", ["Auto"]),
	})
	async lookupSiv(@Input("licensePlate") licensePlate: string) {
		return this.autoService.lookupSiv(licensePlate);
	}

	@Mutation({
		input: CreateVehicleInputSchema,
		meta: restMeta("POST", "/auto/vehicles", ["Auto"]),
	})
	async createVehicle(@Input() input: z.infer<typeof CreateVehicleInputSchema>) {
		return this.autoService.createVehicle(input);
	}

	@Query({
		input: z.object({ contactId: z.string() }),
		meta: restMeta("GET", "/auto/vehicles/by-contact/{contactId}", ["Auto"]),
	})
	async listVehiclesByContact(@Input("contactId") contactId: string) {
		return this.autoService.listVehiclesByContact(contactId);
	}

	// ==========================================
	// CONDUCTEURS
	// ==========================================

	@Mutation({
		input: CreateDriverProfileInputSchema,
		meta: restMeta("POST", "/auto/driver-profiles", ["Auto"]),
	})
	async createDriverProfile(
		@Input() input: z.infer<typeof CreateDriverProfileInputSchema>,
	) {
		return this.autoService.createDriverProfile(input);
	}

	@Query({
		input: z.object({ contactId: z.string() }),
		meta: restMeta("GET", "/auto/driver-profiles/{contactId}", ["Auto"]),
	})
	async getDriverProfile(@Input("contactId") contactId: string) {
		return this.autoService.getDriverProfileByContact(contactId);
	}

	// ==========================================
	// DOSSIERS ASSURANCE
	// ==========================================

	@Mutation({
		input: CreateInsuranceDossierInputSchema,
		meta: restMeta("POST", "/auto/dossiers", ["Auto"]),
	})
	async createDossier(
		@Input() input: z.infer<typeof CreateInsuranceDossierInputSchema>,
	) {
		return this.autoService.createDossier(input);
	}

	@Query({
		input: z
			.object({
				status: DossierStatusSchema.optional(),
				contactId: z.string().optional(),
			})
			.optional(),
		meta: restMeta("GET", "/auto/dossiers", ["Auto"]),
	})
	async listDossiers(
		@Input()
		input?: {
			status?: z.infer<typeof DossierStatusSchema>;
			contactId?: string;
		},
	) {
		return this.autoService.listDossiers(input);
	}

	@Mutation({
		input: UpdateDossierStatusInputSchema,
		meta: restMeta("PATCH", "/auto/dossiers/status", ["Auto"]),
	})
	async updateDossierStatus(
		@Input() input: z.infer<typeof UpdateDossierStatusInputSchema>,
	) {
		return this.autoService.updateDossierStatus(input);
	}

	// ==========================================
	// PARTENAIRES & COMMISSIONS
	// ==========================================

	@Query({
		meta: restMeta("GET", "/auto/broker-partners", ["Auto"]),
	})
	async listBrokerPartners() {
		return this.autoService.listBrokerPartners();
	}

	@Mutation({
		input: z.object({
			name: z.string(),
			contactName: z.string().optional(),
			email: z.string().optional(),
			phone: z.string().optional(),
			portalUrl: z.string().optional(),
			defaultAcquisitionCommission: z.number().optional(),
			defaultRenewCommissionRate: z.number().optional(),
		}),
		meta: restMeta("POST", "/auto/broker-partners", ["Auto"]),
	})
	async createBrokerPartner(
		@Input()
		input: {
			name: string;
			contactName?: string;
			email?: string;
			phone?: string;
			portalUrl?: string;
			defaultAcquisitionCommission?: number;
			defaultRenewCommissionRate?: number;
		},
	) {
		return this.autoService.createBrokerPartner(input);
	}

	@Mutation({
		input: ImportCommissionStatementInputSchema,
		meta: restMeta("POST", "/auto/commissions/import", ["Auto"]),
	})
	async importCommissionStatement(
		@Input() input: z.infer<typeof ImportCommissionStatementInputSchema>,
	) {
		return this.autoService.importAndReconcileStatement(input);
	}

	@Query({
		meta: restMeta("GET", "/auto/commissions/statements", ["Auto"]),
	})
	async listCommissionStatements() {
		return this.autoService.listCommissionStatements();
	}
}
