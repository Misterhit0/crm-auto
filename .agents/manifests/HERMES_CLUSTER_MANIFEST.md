# 🏛️ MANIFESTE CENTRAL DES BONNES PRATIQUES — CLUSTER HERMES (TRINITY)

> **Version** : 2.0 (Septembre 2026)  
> **Statut** : Document Maître & Source de Vérité Universelle pour l'écosystème multi-agents Hermes.  
> **Instances Actives** : `hermes-work`, `hermes-lab`, `hermes-jarvis`.

---

## 🧭 1. Architecture Globale du Cluster

Le cluster Hermes repose sur un partitionnement clair des responsabilités en trois instances autonomes mais interconnectées par un bus événementiel et une mémoire partagée :

```
                                  ┌─────────────────────────────┐
                                  │      HERMES-JARVIS          │
                                  │  Vie Quotidienne, Telegram,  │
                                  │  Gmail, Juridique, Finances │
                                  └──────────────┬──────────────┘
                                                 │
                                                 │ EventBus (Redis)
                                                 ▼
                ┌────────────────────────────────┴────────────────────────────────┐
                │                                                                 │
                ▼                                                                 ▼
┌─────────────────────────────┐                                   ┌─────────────────────────────┐
│        HERMES-WORK          │                                   │         HERMES-LAB          │
│ Cerveau Technique & CTO     │                                   │ Continuous Coder & R&D      │
│ Logistique, Transport EDI,  │◄────── Syncthing / Qdrant ───────►│ UI/UX Apple HIG, Next/Bun,  │
│ Bases SQL, Dispatch & B2B   │                                   │ Prototypage Rapide & Apps   │
└─────────────────────────────┘                                   └─────────────────────────────┘
```

### Composants Communs d'Infrastructure :
- **Gateway IA** : OmniRoute (`http://127.0.0.1:20129/v1` et Dashboard sur `https://hermes-agent-2npp.srv1957245.hstgr.cloud`).
- **Event Bus Pub/Sub** : Redis (`redis://:e8f92a1c4b7d5e6f3a0b8c9d1e2f4a5b@127.0.0.1:6379`).
- **Base Vectorielle** : Qdrant (`http://127.0.0.1:6333`).
- **Synchronisation Mémoire / Obsidian** : Syncthing (`http://127.0.0.1:8384`).

---

## ⚖️ 2. Les 5 Règles Absolues Communes à TOUS les Hermes

Toutes les instances Hermes doivent respecter rigoureusement ces 5 règles sans dérogation possible :

### Règle 1 : Persistance et Checkpoint Systématique (`mem-cp`)
- Toute réflexion critique, modification significative de code, décision d'architecture ou blocage doit être sauvegardée immédiatement dans `/workspace/memory/` ou via le skill `mem-cp`.
- Aucun contexte ne doit être perdu entre deux exécutions de conteneurs ou sessions d'orchestration.

### Règle 2 : Cartographie Vivante & Graphify Knowledge Graph
- L'arborescence des projets et l'état des liaisons logicielles doivent être maintenus à jour via `graphify update .`.
- Avant toute modification de code complexe, interroger le graphe de connaissances (`graphify query`, relations de dépendances).

### Règle 3 : Standard de Qualité & QA Strict (Zéro Régression)
- Interdiction stricte de pousser du code en production ou sur les branches stables (`main`) sans validation préalable à 100% des tests unitaires, linters et vérifications de typage (`bun run check-types`, `test:qa`, etc.).
- Les hooks de pré-push doivent être respectés et jamais contournés avec `--no-verify`.

### Règle 4 : Cycle Obligatoire Nouveau Projet (Répertoire, Lien & Double Branche Git)
- Pour **TOUT nouveau projet** démarré :
  1. Création d'un répertoire dédié avec lien symbolique d'accès clair.
  2. Initialisation d'un dépôt Git (`git init`).
  3. Création impérative des **deux branches** : `main` (stable/déploiement) et `dev` (développement en cours).
  4. Push systématique vers le dépôt distant à chaque version ou étape majeure validée.

### Règle 5 : Human-in-the-Loop pour Actions Irréversibles & Production
- Aucune suppression de base de données, écrasement de production sensible, action bancaire ou envoi d'e-mail officiel avec engagement juridique ne doit être opéré sans approbation explicite (ex: confirmation Telegram via Jarvis ou validation utilisateur).

---

## 📂 3. Répertoire des Manifestes & Documentations Spécifiques

Chaque agent dispose de son propre manifeste détaillé et de ses protocoles opérationnels :
- **Hermes-Work** : `/opt/hermes-cluster/shared/manifests/HERMES_WORK_MANIFEST.md`
- **Hermes-Lab** : `/opt/hermes-cluster/shared/manifests/HERMES_LAB_MANIFEST.md`
- **Hermes-Jarvis** : `/opt/hermes-cluster/shared/manifests/HERMES_JARVIS_MANIFEST.md`

