"use client";

import React, { useState, useMemo } from "react";
import {
	Users,
	Plus,
	Edit,
	Trash2,
	Layers,
	Car,
	Phone,
	Mail,
	MapPin,
	ShieldCheck,
	AlertCircle,
	Search,
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

type ContactItem = {
	id: string;
	name: string;
	email: string;
	phone: string;
	city: string;
	vehiclePlate: string;
	vehicleName: string;
	bonusMalus: string;
	dossierCount: number;
	missingDoc: string | null;
};

export default function ContactsPage() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFilters, setSelectedFilters] = useState<
		Record<string, string[]>
	>({});
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteImpact, setDeleteImpact] = useState<CascadeImpact | null>(null);
	const [contactToDelete, setContactToDelete] = useState<ContactItem | null>(
		null,
	);

	const [contacts, setContacts] = useState<ContactItem[]>([
		{
			id: "ct-1",
			name: "Alexandre Martin",
			email: "alexandre.martin@example.fr",
			phone: "06 12 34 56 78",
			city: "Paris 17e",
			vehiclePlate: "AB-123-CD",
			vehicleName: "Peugeot 208 II 1.2 PureTech",
			bonusMalus: "Bonus 0.50 (50%)",
			dossierCount: 1,
			missingDoc: null,
		},
		{
			id: "ct-2",
			name: "Sarah Benali",
			email: "sarah.benali@example.fr",
			phone: "06 98 76 54 32",
			city: "Marseille",
			vehiclePlate: "EF-456-GH",
			vehicleName: "Renault Clio V 1.0 TCe",
			bonusMalus: "Bonus 0.85 (15%)",
			dossierCount: 1,
			missingDoc: null,
		},
		{
			id: "ct-3",
			name: "Thomas Dubois",
			email: "thomas.dubois@example.fr",
			phone: "07 11 22 33 44",
			city: "Lyon",
			vehiclePlate: "IJ-789-KL",
			vehicleName: "Volkswagen Golf VIII TDI",
			bonusMalus: "Bonus 0.72 (28%)",
			dossierCount: 1,
			missingDoc: "Relevé d'Information manquant (J+3)",
		},
		{
			id: "ct-4",
			name: "Julie Moreau",
			email: "julie.moreau@example.fr",
			phone: "06 55 44 33 22",
			city: "Toulon",
			vehiclePlate: "WX-321-YZ",
			vehicleName: "Toyota Yaris Hybride",
			bonusMalus: "Malus 1.15",
			dossierCount: 1,
			missingDoc: "Permis Recto/Verso manquant",
		},
	]);

	const facets: FilterFacet[] = [
		{
			id: "crm",
			label: "Profil Assuré (CRM)",
			options: [
				{ value: "BONUS", label: "Bonus (< 1.00)", count: 3 },
				{ value: "MALUS", label: "Malus (> 1.00)", count: 1 },
			],
		},
		{
			id: "docs",
			label: "Conformité Dossier",
			options: [
				{ value: "COMPLETE", label: "Pièces à jour", count: 2 },
				{ value: "MISSING", label: "Pièce manquante (RI/Permis)", count: 2 },
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

	const filteredContacts = useMemo(() => {
		return contacts.filter((c) => {
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const match =
					c.name.toLowerCase().includes(q) ||
					c.email.toLowerCase().includes(q) ||
					c.phone.includes(q) ||
					c.vehiclePlate.toLowerCase().includes(q) ||
					c.vehicleName.toLowerCase().includes(q);
				if (!match) return false;
			}
			if (selectedFilters.crm?.length) {
				const isMalus = c.bonusMalus.includes("Malus");
				const matchCrm = selectedFilters.crm.some((v) =>
					v === "MALUS" ? isMalus : !isMalus,
				);
				if (!matchCrm) return false;
			}
			if (selectedFilters.docs?.length) {
				const hasMissing = Boolean(c.missingDoc);
				const matchDoc = selectedFilters.docs.some((v) =>
					v === "MISSING" ? hasMissing : !hasMissing,
				);
				if (!matchDoc) return false;
			}
			return true;
		});
	}, [contacts, searchQuery, selectedFilters]);

	return (
		<div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen text-slate-100">
			{/* En-tête Apple HIG */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl">
				<div className="flex items-center gap-3">
					<div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/25">
						<Users className="size-6" />
					</div>
					<div>
						<h1 className="text-2xl font-bold tracking-tight text-white">
							Contacts & Assurés
						</h1>
						<p className="text-sm text-slate-400">
							Répertoire 360° des conducteurs, profils de bonus/malus et
							véhicules associés.
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

					<button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/30 transition-all active:scale-95">
						<Plus className="size-4" />
						Nouveau Contact
					</button>
				</div>
			</div>

			{/* Barre de Recherche & Filtres Avancés */}
			<ObjectFilterBar
				searchPlaceholder="Rechercher par assuré, téléphone, email ou plaque (ex: AB-123-CD)..."
				facets={facets}
				selectedFilters={selectedFilters}
				onFilterChange={handleFilterChange}
				searchValue={searchQuery}
				onSearchChange={setSearchQuery}
				onReset={() => {
					setSearchQuery("");
					setSelectedFilters({});
				}}
				totalResults={filteredContacts.length}
			/>

			{/* Grille des Contacts */}
			<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
				{filteredContacts.map((ct) => (
					<div
						key={ct.id}
						className="p-6 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.08] hover:border-emerald-500/30 transition-all duration-200 shadow-xl space-y-4 flex flex-col justify-between"
					>
						<div className="space-y-3">
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-2.5">
									<div className="size-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm">
										{ct.name.slice(0, 2).toUpperCase()}
									</div>
									<div>
										<h3 className="text-sm font-bold text-white">{ct.name}</h3>
										<span className="text-[11px] text-emerald-400 font-semibold">
											{ct.bonusMalus}
										</span>
									</div>
								</div>

								{ct.missingDoc ? (
									<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
										Pièce manquante
									</span>
								) : (
									<span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
										Complet
									</span>
								)}
							</div>

							<div className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04] space-y-1.5 text-xs">
								<p className="flex items-center gap-2 text-slate-300">
									<Car className="size-3.5 text-blue-400" />
									<span>{ct.vehicleName}</span>
									<span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white">
										{ct.vehiclePlate}
									</span>
								</p>
								<p className="flex items-center gap-2 text-slate-400 text-[11px]">
									<Phone className="size-3 text-slate-500" />
									{ct.phone}
								</p>
								<p className="flex items-center gap-2 text-slate-400 text-[11px]">
									<Mail className="size-3 text-slate-500" />
									{ct.email}
								</p>
							</div>

							{ct.missingDoc && (
								<div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
									<AlertCircle className="size-3.5 shrink-0" />
									<span className="text-[11px]">{ct.missingDoc}</span>
								</div>
							)}
						</div>

						<div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
							<span className="text-slate-400 text-[11px]">
								{ct.dossierCount} contrat actif
							</span>

							<div className="flex items-center gap-1">
								<button
									title="Supprimer en cascade"
									onClick={() => {
										setContactToDelete(ct);
										setDeleteImpact({
											entityType: "CONTACT",
											name: ct.name,
											children: [
												{
													label: `Profil conducteur & carte grise`,
													count: 1,
													cascadeAction: "DELETE",
												},
												{
													label: `Dossiers d'assurance auto rattachés`,
													count: ct.dossierCount,
													cascadeAction: "DELETE",
												},
												{
													label: `Documents justificatifs`,
													count: 2,
													cascadeAction: "DELETE",
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
					if (contactToDelete) {
						setContacts((prev) =>
							prev.filter((c) => c.id !== contactToDelete.id),
						);
						setDeleteDialogOpen(false);
						setContactToDelete(null);
					}
				}}
			/>
		</div>
	);
}
