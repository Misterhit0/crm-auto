"use client";

import React, { useState } from "react";
import {
	Settings,
	Layers,
	Users,
	ShieldCheck,
	Key,
	Building2,
	Bell,
	CheckCircle2,
	Save,
	FileText,
	DollarSign,
} from "lucide-react";
import { NavigationMenuSheet } from "@/components/navigation-menu-sheet";

export default function SettingsPage() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [activeTab, setActiveTab] = useState<"general" | "team" | "grossistes" | "api">("general");

	const [cabinetName, setCabinetName] = useState("Cabinet NIL Courtage Auto");
	const [orias, setOrias] = useState("18004521");
	const [siren, setSiren] = useState("849 558 150");
	const [saved, setSaved] = useState(false);

	const handleSave = (e: React.FormEvent) => {
		e.preventDefault();
		setSaved(true);
		setTimeout(() => setSaved(false), 2000);
	};

	return (
		<div className="p-8 space-y-8 max-w-[1400px] mx-auto min-h-screen text-slate-100">
			{/* En-tête Apple HIG */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl">
				<div className="flex items-center gap-3">
					<div className="p-2.5 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-lg shadow-black/40 border border-white/10">
						<Settings className="size-6" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-white">
							Paramètres du Workspace
						</h1>
						<p className="text-sm text-slate-400">
							Configuration générale du cabinet, partenaires grossistes, équipe et clés d'API.
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
				</div>
			</div>

			{/* Onglets de Navigation Settings */}
			<div className="flex border-b border-white/[0.08] gap-2 pb-2">
				{[
					{ id: "general", label: "Général & ORIAS", icon: Building2 },
					{ id: "team", label: "Membres de l'Équipe", icon: Users },
					{ id: "grossistes", label: "Grossistes & Grilles", icon: DollarSign },
					{ id: "api", label: "Clés d'API & Webhooks", icon: Key },
				].map((tab) => {
					const Icon = tab.icon;
					const isActive = activeTab === tab.id;
					return (
						<button
							key={tab.id}
							onClick={() => setActiveTab(tab.id as any)}
							className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
								isActive
									? "bg-white/[0.1] text-white shadow-md"
									: "text-slate-400 hover:text-white hover:bg-white/[0.04]"
							}`}
						>
							<Icon className="size-3.5" />
							{tab.label}
						</button>
					);
				})}
			</div>

			{/* Contenu Onglet 1 : Général */}
			{activeTab === "general" && (
				<form onSubmit={handleSave} className="max-w-2xl space-y-6">
					<div className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-xl space-y-4">
						<h3 className="text-sm font-bold text-white">Identité du Cabinet de Courtage</h3>

						<div className="space-y-3">
							<div>
								<label className="text-xs text-slate-400 font-medium">Raison Sociale</label>
								<input
									type="text"
									value={cabinetName}
									onChange={(e) => setCabinetName(e.target.value)}
									className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
								/>
							</div>

							<div className="grid grid-cols-2 gap-3">
								<div>
									<label className="text-xs text-slate-400 font-medium">N° ORIAS</label>
									<input
										type="text"
										value={orias}
										onChange={(e) => setOrias(e.target.value)}
										className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
								</div>
								<div>
									<label className="text-xs text-slate-400 font-medium">SIREN</label>
									<input
										type="text"
										value={siren}
										onChange={(e) => setSiren(e.target.value)}
										className="w-full mt-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
									/>
								</div>
							</div>
						</div>

						<div className="pt-2 flex justify-end">
							<button
								type="submit"
								className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md transition-all active:scale-95"
							>
								{saved ? (
									<>
										<CheckCircle2 className="size-3.5 text-emerald-300" />
										Enregistré !
									</>
								) : (
									<>
										<Save className="size-3.5" />
										Enregistrer les modifications
									</>
								)}
							</button>
						</div>
					</div>
				</form>
			)}

			{/* Contenu Onglet 2 : Équipe */}
			{activeTab === "team" && (
				<div className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-xl space-y-4 max-w-3xl">
					<h3 className="text-sm font-bold text-white">Courtiers & Collaborateurs</h3>
					<div className="space-y-2 text-xs">
						{[
							{ name: "Benjamin Grégoire", role: "Courtier Titulaire (Admin)", email: "benjamin@nilcourtage.fr" },
							{ name: "Sarah Benali", role: "Conseillère Souscription Auto", email: "sarah@nilcourtage.fr" },
							{ name: "Agent Autonome Comp AI", role: "Agent IA Orchestrateur", email: "eve@compai.internal" },
						].map((u, idx) => (
							<div
								key={idx}
								className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
							>
								<div>
									<p className="font-bold text-white">{u.name}</p>
									<p className="text-slate-400 text-[11px]">{u.email}</p>
								</div>
								<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/[0.08] text-slate-300">
									{u.role}
								</span>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Contenu Onglet 3 : Grossistes */}
			{activeTab === "grossistes" && (
				<div className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-xl space-y-4 max-w-3xl">
					<h3 className="text-sm font-bold text-white">Grossistes Partenaires Connectés</h3>
					<div className="space-y-2 text-xs">
						{[
							{ name: "April Auto", code: "APRIL-8841", status: "Actif (API Direct)", rate: "12.5% linéaire" },
							{ name: "Maxance", code: "MAX-9012", status: "Actif (Bordereaux mensuels)", rate: "14.0% linéaire" },
							{ name: "Solly Azar", code: "SAZ-3310", status: "Actif (Bordereaux mensuels)", rate: "11.0% linéaire" },
							{ name: "Netvox", code: "NET-4512", status: "Actif", rate: "13.0% linéaire" },
						].map((g, idx) => (
							<div
								key={idx}
								className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
							>
								<div>
									<p className="font-bold text-white">{g.name}</p>
									<p className="text-slate-400 text-[11px]">Identifiant : {g.code}</p>
								</div>
								<div className="text-right">
									<span className="font-bold text-emerald-400">{g.rate}</span>
									<p className="text-[10px] text-slate-500">{g.status}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Contenu Onglet 4 : API */}
			{activeTab === "api" && (
				<div className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] shadow-xl space-y-4 max-w-2xl text-xs">
					<h3 className="text-sm font-bold text-white">Intégrations & Webhooks</h3>
					<div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
						<span className="text-slate-400 text-[11px]">Clé API SIV Immatriculation</span>
						<p className="font-mono text-slate-200">siv_live_9f81a7b64c2e01</p>
					</div>
					<div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1">
						<span className="text-slate-400 text-[11px]">Passerelle SMS Relances RI</span>
						<p className="font-mono text-slate-200">sms_gateway_active (Twilio/Brevo)</p>
					</div>
				</div>
			)}

			<NavigationMenuSheet open={menuOpen} onOpenChange={setMenuOpen} />
		</div>
	);
}
