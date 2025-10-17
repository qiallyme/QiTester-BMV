# QiTester-BMV 🚗

**Indiana Driver's License Mastery System** - Adaptive flashcard app to crush the BMV test.

## Features

- **🧠 Adaptive Learning**: Cards require 4 consecutive correct answers to retire
- **⚡ Smart Re-queueing**: Wrong answers return quickly, correct ones spaced out  
- **🎯 Domain Filtering**: Practice signs, rules, or both
- **✨ Glassmorphism UI**: Clean, modern interface that doesn't hurt your eyes
- **🔒 Local-First**: No server required, runs entirely in browser
- **📤 Export Questions**: Download question bank for versioning

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## How It Works

### The Magic Algorithm
1. **Queue Init**: Shuffles selected domain(s)
2. **Card State**: Tracks `consecutive`, `seen`, `wrong` counts
3. **Answer Correct**: `consecutive++`, reinsert ~6 cards later
4. **Answer Wrong**: `consecutive = 0`, reinsert ~2 cards later  
5. **Retire**: `consecutive >= 4` removes card from active rotation

### Question Structure
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

## Adding Questions

Edit `src/questions.json` to add more questions. The UI exports this file if you want to version it.

**Domains supported**: `signs`, `rules` (add more if you like)

## Deploy to Cloudflare

### Option 1: Wrangler CLI
```bash
# Install Wrangler globally
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy
npm run deploy
```

### Option 2: Cloudflare Pages Dashboard
1. Connect your repository to Cloudflare Pages
2. Set build settings:
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
3. Deploy automatically on every push

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

## Performance Optimizations

- **Code Splitting**: Vendor chunks separated for better caching
- **Asset Optimization**: Terser minification enabled
- **Caching Headers**: Static assets cached for 1 year
- **Security Headers**: XSS protection, content type sniffing prevention

## License

MIT - Go bully your brain into passing the BMV without crying in the parking lot.