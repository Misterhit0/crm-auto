# Directives & Mémoire de Travail - crm-nil

> 🤖 **DIRECTIVE IA OBLIGATOIRE**  
> Tout assistant IA (Claude Code, Antigravity, Gemini CLI) **DOIT lire `CLAUDE.md` et `AGENTS.md`** avant toute intervention ou développement sur ce projet.

---

## 🎯 Organisation & Équipes de Développement Disponibles

L'écosystème de travail repose sur une organisation d'agents et de rôles spécialisés :

```
                                  ┌───────────────────────────┐
                                  │   Lead / CTO Orchestrator │
                                  │      (it-manager-pro)     │
                                  └─────────────┬─────────────┘
                                                │
         ┌───────────────────┬──────────────────┼──────────────────┬───────────────────┐
         ▼                   ▼                  ▼                  ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ Product / Spec  │ │ Frontend & UX   │ │ Backend & Data │ │ QA & Securité   │ │ Devops & Release│
│ product-manager │ │ apple-design    │ │ hono / node    │ │ qa / qa-only    │ │ ship            │
│ spec / prd      │ │ ui-ux-pro-max   │ │ postgres / sql │ │ cso / audit     │ │ land-and-deploy │
└─────────────────┘ └─────────────────┘ └────────────────┘ └─────────────────┘ └─────────────────┘
```

### 1. Pôle Direction Technique & Architecture (CTO & Management)
- **Rôle principal** : Arbitrage technique, choix de stack, modélisation globale, sécurité et gouvernance.
- **Skills mobilisés** : `it-manager-pro`, `plan-eng-review`, `plan-ceo-review`, `autoplan`.
- **Règle d'autonomie** : Pleine autonomie pour auditer, lire, générer des architectures, des plans et exécuter en local. Les actions impactant des environnements partagés/production nécessitent confirmation explicite.

### 2. Pôle Produit & Cadrage (Product & Specs)
- **Rôle principal** : Clarification du besoin, spécifications fonctionnelles, priorisation et user stories.
- **Skills mobilisés** : `product-manager`, `product-manager-toolkit`, `product-strategy`, `spec`, `office-hours`.

### 3. Pôle Frontend & Design Système (UI / UX / Frontend Dev)
- **Rôle principal** : Interfaces modernes, composabilité, design tokens, micro-animations et standards Apple HIG.
- **Skills mobilisés** : `apple`, `frontend-design`, `ui-ux-pro-max`, `shadcn`, `tailwind-patterns`, `design-consultation`, `design-html`, `design-review`, `design-shotgun`.
- **Règle de design** : Application du standard **Apple HIG** par défaut (sauf si instruction `/no-apple`).

### 4. Pôle Backend & Données (Backend & Database Engineering)
- **Rôle principal** : Architecture d'API, intégrité transactionnelle, modèles relationnels, sécurité et performance.
- **Skills mobilisés** : `api-endpoint-builder`, `api-security-best-practices`, `postgres-best-practices`, `drizzle-orm-expert`, `hono`, `typescript-expert`, `zod-validation-expert`.

### 5. Pôle Qualité, Sécurité & Diagnostic (QA, Debugging & CSO)
- **Rôle principal** : Détection systématique de régressions, audits de code, tests bout en bout et sécurité applicative.
- **Skills mobilisés** : `systematic-debugging`, `investigate`, `qa`, `qa-only`, `cso`, `code-reviewer`, `lint-and-validate`.

### 6. Pôle Déploiement & Cycle de Vie (DevOps & Release)
- **Rôle principal** : Revue avant mise en production, déploiements propres, gestion des versions et canaris.
- **Skills mobilisés** : `review`, `ship`, `land-and-deploy`, `canary`, `document-release`, `careful`.

---

## ⚡ Schéma d'Exécution & g-stack

Pour toute phase du projet, utiliser l'orchestration **gstack** :
1. **Conception & Planification** : `/office-hours` ➔ `/plan-ceo-review` ➔ `/plan-eng-review` ➔ `/plan-design-review`
2. **Design & Prototypage** : `/design-consultation` ➔ `/design-shotgun` ➔ `/design-html`
3. **Investigation & Debugging** : `/investigate` (démarche rigoureuse avant tout fix)
4. **Validation & Assurance Qualité** : `/qa` ou `/qa-only` avec navigation headless `/browse`
5. **Pré-mise en production & Livraison** : `/review` ➔ `/ship` ➔ `/land-and-deploy` ➔ `/canary`

---

## 📋 Règles Fondamentales du Projet

### 1. Sauvegarde Continue de Contexte (`mem-cp`)
À chaque étape majeure ou action significative :
- Consigner l'état de la tâche, les décisions et les fichiers modifiés dans `.agents/memories/` via `mem-cp`.

### 2. Standard Apple Design System (HIG)
- Pour toute création d'interface web/mobile : glassmorphism (`backdrop-filter: blur(20px)`), typographie moderne (SF Pro / Inter), coins arrondis organiques (12px-20px), animations souples (springs) et contrastes équilibrés.
- **Exception** : Utiliser la commande `/no-apple` en début de prompt pour désactiver cette règle.

### 3. Cartographie & Knowledge Graph (`graphify`)
- Dès l'ajout des premiers modules de code, initialiser et maintenir le graphe de connaissances avec `graphify . --obsidian` pour préserver une documentation vivante dans `graphify-out/`.
- **Mise à jour obligatoire** : après chaque modification de fichiers, exécuter `graphify update .`.

### 4. Validation Systématique & Règle Absolue de Déploiement (/qa)
- **Règle Absolue** : Tant que l'intégralité des tests unitaires et de typage (`check-types`, `test:qa`) n'est pas passée avec 100% de succès, **aucun push n'est autorisé**.
- Le hook Git `.githooks/pre-push` applique cette contrainte de manière infranchissable avant tout envoi vers le dépôt distant.

---

## 🛠️ Commandes Utiles & Workflows

| Action | Commande / Workflow |
| :--- | :--- |
| **Typecheck** | `bun run check-types` |
| **Tests QA** | `bun run test:qa` |
| **Validation Globale** | `bun run check-types && bun run test:qa` |
| **Knowledge Graph Init** | `graphify . --obsidian` |
| **Knowledge Graph Update** | `graphify update .` |
| **Navigation QA / Headless** | Skill `/browse` ou `/qa` |
| **Désactivation Apple HIG** | Préfixer la commande par `/no-apple` |
| **Sauvegarde de contexte** | Skill `mem-cp` (dans `.agents/memories/`) |
