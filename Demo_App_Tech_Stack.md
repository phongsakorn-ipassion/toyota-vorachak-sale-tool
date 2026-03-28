# Demo App Tech Stack & Pipeline

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | React | 18 |
| Build Tool | Vite | 5 |
| Styling | Tailwind CSS | 3 |
| State Management | Zustand | 4 |
| Routing | React Router (HashRouter) | 6 |
| Rich Text Editor | CKEditor 5 | 41 |
| Backend-as-a-Service | Supabase JS | 2 |
| Auth | Supabase Auth | — |
| Database | PostgreSQL (via Supabase) | 15 |
| CI/CD | GitHub Actions | — |
| Hosting | GitHub Pages | — |

---

## Project Init

```bash
npm create vite@latest my-app -- --template react
cd my-app
npm install react-router-dom zustand @supabase/supabase-js
npm install @ckeditor/ckeditor5-react @ckeditor/ckeditor5-build-classic
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---

## Key Config

**`vite.config.js`** — set `base` for GitHub Pages
```js
export default defineConfig({
  base: '/repo-name/',
  plugins: [react()],
})
```

**`tailwind.config.js`**
```js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
}
```

**`.env.local`**
```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

---

## GitHub Actions Pipeline

**`.github/workflows/deploy.yml`**
```yaml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

> Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in GitHub → Settings → Secrets.

---

## SPA Routing Fix (GitHub Pages)

Add `public/404.html` to handle page refresh:
```html
<!DOCTYPE html>
<html>
  <head><meta http-equiv="refresh" content="0;url=/" /></head>
</html>
```
