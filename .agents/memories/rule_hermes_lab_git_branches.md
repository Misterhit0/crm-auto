# Checkpoint Mémoire : Règle Absolue Hermes-Lab & Double Branche Git

- **Date** : 2026-09-06
- **Sujet** : Intégration de la règle absolue pour hermes-lab (nouveau projet -> répertoire + lien + git double branche main/dev + push à chaque version), ajout de crm-nil sur le serveur VPS et synchronisation des branches.

## Actions Réalisées

1. **Règle Absolue Hermes-Lab sur le Serveur VPS** :
   - Mise à jour de `/opt/hermes-cluster/instances/hermes-lab/config/INSTRUCTIONS.md` (monté dans `/workspace/` du conteneur hermes-lab).
   - Obligation d'un répertoire dédié, initialisation Git, branches obligatoires `main` et `dev`, et push automatique à chaque version/itération.

2. **Règle 5 dans le Référentiel du Projet `crm-nil`** :
   - Ajout de la `Règle 5 : Règle Absolue de Démarrage de Projet & Double Branche (main / dev)` dans [AGENTS.md](file:///Users/cogepart/Documents/crm-nil/AGENTS.md) et [.agents/AGENTS.md](file:///Users/cogepart/Documents/crm-nil/.agents/AGENTS.md).

3. **Application sur `crm-nil` (Local & Remote)** :
   - Création de la branche `dev` locale.
   - Poussée des deux branches `main` et `dev` sur GitHub (`https://github.com/Misterhit0/crm-auto.git`).
   - Hook de pré-déploiement `.githooks/pre-push` validé à 100% (13 tâches de typage + suite QA).

4. **Déploiement du projet sur le Serveur VPS** :
   - Projet cloné dans `/opt/hermes-cluster/instances/hermes-lab/projects/crm-nil`.
   - Branches `main` et `dev` synchronisées et trackées sur le serveur.
