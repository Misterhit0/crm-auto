---
name: trinity-pipeline
description: Pipeline Fail-Closed souverain pour le cluster Trinity (hermes-work, hermes-lab, hermes-jarvis). Intègre No Direct Coding, isolation Worktrees, Invariant Mutation (Bite Proof) et validation Git.
---

# 🏛️ Trinity Sovereign Pipeline (Fail-Closed & Bite Proof)

Ce skill formalise la doctrine et les règles mécaniques obligatoires pour toute modification logicielle, refonte ou création de SaaS au sein de l'écosystème.

## 📌 1. Les Règles Non Négociables
1. **No Direct Coding** : L'orchestrateur principal ne code jamais directement. Il explore (`hermes-research`), conçoit le plan (`hermes-plan`) et délègue l'écriture à un sous-agent dédié sur un worktree git isolé (`.worktrees/<story-id>`).
2. **Fail-Closed** : Aucun commit sans plan marqué `validated: yes`. Aucun merge sans `Ship allowed: yes`.
3. **Bite Proof (Test par Mutation)** : Lors de la revue (en fresh context), neutraliser temporairement la ligne critique. Si les tests restent verts, le test est considéré comme décoratif et le ticket est rejeté.
4. **Single-Run Verification** : Budget de 25 tests max par défaut. Suites E2E et builds lourds exécutés uniquement à l'étape finale de Ship.

## 🔧 2. Commandes de Contrôle
Pour exécuter les vérifications mécaniques dans n'importe quel projet :
- Vérifier un plan : `bin/hermes-controller.sh gate-plan <id>`
- Vérifier un ship : `bin/hermes-controller.sh gate-ship <id>`
- Tester la mutation : `bin/hermes-controller.sh bite-proof-test <fichier> <ligne> "<commande_test>"`
