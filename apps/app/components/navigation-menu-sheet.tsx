"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
	LayoutGrid,
	Bot,
	Sparkles,
	Building2,
	Users,
	Handshake,
	Car,
	Search,
	Smartphone,
	DollarSign,
	FileSpreadsheet,
	Settings,
	ShieldCheck,
	FolderKanban,
	ChevronRight,
	Layers,
	FileText,
	PhoneCall,
} from "lucide-react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/responsive-sheet";

export type NavSection = {
	title: string;
	description: string;
	items: Array<{
		title: string;
		href: string;
		description: string;
		icon: React.ComponentType<{ className?: string }>;
		badge?: string;
		badgeColor?: string;
	}>;
};

export const GLOBAL_NAV_SECTIONS: NavSection[] = [
	{
		title: "Pilotage & Intelligence Artificielle",
		description:
			"Supervision globale et interaction avec les agents d'exécution",
		items: [
			{
				title: "Vue d'ensemble Cockpit",
				href: "/",
				description: "Indicateurs synthétiques, activité récente et objectifs",
				icon: LayoutGrid,
			},
			{
				title: "Chat IA Central",
				href: "/chat",
				description: "Dialogue plein écran avec l'agent d'orchestration Eve",
				icon: Bot,
				badge: "IA",
				badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20",
			},
			{
				title: "Agent Builder & Compétences",
				href: "/agents",
				description: "Configuration des flux autonomes et déclencheurs",
				icon: Sparkles,
			},
		],
	},
	{
		title: "Gestion Commerciale & CRM",
		description: "Base relationnelle et pipeline d'affaires",
		items: [
			{
				title: "Entreprises & Apporteurs",
				href: "/companies",
				description: "Comptes entreprises, garages partenaires et flottes",
				icon: Building2,
			},
			{
				title: "Contacts & Clients",
				href: "/contacts",
				description:
					"Répertoire assuré, historique des échanges et fiches 360°",
				icon: Users,
			},
			{
				title: "Opportunités & Deals",
				href: "/deals",
				description: "Suivi des ventes transverses et offres en cours",
				icon: Handshake,
			},
		],
	},
	{
		title: "Métier Courtage Auto & Qualification",
		description: "Cycle de souscription et contrôle carte grise",
		items: [
			{
				title: "Pipeline Dossiers Auto",
				href: "/auto",
				description: "Kanban des dossiers, relances RI et contrôle des pièces",
				icon: FolderKanban,
				badge: "Priorité A.1",
				badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
			},
			{
				title: "Recherche Plaque SIV",
				href: "/auto?tab=siv",
				description: "Interrogation en temps réel de la base d'immatriculation",
				icon: Search,
			},
			{
				title: "Mode Smartphone Terrain",
				href: "/auto?tab=mobile",
				description: "Saisie express et scan photo pour agents nomades",
				icon: Smartphone,
				badge: "Mobile",
				badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20",
			},
		],
	},
	{
		title: "Commissions & Rapprochement Financier",
		description: "Rétrocessions grossistes et détection d'anomalies",
		items: [
			{
				title: "Bordereaux & Pointage",
				href: "/commissions",
				description: "Rapprochement automatique des versements grossistes",
				icon: DollarSign,
				badge: "93.5% Auto",
				badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
			},
			{
				title: "Partenaires Grossistes",
				href: "/commissions#partners",
				description: "Grilles April Auto, Maxance, Solly Azar, Netvox",
				icon: FileSpreadsheet,
			},
		],
	},
	{
		title: "Administration & Configuration",
		description: "Gouvernance et intégrations",
		items: [
			{
				title: "Paramètres du Workspace",
				href: "/settings",
				description: "Gestion d'équipe, SSO, clés API et tracking web",
				icon: Settings,
			},
		],
	},
];

export function NavigationMenuSheet({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const pathname = usePathname();

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="left"
				size="xl"
				className="flex flex-col gap-0 p-0 bg-slate-950/95 backdrop-blur-2xl border-r border-white/[0.08] text-slate-100"
			>
				<SheetHeader className="p-6 border-b border-white/[0.08]">
					<div className="flex items-center gap-3">
						<div className="p-2 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25">
							<Layers className="size-5" />
						</div>
						<div>
							<SheetTitle
								size="default"
								className="text-white font-bold text-lg tracking-tight"
							>
								Catalogue des Modules & Pages
							</SheetTitle>
							<SheetDescription className="text-xs text-slate-400">
								Accédez directement à tous les objets et fonctionnalités de la
								plateforme.
							</SheetDescription>
						</div>
					</div>
				</SheetHeader>

				<div className="flex-1 overflow-y-auto p-6 space-y-8">
					{GLOBAL_NAV_SECTIONS.map((section, idx) => (
						<div key={idx} className="space-y-3">
							<div className="flex flex-col">
								<h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
									{section.title}
								</h3>
								<p className="text-[11px] text-slate-500">
									{section.description}
								</p>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
								{section.items.map((item, itemIdx) => {
									const IconComponent = item.icon;
									const isCurrent =
										pathname === item.href ||
										(item.href !== "/" && pathname.startsWith(item.href));

									return (
										<Link
											key={itemIdx}
											href={item.href}
											onClick={() => onOpenChange(false)}
											className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all duration-200 group ${
												isCurrent
													? "bg-blue-600/15 border-blue-500/40 text-white shadow-lg shadow-blue-500/10"
													: "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.12] text-slate-200"
											}`}
										>
											<div
												className={`p-2 rounded-xl shrink-0 transition-colors ${
													isCurrent
														? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
														: "bg-white/[0.05] text-slate-400 group-hover:text-white group-hover:bg-white/[0.1]"
												}`}
											>
												<IconComponent className="size-4" />
											</div>

											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-2">
													<h4 className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors truncate">
														{item.title}
													</h4>
													{item.badge && (
														<span
															className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
																item.badgeColor ||
																"bg-white/10 text-white border-white/20"
															}`}
														>
															{item.badge}
														</span>
													)}
												</div>
												<p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
													{item.description}
												</p>
											</div>

											<ChevronRight className="size-4 text-slate-600 group-hover:text-slate-300 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
										</Link>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</SheetContent>
		</Sheet>
	);
}
