# Giada — Next.js Frontend

Next.js migration of [giada-studio.com](https://www.giada-studio.com/) (currently built with Astro), paired with a new Laravel backend.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the project status, folder structure, conventions, and next steps — that's the source of truth, keep it updated as decisions get made.

## Getting started

```bash
npm install
cp .env.example .env.local   # set API_URL once the Laravel API exists
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Stack

- Next.js 16 (App Router), React 19, TypeScript
- Tailwind CSS v4
- Backend: Laravel (separate repo) — CMS + API, no cart/checkout

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint
