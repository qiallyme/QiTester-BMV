# QiTester-BMV Cloudflare Deployment Guide

## Quick Deploy to Cloudflare Pages

### Option 1: Deploy via Wrangler CLI (Recommended)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the project:**
   ```bash
   npm run build
   ```

3. **Deploy to Cloudflare Pages:**
   ```bash
   npm run deploy
   ```

### Option 2: Deploy via Cloudflare Dashboard

1. **Connect your repository** to Cloudflare Pages
2. **Set build settings:**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/` (or leave empty)

3. **Deploy automatically** on every push to main branch

## Project Structure

```
QiTester-BMV/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # React entry point
│   └── questions.json   # Question bank (signs & rules)
├── dist/                # Built files (generated)
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── package.json         # Dependencies & scripts
├── wrangler.toml        # Cloudflare configuration
├── _headers             # Security headers
└── _redirects           # SPA routing rules
```

## Features

- **Adaptive Learning**: Cards require 4 consecutive correct answers to retire
- **Smart Re-queueing**: Wrong answers return quickly, correct ones spaced out
- **Domain Filtering**: Practice signs, rules, or both
- **Glassmorphism UI**: Clean, modern interface
- **Local-First**: No server required, runs entirely in browser
- **Export Questions**: Download question bank for versioning

## Adding Questions

Edit `src/questions.json` with this structure:

```json
{
  "id": "S-001",
  "q": "What does a downward-pointing triangle sign indicate?",
  "choices": ["Stop","Yield","Do Not Enter","No Passing"],
  "answer": "Yield",
  "domain": "signs",
  "ref": "Manual: Signs",
  "why": "Triangular downward equals Yield. You must slow and give right-of-way."
}
```

## Performance Optimizations

- **Code Splitting**: Vendor chunks separated for better caching
- **Asset Optimization**: Terser minification enabled
- **Caching Headers**: Static assets cached for 1 year
- **Security Headers**: XSS protection, content type sniffing prevention

## Local Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` to see your app.

## Build Preview

```bash
npm run build
npm run preview
```

This builds and serves the production version locally for testing.
