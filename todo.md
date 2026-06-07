# ALIEN.MX — Project TODO

## Design System
- [ ] Global theme: Void Black bg, Alien Green + Psycho Purple, Warning Amber accents
- [ ] Fonts: Space Grotesk (display) + Inter (body) via Google Fonts
- [ ] Animated noise texture overlay
- [ ] Neon glow utilities + ghost borders + angular (no-radius) components
- [ ] framer-motion glitch/interference helpers

## Database & Backend
- [ ] users: extend with membershipTier (3 levels), xp, rank, tokenBalance
- [ ] products: name, slug, price, category, image, stock, sizes, amazon_asin, mercadolibre_id, description, badge
- [ ] cartItems / orders: cart + checkout (crypto 15% discount)
- [ ] sightings: title, lat, lng, description, votes, status, userId
- [ ] sightingVotes: per-user voting
- [ ] scores: arcade scores per user/game
- [ ] news (CMS): title, slug, body, category, image, published
- [ ] activity feed: community events (XP gains, posts)
- [ ] tRPC routers: products, cart, orders, sightings, arcade, news, community, admin
- [ ] Seed data: products, news, sightings

## Frontend Pages
- [ ] Home — hero "Believe in the Vibe.", featured grid, radar teaser, media hub, latest intel
- [ ] Shop / Arsenal — grid, category filters, stock badges, size selectors, add-to-cart
- [ ] Accessories / Cosmic Gear — listings + product detail page
- [ ] Cart drawer + checkout flow
- [ ] Community — gamified profile (XP, rank), live activity feed
- [ ] Sightings Map — Google Maps, pins, submission form, filters, voting
- [ ] Web3 Radar — wallet connect prompt, Polymarket countdown to 2027 + odds chart, NFT drops, crypto news
- [ ] Arcade 420 — Crypto Crash UFO game (Canvas), leaderboard, score tracking
- [ ] News/Blog — article cards w/ tags + full article view
- [ ] Admin CMS — role-gated (admin only): products, news, community moderation
- [ ] Global nav (sticky glass header) + footer + cart context

## Testing & Delivery
- [ ] Vitest specs for key procedures
- [ ] webdev_check_status passes
- [ ] Export to GitHub repo MarcusAlienx/alien
