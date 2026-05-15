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

Add a rewrite in the service's **Redirects/Rewrites** tab:

```bash
Source: /*
Destination: /index.html
Action: Rewrite
```

That rewrite is required so direct requests like `/blog` and `/blog/article-slug` load the React app instead of returning a static-host 404.
