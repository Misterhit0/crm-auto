# Dynamic Context & Architectural Guidelines - WORK Monorepo

> [!IMPORTANT]
> **RÈGLE D'OR DE CONSULTATION**
> L'agent IA (Antigravity / Gemini / Claude) **DOIT** obligatoirement consulter `graphify-out/GRAPH_REPORT.md` et `graphify-out/graph.json` avant tout refactoring, modification d'architecture ou recherche complexe dans la base de code.

---

# Gestion Dynamique des Skills
- Ne charge aucun skill au démarrage du workspace.
- Si le prompt de l'utilisateur contient le mot-clé `/skill-name` (ex: `/prd`, `/sql`), va lire la règle correspondante dans le dossier `skills/` avant d'exécuter la tâche.

## 🗺️ Cartographie & Modules Clés du Projet

D'après le clustering et le rapport d'analyse de dépendances `GRAPH_REPORT.md`, ce dépôt rassemble les applications et modules clés suivants :

1. **`zou/` (Système central de transport & Logistique / EDI)**
   - Gestion des expéditions, bordereaux, tournées et webservices d'intégration partenaires/logistique.
   - Modules d'échange de données (LogissimoEDI, Inovert EDI, RapprochementWexWebfleet, etc.).

2. **`dispatch-new/` (Dispatching & Planification)**
   - Module de gestion des coursiers, affectations de missions, plannings, grilles tarifaires et suivi temps réel.
   - Intégration front-end / back-end lourde pour le pilotage opérationnel des tournées.

3. **`lad_NEWEST/` (Livraison à Domicile / RDV)**
   - Gestion spécifique des flux de livraison à domicile, prise de rendez-vous clients, portail et connecteurs métiers.

4. **`COGEPART/` & `CORE/` (Bibliothèques Cœur & Modèles Métiers Commun)**
   - Modèles de données partagés (`Mission`, `Coursier`, `ClientAgence`, `LAD_commande`, `Order`, `Parcel`).
   - Abstractions base de données (`ADOConnection` / `ADODB`, `DBOModel`, `dbObject`, `PDODb`).

5. **`index-manager/` & `my-assistant-api/` (Services Modernes / APIs & Indexation)**
   - Microservices d'aide et d'indexation accompagnant la suite logicielle principale.

---

# Gestion Dynamique des Skills
- Ne charge aucun skill au démarrage du workspace.
- Si le prompt de l'utilisateur contient le mot-clé `/skill-name` (ex: `/prd`, `/sql`), va lire la règle correspondante dans le dossier `skills/` avant d'exécuter la tâche.

## 📐 Règles de Code & Normes de Développement

- **Langage Principal** : **PHP (7.x / legacy & moderne)** et **JavaScript (jQuery / Vanilla / Angular)**.
- **Base de données & Accès aux Données** :
  - Respecter les abstractions ADODB (`ADOConnection`, `ADORecordSet`) et les fonctions utilitaires SQL du projet (`dbu_getListe`, `dbu_getListeAsso`).
  - Toujours échapper les variables SQL et éviter les requêtes non préparées.
- **Formats d'échanges & Bibliothèques tierces** :
  - **Excel / Export** : Utiliser les wrappers et classes autour de `PHPExcel` / `SimpleXLSX` / `make_xlsx_lib`.
  - **PDF / Impresssion** : `TCPDF`, `FPDF`, `HTML2PDF`.
  - **Dates & Heures** : Respecter les utilitaires internes de formatage (`convDateFRISO`, `convDateISOFR`, `euro_format_cog`).

---

## 🔗 Consignes Graphify & Obsidian

- **Obsidian Vault Integration** : La documentation visuelle et les graphes de connaissances sont générés sous `graphify-out/obsidian/`.
- **Compatibilité des Liens Markdown** : Toujours préserver la structure et la compatibilité des liens Markdown avec les fiches situées dans `graphify-out/obsidian/`.
- **Mise à jour du Graphe** : Lors de l'ajout ou de la restructuration majeure de dossiers/classes, réexécuter la commande :
  ```bash
  graphify cluster-only .
  ```
