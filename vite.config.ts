import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [
      react(),
      {
        name: 'tts-proxy-middleware',
        configureServer(server) {
          server.middlewares.use('/api/tts', async (req, res) => {
            try {
              const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
              const text = url.searchParams.get('text') || '';
              const lang = url.searchParams.get('lang') || 'hi';

              if (!text.trim()) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Text parameter is required' }));
                return;
              }

              // Google Translate Audio TTS Endpoint
              const targetUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text.trim())}&tl=${encodeURIComponent(lang)}&client=tw-ob`;

              const fetchRes = await fetch(targetUrl, {
                headers: {
                  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                  'Referer': 'https://translate.google.com/'
                }
              });

              if (!fetchRes.ok) {
                res.statusCode = fetchRes.status;
                res.end(`TTS provider responded with status ${fetchRes.status}`);
                return;
              }

              res.setHeader('Content-Type', 'audio/mpeg');
              res.setHeader('Cache-Control', 'public, max-age=86400');
              const buffer = Buffer.from(await fetchRes.arrayBuffer());
              res.end(buffer);
            } catch (err: any) {
              console.error('TTS Middleware error:', err);
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'TTS Error' }));
            }
          });
        }
      }
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '')
    }
  };
});
