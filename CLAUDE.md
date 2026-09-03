# Directives & Mémoire de Travail - crm-nil

> 🤖 **DIRECTIVE IA OBLIGATOIRE**  
> Tout assistant IA (Antigravity, Claude Code, Gemini CLI) **DOIT lire `CLAUDE.md` et `AGENTS.md`** avant toute intervention ou développement sur ce projet.

---

## gstack
Use the `/browse` skill from gstack for all web browsing. **NEVER** use `mcp__claude-in-chrome__*` tools.

### Available gstack skills:
- `/office-hours` : Cadrage initial et alignement produit/vision
- `/plan-ceo-review` : Revue stratégique et simplification
- `/plan-eng-review` : Revue technique et architecture d'ingénierie
- `/plan-design-review` : Revue ergonomique et direction artistique
- `/design-consultation` : Définition des tokens et du design system
- `/design-shotgun` : Génération de variantes comparatives d'interfaces
- `/design-html` : Implémentation HTML/CSS responsive haut de gamme
- `/review` : Revue de code avant merge/commit
- `/ship` : Préparation et exécution de release
- `/land-and-deploy` : Déploiement automatisé
- `/canary` : Surveillance post-déploiement
- `/benchmark` : Suivi et non-régression de performance
- `/browse` : Navigateur headless pour QA et tests visuels
- `/connect-chrome` : Connexion au navigateur de test
- `/qa` & `/qa-only` : Tests fonctionnels et détection de bugs
- `/design-review` : Audit visuel et cohérence graphique
- `/setup-browser-cookies` : Gestion de session navigateur
- `/setup-deploy` : Configuration de déploiement
- `/setup-gbrain` : Synchronisation gbrain
- `/retro` : Rétrospective d'ingénierie
- `/investigate` : Diagnostic rigoureux de bugs
- `/document-release` & `/document-generate` : Génération et mise à jour documentaire
- `/codex` : Assistance CLI avancée
- `/cso` : Revue sécurité & conformité
- `/autoplan` : Pipeline de décision automatisé
- `/plan-devex-review` & `/devex-review` : Audit d'expérience développeur
- `/careful` / `/guard` / `/freeze` / `/unfreeze` : Garde-fous et périmètres
- `/gstack-upgrade` : Mise à jour des briques gstack
- `/learn` : Capitalisation d'apprentissage projet

---

## 1. Description du Projet
**crm-nil** est un nouveau projet CRM conçu avec une architecture propre et moderne, des interfaces répondant au standard Apple HIG, et un écosystème de skills complet pour assurer productivité, maintenabilité et sécurité.

---

## 2. Commandes Utiles & Workflows

| Action | Commande / Workflow |
| :--- | :--- |
| **Knowledge Graph** | `graphify . --obsidian` |
| **Mise à jour Graphe** | `graphify update .` |
| **Checkpoint Contexte** | Skill `mem-cp` (dans `.agents/memories/`) |
| **QA / Tests Navigateur** | Skill `/browse` ou `/qa` |
| **Désactivation Apple HIG** | Commencer la demande par `/no-apple` |

---

## 3. Directives d'Agent IA
1. Consulter [AGENTS.md](file:///Users/cogepart/Documents/crm-nil/AGENTS.md) pour connaître la répartition des équipes de développement (Lead/CTO, Product, Frontend, Backend, QA, DevOps).
2. Toujours valider les modifications et exécuter les tests avant de clore une tâche.
3. Conserver un historique clair des décisions dans `.agents/memories/`.
