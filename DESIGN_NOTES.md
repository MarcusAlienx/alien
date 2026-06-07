# ALIEN.MX — Design System Reference (from Stitch + docs)

## Colors (exact tokens)
- Void Black background: `#000000` / surfaces `#131313`, `#0e0e0e`
- Space Grey containers: `#1A1A1A` / `#1f1f1f` / `#1b1b1b`
- Alien Green (primary): `#6CBF71` (variants `#87db8a`, `#a0f6a2`)
- Psycho Purple (secondary): `#9400E4` / `#A020F0`
- Warning Amber (alerts/UAP): `#FFB000`
- Body text on-surface: `#E5E2E1`, muted `#bfcabb` / `#899486`
- Ghost border base: `#40493e`

## Typography
- Headlines/Display: **Space Grotesk** (700-900), tracking `-0.05em`, often UPPERCASE
- Body: **Inter** (also Manrope acceptable per doc)
- Labels/metadata: Inter uppercase, wide tracking

## Shape & Effects
- NO rounded corners on technical components (border-radius 0 preferred for buttons/cards per pasted_content.txt). Stitch uses some rounded; we follow the doc: angular/sharp default with a few soft accents.
- Animated 2% grain noise overlay (fractalNoise SVG) fixed over whole page
- Neon glow on hover: green `rgba(108,191,113,0.x)`, purple `rgba(148,0,228,0.x)`
- Glassmorphism nav: bg surface 60-70% + backdrop-blur
- Buttons: gradient primary->primary-container with inner glow; active scale(0.97)
- framer-motion glitch/interference effects on text and cards

## Hero
- Eyebrow: "TRANSMISIÓN INTERCEPTADA"
- Headline EXACT: "Believe in the Vibe." (Stitch shows "BELIEVE IN THE VIBE." / "CREE EN LA VIBRA")
- Sub: tactical gear for contact, Mexican cosmic underground
- CTAs: "EXPLORAR INVENTARIO" + "VER TRANSMISIÓN"

## Sections / Pages
1. Home: hero + ARSENAL/ARTEFACTOS CÓSMICOS featured grid + Radar + Media hub + Latest Intel feed
2. Shop / Arsenal: product grid, category filters sidebar, stock badges, size selectors, add-to-cart
3. Accessories / Cosmic Gear (Equipo Cósmico): filters + grid + product detail page
4. Community: gamified profile (XP, rank/levels), live activity feed
5. Sightings Map: Google Maps + pins + submission form + filters + community voting
6. Web3 Radar: wallet connect prompt, Polymarket "Radar de la Verdad" countdown to Jan 1 2027 + odds chart, NFT drops, crypto news feed
7. Arcade 420: mini-games hub (Crypto Crash UFO ascend), leaderboard, score tracking
8. News/Blog: article cards w/ category tags + full article view
9. Admin CMS: role-gated (admin only), manage products / news / community

## E-commerce logic
- Dropshipping fields: amazon_asin, mercadolibre_id (no physical stock)
- Crypto payment ($ALIENX) => automatic 15% discount at checkout
- Membership: 3 tiers + token balance per user

## Footer
©2024 ALIEN.MX // INTELLIGENCE CENTER — links: Terminal, Encryption, Sat-Link, Privacy
