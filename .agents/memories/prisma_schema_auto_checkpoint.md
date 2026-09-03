# Checkpoint : Modélisation Métier Prisma Assurance Auto & Validation

- **Date** : 03/09/2026
- **Pôle mobilisé** : Backend & Data Engineering (`drizzle-orm-expert`, `postgres-best-practices`, `zod-validation-expert`)
- **Action** :
  - Enrichissement du schéma de base de données `packages/db/prisma/schema.prisma` avec l'ensemble des entités du métier :
    - `Vehicle` (immatriculation SIV, marque, modèle, DIN, CV, carburant, stationnement, km, payload API SIV).
    - `DriverProfile` (CRM bonus/malus, historique de sinistres sur 36 mois, résiliations, suspensions).
    - `BrokerPartner` (grossistes & partenaires : April, Solly Azar, Maxance, Netvox, barèmes de commissionnement).
    - `InsuranceDossier` (cycle de vie du prospect jusqu'au contrat actif et date anniversaire Loi Hamon).
    - `DossierDocument` (GED permis, carte grise, relevé d'information avec statuts OCR).
    - `CommissionStatement` & `CommissionRecord` (bordereaux grossistes et rapprochement intelligent).
  - Liaison avec le modèle `Contact`.
  - Lancement de la validation syntaxique Prisma.
