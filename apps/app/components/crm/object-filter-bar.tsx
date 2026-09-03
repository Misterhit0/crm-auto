"use client";

import React, { useState } from "react";
import {
	Search,
	Filter,
	X,
	Check,
	SlidersHorizontal,
	AlertCircle,
	ShieldCheck,
	Car,
	Building2,
	ChevronDown,
	RefreshCw,
} from "lucide-react";

export type FilterFacet = {
	id: string;
	label: string;
	options: Array<{
		value: string;
		label: string;
		count?: number;
		badgeColor?: string;
	}>;
};

export function ObjectFilterBar({
	searchPlaceholder = "Rechercher par mot-clé, nom, référence, immatriculation...",
	facets,
	selectedFilters,
	onFilterChange,
	searchValue,
	onSearchChange,
	onReset,
	totalResults,
}: {
	searchPlaceholder?: string;
	facets: FilterFacet[];
	selectedFilters: Record<string, string[]>;
	onFilterChange: (facetId: string, value: string) => void;
	searchValue: string;
	onSearchChange: (query: string) => void;
	onReset?: () => void;
	totalResults?: number;
}) {
	const [activeFacetOpen, setActiveFacetOpen] = useState<string | null>(null);

	const activeFilterCount = Object.values(selectedFilters).reduce(
		(acc, curr) => acc + curr.length,
		0,
	);

	return (
		<div className="space-y-3 p-4 rounded-2xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.08] shadow-lg">
			{/* Ligne 1 : Champ de recherche et boutons de contrôle */}
			<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
				<div className="relative flex-1">
					<Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
					<input
						type="text"
						placeholder={searchPlaceholder}
						value={searchValue}
						onChange={(e) => onSearchChange(e.target.value)}
						className="w-full pl-10 pr-10 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
					/>
					{searchValue && (
						<button
							onClick={() => onSearchChange("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-white"
						>
							<X className="size-3.5" />
						</button>
					)}
				</div>

				<div className="flex items-center gap-2">
					{totalResults !== undefined && (
						<span className="text-xs text-slate-400 font-medium px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.06]">
							<strong className="text-white font-bold">{totalResults}</strong>{" "}
							résultat{totalResults > 1 ? "s" : ""}
						</span>
					)}

					{activeFilterCount > 0 && onReset && (
						<button
							onClick={onReset}
							className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all"
						>
							<RefreshCw className="size-3" />
							Réinitialiser ({activeFilterCount})
						</button>
					)}
				</div>
			</div>

			{/* Ligne 2 : Facettes et filtres déroulants */}
			<div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/[0.06]">
				<span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
					<Filter className="size-3 text-blue-400" />
					Filtres :
				</span>

				{facets.map((facet) => {
					const selectedInFacet = selectedFilters[facet.id] || [];
					const hasActive = selectedInFacet.length > 0;
					const isOpen = activeFacetOpen === facet.id;

					return (
						<div key={facet.id} className="relative">
							<button
								onClick={() => setActiveFacetOpen(isOpen ? null : facet.id)}
								className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
									hasActive
										? "bg-blue-600/20 border-blue-500/40 text-blue-300 font-semibold"
										: "bg-white/[0.03] border-white/[0.08] text-slate-300 hover:bg-white/[0.06]"
								}`}
							>
								<span>{facet.label}</span>
								{hasActive && (
									<span className="size-4 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
										{selectedInFacet.length}
									</span>
								)}
								<ChevronDown
									className={`size-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
								/>
							</button>

							{/* Menu Popover des Options de la Facette */}
							{isOpen && (
								<div className="absolute left-0 top-full mt-2 z-50 min-w-[220px] p-2 rounded-2xl bg-slate-900 border border-white/[0.12] shadow-2xl space-y-1 animate-in fade-in zoom-in-95">
									<div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-white/[0.06] mb-1">
										{facet.label}
									</div>

									{facet.options.map((option) => {
										const isChecked = selectedInFacet.includes(option.value);

										return (
											<button
												key={option.value}
												onClick={() => onFilterChange(facet.id, option.value)}
												className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors ${
													isChecked
														? "bg-blue-600 text-white font-medium"
														: "text-slate-300 hover:bg-white/[0.05]"
												}`}
											>
												<span className="truncate">{option.label}</span>
												<div className="flex items-center gap-2">
													{option.count !== undefined && (
														<span className="text-[10px] text-slate-400 bg-white/[0.08] px-1.5 py-0.5 rounded">
															{option.count}
														</span>
													)}
													{isChecked && <Check className="size-3.5 shrink-0" />}
												</div>
											</button>
										);
									})}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
