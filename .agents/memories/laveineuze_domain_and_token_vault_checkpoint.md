# Checkpoint Mémoire : Master Gateway laveineuze.fr & Espace Token Vault Sécurisé (SQLite)

- **Date** : 2026-09-10
- **Auteur** : Lead Orchestrator
- **Sujet** : Mise en production du domaine maître laveineuze.fr et déploiement du gestionnaire de jetons d'accès scellés.

## 1. Validation DNS & Certificats SSL
- **DNS Résolu** : `195.35.1.167` pour `laveineuze.fr` et `www.laveineuze.fr`.
- **Routage Traefik** :
  - `https://laveineuze.fr/` (HTTP 200) -> Sas de connexion Zero-Trust & Portail NextGen Trinity.
  - `https://www.laveineuze.fr/` (HTTP 200) -> Redirection / Portail NextGen Trinity.
  - `https://laveineuze.fr/omni/` -> Passerelle OmniRoute.

## 2. Token Vault & Protection des Pages Enfants
- **Base SQLite Scellée** : `/opt/hermes-cluster/trinity-portal/data/tokens.db` (droits stricts).
- **Hachage Cryptographique** : Les jetons sont hachés en `SHA-256` avec sel secret (`PORTAL_SECRET_KEY`).
- **Endpoints Sécurisés** :
  - `POST /api/tokens/create` (génération de token `tk_live_...` avec nom, scope, durée).
  - `GET /api/tokens/list` (inventaire des jetons, dates d'expiration, statut).
  - `POST /api/tokens/revoke` (révocation immédiate).
  - `GET /api/verify-access` (contrôle d'autorisation pour les sous-chemins).
- **Interface Apple HIG** : Nouvel onglet `🔑 Tokens d'Accès` avec modal de copie de lien direct prêt à l'emploi.
