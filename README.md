## MediPredict Neuro AI - Vite + React + TS

This is a Vite React TypeScript single-page app configured for Netlify deployment.

### Prerequisites
- Node.js 18+
- npm 9+

### Install
```bash
npm ci
```

### Develop
```bash
npm run dev
```

### Lint
```bash
npm run lint
```

### Test
```bash
npm run test
```

### Build
```bash
npm run build
```
Output goes to `dist/`.

### Deployment (Netlify)
- Config: `netlify.toml`
- SPA routing: `public/_redirects` ensures client-side routes resolve to `index.html`.

### GitHub Setup
```bash
git init
git add -A
git commit -m "chore: initial project setup for deploy"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### Notes
- Tests are configured in `vitest.config.ts`.
- Vite aliases `@` to `src/`.
- `dist/` is ignored via `.gitignore`.

