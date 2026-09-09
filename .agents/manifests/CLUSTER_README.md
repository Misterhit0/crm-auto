# Projet "Minimoi" — Cluster Multi-Hermes Enterprise (Hostinger KVM 8)

Ce projet rassemble l'infrastructure isolée et prête au déploiement pour vos 3 cerveaux Hermes autonomes, fonctionnant avec OmniRoute, Redis EventBus, Qdrant VectorDB et Syncthing.

---

## 🏛️ 1. Manifestes des Bonnes Pratiques & Sources de Vérité

L'ensemble des règles opératoires, workflows, commandes et standards absolus sont centralisés dans `/opt/hermes-cluster/shared/manifests/` et montés dans `/workspace/manifests/` au sein de chaque instance :

- **[Manifeste Central du Cluster (Trinity)](shared/manifests/HERMES_CLUSTER_MANIFEST.md)** : Vue d'ensemble, connectivités et les 5 règles absolues communes.
- **[Manifeste & Guide Hermes-Work](shared/manifests/HERMES_WORK_MANIFEST.md)** : CTO, Architecture Cogepart, BDD SQL, flux EDI transport, diagnostic et dispatching.
- **[Manifeste & Guide Hermes-Lab](shared/manifests/HERMES_LAB_MANIFEST.md)** : Continuous Coder, Apple HIG, CRM-nil, Doggle/Woofmatch, Next.js et règle absolue double branche (main/dev).
- **[Manifeste & Guide Hermes-Jarvis](shared/manifests/HERMES_JARVIS_MANIFEST.md)** : Intendant vie quotidienne, triage Gmail, pôles juridique/assurances/finances et Human-in-the-Loop via Telegram.

---

## 2. Arborescence du Projet

```text
/opt/hermes-cluster/
├── README.md                          # Guide complet du projet et index des manifestes
├── docker-compose.yml                 # Stack complète (3 cerveaux, Redis Bus, Qdrant, Syncthing)
├── update_instructions.sh             # Script de régénération des INSTRUCTIONS.md par instance
├── shared/
│   ├── manifests/                     # Manifestes de bonnes pratiques et documentation par agent
│   │   ├── HERMES_CLUSTER_MANIFEST.md # Manifeste central & 5 règles absolues
│   │   ├── HERMES_WORK_MANIFEST.md    # Guide spécifique hermes-work
│   │   ├── HERMES_LAB_MANIFEST.md     # Guide spécifique hermes-lab
│   │   └── HERMES_JARVIS_MANIFEST.md  # Guide spécifique hermes-jarvis
│   ├── rules/                         # Règles globales (AGENTS.md, Apple HIG, Graphify)
│   └── skills/
│       ├── personal/                  # Skills Jarvis (Gestion, Triage)
│       ├── tech/                      # Skills Work (BDD, API, Debug, Architecture)
│       └── agency/                    # Skills Lab (Apple Design, Next.js, Fullstack, Coder)
├── instances/
│   ├── hermes-jarvis/                 # Cerveau 1 : 1 vCPU / 2 Go RAM (Gmail, Avocat, Assurance, Banque)
│   ├── hermes-work/                   # Cerveau 2 : 3 vCPU / 12 Go RAM (Cogepart, Graphify, Obsidian)
│   └── hermes-lab/                    # Cerveau 3 : 4 vCPU / 16 Go RAM (Coder Autonome en continu, Sandbox)
└── infra/
    ├── redis-data/                    # Persistance Event Bus (127.0.0.1:6379)
    ├── qdrant-data/                   # Persistance Vector DB RAG (127.0.0.1:6333)
    └── syncthing/                     # Hub de synchronisation des Vaults
```

---

## 3. Commandes d'Exploitation du Cluster

```bash
# Vérifier l'état de santé des conteneurs
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

# Mettre à jour les instructions et propager les manifestes
bash /opt/hermes-cluster/update_instructions.sh

# Recharger un conteneur en appliquant les modifications
docker compose up -d <nom-service>

# Consulter les journaux d'activité
docker logs -f hermes-jarvis
docker logs -f hermes-work
docker logs -f hermes-lab
```
