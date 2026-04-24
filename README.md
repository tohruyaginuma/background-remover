# Background Remover

Browser-based background removal + canvas composition tool powered by [BRIA Remove Background](https://replicate.com/bria/remove-background) via Replicate.

## Setup

```bash
pnpm install
cp .env.local.example .env.local
```

Edit `.env.local` and add your Replicate API token:

```
REPLICATE_API_TOKEN=your_token_here
```

Get your token at: https://replicate.com/account/api-tokens

## Dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
pnpm build
pnpm start
```

## Vercel deployment

1. Push to GitHub and connect to Vercel
2. In Vercel dashboard go to **Settings → Environment Variables** and add `REPLICATE_API_TOKEN`
3. Deploy

## Features

- Multi-image upload (JPG / PNG / WebP, max 25 MB per image)
- Drag & drop support
- Configurable settings:
  - Background color (color picker) + transparent toggle
  - Canvas size (default 1800 × 1800 px)
  - Padding (default 140 px)
  - Quality: Soft (90%) / Medium (70%) / Hard (50%)
- Parallel processing via Promise.allSettled
- Individual download + ZIP bulk download
- Per-image retry on error
