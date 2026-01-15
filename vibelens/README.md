# VibeLens

VibeLens is a small, shippable web tool that turns an image into a concise “vibe”: a color palette, short mood words, a caption, and a simple interior design direction.

I built this project as a mini product that combines UI polish with backend/API work. The goal was to keep the product surface small, but build it with production-style thinking (clean API boundary, typed response contracts, and room for caching/rate limiting as it scales).

## What it does

Upload an image and get:
- A 6-color palette (clickable/copyable hex values)
- 5 vibe words
- A short caption
- A minimal “interior vibe” suggestion (style + keywords)

## Tech stack

- Next.js (App Router)
- React + TypeScript
- TailwindCSS
- Next.js Route Handlers (`/api/*`) for the backend

## Architecture

VibeLens is a single Next.js application with a UI layer and an API layer.

- UI: `app/page.tsx`
- Backend: `app/api/analyze/route.ts`

Flow:
1. User uploads an image in the UI
2. UI sends a `POST /api/analyze` request using `FormData`
3. API returns a typed JSON response
4. UI renders results using simple composable components (palette chips, vibe tokens, caption, etc.)

This setup makes it easy to keep API keys and external calls server-side, while keeping the frontend focused on UX.

## API contract

`POST /api/analyze`

Returns:
```json
{
  "palette": [{"hex": "#0B0F14", "rgb": [11, 15, 20]}],
  "vibe_words": ["golden hour", "salt air", "soft glow", "calm", "wanderlust"],
  "caption": "A quiet sky spilling warmth into the sea.",
  "interior": { "style": "Coastal Minimal", "keywords": ["linen textures", "warm neutrals", "brushed brass"] },
  "meta": { "latency_ms": 120 }
}
```
## Local development
Install deps:
```bash
npm install
```
Run dev server:
```bash
npm run dev
```
Open: `http://localhost:3000`
## Notes / Next steps
This repo currently ships the core product surface (upload → analyze → display results). Planned upgrades include:
- Real palette extraction from the uploaded image
- AI-based vibe generation (prompted JSON output)
- Result caching keyed by image hash
- Rate limiting for API abuse/cost control
- Shareable “result card” rendering
