# Checkpoint Mémoire : Synchronisation Continue des Dépôts et du Cerveau (hermes-work)

- **Date** : 2026-09-10
- **Auteur** : Lead Orchestrator
- **Sujet** : Activation du cron 5 minutes pour hermes-work synchronisant en continu les commits et branches collègues et le Knowledge Graph.

## 1. Fonctionnement du Cycle 5 Minutes
- **Exécution** : Cron hôte `*/5 * * * * docker exec hermes-work /bin/bash /workspace/scripts/sync_team_work.sh`.
- **Dépôts Scannés** :
  - `/workspace/projects/zou`
  - `/workspace/projects/lad_NEWEST`
  - `/workspace/projects/dispatch-new`
  - `/workspace/projects/CORE`
  - `/workspace/projects/my-assistant-api`
  - `/workspace/projects/killer-saas`
  - `/workspace/projects/crm-nil`
- **Actions Automatiques** :
  - `git fetch --all --tags --prune`
  - Détection automatique de toute nouvelle branche distante créée par un collègue et création immédiate de la branche de tracking locale correspondante (`git branch --track`).
  - Fast-forward propre (`git merge --ff-only`) sur la branche de travail si elle est propre.
  - Si des modifications sont constatées : déclenchement de `graphify update .` et notification sur le bus Redis `hermes:events`.
  - Journalisation continue dans `/workspace/data/cron_sync.log`.
