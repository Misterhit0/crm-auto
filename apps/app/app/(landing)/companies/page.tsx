"use client";

import React, { useState, useMemo } from "react";
import {
	Building2,
	Plus,
	Edit,
	Trash2,
	Layers,
	ExternalLink,
	Phone,
	Mail,
	MapPin,
	Users,
	Car,
	Handshake,
	TrendingUp,
} from "lucide-react";
import { NavigationMenuSheet } from "@/components/navigation-menu-sheet";
import {
	ObjectFilterBar,
	type FilterFacet,
} from "@/components/crm/object-filter-bar";
import {
	CascadeDeleteDialog,
	type CascadeImpact,
} from "@/components/crm/cascade-delete-dialog";

type CompanyItem = {
	id: string;
	name: string;
	siren: string;
	type: "GARAGE" | "CONCESSIONNAIRE" | "FLOTTE" | "COURTIER_PARTENAIRE";
	city: string;
	contactName: string;
	activeDossiers: number;
	totalRevenue: string;
	status: "CONVENTIONNE" | "EN_ATTENTE" | "SUSPENDU";
};

export default function CompaniesPage() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFilters, setSelectedFilters] = useState<
		Record<string, string[]>
	>({});
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteImpact, setDeleteImpact] = useState<CascadeImpact | null>(null);
	const [companyToDelete, setCompanyToDelete] = useState<CompanyItem | null>(
		null,
	);

	const [companies, setCompanies] = useState<CompanyItem[]>([
		{
			id: "comp-1",
			name: "Garage Moderne des Batignolles",
			siren: "820 764 538",
			type: "GARAGE",
			city: "Paris 17e",
			contactName: "Jean-Pierre Vasseur",
			activeDossiers: 12,
			totalRevenue: "4 850 €",
			status: "CONVENTIONNE",
		},
		{
			id: "comp-2",
			name: "Autosphere Keos Marseille",
			siren: "776 223 406",
			type: "CONCESSIONNAIRE",
			city: "Marseille",
			contactName: "Laurent Fabre",
			activeDossiers: 28,
			totalRevenue: "14 200 €",
			status: "CONVENTIONNE",
		},
		{
			id: "comp-3",
			name: "Flotte Cogepart Logistique Sud",
			siren: "508 001 021",
			type: "FLOTTE",
			city: "Nice",
			contactName: "Marc Benamou",
			activeDossiers: 45,
			totalRevenue: "38 900 €",
			status: "CONVENTIONNE",
		},
		{
			id: "comp-4",
			name: "Azur Auto Occasions",
			siren: "825 354 947",
			type: "GARAGE",
			city: "Manosque",
			contactName: "Thierry Roubaud",
			activeDossiers: 5,
			totalRevenue: "1 950 €",
			status: "EN_ATTENTE",
		},
	]);

	const facets: FilterFacet[] = [
		{
			id: "type",
			label: "Type d'Établissement",
			options: [
				{ value: "GARAGE", label: "Garages Apporteurs", count: 2 },
				{ value: "CONCESSIONNAIRE", label: "Concessions", count: 1 },
				{ value: "FLOTTE", label: "Flottes d'Entreprises", count: 1 },
			],
		},
		{
			id: "status",
			label: "Statut Convention",
			options: [
				{ value: "CONVENTIONNE", label: "Conventionné", count: 3 },
				{ value: "EN_ATTENTE", label: "En cours de signature", count: 1 },
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

	const filteredCompanies = useMemo(() => {
		return companies.filter((c) => {
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const match =
					c.name.toLowerCase().includes(q) ||
					c.siren.includes(q) ||
					c.city.toLowerCase().includes(q) ||
					c.contactName.toLowerCase().includes(q);
				if (!match) return false;
			}
			if (
				selectedFilters.type?.length &&
				!selectedFilters.type.includes(c.type)
			) {
				return false;
			}
			if (
				selectedFilters.status?.length &&
				!selectedFilters.status.includes(c.status)
			) {
				return false;
			}
			return true;
		});
	}, [companies, searchQuery, selectedFilters]);

	return (
		<div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen text-slate-100">
			{/* En-tête Apple HIG */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl">
				<div className="flex items-center gap-3">
					<div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
						<Building2 className="size-6" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-white">
							Entreprises & Garages Apporteurs
						</h1>
						<p className="text-sm text-slate-400">
							Réseau d'apporteurs d'affaires, concessions partenaires et gestion
							des flottes professionnelles.
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

					<button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-95">
						<Plus className="size-4" />
						Nouvelle Entreprise
					</button>
				</div>
			</div>

			{/* Barre de Recherche & Filtres Avancés */}
			<ObjectFilterBar
				searchPlaceholder="Rechercher une entreprise, SIREN, contact ou ville..."
				facets={facets}
				selectedFilters={selectedFilters}
				onFilterChange={handleFilterChange}
				searchValue={searchQuery}
				onSearchChange={setSearchQuery}
				onReset={() => {
					setSearchQuery("");
					setSelectedFilters({});
				}}
				totalResults={filteredCompanies.length}
			/>

			{/* Cartes / Grille des Entreprises */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{filteredCompanies.map((comp) => (
					<div
						key={comp.id}
						className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] hover:border-blue-500/30 transition-all duration-200 shadow-xl space-y-4 flex flex-col justify-between"
					>
						<div className="space-y-3">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2.5">
									<div className="size-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
										<Building2 className="size-5" />
									</div>
									<div>
										<h3 className="text-sm font-bold text-white">
											{comp.name}
										</h3>
										<span className="text-[10px] text-slate-400 font-mono">
											SIREN : {comp.siren}
										</span>
									</div>
								</div>

								<span
									className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
										comp.status === "CONVENTIONNE"
											? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
											: "bg-amber-500/10 text-amber-400 border-amber-500/30"
									}`}
								>
									{comp.status === "CONVENTIONNE" ? "Conventionné" : "En cours"}
								</span>
							</div>

							<div className="space-y-1 text-xs text-slate-300">
								<p className="flex items-center gap-2 text-slate-400">
									<MapPin className="size-3.5 text-slate-500" />
									{comp.city}
								</p>
								<p className="flex items-center gap-2 text-slate-400">
									<Users className="size-3.5 text-slate-500" />
									Référent :{" "}
									<strong className="text-white">{comp.contactName}</strong>
								</p>
							</div>
						</div>

						<div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs">
							<div>
								<span className="text-slate-400 text-[11px]">
									Dossiers actifs
								</span>
								<p className="font-bold text-white mt-0.5">
									{comp.activeDossiers} dossiers
								</p>
							</div>
							<div className="text-right">
								<span className="text-slate-400 text-[11px]">
									Commissions générées
								</span>
								<p className="font-bold text-emerald-400 mt-0.5">
									{comp.totalRevenue}
								</p>
							</div>

							<div className="flex items-center gap-1">
								<button
									title="Supprimer en cascade"
									onClick={() => {
										setCompanyToDelete(comp);
										setDeleteImpact({
											entityType: "COMPANY",
											name: comp.name,
											children: [
												{
													label: `Contacts & interlocuteurs rattachés`,
													count: 2,
													cascadeAction: "DELETE",
												},
												{
													label: `Dossiers d'assurance auto apportés`,
													count: comp.activeDossiers,
													cascadeAction: "SET_NULL",
												},
											],
										});
										setDeleteDialogOpen(true);
									}}
									className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
								>
									<Trash2 className="size-3.5" />
								</button>
							</div>
						</div>
					</div>
				))}
			</div>

			<NavigationMenuSheet open={menuOpen} onOpenChange={setMenuOpen} />

			<CascadeDeleteDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				impact={deleteImpact}
				onConfirm={() => {
					if (companyToDelete) {
						setCompanies((prev) =>
							prev.filter((c) => c.id !== companyToDelete.id),
						);
						setDeleteDialogOpen(false);
						setCompanyToDelete(null);
					}
				}}
			/>
		</div>
	);
}
