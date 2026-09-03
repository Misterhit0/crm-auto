"use client";

import React, { useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetDescription,
} from "@/components/responsive-sheet";
import { Bot, Sparkles, Send, CheckCircle2, ShieldCheck, Car, ExternalLink, HelpCircle } from "lucide-react";
import Link from "next/link";

export function CompAiChatSheet({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<
		Array<{ role: "assistant" | "user"; text: string; time: string; action?: string }>
	>([
		{
			role: "assistant",
			text: "Bonjour ! Je suis l'Agent IA Comp AI CRM. Je peux analyser vos dossiers d'assurance auto, rechercher une plaque SIV, vérifier un Relevé d'Information (RI) manquant ou rapprocher vos bordereaux de commissions. Que souhaitez-vous faire ?",
			time: "À l'instant",
		},
	]);

	const handleSend = (textToSend?: string) => {
		const text = textToSend || input;
		if (!text.trim()) return;

		const userMsg = {
			role: "user" as const,
			text,
			time: "À l'instant",
		};

		setMessages((prev) => [...prev, userMsg]);
		if (!textToSend) setInput("");

		setTimeout(() => {
			let reply = "J'ai bien analysé votre demande. Je vérifie les informations dans le CRM...";
			const q = text.toLowerCase();

			if (q.includes("siv") || q.includes("plaque") || q.includes("ab-123-cd") || q.includes("golf")) {
				reply = "🔍 **Analyse SIV effectuée** :\n\n- Véhicule identifié : Peugeot 208 II 1.2 PureTech 100ch\n- Puissance fiscale : 5 CV (Essence)\n- Profil recommandé : April Auto Formule Tous Risques (450 €/an)\n- Commission estimée : 80 €";
			} else if (q.includes("ri") || q.includes("relevé") || q.includes("document") || q.includes("relance")) {
				reply = "📄 **Priorité A.1 Détectée** : Le Relevé d'Information (RI) est manquant sur le dossier DOS-2026-0009 (Thomas Dubois) depuis 3 jours. J'ai préparé un SMS et un email de relance avec lien sécurisé de téléversement smartphone.";
			} else if (q.includes("commission") || q.includes("bordereau") || q.includes("rapprochement")) {
				reply = "💶 **Rapprochement Financier** : Sur les 2 480 € de commissions du mois, 93.5% sont rapprochés automatiquement. 1 dossier April Auto nécessite un pointage d'écart de 15 €.";
			} else {
				reply = `Analyse terminée sur : "${text}". Tous les dossiers liés sont à jour dans le CRM. Souhaitez-vous déclencher une action ou ouvrir la fiche complète ?`;
			}

			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					text: reply,
					time: "À l'instant",
				},
			]);
		}, 600);
	};

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="right"
				className="w-full sm:max-w-md md:max-w-lg bg-slate-950/95 backdrop-blur-2xl border-l border-white/[0.08] shadow-2xl p-0 flex flex-col z-[100]"
			>
				<SheetHeader className="p-4 border-b border-white/[0.08] flex-row items-center justify-between space-y-0">
					<div className="flex items-center gap-3">
						<div className="size-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
							<Bot className="size-5" />
						</div>
						<div>
							<SheetTitle className="text-sm font-bold text-white flex items-center gap-1.5">
								Comp AI Agent CRM
								<span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
									<Sparkles className="size-2.5" /> En ligne
								</span>
							</SheetTitle>
							<SheetDescription className="text-[11px] text-slate-400">
								Copilote intelligent courtage & assurance automobile
							</SheetDescription>
						</div>
					</div>

					<Link
						href="/chat"
						onClick={() => onOpenChange(false)}
						className="hidden sm:flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-colors border border-white/[0.06]"
					>
						<span>Plein écran</span>
						<ExternalLink className="size-3" />
					</Link>
				</SheetHeader>

				{/* Suggestions rapides en haut */}
				<div className="p-3 border-b border-white/[0.06] bg-white/[0.02] flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
					<button
						onClick={() => handleSend("Vérifier les dossiers avec Relevé d'Information (RI) manquant")}
						className="shrink-0 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-medium transition-all"
					>
						⚠️ Dossiers avec RI manquant
					</button>
					<button
						onClick={() => handleSend("Faire un lookup SIV sur la plaque AB-123-CD")}
						className="shrink-0 px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-300 font-medium transition-all"
					>
						🚗 Lookup SIV Peugeot 208
					</button>
					<button
						onClick={() => handleSend("Quel est le total des commissions rapprochées ?")}
						className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-medium transition-all"
					>
						💶 Pointage Commissions
					</button>
				</div>

				{/* Liste des messages */}
				<div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
					{messages.map((m, idx) => (
						<div
							key={idx}
							className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
						>
							<div
								className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-line ${
									m.role === "user"
										? "bg-blue-600 text-white shadow-md shadow-blue-600/20 rounded-br-sm"
										: "bg-white/[0.04] border border-white/[0.08] text-slate-200 rounded-bl-sm"
								}`}
							>
								{m.text}
							</div>
							<span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
						</div>
					))}
				</div>

				{/* Saisie de message */}
				<form
					onSubmit={(e) => {
						e.preventDefault();
						handleSend();
					}}
					className="p-3 border-t border-white/[0.08] bg-white/[0.02] flex items-center gap-2"
				>
					<input
						type="text"
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder="Posez une question à Comp AI sur un dossier ou une plaque..."
						className="flex-1 px-3.5 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
					/>
					<button
						type="submit"
						disabled={!input.trim()}
						className="size-9 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white flex items-center justify-center shadow-md transition-all active:scale-95 shrink-0"
					>
						<Send className="size-4" />
					</button>
				</form>
			</SheetContent>
		</Sheet>
	);
}
