import esbuild from 'esbuild';
import fs from 'fs';
import path from 'path';

// Load environment variables from .env.local
let define = {};
const envFile = '.env.local';
if (fs.existsSync(envFile)) {
  const envContent = fs.readFileSync(envFile, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) {
      // Convert VITE_API_KEY to process.env.API_KEY
      const envKey = key.replace('VITE_', '');
      define[`process.env.${envKey}`] = JSON.stringify(value.trim());
    }
  });
}

esbuild.build({
  entryPoints: ['index.tsx'],
  bundle: true,
  outfile: 'dist/index.js',
  loader: { '.tsx': 'tsx' },
  platform: 'browser',
  format: 'esm',
  external: ['react', 'react-dom', '@google/genai', 'recharts'],
  define
}).catch(() => process.exit(1));
