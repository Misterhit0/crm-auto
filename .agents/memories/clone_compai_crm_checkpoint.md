# Checkpoint : Clônage & Intégration Socle Base Comp AI CRM

- **Date** : 03/09/2026
- **Action** :
  - Clônage du dépôt officiel `https://github.com/trycompai/crm` dans le projet `crm-nil`.
  - Préservation intégrale des configurations des équipes d'agents (`AGENTS.md`, `.agents/`, `.antigravity/`, `CLAUDE.md`, `skills_library.md`).
  - Validation de l'arborescence monorepo :
    - `apps/app` (Next.js App Router + shadcn/ui)
    - `apps/api` (NestJS + tRPC)
    - `apps/agent` (Agentic AI orchestration)
    - `packages/db` (PostgreSQL + Prisma)
    - `packages/ui` (Design System)
    - `packages/auth` (Better-Auth)
  - Validation de la décision sur l'**API SIV / Immatriculation** : Intégration retenue pour remplir automatiquement la carte grise à partir de la plaque d'immatriculation.
- **Prochaine étape** :
  - Extension du schéma Prisma pour modéliser les entités Automobile (Véhicules, Profil Conducteur, Bonus/Malus, Dossiers d'Assurance, Grossistes et Rapprochement de Bordereaux de Commissions).
