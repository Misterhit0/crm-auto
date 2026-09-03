"use client";

import React, { useState } from "react";
import {
	Camera,
	Car,
	Search,
	CheckCircle2,
	Upload,
	ArrowRight,
	Sparkles,
	Phone,
	User,
	ShieldAlert,
} from "lucide-react";

export function MobileQuickIntake({
	onSuccess,
}: {
	onSuccess?: (data: any) => void;
}) {
	const [plate, setPlate] = useState("");
	const [clientName, setClientName] = useState("");
	const [clientPhone, setClientPhone] = useState("");
	const [bonusMalus, setBonusMalus] = useState("0.50");
	const [isSearching, setIsSearching] = useState(false);
	const [vehicleData, setVehicleData] = useState<any>(null);
	const [uploadedLicense, setUploadedLicense] = useState(false);
	const [uploadedRI, setUploadedRI] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const handlePlateSearch = (e: React.FormEvent) => {
		e.preventDefault();
		if (!plate.trim()) return;

		setIsSearching(true);
		setTimeout(() => {
			const clean = plate.toUpperCase().replace(/[\s-]/g, "");
			if (clean.includes("208") || clean === "AB123CD") {
				setVehicleData({
					brand: "PEUGEOT",
					model: "208 II 1.2 PureTech 100",
					power: "5 CV",
					fuel: "Essence",
					vin: "VF3UPHNKMPW123456",
				});
			} else {
				setVehicleData({
					brand: "RENAULT",
					model: "CLIO V 1.0 TCe",
					power: "5 CV",
					fuel: "Essence",
					vin: "VF1RJA00564987123",
				});
			}
			setIsSearching(false);
		}, 400);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSubmitted(true);
		if (onSuccess) {
			onSuccess({
				plate,
				clientName,
				clientPhone,
				bonusMalus,
				vehicleData,
			});
		}
	};

	if (submitted) {
		return (
			<div className="p-6 rounded-3xl bg-gradient-to-b from-emerald-950/60 to-slate-900 border border-emerald-500/30 text-center space-y-4 animate-in fade-in zoom-in-95">
				<div className="size-14 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
					<CheckCircle2 className="size-8" />
				</div>
				<h3 className="text-xl font-bold text-white">Dossier Créé avec Succès !</h3>
				<p className="text-xs text-slate-300">
					Référence : <span className="font-mono font-bold text-emerald-400">DOS-2026-0042</span>
				</p>
				<p className="text-xs text-slate-400">
					La demande a été ajoutée au Pipeline et les relances documentaires automatiques sont activées.
				</p>
				<button
					onClick={() => {
						setSubmitted(false);
						setPlate("");
						setVehicleData(null);
						setClientName("");
						setClientPhone("");
					}}
					className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-all"
				>
					Nouveau Dossier Express
				</button>
			</div>
		);
	}

	return (
		<div className="p-5 rounded-3xl bg-slate-950/80 backdrop-blur-2xl border border-white/[0.08] shadow-2xl space-y-5">
			<div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
				<div className="flex items-center gap-2.5">
					<div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/25">
						<Car className="size-5" />
					</div>
					<div>
						<h3 className="text-base font-bold text-white">Saisie Express Terrain</h3>
						<p className="text-[11px] text-slate-400">Plaque SIV & Scan pièces en 30s</p>
					</div>
				</div>
				<span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
					Mode Smartphone
				</span>
			</div>

			{/* Étape 1 : Plaque d'immatriculation */}
			<form onSubmit={handlePlateSearch} className="space-y-2">
				<label className="text-xs font-semibold text-slate-300">1. Plaque d'immatriculation</label>
				<div className="flex gap-2">
					<input
						type="text"
						placeholder="Ex: AB-123-CD"
						value={plate}
						onChange={(e) => setPlate(e.target.value.toUpperCase())}
						className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.12] text-white font-mono uppercase tracking-widest text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
					/>
					<button
						type="submit"
						disabled={isSearching}
						className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center shrink-0"
					>
						{isSearching ? "..." : <Search className="size-4" />}
					</button>
				</div>
			</form>

			{/* Résultat SIV automatique */}
			{vehicleData && (
				<div className="p-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-1 animate-in fade-in">
					<div className="flex items-center justify-between">
						<span className="font-bold text-white">
							{vehicleData.brand} {vehicleData.model}
						</span>
						<span className="text-[10px] text-blue-300 font-semibold">{vehicleData.power}</span>
					</div>
					<p className="text-[11px] text-slate-400 font-mono">VIN : {vehicleData.vin}</p>
				</div>
			)}

			{/* Étape 2 : Coordonnées Client & Bonus */}
			<div className="space-y-3 pt-1">
				<label className="text-xs font-semibold text-slate-300">2. Assuré & Coefficient</label>
				<div className="space-y-2">
					<input
						type="text"
						placeholder="Nom et Prénom du client"
						value={clientName}
						onChange={(e) => setClientName(e.target.value)}
						className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
					<div className="flex gap-2">
						<input
							type="tel"
							placeholder="Téléphone mobile"
							value={clientPhone}
							onChange={(e) => setClientPhone(e.target.value)}
							className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
						/>
						<select
							value={bonusMalus}
							onChange={(e) => setBonusMalus(e.target.value)}
							className="px-3 py-2.5 rounded-xl bg-slate-900 border border-white/[0.08] text-white text-xs font-semibold focus:outline-none"
						>
							<option value="0.50">Bonus 0.50 (50%)</option>
							<option value="0.60">Bonus 0.60 (40%)</option>
							<option value="0.72">Bonus 0.72 (28%)</option>
							<option value="0.85">Bonus 0.85 (15%)</option>
							<option value="1.00">Neutre 1.00</option>
							<option value="1.15">Malus 1.15</option>
							<option value="1.25">Malus 1.25</option>
						</select>
					</div>
				</div>
			</div>

			{/* Étape 3 : Prise de vue Photo Directe (Permis / RI) */}
			<div className="space-y-2 pt-1">
				<label className="text-xs font-semibold text-slate-300">3. Photos des pièces (Optionnel)</label>
				<div className="grid grid-cols-2 gap-2">
					<button
						type="button"
						onClick={() => setUploadedLicense(!uploadedLicense)}
						className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
							uploadedLicense
								? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
								: "bg-white/[0.03] border-white/[0.08] text-slate-300 hover:bg-white/[0.06]"
						}`}
					>
						{uploadedLicense ? (
							<CheckCircle2 className="size-5 text-emerald-400" />
						) : (
							<Camera className="size-5 text-blue-400" />
						)}
						<span className="text-[11px] font-semibold">
							{uploadedLicense ? "Permis Capturé" : "Scanner Permis"}
						</span>
					</button>

					<button
						type="button"
						onClick={() => setUploadedRI(!uploadedRI)}
						className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
							uploadedRI
								? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
								: "bg-white/[0.03] border-white/[0.08] text-slate-300 hover:bg-white/[0.06]"
						}`}
					>
						{uploadedRI ? (
							<CheckCircle2 className="size-5 text-emerald-400" />
						) : (
							<Upload className="size-5 text-amber-400" />
						)}
						<span className="text-[11px] font-semibold">
							{uploadedRI ? "RI Téléversé" : "Scanner RI"}
						</span>
					</button>
				</div>
			</div>

			{/* Bouton de soumission */}
			<button
				onClick={handleSubmit}
				disabled={!plate.trim() || !clientName.trim()}
				className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-blue-500/25 transition-all active:scale-98 disabled:opacity-40 flex items-center justify-center gap-2"
			>
				Valider le Dossier & Lancer l'Agent
				<ArrowRight className="size-4" />
			</button>
		</div>
	);
}
