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
