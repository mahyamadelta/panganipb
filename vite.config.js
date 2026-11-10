import dns from 'node:dns';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import analyzeFoodHandler from './api/analyze-food.js';

// Prioritize IPv4 to avoid 20-30s IPv6 connect timeouts on WSL2/Windows
try {
  dns.setDefaultResultOrder('ipv4first');
} catch (e) {}

export default defineConfig(({ mode }) => {
  // Load environment variables from .env and .env.local
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }
  if (env.GEMINI_MODEL) {
    process.env.GEMINI_MODEL = env.GEMINI_MODEL;
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'local-api-dev-server',
        configureServer(server) {
          server.middlewares.use('/api/analyze-food', async (req, res) => {
            // Provide Express/Vercel-like response helpers for standard Node http response
            res.status = function (code) {
              res.statusCode = code;
              return res;
            };
            res.json = function (data) {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
              return res;
            };

            try {
              await analyzeFoodHandler(req, res);
            } catch (err) {
              console.error('[Dev API Error]:', err);
              if (!res.writableEnded) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    identified: false,
                    message: err.message || 'Terjadi kesalahan pada server lokal.',
                  })
                );
              }
            }
          });
        },
      },
    ],
  };
});
