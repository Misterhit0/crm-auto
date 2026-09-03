---
trigger: always_on
description: Standard de design Apple HIG (Glassmorphism, SF Pro/Inter, ombres douces, micro-animations, finitions haut de gamme) appliqué automatiquement à toute création UI/web, sauf si la demande commence par /no-apple.
---

# Standard de Design Apple HIG (Apple Design System)

## 📌 Règle Absolue & Portée
Toute création d'interface web, composant frontend, maquette HTML/CSS, ou application réalisée par l'agent **DOIT ABSOLUMENT** respecter le système de design Apple (Apple Human Interface Guidelines), **SAUF si le prompt de l'utilisateur commence explicitement par `/no-apple`**.

---

## 🎨 Principes Fondamentaux du Design Apple HIG

### 1. Structure & Matériaux (Glassmorphism & Depth)
- **Effets de Translucidité & Flou** : Utilisation de `backdrop-filter: blur(20px)` avec un fond semi-transparent (`rgba(255, 255, 255, 0.75)` en mode clair, `rgba(30, 30, 35, 0.75)` en mode sombre).
- **Bordures Subtiles & Lumineuses** : Bordures de `1px solid rgba(255, 255, 255, 0.2)` ou `rgba(0, 0, 0, 0.08)` pour donner un aspect verre gravé.
- **Profondeur & Ombres Multi-couches** : Ombres très douces et naturelles (`box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.04)`).

### 2. Typographie & Lisibilité (San Francisco / SF Pro / Inter)
- **Police système Apple** : `font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Inter", "Segoe UI", sans-serif;`.
- **Hiérarchie claire** :
  - Titres principaux : Poids `700` ou `600`, avec `letter-spacing: -0.025em`.
  - Sous-titres et labels : Poids `500` ou `600`, couleur secondaire adoucie (`#8e8e93` / `rgba(235, 235, 245, 0.6)`).
  - Corps de texte : Lisibilité optimale (`line-height: 1.5`, `font-size: 14px` à `16px`).

### 3. Géométrie & Espacement
- **Coins Arrondis Organiques (Continuous Curves)** :
  - Cartes et panneaux : `border-radius: 16px` ou `20px`.
  - Boutons et champs d'entrée : `border-radius: 12px` ou `14px`.
  - Badges et puces : `border-radius: 9999px` (Pill format).
- **Aération Generouse** : Marge interne (`padding`) équilibrée pour un look dépuré et aéré.

### 4. Palette de Couleurs & Accents Apple
- **Accents Vifs & Élégants** :
  - Bleu Apple (`#007AFF`), Violet System (`#5E5CE6`), Vert Menthe (`#34C759`), Orange Vibrant (`#FF9500`), Rose Magenta (`#FF2D55`).
- **Dégradés Subtils** : Gradients doux et satinés sur les boutons d'action principale (`background: linear-gradient(135deg, #007AFF 0%, #0051A8 100%)`).

### 5. Micro-Interactions & Animations Liquides
- **Transitions Fluides** : `transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);`.
- **Effets Survol (Hover)** : Élévation légère (`transform: translateY(-2px)`), surbrillance de bordure et légère augmentation d'ombre.
- **Retour Tactile / Pression (Active)** : Enfoncement léger (`transform: scale(0.98)`).

---

## 🚫 Exception `/no-apple`
Si une requête de l'utilisateur commence par le préfixe `/no-apple` (ex: `/no-apple crée un dashboard bootstrap classique`), l'agent **ignore** ces contraintes Apple HIG et suit strictement les consignes de style spécifiques données dans le message.
