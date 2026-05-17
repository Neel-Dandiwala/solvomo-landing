# Solvomo Landing

React + Vite landing site for Solvomo.

## Notion Blog Sync

Add these values to `.env.local`:

```bash
NOTION_API_KEY=secret_...
NOTION_BLOG_DATABASE_ID=...
```

Then sync the blog database:

```bash
npm run sync:blogs
```

The sync creates markdown files in `content/blogs`, downloads Notion images into `public/images/blogs`, and writes `src/content/blogs.generated.json` for the `/blog` and `/blog/:slug` routes.

## Render Deployment

For the existing Render static site, set:

```bash
Build Command: npm run render-build
Publish Directory: dist
```

Add these environment variables in Render under your service's **Environment** tab:

```bash
NOTION_API_KEY=secret value from Notion
NOTION_BLOG_DATABASE_ID=47a9fea1de7346ce94acf33a2cc02de4
```

Add rewrites in the service's **Redirects/Rewrites** tab. Do **not** use `/*` — that catch-all can prevent `/images/blogs/*` from being served (images 404 in production).

```bash
Source: /blog/*
Destination: /index.html
Action: Rewrite

Source: /privacy
Destination: /index.html
Action: Rewrite
```

Commit and push `public/images/blogs/*.png` and `src/content/blogs.generated.json` so images are in the repo.

After deploy, verify an image URL directly, e.g. `https://www.solvomo.com/images/blogs/chatgpt-ads-are-here-and-they-will-change-how-you-reach-customers-in-2026-0-d96253d5a2.png` — it should return `200`, not `404`.
