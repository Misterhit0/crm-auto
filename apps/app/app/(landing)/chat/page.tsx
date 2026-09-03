"use client";

import React, { useState } from "react";
import {
	Bot,
	Sparkles,
	Send,
	CheckCircle2,
	AlertCircle,
	Clock,
	Layers,
	ExternalLink,
	Car,
	DollarSign,
	Search,
} from "lucide-react";
import Link from "next/link";
import { NavigationMenuSheet } from "@/components/navigation-menu-sheet";

export default function FullscreenChatPage() {
	const [menuOpen, setMenuOpen] = useState(false);
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<
		Array<{ role: "assistant" | "user"; text: string; time: string }>
	>([
		{
			role: "assistant",
			text: "Bonjour ! Je suis l'Agent IA Central Comp AI CRM (Eve). Je coordonne l'ensemble de votre cabinet de courtage : qualification SIV, relances automatiques de Relevé d'Information (RI), calcul des marges grossistes et rapprochement de commissions. Comment puis-je vous aider aujourd'hui ?",
			time: "09:00",
		},
	]);

	const handleSend = (userText?: string) => {
		const text = userText || input;
		if (!text.trim()) return;

		const userMsg = {
			role: "user" as const,
			text,
			time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
		};

		setMessages((prev) => [...prev, userMsg]);
		if (!userText) setInput("");

		setTimeout(() => {
			let reply = "J'analyse les données du CRM pour répondre à votre requête...";
			const q = text.toLowerCase();

			if (q.includes("siv") || q.includes("plaque") || q.includes("ab-123-cd") || q.includes("peugeot")) {
				reply = "🚗 **Qualification SIV Peugeot 208 II (AB-123-CD)** :\n\n- Finition : Allure 1.2 PureTech 100ch (5 CV)\n- Énergie : Essence | 1ère immat : 15/06/2022\n- Assuré : Alexandre Martin (Bonus 0.50)\n- Meilleure offre : April Auto Tous Risques (450 €/an)\n- Commission cabinet : 80 € (85% rétrocédé)";
			} else if (q.includes("ri") || q.includes("relevé") || q.includes("manquant") || q.includes("relance")) {
				reply = "⚠️ **Anomalie Documentaire Priorité A.1 Détectée** :\n\n- Dossier DOS-2026-0009 (Thomas Dubois, Golf VIII) : Relevé d'Information manquant depuis 3 jours.\n- Action automatique engagée : Relance SMS & Email envoyée ce matin avec lien de téléversement sécurisé.";
			} else if (q.includes("commission") || q.includes("bordereau") || q.includes("rapprochement")) {
				reply = "💶 **Rapprochement des Commissions du Mois** :\n\n- Volume global : 2 480 €\n- Taux de réconciliation automatique : 93.5%\n- Partenaires : April Auto (1 420 €), Maxance (620 €), Solly Azar (440 €)\n- Écart à pointer : 1 dossier Netvox en attente de validation (+15 €).";
			} else {
				reply = `Demande prise en compte concernant : "${text}". L'agent a synchronisé le dossier associé et mis à jour le journal d'activité. Souhaitez-vous déclencher une action spécifique ?`;
			}

			setMessages((prev) => [
				...prev,
				{
					role: "assistant",
					text: reply,
					time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
				},
			]);
		}, 500);
	};

	return (
		<div className="flex h-screen w-full flex-col bg-slate-950 text-slate-100">
			{/* En-tête Apple HIG */}
			<header className="flex h-14 shrink-0 items-center justify-between border-b border-white/[0.08] px-6 bg-white/[0.02] backdrop-blur-xl">
				<div className="flex items-center gap-3">
					<div className="size-9 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25">
						<Bot className="size-5" />
					</div>
					<div>
						<h1 className="text-sm font-bold text-white flex items-center gap-2">
							Chat IA Central Comp AI (Eve)
							<span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
								<Sparkles className="size-2.5" /> En direct
							</span>
						</h1>
						<p className="text-[11px] text-slate-400">
							Supervision et copilote autonome courtage automobile
						</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<button
						onClick={() => setMenuOpen(true)}
						className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.08] text-xs font-semibold text-white transition-all"
					>
						<Layers className="size-3.5 text-blue-400" />
						Toutes les Pages
					</button>
					<Link
						href="/auto"
						className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white shadow-md transition-all"
					>
						<Car className="size-3.5" />
						Dossiers Auto
					</Link>
				</div>
			</header>

			{/* Zone centrale de chat */}
			<div className="flex flex-1 overflow-hidden">
				{/* Panneau latéral des canaux / prompts rapides */}
				<div className="hidden lg:flex w-72 flex-col border-r border-white/[0.08] bg-white/[0.01] p-4 space-y-4">
					<span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
						Suggestions Prédéfinies
					</span>

					<button
						onClick={() => handleSend("Faire un lookup SIV sur la plaque AB-123-CD")}
						className="text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs text-slate-200 transition-all space-y-1 group"
					>
						<div className="font-semibold text-blue-400 flex items-center gap-1.5">
							<Search className="size-3.5" />
							Lookup SIV Plaque
						</div>
						<p className="text-[11px] text-slate-400">Peugeot 208 II (AB-123-CD)</p>
					</button>

					<button
						onClick={() => handleSend("Vérifier les dossiers avec Relevé d'Information (RI) manquant")}
						className="text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs text-slate-200 transition-all space-y-1 group"
					>
						<div className="font-semibold text-amber-400 flex items-center gap-1.5">
							<AlertCircle className="size-3.5" />
							Priorité A.1 RI Manquant
						</div>
						<p className="text-[11px] text-slate-400">Relance automatique client J+3</p>
					</button>

					<button
						onClick={() => handleSend("Quel est le total des commissions rapprochées ?")}
						className="text-left p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-xs text-slate-200 transition-all space-y-1 group"
					>
						<div className="font-semibold text-emerald-400 flex items-center gap-1.5">
							<DollarSign className="size-3.5" />
							Pointage Commissions
						</div>
						<p className="text-[11px] text-slate-400">Rapprochement bordereaux grossistes</p>
					</button>
				</div>

				{/* Flux de messages */}
				<div className="flex flex-1 flex-col overflow-hidden">
					<div className="flex-1 overflow-y-auto p-6 space-y-4 max-w-4xl w-full mx-auto">
						{messages.map((m, idx) => (
							<div
								key={idx}
								className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
							>
								<div
									className={`max-w-2xl p-4 rounded-2xl text-xs leading-relaxed whitespace-pre-line shadow-lg ${
										m.role === "user"
											? "bg-blue-600 text-white shadow-blue-600/20 rounded-br-sm"
											: "bg-white/[0.03] border border-white/[0.08] text-slate-200 rounded-bl-sm"
									}`}
								>
									{m.text}
								</div>
								<span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
							</div>
						))}
					</div>

					{/* Barre de saisie */}
					<div className="p-4 border-t border-white/[0.08] bg-white/[0.02]">
						<form
							onSubmit={(e) => {
								e.preventDefault();
								handleSend();
							}}
							className="max-w-4xl mx-auto flex items-center gap-2"
						>
							<input
								type="text"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Interrogez Comp AI (ex: analyse plaque AB-123-CD, relances RI, bordereaux April)..."
								className="flex-1 px-4 py-3 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
							/>
							<button
								type="submit"
								disabled={!input.trim()}
								className="size-11 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 transition-all active:scale-95 shrink-0"
							>
								<Send className="size-4" />
							</button>
						</form>
					</div>
				</div>
			</div>

			<NavigationMenuSheet open={menuOpen} onOpenChange={setMenuOpen} />
		</div>
	);
}
