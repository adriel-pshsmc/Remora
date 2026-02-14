# LogiSmart Optimizer - Setup & Build

## Prerequisites
- Node.js v18+ (you have v24.13.1 ✓)
- PowerShell execution policy enabled (currently blocked)

## Quick Start

### Step 1: Enable Script Execution
Run **PowerShell as Administrator** and execute:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Answer `Y` when prompted.

### Step 2: Install Dependencies
```powershell
npm install
```

### Step 3: Build the Bundle
```powershell
npm run build
```

This will create `dist/index.js` which `index.html` loads.

### Step 4: Run Local Server
```powershell
npm run serve
```

Open the URL printed (usually `http://localhost:3000` or `http://localhost:5000`) in your browser.

---

## What Was Fixed

1. **index.html** – Added `<script type="module" src="./dist/index.js"></script>` to load the bundle
2. **index.tsx** – Fixed import from `'./App'` to `'./app'` (case-sensitive)
3. **package.json** – Created with esbuild build script to transpile TSX → JS

## How It Works

- **esbuild** transpiles `index.tsx` and `app.tsx` (TypeScript/JSX) to a browser-compatible JavaScript bundle
- The bundle is saved to `dist/index.js`
- `index.html` loads this bundle via `<script type="module">`
- Browser renders the React app in the `<div id="root"></div>` element

## Troubleshooting

- **"npm is not recognized"**: Execution policy is still blocked → re-run Step 1 in Administrator PowerShell
- **"ECONNRESET or network error"**: Network connectivity issue → check internet/proxy settings
- **Nothing renders after serving**: Check browser console (F12) for errors; ensure `dist/index.js` exists

---

Made with ❤️ for logistics optimization.
