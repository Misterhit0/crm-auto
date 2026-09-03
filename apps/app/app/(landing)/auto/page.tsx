"use client";

import React, { useState, useMemo } from "react";
import {
	Car,
	ShieldCheck,
	FileText,
	DollarSign,
	Clock,
	Search,
	Plus,
	CheckCircle2,
	AlertCircle,
	ArrowRight,
	TrendingUp,
	Users,
	Smartphone,
	Monitor,
	Edit,
	Trash2,
	Layers,
	Bot,
	Sparkles,
} from "lucide-react";
import { DossierSheet, type DossierData } from "@/components/crm/dossier-sheet";
import { MobileQuickIntake } from "@/components/auto/mobile-quick-intake";
import { ObjectFilterBar, type FilterFacet } from "@/components/crm/object-filter-bar";
import { DossierCrudDialog } from "@/components/crm/dossier-crud-dialog";
import { CascadeDeleteDialog, type CascadeImpact } from "@/components/crm/cascade-delete-dialog";
import { NavigationMenuSheet } from "@/components/navigation-menu-sheet";
import { CompAiChatSheet } from "@/components/crm/compai-chat-sheet";

export default function AutoDossiersPage() {
	const [activeTab, setActiveTab] = useState<"kanban" | "siv" | "mobile">("kanban");
	const [selectedDossier, setSelectedDossier] = useState<DossierData | null>(null);
	const [sheetOpen, setSheetOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [chatOpen, setChatOpen] = useState(false);
	const [crudDialogOpen, setCrudDialogOpen] = useState(false);
	const [editingDossier, setEditingDossier] = useState<DossierData | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteImpact, setDeleteImpact] = useState<CascadeImpact | null>(null);
	const [dossierToDelete, setDossierToDelete] = useState<any>(null);

	// Filtres avancés
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({});

	const [sivPlate, setSivPlate] = useState("");
	const [sivLoading, setSivLoading] = useState(false);
	const [sivResult, setSivResult] = useState<any>(null);

	// Liste dynamique des dossiers modifiable
	const [customDossiers, setCustomDossiers] = useState<any[]>([
		{
			ref: "DOS-2026-0012",
			client: "Alexandre Martin",
			car: "Peugeot 208 II (AB-123-CD)",
			crm: "Bonus 0.50 (50%)",
			partner: "April Auto",
			premium: "450 €/an",
			comm: "80 €",
			missingDoc: null,
			colId: "PROSPECT",
		},
		{
			ref: "DOS-2026-0013",
			client: "Sarah Benali",
			car: "Renault Clio V (EF-456-GH)",
			crm: "Bonus 0.85 (15%)",
			partner: "Maxance",
			premium: "620 €/an",
			comm: "90 €",
			missingDoc: null,
			colId: "PROSPECT",
		},
		{
			ref: "DOS-2026-0009",
			client: "Thomas Dubois",
			car: "Golf VIII (IJ-789-KL)",
			crm: "Bonus 0.72",
			partner: "Solly Azar",
			premium: "780 €/an",
			comm: "110 €",
			missingDoc: "Relevé d'Information manquant (J+3)",
			colId: "PIECES",
		},
		{
			ref: "DOS-2026-0010",
			client: "Julie Moreau",
			car: "Toyota Yaris (WX-321-YZ)",
			crm: "Malus 1.15",
			partner: "Netvox",
			premium: "950 €/an",
			comm: "120 €",
			missingDoc: "Permis Recto/Verso manquant",
			colId: "PIECES",
		},
		{
			ref: "DOS-2026-0008",
			client: "Karim Zeroual",
			car: "Audi A3 Sportback",
			crm: "Bonus 0.60",
			partner: "Allianz Courtage",
			premium: "1 150 €/an",
			comm: "150 €",
			missingDoc: null,
			colId: "DEVIS",
		},
		{
			ref: "DOS-2026-0001",
			client: "David Lefebvre",
			car: "Tesla Model 3 (AA-001-AA)",
			crm: "Bonus 0.50",
			partner: "April Auto",
			premium: "1 350 €/an",
			comm: "Rapproché (140 €)",
			missingDoc: null,
			colId: "ACTIF",
		},
	]);

	const facets: FilterFacet[] = [
		{
			id: "partner",
			label: "Grossiste",
			options: [
				{ value: "April Auto", label: "April Auto", count: 2 },
				{ value: "Maxance", label: "Maxance", count: 1 },
				{ value: "Solly Azar", label: "Solly Azar", count: 1 },
				{ value: "Netvox", label: "Netvox", count: 1 },
				{ value: "Allianz Courtage", label: "Allianz Courtage", count: 1 },
			],
		},
		{
			id: "missingDoc",
			label: "Anomalie Pièces",
			options: [
				{ value: "RI", label: "Relevé d'Info Manquant", count: 1 },
				{ value: "PERMIS", label: "Permis Manquant", count: 1 },
				{ value: "OK", label: "Dossier Complet", count: 4 },
			],
		},
		{
			id: "crm",
			label: "Bonus / Malus",
			options: [
				{ value: "BONUS", label: "Bonus (< 1.00)", count: 5 },
				{ value: "MALUS", label: "Malus (> 1.00)", count: 1 },
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

	const handleResetFilters = () => {
		setSearchQuery("");
		setSelectedFilters({});
	};

	// Filtrage dynamique
	const filteredDossiers = useMemo(() => {
		return customDossiers.filter((item) => {
			if (searchQuery.trim()) {
				const q = searchQuery.toLowerCase();
				const matches =
					item.ref.toLowerCase().includes(q) ||
					item.client.toLowerCase().includes(q) ||
					item.car.toLowerCase().includes(q) ||
					item.partner.toLowerCase().includes(q);
				if (!matches) return false;
			}

			if (selectedFilters.partner?.length) {
				if (!selectedFilters.partner.includes(item.partner)) return false;
			}

			if (selectedFilters.missingDoc?.length) {
				const isRI = item.missingDoc?.includes("Relevé");
				const isPermis = item.missingDoc?.includes("Permis");
				const isOK = !item.missingDoc;

				const matchesDoc = selectedFilters.missingDoc.some((val) => {
					if (val === "RI") return isRI;
					if (val === "PERMIS") return isPermis;
					if (val === "OK") return isOK;
					return true;
				});
				if (!matchesDoc) return false;
			}

			if (selectedFilters.crm?.length) {
				const isMalus = item.crm.includes("Malus") || parseFloat(item.crm.replace(/[^\d.]/g, "")) > 1.0;
				const matchesCrm = selectedFilters.crm.some((val) => {
					if (val === "MALUS") return isMalus;
					if (val === "BONUS") return !isMalus;
					return true;
				});
				if (!matchesCrm) return false;
			}

			return true;
		});
	}, [customDossiers, searchQuery, selectedFilters]);

	// Simulation SIV interactive avec retours physiques instantanés
	const handleSivLookup = (e: React.FormEvent) => {
		e.preventDefault();
		if (!sivPlate.trim()) return;

		setSivLoading(true);
		setTimeout(() => {
			const clean = sivPlate.toUpperCase().replace(/[\s-]/g, "");
			if (clean.includes("208") || clean === "AB123CD") {
				setSivResult({
					plate: "AB-123-CD",
					brand: "PEUGEOT",
					model: "208 II 1.2 PureTech 100ch",
					version: "Allure S&S",
					firstReg: "15/06/2022",
					power: "5 CV",
					fuel: "Essence",
					vin: "VF3UPHNKMPW123456",
				});
			} else if (clean.includes("GOLF") || clean === "IJ789KL") {
				setSivResult({
					plate: "IJ-789-KL",
					brand: "VOLKSWAGEN",
					model: "GOLF VIII 2.0 TDI",
					version: "Life 1st 115ch",
					firstReg: "05/11/2020",
					power: "6 CV",
					fuel: "Diesel",
					vin: "WVWZZZCDZMW009876",
				});
			} else {
				setSivResult({
					plate: sivPlate.toUpperCase(),
					brand: "RENAULT",
					model: "CLIO V 1.0 TCe 90",
					version: "Intens",
					firstReg: "20/09/2021",
					power: "5 CV",
					fuel: "Essence",
					vin: "VF1RJA00564987123",
				});
			}
			setSivLoading(false);
		}, 450);
	};

	const columns = [
		{
			id: "PROSPECT",
			title: "Prospects & Saisie SIV",
			count: 4,
			color: "border-blue-500/20 bg-blue-500/5",
			badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
			items: [
				{
					ref: "DOS-2026-0012",
					client: "Alexandre Martin",
					car: "Peugeot 208 II (AB-123-CD)",
					crm: "Bonus 0.50 (50%)",
					partner: "April Auto",
					premium: "450 €/an",
					comm: "80 €",
					missingDoc: null,
				},
				{
					ref: "DOS-2026-0013",
					client: "Sarah Benali",
					car: "Renault Clio V (EF-456-GH)",
					crm: "Bonus 0.85 (15%)",
					partner: "Maxance",
					premium: "620 €/an",
					comm: "90 €",
					missingDoc: null,
				},
			],
		},
		{
			id: "PIECES",
			title: "Pièces en Attente (RI)",
			count: 3,
			color: "border-amber-500/20 bg-amber-500/5",
			badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
			items: [
				{
					ref: "DOS-2026-0009",
					client: "Thomas Dubois",
					car: "Golf VIII (IJ-789-KL)",
					crm: "Bonus 0.72",
					partner: "Solly Azar",
					premium: "780 €/an",
					comm: "110 €",
					missingDoc: "Relevé d'Information manquant (J+3)",
				},
				{
					ref: "DOS-2026-0010",
					client: "Julie Moreau",
					car: "Toyota Yaris (WX-321-YZ)",
					crm: "Malus 1.15",
					partner: "Netvox",
					premium: "950 €/an",
					comm: "120 €",
					missingDoc: "Permis Recto/Verso manquant",
				},
			],
		},
		{
			id: "DEVIS",
			title: "Devis Soumis",
			count: 2,
			color: "border-purple-500/20 bg-purple-500/5",
			badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
			items: [
				{
					ref: "DOS-2026-0008",
					client: "Karim Zeroual",
					car: "Audi A3 Sportback",
					crm: "Bonus 0.60",
					partner: "Allianz Courtage",
					premium: "1 150 €/an",
					comm: "150 €",
					missingDoc: null,
				},
			],
		},
		{
			id: "ACTIF",
			title: "Contrats Actifs & Cartes Vertes",
			count: 18,
			color: "border-emerald-500/20 bg-emerald-500/5",
			badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
			items: [
				{
					ref: "DOS-2026-0001",
					client: "David Lefebvre",
					car: "Tesla Model 3 (AA-001-AA)",
					crm: "Bonus 0.50",
					partner: "April Auto",
					premium: "1 350 €/an",
					comm: "Rapproché (140 €)",
					missingDoc: null,
				},
			],
		},
	];

	return (
		<div className="p-8 space-y-8 max-w-[1600px] mx-auto min-h-screen text-slate-100">
			{/* En-tête Apple HIG avec effet Glassmorphism */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-2xl">
				<div>
					<div className="flex items-center gap-3">
						<div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
							<Car className="size-6" />
						</div>
						<div>
							<h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/70">
								Assurance Automobile & Apporteur
							</h1>
							<p className="text-sm text-slate-400">
								Pilotage des dossiers, qualification SIV instantanée et réconciliation de commissions.
							</p>
						</div>
					</div>
				</div>

				{/* Boutons d'action rapides */}
				<div className="flex flex-wrap items-center gap-2.5">
					<button
						onClick={() => setMenuOpen(true)}
						className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.12] text-white shadow-md transition-all active:scale-95"
					>
						<Layers className="size-3.5 text-blue-400" />
						Toutes les Pages
					</button>

					<button
						onClick={() => setChatOpen(true)}
						className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600/30 to-indigo-600/30 hover:from-blue-600/50 hover:to-indigo-600/50 border border-blue-400/40 text-blue-200 shadow-md transition-all active:scale-95"
					>
						<Bot className="size-3.5 text-blue-400" />
						Chat Agent Comp AI
					</button>

					<div className="flex p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
						<button
							onClick={() => setActiveTab("kanban")}
							className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
								activeTab === "kanban"
									? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
									: "text-slate-400 hover:text-white"
							}`}
						>
							<Monitor className="size-3.5" />
							Pipeline Kanban
						</button>
						<button
							onClick={() => setActiveTab("siv")}
							className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
								activeTab === "siv"
									? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
									: "text-slate-400 hover:text-white"
							}`}
						>
							<Search className="size-3.5" />
							Lookup SIV Plaque
						</button>
						<button
							onClick={() => setActiveTab("mobile")}
							className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
								activeTab === "mobile"
									? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-500/30"
									: "text-slate-400 hover:text-white"
							}`}
						>
							<Smartphone className="size-3.5 text-emerald-400" />
							Mode Smartphone
						</button>
					</div>

					<button
						onClick={() => {
							setEditingDossier(null);
							setCrudDialogOpen(true);
						}}
						className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold shadow-lg shadow-blue-600/30 transition-all active:scale-95"
					>
						<Plus className="size-4" />
						Nouveau Dossier Auto
					</button>
				</div>
			</div>

			{/* Barre de Recherche & Filtres Avancés par Objet */}
			<ObjectFilterBar
				searchPlaceholder="Rechercher par client, plaque (ex: AB-123-CD), référence ou grossiste..."
				facets={facets}
				selectedFilters={selectedFilters}
				onFilterChange={handleFilterChange}
				searchValue={searchQuery}
				onSearchChange={setSearchQuery}
				onReset={handleResetFilters}
				totalResults={filteredDossiers.length}
			/>

			{/* Cartes Métriques Synthétiques (Apple HIG KPI Cards) */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
				<div className="p-5 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] hover:border-white/[0.12] transition-all">
					<div className="flex items-center justify-between text-slate-400 text-xs font-medium">
						<span>Dossiers filtrés / total</span>
						<FileText className="size-4 text-blue-400" />
					</div>
					<div className="mt-3 flex items-baseline gap-2">
						<span className="text-3xl font-bold tracking-tight text-white">{filteredDossiers.length}</span>
						<span className="text-xs text-slate-400">sur {customDossiers.length} dossiers</span>
					</div>
				</div>

				<div className="p-5 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] hover:border-white/[0.12] transition-all">
					<div className="flex items-center justify-between text-slate-400 text-xs font-medium">
						<span>Commissions Rapprochées</span>
						<DollarSign className="size-4 text-emerald-400" />
					</div>
					<div className="mt-3 flex items-baseline gap-2">
						<span className="text-3xl font-bold tracking-tight text-white">2 480 €</span>
						<span className="text-xs text-emerald-400 flex items-center font-medium">Objectif 85%</span>
					</div>
				</div>

				<div className="p-5 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] hover:border-white/[0.12] transition-all">
					<div className="flex items-center justify-between text-slate-400 text-xs font-medium">
						<span>Relevés d'Info Bloquants</span>
						<AlertCircle className="size-4 text-amber-400" />
					</div>
					<div className="mt-3 flex items-baseline gap-2">
						<span className="text-3xl font-bold tracking-tight text-amber-400">
							{filteredDossiers.filter((d) => d.missingDoc?.includes("Relevé")).length}
						</span>
						<span className="text-xs text-slate-400">Relance auto active</span>
					</div>
				</div>

				<div className="p-5 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] hover:border-white/[0.12] transition-all">
					<div className="flex items-center justify-between text-slate-400 text-xs font-medium">
						<span>Échéances Loi Hamon (J-45)</span>
						<Clock className="size-4 text-purple-400" />
					</div>
					<div className="mt-3 flex items-baseline gap-2">
						<span className="text-3xl font-bold tracking-tight text-purple-300">8</span>
						<span className="text-xs text-slate-400">À recontacter ce mois</span>
					</div>
				</div>
			</div>

			{/* Vue Onglet 1 : Pipeline Kanban des Dossiers Filtrés */}
			{activeTab === "kanban" && (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
					{[
						{
							id: "PROSPECT",
							title: "Prospects & Saisie SIV",
							color: "border-blue-500/20 bg-blue-500/5",
							badgeColor: "bg-blue-500/10 text-blue-500 border-blue-500/20",
						},
						{
							id: "PIECES",
							title: "Pièces en Attente (RI)",
							color: "border-amber-500/20 bg-amber-500/5",
							badgeColor: "bg-amber-500/10 text-amber-500 border-amber-500/20",
						},
						{
							id: "DEVIS",
							title: "Devis Soumis",
							color: "border-purple-500/20 bg-purple-500/5",
							badgeColor: "bg-purple-500/10 text-purple-500 border-purple-500/20",
						},
						{
							id: "ACTIF",
							title: "Contrats Actifs & Cartes Vertes",
							color: "border-emerald-500/20 bg-emerald-500/5",
							badgeColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
						},
					].map((col) => {
						const colItems = filteredDossiers.filter((d) => d.colId === col.id);

						return (
							<div
								key={col.id}
								className={`p-4 rounded-2xl border backdrop-blur-xl ${col.color} flex flex-col gap-4 min-h-[600px]`}
							>
								<div className="flex items-center justify-between px-1">
									<div className="flex items-center gap-2">
										<h2 className="text-sm font-semibold text-slate-200">{col.title}</h2>
										<span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${col.badgeColor}`}>
											{colItems.length}
										</span>
									</div>
								</div>

								<div className="flex flex-col gap-3">
									{colItems.map((item) => (
										<div
											key={item.ref}
											className="p-4 rounded-xl bg-slate-900/60 hover:bg-slate-900/80 backdrop-blur-md border border-white/[0.08] hover:border-blue-500/40 transition-all duration-200 shadow-lg hover:shadow-xl cursor-pointer group space-y-3"
										>
											<div className="flex items-center justify-between text-xs">
												<span
													onClick={() => {
														setSelectedDossier({
															id: item.ref,
															ref: item.ref,
															client: {
																name: item.client,
																phone: "06 12 34 56 78",
																email: `${item.client.toLowerCase().replace(" ", ".")}@example.fr`,
																address: "14 rue de la Paix, 75002 Paris",
																bonusMalus: item.crm,
																licenseDate: "12/04/2015",
															},
															vehicle: {
																plate: item.car.includes("(")
																	? (item.car.split("(")[1]?.replace(")", "") ?? "AB-123-CD")
																	: "AB-123-CD",
																brand: item.car.split(" ")[0] ?? "PEUGEOT",
																model: item.car.split(" ").slice(1).join(" ") || "208 II",
																version: "Allure PureTech",
																firstReg: "2021",
																power: "5 CV",
																fuel: "Essence",
																vin: "VF3UPHNKMPW123456",
															},
															formula: "TOUS_RISQUES",
															partner: item.partner,
															annualPremium: item.premium,
															monthlyPremium: "42 €/mois",
															commissionAmount: item.comm,
															commissionStatus: item.comm.includes("Rapproché") ? "RECONCILED" : "PENDING",
															status: col.id as any,
															missingDoc: item.missingDoc,
															daysWaiting: item.missingDoc ? 3 : 0,
														});
														setSheetOpen(true);
													}}
													className="font-mono text-blue-400 text-[11px] font-semibold hover:underline"
												>
													{item.ref}
												</span>
												<div className="flex items-center gap-1.5">
													<span className="text-[11px] font-medium text-slate-400 bg-white/[0.05] px-2 py-0.5 rounded-md">
														{item.partner}
													</span>
													{/* Actions CRUD rapides par hiérarchie */}
													<button
														title="Modifier le dossier"
														onClick={(e) => {
															e.stopPropagation();
															setEditingDossier({
																id: item.ref,
																ref: item.ref,
																client: {
																	name: item.client,
																	phone: "06 12 34 56 78",
																	email: `${item.client.toLowerCase().replace(" ", ".")}@example.fr`,
																	address: "Adresse",
																	bonusMalus: item.crm,
																	licenseDate: "2015",
																},
																vehicle: {
																	plate: item.car.includes("(")
																		? (item.car.split("(")[1]?.replace(")", "") ?? "AB-123-CD")
																		: "AB-123-CD",
																	brand: item.car.split(" ")[0] ?? "PEUGEOT",
																	model: item.car.split(" ").slice(1).join(" ") || "208 II",
																	version: "Allure",
																	firstReg: "2021",
																	power: "5 CV",
																	fuel: "Essence",
																	vin: "VF123",
																},
																formula: "TOUS_RISQUES",
																partner: item.partner,
																annualPremium: item.premium,
																monthlyPremium: "45 €/mois",
																commissionAmount: item.comm,
																commissionStatus: "PENDING",
																status: col.id as any,
																missingDoc: item.missingDoc,
																daysWaiting: 0,
															});
															setCrudDialogOpen(true);
														}}
														className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
													>
														<Edit className="size-3" />
													</button>
													<button
														title="Supprimer en cascade"
														onClick={(e) => {
															e.stopPropagation();
															setDossierToDelete(item);
															setDeleteImpact({
																entityType: "DOSSIER",
																name: `${item.ref} (${item.client})`,
																children: [
																	{
																		label: "Documents justificatifs attachés",
																		count: item.missingDoc ? 2 : 3,
																		cascadeAction: "DELETE",
																	},
																	{
																		label: "Ligne de commission d'apporteur",
																		count: 1,
																		cascadeAction: "SET_NULL",
																	},
																],
															});
															setDeleteDialogOpen(true);
														}}
														className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
													>
														<Trash2 className="size-3" />
													</button>
												</div>
											</div>

											<div
												onClick={() => {
													setSelectedDossier({
														id: item.ref,
														ref: item.ref,
														client: {
															name: item.client,
															phone: "06 12 34 56 78",
															email: `${item.client.toLowerCase().replace(" ", ".")}@example.fr`,
															address: "14 rue de la Paix, 75002 Paris",
															bonusMalus: item.crm,
															licenseDate: "12/04/2015",
														},
														vehicle: {
															plate: item.car.includes("(")
																? (item.car.split("(")[1]?.replace(")", "") ?? "AB-123-CD")
																: "AB-123-CD",
															brand: item.car.split(" ")[0] ?? "PEUGEOT",
															model: item.car.split(" ").slice(1).join(" ") || "208 II",
															version: "Allure PureTech",
															firstReg: "2021",
															power: "5 CV",
															fuel: "Essence",
															vin: "VF3UPHNKMPW123456",
														},
														formula: "TOUS_RISQUES",
														partner: item.partner,
														annualPremium: item.premium,
														monthlyPremium: "42 €/mois",
														commissionAmount: item.comm,
														commissionStatus: item.comm.includes("Rapproché") ? "RECONCILED" : "PENDING",
														status: col.id as any,
														missingDoc: item.missingDoc,
														daysWaiting: item.missingDoc ? 3 : 0,
													});
													setSheetOpen(true);
												}}
											>
												<p className="font-semibold text-sm text-white group-hover:text-blue-300 transition-colors">
													{item.client}
												</p>
												<p className="text-xs text-slate-300 mt-0.5 flex items-center gap-1.5">
													<Car className="size-3.5 text-slate-400" />
													{item.car}
												</p>
											</div>

											{item.missingDoc && (
												<div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center gap-2">
													<AlertCircle className="size-3.5 shrink-0" />
													<span className="text-[11px]">{item.missingDoc}</span>
												</div>
											)}

											<div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
												<span>{item.crm}</span>
												<div className="flex items-center gap-2">
													<span className="font-semibold text-emerald-400">{item.comm}</span>
												</div>
											</div>
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			)}

			{/* Vue Onglet 2 : Recherche Instantanée SIV Plaque Immat */}
			{activeTab === "siv" && (
				<div className="max-w-3xl mx-auto p-8 rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] shadow-2xl space-y-6">
					<div>
						<h2 className="text-xl font-bold text-white">Recherche SIV Immatriculation</h2>
						<p className="text-xs text-slate-400 mt-1">
							Interrogez la base d'immatriculation française pour pré-remplir instantanément la carte grise sans erreur.
						</p>
					</div>

					<form onSubmit={handleSivLookup} className="flex gap-3">
						<div className="relative flex-1">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-slate-400" />
							<input
								type="text"
								placeholder="Ex: AB-123-CD ou AA001AA"
								value={sivPlate}
								onChange={(e) => setSivPlate(e.target.value)}
								className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white font-mono uppercase tracking-wider text-base focus:outline-none focus:ring-2 focus:ring-blue-500/50"
							/>
						</div>
						<button
							type="submit"
							disabled={sivLoading}
							className="px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 transition-all active:scale-95 disabled:opacity-50"
						>
							{sivLoading ? "Interrogation..." : "Rechercher"}
						</button>
					</form>

					{sivResult && (
						<div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/40 to-slate-900/60 border border-blue-500/30 shadow-xl space-y-4 animate-in fade-in duration-300">
							<div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
								<div className="flex items-center gap-3">
									<div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
										<CheckCircle2 className="size-5" />
									</div>
									<div>
										<span className="text-xs text-blue-300 font-medium">Véhicule identifié</span>
										<h3 className="text-lg font-bold text-white">{sivResult.brand} {sivResult.model}</h3>
									</div>
								</div>
								<span className="px-3 py-1 font-mono font-bold text-sm rounded-lg bg-white/10 text-white border border-white/20">
									{sivResult.plate}
								</span>
							</div>

							<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
								<div>
									<span className="text-slate-400">Version / Finition :</span>
									<p className="font-medium text-slate-200 mt-0.5">{sivResult.version}</p>
								</div>
								<div>
									<span className="text-slate-400">1ère Mise en circulation :</span>
									<p className="font-medium text-slate-200 mt-0.5">{sivResult.firstReg}</p>
								</div>
								<div>
									<span className="text-slate-400">Puissance fiscale :</span>
									<p className="font-medium text-slate-200 mt-0.5">{sivResult.power}</p>
								</div>
								<div>
									<span className="text-slate-400">Énergie :</span>
									<p className="font-medium text-slate-200 mt-0.5">{sivResult.fuel}</p>
								</div>
								<div className="col-span-2">
									<span className="text-slate-400">Numéro de série VIN :</span>
									<p className="font-mono text-slate-300 mt-0.5">{sivResult.vin}</p>
								</div>
							</div>

							<div className="pt-2 flex justify-end">
								<button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all">
									Associer à un Contact Client
									<ArrowRight className="size-3.5" />
								</button>
							</div>
						</div>
					)}
				</div>
			)}

			{/* Vue Onglet 3 : Mode Smartphone Saisie Express */}
			{activeTab === "mobile" && (
				<div className="max-w-md mx-auto">
					<MobileQuickIntake
						onSuccess={(newDossier) => {
							setCustomDossiers((prev) => [
								{
									ref: `DOS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
									client: newDossier.clientName || "Client Express",
									car: `${newDossier.vehicleData?.brand || "AUTO"} (${newDossier.plate})`,
									crm: `Bonus ${newDossier.bonusMalus}`,
									partner: "April Auto",
									premium: "520 €/an",
									comm: "80 €",
									missingDoc: "Relevé d'Information manquant (J+0)",
									colId: "PROSPECT",
								},
								...prev,
							]);
							setActiveTab("kanban");
						}}
					/>
				</div>
			)}

			{/* Fiche Latérale Complète du Dossier (DossierSheet avec les 5 onglets) */}
			<DossierSheet
				dossier={selectedDossier}
				open={sheetOpen}
				onOpenChange={setSheetOpen}
			/>

			{/* Modale CRUD Ajout & Modification */}
			<DossierCrudDialog
				open={crudDialogOpen}
				onOpenChange={setCrudDialogOpen}
				dossier={editingDossier}
				onSave={(saved) => {
					if (editingDossier) {
						setCustomDossiers((prev) =>
							prev.map((d) =>
								d.ref === saved.ref
									? {
											...d,
											client: saved.client.name,
											car: `${saved.vehicle.brand} ${saved.vehicle.model} (${saved.vehicle.plate})`,
											crm: saved.client.bonusMalus,
											partner: saved.partner,
											premium: saved.annualPremium,
											comm: saved.commissionAmount,
										}
									: d,
							),
						);
					} else {
						setCustomDossiers((prev) => [
							{
								ref: saved.ref,
								client: saved.client.name,
								car: `${saved.vehicle.brand} ${saved.vehicle.model} (${saved.vehicle.plate})`,
								crm: saved.client.bonusMalus,
								partner: saved.partner,
								premium: saved.annualPremium,
								comm: saved.commissionAmount,
								missingDoc: null,
								colId: "PROSPECT",
							},
							...prev,
						]);
					}
				}}
			/>

			{/* Dialogue de Confirmation de Suppression en Cascade */}
			<CascadeDeleteDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				impact={deleteImpact}
				onConfirm={() => {
					if (dossierToDelete) {
						setCustomDossiers((prev) =>
							prev.filter((d) => d.ref !== dossierToDelete.ref),
						);
						setDeleteDialogOpen(false);
						setDossierToDelete(null);
					}
				}}
			/>

			{/* Tiroir Menu Global de toutes les pages */}
			<NavigationMenuSheet open={menuOpen} onOpenChange={setMenuOpen} />

			{/* Chat Agent Comp AI CRM Latéral */}
			<CompAiChatSheet open={chatOpen} onOpenChange={setChatOpen} />
		</div>
	);
}
