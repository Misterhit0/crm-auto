"use client";

import React, { useState } from "react";
import {
	Bot,
	Sparkles,
	Plus,
	Play,
	Pause,
	Settings,
	CheckCircle2,
	AlertTriangle,
	Clock,
	Layers,
	FileText,
	Smartphone,
	Car,
	DollarSign,
	ShieldCheck,
} from "lucide-react";
import { NavigationMenuSheet } from "@/components/navigation-menu-sheet";

type AgentCompetence = {
	id: string;
	name: string;
	category: "DOCUMENTAIRE" | "SIV" | "COMMISSIONS" | "RELANCE";
	status: "ACTIVE" | "PAUSED";
	description: string;
	trigger: string;
	executionsCount: number;
	lastRun: string;
	accuracy: string;
};

export default function AgentsBuilderPage() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [agents, setAgents] = useState<AgentCompetence[]>([
		{
			id: "agent-ri-chaser",
			name: "Agent Relance Documentaire (Priorité A.1)",
			category: "DOCUMENTAIRE",
			status: "ACTIVE",
			description:
				"Détecte automatiquement les Relevés d'Information (RI) et pièces d'identité manquants à J+3 et déclenche les relances SMS + email avec lien sécurisé smartphone.",
			trigger: "Quotidien à 08:30 + Événement nouveau dossier",
			executionsCount: 342,
			lastRun: "Il y a 14 min",
			accuracy: "99.4%",
		},
		{
			id: "agent-siv-enricher",
			name: "Agent Qualification SIV & Carte Grise",
			category: "SIV",
			status: "ACTIVE",
			description:
				"Interroge la base d'immatriculation nationale pour récupérer instantanément marque, modèle, puissance fiscale, VIN et date de mise en circulation sans saisie manuelle.",
			trigger: "À la frappe de la plaque (Web & Mobile)",
			executionsCount: 890,
			lastRun: "Il y a 2 min",
			accuracy: "100%",
		},
		{
			id: "agent-commission-matcher",
			name: "Agent Rapprochement Bordereaux Grossistes",
			category: "COMMISSIONS",
			status: "ACTIVE",
			description:
				"Compare ligne à ligne les fichiers de versements April, Maxance, Solly Azar avec les contrats enregistrés pour valider le virement ou pointer l'anomalie de commission.",
			trigger: "Import CSV / Excel ou API Grossiste",
			executionsCount: 156,
			lastRun: "Il y a 1 heure",
			accuracy: "93.5% Auto",
		},
		{
			id: "agent-hamon-retention",
			name: "Agent Échéances Loi Hamon (J-45)",
			category: "RELANCE",
			status: "PAUSED",
			description:
				"Identifie les contrats auto approchant leur date anniversaire de 45 jours pour proposer une réévaluation tarifaire proactive avant résiliation.",
			trigger: "Hebdomadaire le Lundi",
			executionsCount: 78,
			lastRun: "Il y a 4 jours",
			accuracy: "91.0%",
		},
	]);

	const toggleStatus = (id: string) => {
		setAgents((prev) =>
			prev.map((a) =>
				a.id === id
					? { ...a, status: a.status === "ACTIVE" ? "PAUSED" : "ACTIVE" }
					: a,
			),
		);
	};

	return (
		<div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen text-slate-100">
			{/* En-tête Apple HIG */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl">
				<div className="flex items-center gap-3">
					<div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25">
						<Sparkles className="size-6" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-white">
							Agent Builder & Compétences IA
						</h1>
						<p className="text-sm text-slate-400">
							Orchestrez les agents autonomes de traitement documentaire,
							qualification SIV et rapprochement.
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2.5">
					<button
						onClick={() => setMenuOpen(true)}
						className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-white shadow-md transition-all active:scale-95"
					>
						<Layers className="size-3.5 text-blue-400" />
						Toutes les Pages
					</button>

					<button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition-all active:scale-95">
						<Plus className="size-4" />
						Créer une Compétence
					</button>
				</div>
			</div>

			{/* Grille des Agents Autonomes */}
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				{agents.map((agent) => (
					<div
						key={agent.id}
						className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] hover:border-purple-500/30 transition-all duration-200 shadow-xl flex flex-col justify-between space-y-4"
					>
						<div className="space-y-3">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2.5">
									<div className="size-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center">
										<Bot className="size-5" />
									</div>
									<div>
										<h3 className="text-sm font-bold text-white">
											{agent.name}
										</h3>
										<span className="text-[10px] text-slate-400 font-mono">
											Déclencheur : {agent.trigger}
										</span>
									</div>
								</div>

								<button
									onClick={() => toggleStatus(agent.id)}
									className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
										agent.status === "ACTIVE"
											? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
											: "bg-slate-800 text-slate-400 border-white/10 hover:bg-slate-700"
									}`}
								>
									{agent.status === "ACTIVE" ? (
										<>
											<span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
											Actif
										</>
									) : (
										<>
											<Pause className="size-2.5" />
											En pause
										</>
									)}
								</button>
							</div>

							<p className="text-xs text-slate-300 leading-relaxed">
								{agent.description}
							</p>
						</div>

						<div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
							<div className="flex items-center gap-4">
								<span>
									Exécutions :{" "}
									<strong className="text-white">
										{agent.executionsCount}
									</strong>
								</span>
								<span>
									Précision :{" "}
									<strong className="text-emerald-400">{agent.accuracy}</strong>
								</span>
							</div>
							<span className="text-[11px] text-slate-500">
								{agent.lastRun}
							</span>
						</div>
					</div>
				))}
			</div>

			<NavigationMenuSheet open={menuOpen} onOpenChange={setMenuOpen} />
		</div>
	);
}
