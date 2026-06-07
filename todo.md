# ALIEN.MX — Project TODO

## Design System
- [x] Global theme: Void Black bg, Alien Green + Psycho Purple, Warning Amber accents
- [x] Fonts: Space Grotesk (display) + Inter (body) via Google Fonts
- [x] Animated noise texture overlay
- [x] Neon glow utilities + ghost borders + angular (no-radius) components
- [x] framer-motion glitch/interference helpers

## Database & Backend
- [x] users: extend with membershipTier (3 levels), xp, rank, tokenBalance
- [x] products: name, slug, price, category, image, stock, sizes, amazon_asin, mercadolibre_id, description, badge
- [x] cartItems / orders: cart + checkout (crypto 15% discount)
- [x] sightings: title, lat, lng, description, votes, status, userId
- [x] sightingVotes: per-user voting
- [x] scores: arcade scores per user/game
- [x] news (CMS): title, slug, body, category, image, published
- [x] activity feed: community events (XP gains, posts)
- [x] tRPC routers: products, cart, orders, sightings, arcade, news, community, admin
- [x] Seed data: products, news, sightings

## Frontend Pages
- [x] Home — hero "Believe in the Vibe.", featured grid, radar teaser, media hub, latest intel
- [x] Shop / Arsenal — grid, category filters, stock badges, size selectors, add-to-cart
- [x] Accessories / Cosmic Gear — listings + product detail page
- [x] Cart drawer + checkout flow
- [x] Community — gamified profile (XP, rank), live activity feed
- [x] Sightings Map — Google Maps, pins, submission form, filters, voting
- [x] Web3 Radar — wallet connect prompt, Polymarket countdown to 2027 + odds chart, NFT drops, crypto news
- [x] Arcade 420 — Crypto Crash UFO game (Canvas), leaderboard, score tracking
- [x] News/Blog — article cards w/ tags + full article view
- [x] Admin CMS — role-gated (admin only): products, news, community moderation
- [x] Global nav (sticky glass header) + footer + cart context

## Testing & Delivery
- [x] Vitest specs for key procedures
- [ ] webdev_check_status passes
- [ ] Export to GitHub repo MarcusAlienx/alien
