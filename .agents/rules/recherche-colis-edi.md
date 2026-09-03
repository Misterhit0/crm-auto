# Règle d'Investigation : Recherche de Colis, Codes-Barres et Flux EDI

## 🎯 Contexte & Distinctions Fondamentales

Lorsqu'un utilisateur, une agence ou un client recherche un **numéro de colis / code-barres** (ex: `6102751100`) :

1. **Distinction Bordereau (`num_bord`) vs Code-Barres Colis (`barcode` / `parcelList`)** :
   - Dans `cogepart.dispatch`, la colonne `num_bord` contient le **numéro de bordereau / récépissé principal** du client (ex: format `823188xxxx` pour Autover / Sekurit).
   - Les **codes-barres unitaires de pièces/colis** (ex: `6102751100`) ne sont **PAS** dans la colonne `num_bord`.
   - Ils se trouvent stockés dans le JSON `incoming_data` de la table **`edi.incoming`** sous la clé `parcelList: [{"barcode": "6102751100", ...}]`.

---

## 🔍 Méthodologie d'Investigation Obligatoire

Pour retrouver l'origine et l'état d'un colis :

### Étape 1 : Recherche dans `edi.incoming` (Payloads EDI)
```sql
SELECT id, date_created, profile_id, incoming_status, incomingsource_id, 
       incoming_externalreference, incoming_data, mission_id 
FROM edi.incoming 
WHERE incoming_data LIKE '%<CODE_COLIS>%' 
   OR incoming_externalreference LIKE '%<CODE_COLIS>%'
ORDER BY id DESC LIMIT 10;
```
👉 Cette requête permet d'extraire :
- L'**ID de la mission créée** (`mission_id`).
- Le **numéro de bordereau officiel** (`incoming_externalreference`).
- Le **profil EDI du client** (`profile_id`).

---

### Étape 2 : Croisement avec `cogepart.dispatch`
```sql
SELECT id, agence, idclient, nomclient, idcoursier, course_affectee_1, 
       num_bord, date_course, date_saisie, depart, destination, exp_nom, dst_nom 
FROM cogepart.dispatch 
WHERE id = <MISSION_ID> OR num_bord = '<INCOMING_EXTERNAL_REF>';
```

---

### Étape 3 : Diagnostics Fréquents lors des Réclamations Chauffeurs / Agences

1. **Rattachement Multi-Agences pour un même client (ex: SEKURIT)** :
   - Un client national possède souvent plusieurs comptes selon les régions (ex: `AMEX` = Paris, `GEM` = Grand Ouest / Rennes Hub, `RENPA` = Rennes Parc Auto, `BORD` = Bordeaux).
   - Si le flux EDI injecte sur l'agence régionale (ex: `GEM` au lieu de `RENPA`), le chauffeur affecté à l'autre agence ne voit pas la mission dans son Tracker.
2. **Statut d'Affectation (`idcoursier = NULL`)** :
   - Si la mission est intégrée mais n'a pas encore été affectée au chauffeur, elle n'apparaît pas sur son PDA / Tracker tournée.
3. **Codes Colis Générés par Défaut (`C<ID_MISSION>P1`)** :
   - Lorsqu'une mission est saisie sans code colis EDI préalable, le système génère la nomenclature `C + ID_MISSION + P1`. Si le chauffeur cherche le code fournisseur externe, il doit le chercher via le numéro de bordereau.

---

## 🚀 Plan d'Action Recommandé aux Exploitants
1. Identifier la mission et son `num_bord` via `edi.incoming`.
2. Ouvrir `editdispatch.php` sur l'agence réelle de rattachement de la mission (ex: `GEM`).
3. Affecter la mission au coursier concerné ou réaffecter l'agence si le départ physique est effectué depuis un autre site.
