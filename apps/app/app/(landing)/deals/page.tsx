"use client";

import React, { useState, useMemo } from "react";
import {
	Handshake,
	Plus,
	Edit,
	Trash2,
	Layers,
	DollarSign,
	TrendingUp,
	Car,
	Building2,
	Clock,
	CheckCircle2,
} from "lucide-react";
import { NavigationMenuSheet } from "@/components/navigation-menu-sheet";
import { ObjectFilterBar, type FilterFacet } from "@/components/crm/object-filter-bar";

type DealItem = {
	id: string;
	title: string;
	clientName: string;
	partner: string;
	stage: "QUALIFICATION" | "DEVIS_EMIS" | "NEGOCIATION" | "GAGNE";
	value: string;
	commission: string;
	date: string;
};

export default function DealsPage() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

	const [deals, setDeals] = useState<DealItem[]>([
		{
			id: "deal-1",
			title: "Flotte 6 Véhicules Utilitaires",
			clientName: "Flotte Cogepart Logistique Sud",
			partner: "Allianz Courtage",
			stage: "NEGOCIATION",
			value: "8 400 €/an",
			commission: "1 250 €",
			date: "Clôture estimée : 15 Sept",
		},
		{
			id: "deal-2",
			title: "Tesla Model 3 Tous Risques",
			clientName: "David Lefebvre",
			partner: "April Auto",
			stage: "GAGNE",
			value: "1 350 €/an",
			commission: "140 €",
			date: "Souscrit le 01 Sept",
		},
		{
			id: "deal-3",
			title: "Audi A3 Sportback Tiers Étendu",
			clientName: "Karim Zeroual",
			partner: "Allianz Courtage",
			stage: "DEVIS_EMIS",
			value: "1 150 €/an",
			commission: "150 €",
			date: "Devis envoyé J-2",
		},
		{
			id: "deal-4",
			title: "Golf VIII TDI Nouveau Conducteur",
			clientName: "Thomas Dubois",
			partner: "Solly Azar",
			stage: "QUALIFICATION",
			value: "780 €/an",
			commission: "110 €",
			date: "Relance RI en cours",
		},
	]);

	const facets: FilterFacet[] = [
		{
			id: "partner",
			label: "Grossiste Partenaire",
			options: [
				{ value: "April Auto", label: "April Auto", count: 1 },
				{ value: "Allianz Courtage", label: "Allianz Courtage", count: 2 },
				{ value: "Solly Azar", label: "Solly Azar", count: 1 },
			],
		},
		{
			id: "stage",
			label: "Étape Pipeline",
			options: [
				{ value: "QUALIFICATION", label: "Qualification", count: 1 },
				{ value: "DEVIS_EMIS", label: "Devis Émis", count: 1 },
				{ value: "NEGOCIATION", label: "Négociation", count: 1 },
				{ value: "GAGNE", label: "Gagné / Souscrit", count: 1 },
			],
		},
	];

	const handleFilterChange = (facetId: string, value: string) => {
		setSelectedFilters((prev) => {
			const current = prev[facetId] || [];
			const next = current.includes(value)
				? current.filter((v) => v !== value)
				: [...current, value];
			return { ...prev, [facetId]: next };
		});
	};

	const stages = [
		{ id: "QUALIFICATION", label: "1. Qualification", color: "border-blue-500/20 bg-blue-500/5" },
		{ id: "DEVIS_EMIS", label: "2. Devis Émis", color: "border-purple-500/20 bg-purple-500/5" },
		{ id: "NEGOCIATION", label: "3. Négociation", color: "border-amber-500/20 bg-amber-500/5" },
		{ id: "GAGNE", label: "4. Gagné / Souscrit", color: "border-emerald-500/20 bg-emerald-500/5" },
	];

	const filteredDeals = useMemo(() => {
		return deals.filter((d) => {
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const match =
					d.title.toLowerCase().includes(q) ||
					d.clientName.toLowerCase().includes(q) ||
					d.partner.toLowerCase().includes(q);
				if (!match) return false;
			}
			if (selectedFilters.partner?.length && !selectedFilters.partner.includes(d.partner)) {
				return false;
			}
			if (selectedFilters.stage?.length && !selectedFilters.stage.includes(d.stage)) {
				return false;
			}
			return true;
		});
	}, [deals, searchQuery, selectedFilters]);

	return (
		<div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen text-slate-100">
			{/* En-tête Apple HIG */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl">
				<div className="flex items-center gap-3">
					<div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25">
						<Handshake className="size-6" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-white">
							Opportunités & Deals Commerciaux
						</h1>
						<p className="text-sm text-slate-400">
							Pipeline d'affaires, négociation des devis auto et suivi des commissions de conversion.
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

					<button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all active:scale-95">
						<Plus className="size-4" />
						Nouvelle Affaire
					</button>
				</div>
			</div>

			{/* Barre de Recherche & Filtres Avancés */}
			<ObjectFilterBar
				searchPlaceholder="Rechercher une affaire, client ou grossiste..."
				facets={facets}
				selectedFilters={selectedFilters}
				onFilterChange={handleFilterChange}
				searchValue={searchQuery}
				onSearchChange={setSearchQuery}
				onReset={() => {
					setSearchQuery("");
					setSelectedFilters({});
				}}
				totalResults={filteredDeals.length}
			/>

			{/* Pipeline Kanban des Opportunités */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
				{stages.map((st) => {
					const stageDeals = filteredDeals.filter((d) => d.stage === st.id);

					return (
						<div
							key={st.id}
							className={`p-4 rounded-3xl border backdrop-blur-xl ${st.color} flex flex-col gap-4 min-h-[500px]`}
						>
							<div className="flex items-center justify-between px-1">
								<h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
									{st.label}
								</h2>
								<span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/[0.08] text-white">
									{stageDeals.length}
								</span>
							</div>

							<div className="flex flex-col gap-3">
								{stageDeals.map((d) => (
									<div
										key={d.id}
										className="p-4 rounded-2xl bg-slate-900/70 hover:bg-slate-900/90 backdrop-blur-md border border-white/[0.08] hover:border-indigo-500/40 transition-all duration-200 shadow-lg space-y-3"
									>
										<div className="flex items-center justify-between text-[11px]">
											<span className="font-medium text-slate-400">{d.partner}</span>
											<span className="font-bold text-emerald-400">+{d.commission}</span>
										</div>

										<div>
											<h4 className="font-bold text-sm text-white">{d.title}</h4>
											<p className="text-xs text-slate-300 mt-0.5">{d.clientName}</p>
										</div>

										<div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs">
											<span className="font-bold text-white">{d.value}</span>
											<span className="text-[10px] text-slate-400">{d.date}</span>
										</div>
									</div>
								))}
							</div>
						</div>
					);
				})}
			</div>

			<NavigationMenuSheet open={menuOpen} onOpenChange={setMenuOpen} />
		</div>
	);
}
