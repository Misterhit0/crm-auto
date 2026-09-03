"use client";

import React, { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@crm/ui/components/dialog";
import {
	Car,
	User,
	Search,
	ShieldCheck,
	CheckCircle2,
	DollarSign,
	Plus,
	Edit,
	Check,
} from "lucide-react";
import type { DossierData } from "./dossier-sheet";

export function DossierCrudDialog({
	open,
	onOpenChange,
	dossier,
	onSave,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	dossier?: DossierData | null;
	onSave?: (data: any) => void;
}) {
	const isEdit = Boolean(dossier);
	const [ref, setRef] = useState(dossier?.ref || "");

	React.useEffect(() => {
		if (!ref && !dossier?.ref) {
			setRef(`DOS-2026-${Date.now().toString().slice(-4)}`);
		}
	}, [ref, dossier]);
	const [clientName, setClientName] = useState(dossier?.client.name || "");
	const [clientPhone, setClientPhone] = useState(dossier?.client.phone || "06 12 34 56 78");
	const [clientEmail, setClientEmail] = useState(dossier?.client.email || "");
	const [bonusMalus, setBonusMalus] = useState(dossier?.client.bonusMalus || "Bonus 0.50 (50%)");
	const [plate, setPlate] = useState(dossier?.vehicle.plate || "");
	const [brand, setBrand] = useState(dossier?.vehicle.brand || "");
	const [model, setModel] = useState(dossier?.vehicle.model || "");
	const [formula, setFormula] = useState<"TIERS" | "TIERS_PLUS" | "TOUS_RISQUES">(
		dossier?.formula || "TOUS_RISQUES",
	);
	const [partner, setPartner] = useState(dossier?.partner || "April Auto");
	const [premium, setPremium] = useState(dossier?.annualPremium || "580 €/an");
	const [comm, setComm] = useState(dossier?.commissionAmount || "85 €");

	const handleSivAutocomplete = () => {
		if (!plate.trim()) return;
		const clean = plate.toUpperCase().replace(/[\s-]/g, "");
		if (clean.includes("208") || clean === "AB123CD") {
			setBrand("PEUGEOT");
			setModel("208 II PureTech 100");
		} else if (clean.includes("GOLF") || clean === "IJ789KL") {
			setBrand("VOLKSWAGEN");
			setModel("GOLF VIII TDI");
		} else {
			setBrand("RENAULT");
			setModel("CLIO V TCe");
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave?.({
			id: dossier?.id || ref,
			ref,
			client: {
				name: clientName,
				phone: clientPhone,
				email: clientEmail,
				address: "Adresse renseignée",
				bonusMalus,
				licenseDate: "2015",
			},
			vehicle: {
				plate,
				brand: brand || "VÉHICULE",
				model: model || "MODÈLE",
				version: "Finition standard",
				firstReg: "2021",
				power: "5 CV",
				fuel: "Essence",
				vin: "VF1AUTONOMOUS12345",
			},
			formula,
			partner,
			annualPremium: premium,
			monthlyPremium: "45 €/mois",
			commissionAmount: comm,
			commissionStatus: "PENDING",
			status: dossier?.status || "PROSPECT",
			missingDoc: null,
			daysWaiting: 0,
		});
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-xl rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-white/[0.1] shadow-2xl p-6 text-slate-100">
				<DialogHeader>
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
							{isEdit ? <Edit className="size-5" /> : <Plus className="size-5" />}
						</div>
						<div>
							<DialogTitle className="text-lg font-bold text-white tracking-tight">
								{isEdit ? `Modifier le Dossier ${dossier?.ref}` : "Créer un Nouveau Dossier Auto"}
							</DialogTitle>
							<DialogDescription className="text-xs text-slate-400">
								{isEdit
									? "Mettez à jour les informations du véhicule, du client ou de la commission."
									: "Renseignez la plaque SIV et l'assuré pour initialiser la qualification."}
							</DialogDescription>
						</div>
					</div>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4 my-2">
					{/* Section 1 : Véhicule & SIV */}
					<div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2.5">
						<span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
							<Car className="size-3.5" />
							1. Véhicule & Immatriculation (SIV)
						</span>

						<div className="flex gap-2">
							<div className="relative flex-1">
								<input
									type="text"
									placeholder="Plaque (Ex: AB-123-CD)"
									value={plate}
									onChange={(e) => setPlate(e.target.value.toUpperCase())}
									className="w-full px-3.5 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white font-mono uppercase text-xs font-bold focus:outline-none focus:ring-1 focus:ring-blue-500"
								/>
							</div>
							<button
								type="button"
								onClick={handleSivAutocomplete}
								className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all active:scale-95 flex items-center gap-1.5"
							>
								<Search className="size-3.5" />
								Lookup
							</button>
						</div>

						<div className="grid grid-cols-2 gap-2">
							<input
								type="text"
								placeholder="Marque (ex: PEUGEOT)"
								value={brand}
								onChange={(e) => setBrand(e.target.value)}
								className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none"
							/>
							<input
								type="text"
								placeholder="Modèle (ex: 208 II)"
								value={model}
								onChange={(e) => setModel(e.target.value)}
								className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none"
							/>
						</div>
					</div>

					{/* Section 2 : Assuré Conducteur */}
					<div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2.5">
						<span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
							<User className="size-3.5" />
							2. Assuré & Coordonnées Client
						</span>

						<div className="grid grid-cols-2 gap-2">
							<input
								type="text"
								placeholder="Nom & Prénom"
								value={clientName}
								onChange={(e) => setClientName(e.target.value)}
								required
								className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none"
							/>
							<input
								type="tel"
								placeholder="Téléphone portable"
								value={clientPhone}
								onChange={(e) => setClientPhone(e.target.value)}
								className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none"
							/>
						</div>

						<div className="grid grid-cols-2 gap-2">
							<input
								type="email"
								placeholder="Email"
								value={clientEmail}
								onChange={(e) => setClientEmail(e.target.value)}
								className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none"
							/>
							<select
								value={bonusMalus}
								onChange={(e) => setBonusMalus(e.target.value)}
								className="px-3 py-2 rounded-xl bg-slate-900 border border-white/[0.08] text-white text-xs font-semibold focus:outline-none"
							>
								<option value="Bonus 0.50 (50%)">Bonus 0.50 (50%)</option>
								<option value="Bonus 0.60 (40%)">Bonus 0.60 (40%)</option>
								<option value="Bonus 0.72 (28%)">Bonus 0.72 (28%)</option>
								<option value="Bonus 0.85 (15%)">Bonus 0.85 (15%)</option>
								<option value="Neutre 1.00">Neutre 1.00</option>
								<option value="Malus 1.15">Malus 1.15</option>
							</select>
						</div>
					</div>

					{/* Section 3 : Formule & Partenaire Grossiste */}
					<div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-2.5">
						<span className="text-[11px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
							<DollarSign className="size-3.5" />
							3. Offre, Grossiste & Commission
						</span>

						<div className="grid grid-cols-2 gap-2">
							<select
								value={partner}
								onChange={(e) => setPartner(e.target.value)}
								className="px-3 py-2 rounded-xl bg-slate-900 border border-white/[0.08] text-white text-xs font-semibold focus:outline-none"
							>
								<option value="April Auto">April Auto</option>
								<option value="Maxance">Maxance</option>
								<option value="Solly Azar">Solly Azar</option>
								<option value="Netvox">Netvox</option>
								<option value="Allianz Courtage">Allianz Courtage</option>
							</select>

							<select
								value={formula}
								onChange={(e) => setFormula(e.target.value as any)}
								className="px-3 py-2 rounded-xl bg-slate-900 border border-white/[0.08] text-white text-xs font-semibold focus:outline-none"
							>
								<option value="TOUS_RISQUES">Tous Risques</option>
								<option value="TIERS_PLUS">Tiers Étendu / Plus</option>
								<option value="TIERS">Tiers Simple (Mini)</option>
							</select>
						</div>

						<div className="grid grid-cols-2 gap-2">
							<input
								type="text"
								placeholder="Prime (ex: 620 €/an)"
								value={premium}
								onChange={(e) => setPremium(e.target.value)}
								className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none"
							/>
							<input
								type="text"
								placeholder="Commission (ex: 95 €)"
								value={comm}
								onChange={(e) => setComm(e.target.value)}
								className="px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs focus:outline-none"
							/>
						</div>
					</div>

					<DialogFooter className="pt-2 gap-2">
						<button
							type="button"
							onClick={() => onOpenChange(false)}
							className="px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-semibold"
						>
							Annuler
						</button>
						<button
							type="submit"
							className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-500/25 transition-all active:scale-95"
						>
							{isEdit ? "Enregistrer les modifications" : "Créer le dossier"}
						</button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
