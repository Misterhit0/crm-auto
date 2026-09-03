"use client";

import React from "react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@crm/ui/components/alert-dialog";
import { AlertTriangle, Trash2, ArrowRight, ShieldAlert } from "lucide-react";

export type CascadeImpact = {
	entityType: "COMPANY" | "CONTACT" | "VEHICLE" | "DOSSIER";
	name: string;
	children: Array<{
		label: string;
		count: number;
		cascadeAction: "DELETE" | "SET_NULL" | "RESTRICT";
	}>;
};

export function CascadeDeleteDialog({
	open,
	onOpenChange,
	impact,
	onConfirm,
	isDeleting = false,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	impact: CascadeImpact | null;
	onConfirm: () => void;
	isDeleting?: boolean;
}) {
	if (!impact) return null;

	const hasRestrictions = impact.children.some(
		(c) => c.cascadeAction === "RESTRICT" && c.count > 0,
	);

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="max-w-md rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-rose-500/30 shadow-2xl p-6 text-slate-100">
				<AlertDialogHeader className="space-y-3">
					<div className="size-12 rounded-2xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/20">
						<AlertTriangle className="size-6" />
					</div>
					<AlertDialogTitle className="text-lg font-bold text-white tracking-tight">
						Supprimer {impact.name} ?
					</AlertDialogTitle>
					<AlertDialogDescription className="text-xs text-slate-300 leading-relaxed">
						Cette action est irréversible. En raison de la hiérarchie relationnelle de la base de données, la suppression entraînera les répercussions suivantes en cascade :
					</AlertDialogDescription>
				</AlertDialogHeader>

				{/* Détail des impacts en cascade */}
				<div className="my-4 p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-2 text-xs">
					<span className="font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
						Éléments rattachés impactés :
					</span>
					{impact.children.map((child, idx) => (
						<div
							key={idx}
							className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/[0.04]"
						>
							<span className="text-slate-200 font-medium">{child.label}</span>
							<div className="flex items-center gap-2">
								<span className="font-bold text-white px-2 py-0.5 rounded-md bg-white/[0.08]">
									{child.count}
								</span>
								<span
									className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
										child.cascadeAction === "DELETE"
											? "bg-rose-500/10 text-rose-400 border-rose-500/20"
											: child.cascadeAction === "SET_NULL"
												? "bg-amber-500/10 text-amber-400 border-amber-500/20"
												: "bg-red-500/20 text-red-300 border-red-500/40"
									}`}
								>
									{child.cascadeAction === "DELETE"
										? "Supprimé en cascade"
										: child.cascadeAction === "SET_NULL"
											? "Délié (Archivé)"
											: "Bloquant"}
								</span>
							</div>
						</div>
					))}
				</div>

				{hasRestrictions && (
					<div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 mb-2">
						<ShieldAlert className="size-4 shrink-0" />
						<span>
							Suppression impossible : un contrat actif est actuellement en cours sur cet objet.
						</span>
					</div>
				)}

				<AlertDialogFooter className="gap-2 sm:gap-3">
					<AlertDialogCancel
						disabled={isDeleting}
						className="rounded-xl border-white/[0.1] bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-semibold"
					>
						Annuler
					</AlertDialogCancel>
					<AlertDialogAction
						disabled={hasRestrictions || isDeleting}
						onClick={onConfirm}
						className="rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg shadow-rose-600/30 transition-all active:scale-95 disabled:opacity-40"
					>
						{isDeleting ? "Suppression en cours..." : "Confirmer la suppression en cascade"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
