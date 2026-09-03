"use client";

import React, { useState } from "react";
import {
	Car,
	User,
	FileText,
	ShieldCheck,
	Clock,
	DollarSign,
	Send,
	CheckCircle2,
	AlertCircle,
	Bot,
	Phone,
	Mail,
	Upload,
	ExternalLink,
	Sparkles,
} from "lucide-react";
import {
	DetailSheet,
	DetailSheetBody,
	DetailSheetHeader,
	DetailSheetProperties,
	DetailSheetProperty,
	DetailSheetSection,
	DetailSheetStat,
	DetailSheetStats,
	DetailSheetTabs,
	type DetailSheetTab,
} from "@/components/detail-sheet";

export type DossierData = {
	id: string;
	ref: string;
	client: {
		name: string;
		phone: string;
		email: string;
		address: string;
		bonusMalus: string;
		licenseDate: string;
	};
	vehicle: {
		plate: string;
		brand: string;
		model: string;
		version: string;
		firstReg: string;
		power: string;
		fuel: string;
		vin: string;
	};
	formula: "TIERS" | "TIERS_PLUS" | "TOUS_RISQUES";
	partner: string;
	annualPremium: string;
	monthlyPremium: string;
	commissionAmount: string;
	commissionStatus: "RECONCILED" | "PENDING" | "DISCREPANCY";
	status: "PROSPECT" | "PIECES" | "DEVIS" | "ACTIF";
	missingDoc: string | null;
	daysWaiting: number;
};

export function DossierSheet({
	dossier,
	open,
	onOpenChange,
}: {
	dossier: DossierData | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [activeTab, setActiveTab] = useState("overview");
	const [relanceSent, setRelanceSent] = useState(false);
	const [agentPrompt, setAgentPrompt] = useState("");
	const [agentMessages, setAgentMessages] = useState<
		Array<{ role: "agent" | "user"; text: string }>
	>([
		{
			role: "agent",
			text: "Bonjour ! Je suis votre copilote courtage. Ce dossier attend le Relevé d'Information depuis 3 jours. Voulez-vous que je génère le SMS de rappel à l'assuré ?",
		},
	]);

	if (!dossier) return null;

	const handleSendRelance = () => {
		setRelanceSent(true);
		setAgentMessages((prev) => [
			...prev,
			{
				role: "agent",
				text: `✅ Relance SMS & Email envoyée à ${dossier.client.name} (${dossier.client.phone}) avec le lien de téléversement sécurisé pour le Relevé d'Information.`,
			},
		]);
	};

	const handleAgentSend = (e: React.FormEvent) => {
		e.preventDefault();
		if (!agentPrompt.trim()) return;

		const userMsg = agentPrompt;
		setAgentPrompt("");
		setAgentMessages((prev) => [
			...prev,
			{ role: "user", text: userMsg },
			{
				role: "agent",
				text: `Sur ce dossier ${dossier.ref} (${dossier.vehicle.brand} ${dossier.vehicle.model}), le barème April Auto applique une commission de 15% TTC. Le Relevé d'information avec un bonus de ${dossier.client.bonusMalus} permettra d'obtenir l'accord définitif sous 24h.`,
			},
		]);
	};

	const tabs: DetailSheetTab[] = [
		{
			value: "overview",
			label: "Véhicule & Client",
			content: (
				<DetailSheetBody>
					<DetailSheetSection title="Véhicule (Lookup SIV Authentifié)">
						<DetailSheetProperties>
							<DetailSheetProperty label="Immatriculation">
								<span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
									{dossier.vehicle.plate}
								</span>
							</DetailSheetProperty>
							<DetailSheetProperty label="Marque & Modèle">
								<span className="font-semibold text-white">
									{dossier.vehicle.brand} {dossier.vehicle.model}
								</span>
							</DetailSheetProperty>
							<DetailSheetProperty label="Version / Finition">
								<span className="text-slate-300">{dossier.vehicle.version}</span>
							</DetailSheetProperty>
							<DetailSheetProperty label="1ère Mise en circ.">
								<span>{dossier.vehicle.firstReg}</span>
							</DetailSheetProperty>
							<DetailSheetProperty label="Puissance & Énergie">
								<span>
									{dossier.vehicle.power} • {dossier.vehicle.fuel}
								</span>
							</DetailSheetProperty>
							<DetailSheetProperty label="Numéro de série VIN">
								<span className="font-mono text-slate-400 text-xs">
									{dossier.vehicle.vin}
								</span>
							</DetailSheetProperty>
						</DetailSheetProperties>
					</DetailSheetSection>

					<DetailSheetSection title="Profil Conducteur Principal">
						<DetailSheetProperties>
							<DetailSheetProperty label="Titulaire">
								<span className="font-semibold text-white">{dossier.client.name}</span>
							</DetailSheetProperty>
							<DetailSheetProperty label="Coefficient CRM">
								<span className="font-bold text-emerald-400">
									{dossier.client.bonusMalus}
								</span>
							</DetailSheetProperty>
							<DetailSheetProperty label="Date d'obtention permis">
								<span>{dossier.client.licenseDate}</span>
							</DetailSheetProperty>
							<DetailSheetProperty label="Coordonnées">
								<div className="flex flex-col gap-1 text-xs">
									<a
										href={`tel:${dossier.client.phone}`}
										className="flex items-center gap-1 text-blue-400 hover:underline"
									>
										<Phone className="size-3" />
										{dossier.client.phone}
									</a>
									<a
										href={`mailto:${dossier.client.email}`}
										className="flex items-center gap-1 text-slate-400 hover:underline"
									>
										<Mail className="size-3" />
										{dossier.client.email}
									</a>
								</div>
							</DetailSheetProperty>
						</DetailSheetProperties>
					</DetailSheetSection>
				</DetailSheetBody>
			),
		},
		{
			value: "documents",
			label: "Pièces & RI",
			count: dossier.missingDoc ? 1 : 0,
			content: (
				<DetailSheetBody>
					{dossier.missingDoc && (
						<div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-200 space-y-3">
							<div className="flex items-start gap-3">
								<AlertCircle className="size-5 text-amber-400 shrink-0 mt-0.5" />
								<div>
									<h4 className="text-sm font-semibold">Pièce bloquante : {dossier.missingDoc}</h4>
									<p className="text-xs text-amber-300/80 mt-1">
										Dossier en attente depuis {dossier.daysWaiting} jours. La tarification définitive et l'émission de la carte verte exigent ce document.
									</p>
								</div>
							</div>

							<div className="pt-2 flex items-center gap-3">
								<button
									onClick={handleSendRelance}
									disabled={relanceSent}
									className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-all active:scale-95 disabled:opacity-50"
								>
									<Send className="size-3.5" />
									{relanceSent ? "Relance envoyée par SMS" : "Relancer le client (SMS + Email)"}
								</button>
								<button className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] text-white text-xs font-medium transition-all">
									<Upload className="size-3.5" />
									Déposer le fichier reçu
								</button>
							</div>
						</div>
					)}

					<DetailSheetSection title="Contrôle des pièces justificatives">
						<div className="space-y-2 text-xs">
							<div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
								<div className="flex items-center gap-2.5">
									<CheckCircle2 className="size-4 text-emerald-400" />
									<div>
										<p className="font-semibold text-white">Certificat d'immatriculation (Carte Grise)</p>
										<p className="text-[11px] text-slate-400">Validé via API SIV • AB-123-CD</p>
									</div>
								</div>
								<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
									Conforme
								</span>
							</div>

							<div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
								<div className="flex items-center gap-2.5">
									<CheckCircle2 className="size-4 text-emerald-400" />
									<div>
										<p className="font-semibold text-white">Permis de conduire (Recto / Verso)</p>
										<p className="text-[11px] text-slate-400">Vérifié OCR • Date d'obtention 2014</p>
									</div>
								</div>
								<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
									Conforme
								</span>
							</div>

							<div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.08]">
								<div className="flex items-center gap-2.5">
									{dossier.missingDoc?.includes("Relevé") ? (
										<Clock className="size-4 text-amber-400" />
									) : (
										<CheckCircle2 className="size-4 text-emerald-400" />
									)}
									<div>
										<p className="font-semibold text-white">Relevé d'Information (36 mois)</p>
										<p className="text-[11px] text-slate-400">
											{dossier.missingDoc?.includes("Relevé")
												? "En attente retour assuré"
												: "Vérifié • 0 sinistre responsable"}
										</p>
									</div>
								</div>
								<span
									className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
										dossier.missingDoc?.includes("Relevé")
											? "bg-amber-500/10 text-amber-400 border-amber-500/20"
											: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
									}`}
								>
									{dossier.missingDoc?.includes("Relevé") ? "Manquant" : "Conforme"}
								</span>
							</div>
						</div>
					</DetailSheetSection>
				</DetailSheetBody>
			),
		},
		{
			value: "pricing",
			label: "Tarification Grossiste",
			content: (
				<DetailSheetBody>
					<DetailSheetSection title="Offre & Grossiste Retenu">
						<DetailSheetProperties>
							<DetailSheetProperty label="Partenaire">
								<span className="font-semibold text-white">{dossier.partner}</span>
							</DetailSheetProperty>
							<DetailSheetProperty label="Formule">
								<span className="px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold text-xs">
									{dossier.formula.replace("_", " ")}
								</span>
							</DetailSheetProperty>
							<DetailSheetProperty label="Prime Annuelle TTC">
								<span className="font-bold text-white text-base">
									{dossier.annualPremium}
								</span>
							</DetailSheetProperty>
							<DetailSheetProperty label="Mensualité">
								<span className="text-slate-300">{dossier.monthlyPremium}</span>
							</DetailSheetProperty>
						</DetailSheetProperties>
					</DetailSheetSection>

					<DetailSheetSection title="Garanties & Options souscrites">
						<div className="grid grid-cols-2 gap-2 text-xs">
							<div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-200 flex items-center gap-2">
								<CheckCircle2 className="size-3.5 text-blue-400" />
								Assistance 0 km avec remorquage
							</div>
							<div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-200 flex items-center gap-2">
								<CheckCircle2 className="size-3.5 text-blue-400" />
								Véhicule de prêt 15 jours
							</div>
							<div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-200 flex items-center gap-2">
								<CheckCircle2 className="size-3.5 text-blue-400" />
								Protection Juridique Automobile
							</div>
							<div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-slate-200 flex items-center gap-2">
								<CheckCircle2 className="size-3.5 text-blue-400" />
								Bris de glace sans franchise
							</div>
						</div>
					</DetailSheetSection>
				</DetailSheetBody>
			),
		},
		{
			value: "commissions",
			label: "Commissions",
			content: (
				<DetailSheetBody>
					<DetailSheetSection title="Rétrocession Courtier & Rapprochement">
						<DetailSheetProperties>
							<DetailSheetProperty label="Commission attendue">
								<span className="font-bold text-emerald-400 text-base">
									{dossier.commissionAmount}
								</span>
							</DetailSheetProperty>
							<DetailSheetProperty label="Statut Rapprochement">
								<span
									className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
										dossier.commissionStatus === "RECONCILED"
											? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
											: "bg-amber-500/10 text-amber-400 border-amber-500/20"
									}`}
								>
									{dossier.commissionStatus === "RECONCILED"
										? "Rapproché sur bordereau"
										: "En attente bordereau mensuel"}
								</span>
							</DetailSheetProperty>
							<DetailSheetProperty label="Base de calcul">
								<span className="text-slate-300">Prime Nette HT × 15.0%</span>
							</DetailSheetProperty>
						</DetailSheetProperties>
					</DetailSheetSection>
				</DetailSheetBody>
			),
		},
		{
			value: "agent",
			label: "Agent Copilote",
			content: (
				<div className="flex flex-col h-[520px] p-4">
					<div className="flex-1 overflow-y-auto space-y-3 pr-2">
						{agentMessages.map((msg, i) => (
							<div
								key={i}
								className={`flex gap-3 text-xs leading-relaxed ${
									msg.role === "user" ? "justify-end" : "justify-start"
								}`}
							>
								{msg.role === "agent" && (
									<div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white size-8 shrink-0 flex items-center justify-center shadow-md">
										<Bot className="size-4" />
									</div>
								)}
								<div
									className={`p-3.5 rounded-2xl max-w-[85%] ${
										msg.role === "user"
											? "bg-blue-600 text-white"
											: "bg-white/[0.05] border border-white/[0.1] text-slate-200"
									}`}
								>
									{msg.text}
								</div>
							</div>
						))}
					</div>

					<form onSubmit={handleAgentSend} className="mt-4 flex gap-2 pt-2 border-t border-white/[0.08]">
						<input
							type="text"
							placeholder="Demandez à l'agent (ex: Rédige le SMS de relance pour le RI...)"
							value={agentPrompt}
							onChange={(e) => setAgentPrompt(e.target.value)}
							className="flex-1 px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
						/>
						<button
							type="submit"
							className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/25 transition-all active:scale-95"
						>
							<Send className="size-4" />
						</button>
					</form>
				</div>
			),
		},
	];

	return (
		<DetailSheet open={open} onOpenChange={onOpenChange} size="2xl">
			<DetailSheetHeader
				title={`${dossier.ref} · ${dossier.client.name}`}
				description={`${dossier.vehicle.brand} ${dossier.vehicle.model} (${dossier.vehicle.plate})`}
				onClose={() => onOpenChange(false)}
			/>
			<DetailSheetStats>
				<DetailSheetStat label="Formule">
					<span className="font-semibold text-white">
						{dossier.formula.replace("_", " ")}
					</span>
				</DetailSheetStat>
				<DetailSheetStat label="Prime Annuelle">
					<span className="font-bold text-white">{dossier.annualPremium}</span>
				</DetailSheetStat>
				<DetailSheetStat label="Commission Apporteur">
					<span className="font-bold text-emerald-400">
						{dossier.commissionAmount}
					</span>
				</DetailSheetStat>
				<DetailSheetStat label="Partenaire">
					<span className="text-slate-300">{dossier.partner}</span>
				</DetailSheetStat>
			</DetailSheetStats>
			<DetailSheetTabs
				tabs={tabs}
				value={activeTab}
				onValueChange={setActiveTab}
			/>
		</DetailSheet>
	);
}
