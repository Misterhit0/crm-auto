# Checkpoint Mémoire : Autonomie Totale Hermes-Work (Multi-branches, Credentials & Knowledge Graph)

- **Date** : 2026-09-10
- **Auteur** : Lead Orchestrator
- **Sujet** : Déploiement des accès serveurs sécurisés, tracking exhaustif de toutes les branches Git de WORK, synchronisation des rapports et mise à jour Graphify.

## 1. Sécurité des Accès Distants (SSH Wrappers)
- Variables stockées dans `/opt/hermes-cluster/instances/hermes-work/credentials/.env.servers` avec permissions `600`.
- Injection via `env_file` dans `hermes-work`.
- Wrappers installés dans `/usr/local/bin/` :
  - `ssh-zou` (192.168.199.226 / cogepartfr)
  - `ssh-lad` (192.168.199.226 / lad)
  - `ssh-pda` (192.168.199.130 / pda)
  - `ssh-dispatch` (192.168.199.48 / cogepart)
  - `ssh-sftp` (192.168.199.122 / cogepart-sftp)
- Les scripts utilisent `sshpass -e` : aucun mot de passe n'est passé en clair en argument de commande ou dans l'historique shell.

## 2. Tracking Multi-Branches Exhaustif
Toutes les branches distantes de chaque projet de l'écosystème WORK sont trackées localement et synchronisées sur le serveur :
- `zou` (62 branches trackées)
- `lad_NEWEST` (62 branches trackées)
- `dispatch-new` (14 branches trackées)
- `CORE` (18 branches trackées)
- `my-assistant-api` (46 branches trackées)

## 3. Connaissances & Rapports Synchronisés
- `SEKURIT_SHIPPINGPOINT_ANALYSIS.md`
- `rapport_analyse_colis_tempo_one.md`
- `RAPPORT_ANALYSE_EDI_PSA_ZOU.md`
- Correctif cron EDI / DISPOR `cron_generer_dispor_marignane.php`

## 4. Knowledge Graph
- `graphify` mis à jour en local sur `crm-nil` (7 788 nœuds, 19 479 arêtes, 377 communautés).
- `graphify` installé et synchronisé dans `hermes-work`.
