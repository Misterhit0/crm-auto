# Règle de Mise à Jour Continue du Contexte (mem-cp)

À chaque demande, interaction ou modification de code effectuée :
- Mettre à jour systématiquement l'état du contexte (tâches en cours, fichiers impactés, décisions prises).
- S'assurer que le fil de travail est consigné de façon persistance pour les requêtes futures.
