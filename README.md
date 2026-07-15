# MediPredict Neuro AI

AI-powered neurological screening platform for early detection of Alzheimer's, Parkinson's, epilepsy, and stroke risk through multi-modal assessments.

**Live Demo:** <!-- Add your live URL below -->

```
https://your-live-link-here.netlify.app
```

> **Disclaimer:** This app is for educational and screening purposes only. It does not provide a medical diagnosis or replace professional medical advice.

---

## Overview

MediPredict Neuro AI is a React + TypeScript single-page application that helps patients take cognitive, motor, speech, and behavioral assessments, then surfaces risk levels, analytics, and AI-generated insights. Doctors can review patients, imaging-related workflows, and consultation requests from a dedicated portal.

### Who it's for

| Role | What they can do |
|------|------------------|
| **Patients** | Sign in, run assessments, view results & AI insights, upload scans, request doctor consultation |
| **Doctors** | Sign in to the doctor portal, manage patients, review assessments, consultations, and imaging analysis |
| **Visitors** | Browse the home page and educational content (no login required) |

---

## Features

- **Multi-modal assessments**
  - Cognitive — memory, attention, language, orientation, reaction time, pattern/sequence games
  - Motor — tremor, tapping, and coordination (device motion sensors where available)
  - Speech — audio recording and voice pattern checks
  - Behavioral — mood and behavior-focused questionnaires
- **Patient dashboard** — latest scores, risk levels, test analytics, scan upload, doctor suggestions
- **Doctor portal** — patient list, consultation requests, medical imaging analysis helpers, notes
- **AI layer (Google Gemini)** — personalized insights, recommendations, dynamic test generation, enhanced scoring
- **Adaptive testing & analytics** — progress tracking, score comparison, and feedback components
- **Education hub** — neurological health information for users
- **Auth by role** — separate patient and doctor login flows with protected routes

---

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 18, TypeScript, React Router |
| Styling | Tailwind CSS, Lucide icons |
| Build / tooling | Vite, ESLint, Vitest, Testing Library |
| AI | Google Generative AI (Gemini) |
| Deploy | Netlify (`netlify.toml`, SPA `_redirects`) |

---

## Project structure

```
project/
├── public/                 # Static assets + Netlify _redirects
├── src/
│   ├── components/
│   │   ├── ai/             # AI insights, scoring, test generator
│   │   ├── analytics/      # Test analytics & comparison
│   │   ├── assessment/     # Progress tracking
│   │   ├── auth/           # PrivateRoute
│   │   ├── layout/         # Navbar
│   │   ├── medical/        # Doctor tools, consultation, imaging
│   │   ├── tests/          # Individual assessment games/tests
│   │   └── ui/             # Shared UI widgets
│   ├── config/             # Gemini config
│   ├── contexts/           # Auth & assessment state
│   ├── pages/              # Routes (home, dashboards, assessment, etc.)
│   ├── services/           # Gemini service
│   └── test/               # Vitest setup & tests
├── netlify.toml
├── GEMINI_SETUP.md         # Detailed Gemini API setup
└── package.json
```

### Main routes

| Path | Description |
|------|-------------|
| `/` | Landing page |
| `/patient-login` / `/doctor-login` | Role-based login |
| `/register` | Registration |
| `/patient-dashboard` | Patient home (auth required) |
| `/doctor-dashboard` | Doctor portal (auth required) |
| `/assessment/:type` | Run an assessment (`cognitive`, `motor`, `speech`, `behavioral`) |
| `/results/:id` | Assessment results |
| `/education` | Educational content |

---

## Getting started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
cd project
npm install
```

### Environment variables

Create a `.env` file in the project root if you need local overrides, but do not commit secrets.

For the secure Gemini setup, the frontend does not use a client-side API key. Instead, Netlify Functions call Gemini using the server-side environment variable `GEMINI_API_KEY`.

```bash
# Netlify site settings (not committed to Git)
GEMINI_API_KEY=your_gemini_api_key_here
```

See [GEMINI_SETUP.md](./GEMINI_SETUP.md) for API key setup and troubleshooting.

### Run locally

```bash
npm run dev
```

### Build & preview

```bash
npm run build
npm run preview
```

### Lint & test

```bash
npm run lint
npm run test
npm run test:run
npm run test:coverage
```

---

## Deployment (Netlify)

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`
- SPA routing: `public/_redirects`

Connect the GitHub repo in Netlify, or deploy with the CLI:

```bash
netlify deploy --build --prod
```

After deploy, paste your public URL into the **Live Demo** section at the top of this README.

---

## Important notes

- Auth and session storage are currently client-side (localStorage) for demo use.
- Assessment results and doctor demo data are managed in-app; wire to a backend/database for production.
- Keep `GEMINI_API_KEY` in secure environment variables and never commit real keys to the repo.

---

## License

Private / educational project — update this section if you publish under an open-source license.
