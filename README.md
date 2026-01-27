# BudgetThuis AI Creative Studio

Een AI-gestuurde creative dashboard voor het genereren en beheren van marketing assets in de BudgetThuis huisstijl.

## 🌿 Features

### 1. Restyle Photo
Upload afbeeldingen en transformeer ze automatisch naar de BudgetThuis fotografie stijl met:
- Warme, natuurlijke belichting
- Groene accenten voor merkherkenning
- Authentieke, menselijke uitstraling

### 2. Create Photo
Genereer nieuwe foto's met voorgedefinieerde actors:
- Selecteer uit verschillende persona's (jong, oud, families)
- Beschrijf de gewenste scène en actie
- Genereer meerdere variaties tegelijk

### 3. Creative Reviewer
AI-gestuurde review van marketing assets op:
- **Lettertypen**: Correct gebruik van Montserrat
- **Tone of Voice**: Vriendelijke, toegankelijke toon
- **Kleurgebruik**: BudgetThuis groen (#00A651)
- **Logo Plaatsing**: Vrije ruimte en positionering
- **Leesbaarheid**: Teksthiërarchie en contrast
- **Merkrichtlijnen**: Algemene naleving

### 4. UGC Video Creator
Maak user-generated content style videos:
- Kies uit verschillende actors met unieke stijlen
- Selecteer het product dat gepromoot wordt
- Schrijf of genereer scripts
- Output in 9:16 formaat (TikTok/Reels/Shorts)

### 5. Asset Library
Centraal beheer van alle gegenereerde assets:
- Zoeken en filteren op type, status, categorie
- Grid en lijst weergave
- Bulk download in verschillende formaten
- Review status tracking (wachtend, goedgekeurd, afgewezen)

## 🎨 BudgetThuis Brand Colors

| Kleur | Hex | Gebruik |
|-------|-----|---------|
| Primair Groen | `#00A651` | Hoofdkleur, knoppen, accenten |
| Donker Groen | `#008541` | Hover states |
| Licht Groen | `#E8F5EC` | Achtergronden |
| Donker | `#1A1A1A` | Tekst |
| Grijs | `#F5F5F5` | Pagina achtergrond |

## 🚀 Installatie

```bash
# Installeer dependencies
npm install

# Start development server
npm run dev

# Build voor productie
npm run build

# Start productie server
npm start
```

## 📁 Project Structuur

```
budgetthuis.ai/
├── src/
│   ├── app/
│   │   ├── globals.css      # Global styles + Tailwind
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Dashboard page
│   └── components/
│       └── tabs/
│           ├── RestylePhoto.tsx
│           ├── CreatePhoto.tsx
│           ├── CreativeReviewer.tsx
│           ├── UGCVideoCreator.tsx
│           └── AssetLibrary.tsx
├── tailwind.config.ts
├── package.json
└── README.md
```

## 🛠 Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Language**: TypeScript

## 📝 Slogan

> "Bij ons is het gras gewoon groener" 🌿
> 
> "Simpel, betaalbaar én groen"

---

© 2026 BudgetThuis AI Creative Studio
