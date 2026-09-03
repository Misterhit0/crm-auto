"use client";

import React, { useState } from "react";
import {
	DollarSign,
	UploadCloud,
	FileSpreadsheet,
	CheckCircle2,
	AlertTriangle,
	ArrowUpRight,
	TrendingUp,
	Download,
	Layers,
} from "lucide-react";

export default function CommissionsPage() {
	const [selectedPeriod, setSelectedPeriod] = useState("2026-08");

	const statements = [
		{
			id: "STMT-01",
			partner: "April Auto",
			period: "2026-08",
			total: "1 280,00 €",
			lines: 16,
			reconciled: 15,
			discrepancies: 1,
			status: "ANOMALIE_MINEURE",
		},
		{
			id: "STMT-02",
			partner: "Maxance",
			period: "2026-08",
			total: "840,00 €",
			lines: 9,
			reconciled: 9,
			discrepancies: 0,
			status: "CONFORME",
		},
		{
			id: "STMT-03",
			partner: "Solly Azar",
			period: "2026-08",
			total: "620,00 €",
			lines: 6,
			reconciled: 5,
			discrepancies: 1,
			status: "ANOMALIE_MINEURE",
		},
	];

	const sampleRecords = [
		{
			id: "REC-01",
			partner: "April Auto",
			dossierRef: "DOS-2026-0001",
			client: "David Lefebvre",
			plate: "AA-001-AA",
			type: "Acquisition (One-Shot)",
			expected: "140,00 €",
			actual: "140,00 €",
			status: "RAPPROCHE",
		},
		{
			id: "REC-02",
			partner: "April Auto",
			dossierRef: "DOS-2026-0004",
			client: "Marc Lambert",
			plate: "CD-789-EF",
			type: "Acquisition (One-Shot)",
			expected: "90,00 €",
			actual: "70,00 €",
			status: "ECART_DETECTE",
			notes: "Écart de -20€ constaté par rapport au barème négocié",
		},
		{
			id: "REC-03",
			partner: "Maxance",
			dossierRef: "DOS-2026-0003",
			client: "Camille Roussel",
			plate: "GH-456-JK",
			type: "Rétrocession Annuelle (7%)",
			expected: "43,40 €",
			actual: "43,40 €",
			status: "RAPPROCHE",
		},
	];

	return (
		<div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen text-slate-100">
			{/* En-tête Apple HIG */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl">
				<div className="flex items-center gap-3">
					<div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
						<DollarSign className="size-6" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-white">
							Rapprochement des Bordereaux & Commissions
						</h1>
						<p className="text-sm text-slate-400">
							Contrôlez les rétrocessions versées par les grossistes et détectez
							les anomalies en 1 clic.
						</p>
					</div>
				</div>

				<div className="flex items-center gap-3">
					<button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all active:scale-95">
						<UploadCloud className="size-4" />
						Importer un Bordereau (.xlsx / .csv)
					</button>
				</div>
			</div>

			{/* Cartes Synthétiques Commissions */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div className="p-5 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06]">
					<span className="text-xs text-slate-400 font-medium">
						Total Commissions Encaissées (Août 2026)
					</span>
					<div className="mt-3 flex items-baseline gap-2">
						<span className="text-3xl font-bold text-white">2 740,00 €</span>
						<span className="text-xs text-emerald-400 font-medium">
							31 contrats pointés
						</span>
					</div>
				</div>

				<div className="p-5 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06]">
					<span className="text-xs text-slate-400 font-medium">
						Taux de Rapprochement Automatique
					</span>
					<div className="mt-3 flex items-baseline gap-2">
						<span className="text-3xl font-bold text-emerald-400">93.5%</span>
						<span className="text-xs text-slate-400">
							29/31 lignes conformes
						</span>
					</div>
				</div>

				<div className="p-5 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06]">
					<span className="text-xs text-slate-400 font-medium">
						Écarts & Anomalies à Réclamer
					</span>
					<div className="mt-3 flex items-baseline gap-2">
						<span className="text-3xl font-bold text-amber-400">20,00 €</span>
						<span className="text-xs text-amber-300 font-medium">
							1 dossier en écart
						</span>
					</div>
				</div>
			</div>

			{/* Section 1 : Liste des Bordereaux Mensuels */}
			<div className="space-y-4">
				<h2 className="text-lg font-bold text-white flex items-center gap-2">
					<FileSpreadsheet className="size-5 text-blue-400" />
					Bordereaux Grossistes Récents
				</h2>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
					{statements.map((stmt) => (
						<div
							key={stmt.id}
							className="p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] hover:border-white/[0.16] transition-all space-y-4"
						>
							<div className="flex items-center justify-between">
								<h3 className="font-bold text-base text-white">
									{stmt.partner}
								</h3>
								<span className="text-xs font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
									{stmt.period}
								</span>
							</div>

							<div className="flex items-baseline justify-between pt-2 border-t border-white/[0.06]">
								<div>
									<span className="text-xs text-slate-400">Montant versé</span>
									<p className="text-lg font-bold text-emerald-400">
										{stmt.total}
									</p>
								</div>
								<div className="text-right">
									<span className="text-xs text-slate-400">Lignes</span>
									<p className="text-sm font-semibold text-slate-200">
										{stmt.reconciled}/{stmt.lines} conformes
									</p>
								</div>
							</div>

							{stmt.discrepancies > 0 ? (
								<div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
									<AlertTriangle className="size-3.5 shrink-0" />
									<span>{stmt.discrepancies} anomalie détectée</span>
								</div>
							) : (
								<div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs flex items-center gap-2">
									<CheckCircle2 className="size-3.5 shrink-0" />
									<span>Pointage 100% conforme</span>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Section 2 : Table Détaillée des Lignes Rapprochées */}
			<div className="space-y-4">
				<h2 className="text-lg font-bold text-white flex items-center gap-2">
					<Layers className="size-5 text-emerald-400" />
					Détail des Rapprochements de Contrats
				</h2>

				<div className="overflow-hidden rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] shadow-2xl">
					<table className="w-full text-left text-xs text-slate-300">
						<thead className="bg-white/[0.04] text-slate-400 uppercase tracking-wider text-[11px] font-semibold border-b border-white/[0.08]">
							<tr>
								<th className="px-6 py-4">Dossier / Client</th>
								<th className="px-6 py-4">Véhicule</th>
								<th className="px-6 py-4">Partenaire</th>
								<th className="px-6 py-4">Type Commission</th>
								<th className="px-6 py-4">Montant Attendu</th>
								<th className="px-6 py-4">Montant Versé</th>
								<th className="px-6 py-4">Statut</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-white/[0.06]">
							{sampleRecords.map((rec) => (
								<tr
									key={rec.id}
									className="hover:bg-white/[0.02] transition-colors"
								>
									<td className="px-6 py-4">
										<p className="font-semibold text-white">{rec.client}</p>
										<span className="font-mono text-blue-400 text-[11px]">
											{rec.dossierRef}
										</span>
									</td>
									<td className="px-6 py-4 font-mono font-medium text-slate-200">
										{rec.plate}
									</td>
									<td className="px-6 py-4 font-medium text-slate-300">
										{rec.partner}
									</td>
									<td className="px-6 py-4 text-slate-400">{rec.type}</td>
									<td className="px-6 py-4 font-mono text-slate-300">
										{rec.expected}
									</td>
									<td className="px-6 py-4 font-mono font-bold text-white">
										{rec.actual}
									</td>
									<td className="px-6 py-4">
										{rec.status === "RAPPROCHE" ? (
											<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
												<CheckCircle2 className="size-3" />
												Rapproché
											</span>
										) : (
											<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
												<AlertTriangle className="size-3" />
												Écart constaté
											</span>
										)}
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
