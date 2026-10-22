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

          // Bhashini Integration Proxy Middleware
          server.middlewares.use('/api/bhashini', async (req, res) => {
            try {
              const url = new URL(req.url || '', `http://${req.headers.host || 'localhost'}`);
              const action = (url.searchParams.get('action') || 'status').toLowerCase();
              const inferenceKey = env.BHASHINI_INFERENCE_KEY || env.VITE_BHASHINI_INFERENCE_KEY || 'GSw5UdAaw5PTraWTUjj8Bj2ngii0PMq5jxWfvlHStVitMmpy1c_sYoiuqatilOVd';
              const DHRUVA_PIPELINE_URL = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';

              // Handle JSON body if POST
              let body: any = {};
              if (req.method === 'POST') {
                const buffers: Buffer[] = [];
                for await (const chunk of req) {
                  buffers.push(chunk);
                }
                const bodyStr = Buffer.concat(buffers).toString('utf8');
                try {
                  body = JSON.parse(bodyStr);
                } catch {
                  body = {};
                }
              }

              const resolvedAction = (body.action || action).toLowerCase();

              if (resolvedAction === 'tts') {
                const text = (url.searchParams.get('text') || body.text || '').trim();
                const lang = (url.searchParams.get('lang') || body.lang || 'hi').toLowerCase();
                const gender = (url.searchParams.get('gender') || body.gender || 'female').toLowerCase();

                if (!text) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Text required' }));
                  return;
                }

                try {
                  const bRes = await fetch(DHRUVA_PIPELINE_URL, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': inferenceKey
                    },
                    body: JSON.stringify({
                      pipelineTasks: [
                        {
                          taskType: 'tts',
                          config: {
                            language: { sourceLanguage: lang },
                            gender: gender === 'male' ? 'male' : 'female'
                          }
                        }
                      ],
                      inputData: { input: [{ source: text }] }
                    })
                  });

                  if (bRes.ok) {
                    const data: any = await bRes.json();
                    const b64 = data.pipelineResponse?.[0]?.audio?.[0]?.audioContent;
                    if (b64) {
                      if (req.method === 'GET' || url.searchParams.get('format') === 'audio') {
                        res.setHeader('Content-Type', 'audio/wav');
                        res.setHeader('Cache-Control', 'public, max-age=86400');
                        res.end(Buffer.from(b64, 'base64'));
                        return;
                      }
                      res.setHeader('Content-Type', 'application/json');
                      res.end(JSON.stringify({ success: true, audioContent: b64, format: 'wav' }));
                      return;
                    }
                  }
                } catch (bErr) {
                  console.warn('Vite Bhashini TTS failed:', bErr);
                }

                // Fallback to Google TTS
                const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${encodeURIComponent(lang)}&client=tw-ob`;
                const gRes = await fetch(fallbackUrl, {
                  headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                    'Referer': 'https://translate.google.com/'
                  }
                });
                res.setHeader('Content-Type', 'audio/mpeg');
                res.setHeader('Cache-Control', 'public, max-age=86400');
                const gBuf = Buffer.from(await gRes.arrayBuffer());
                res.end(gBuf);
                return;
              }

              if (resolvedAction === 'tld') {
                const text = (body.text || url.searchParams.get('text') || '').trim();
                const bRes = await fetch(DHRUVA_PIPELINE_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': inferenceKey },
                  body: JSON.stringify({
                    pipelineTasks: [{ taskType: 'txt-lang-detection', config: {} }],
                    inputData: { input: [{ source: text }] }
                  })
                });
                const data: any = await bRes.json();
                const prediction = data.pipelineResponse?.[0]?.output?.[0]?.langPrediction?.[0] || null;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, prediction }));
                return;
              }

              if (resolvedAction === 'ocr') {
                const imageBase64 = body.image || body.imageBase64;
                const lang = body.lang || 'en';
                const cleanBase64 = imageBase64 && imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
                const bRes = await fetch(DHRUVA_PIPELINE_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': inferenceKey },
                  body: JSON.stringify({
                    pipelineTasks: [{
                      taskType: 'ocr',
                      config: {
                        language: { sourceLanguage: lang },
                        serviceId: 'bhashini/bodhan/indic-doc/ocr'
                      }
                    }],
                    inputData: { image: [{ imageContent: cleanBase64 }] }
                  })
                });
                const data: any = await bRes.json();
                const extractedText = data.pipelineResponse?.[0]?.output?.[0]?.source || '';
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, extractedText }));
                return;
              }

              if (resolvedAction === 'translate') {
                const text = body.text || '';
                const sourceLang = body.sourceLang || 'en';
                const targetLang = body.targetLang || 'hi';
                const bRes = await fetch(DHRUVA_PIPELINE_URL, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json', 'Authorization': inferenceKey },
                  body: JSON.stringify({
                    pipelineTasks: [{
                      taskType: 'translation',
                      config: {
                        language: { sourceLanguage: sourceLang, targetLanguage: targetLang }
                      }
                    }],
                    inputData: { input: [{ source: text }] }
                  })
                });
                const data: any = await bRes.json();
                const targetText = data.pipelineResponse?.[0]?.output?.[0]?.target || '';
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ success: true, translatedText: targetText }));
                return;
              }

              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ status: 'active', gateway: 'bhashini-dev-proxy' }));
            } catch (err: any) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: err.message || 'Bhashini proxy error' }));
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
