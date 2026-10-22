const BHASHINI_INFERENCE_KEY = process.env.BHASHINI_INFERENCE_KEY || 'GSw5UdAaw5PTraWTUjj8Bj2ngii0PMq5jxWfvlHStVitMmpy1c_sYoiuqatilOVd';
const DHRUVA_PIPELINE_URL = 'https://dhruva-api.bhashini.gov.in/services/inference/pipeline';

// Fallback to Google TTS if needed
async function streamFallbackGoogleTts(text, lang, res) {
  try {
    const targetUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text.trim())}&tl=${encodeURIComponent(lang)}&client=tw-ob`;
    const fetchRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/'
      }
    });
    if (!fetchRes.ok) {
      return res.status(fetchRes.status).send(`Fallback TTS error ${fetchRes.status}`);
    }
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    const buffer = Buffer.from(await fetchRes.arrayBuffer());
    return res.send(buffer);
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Fallback TTS error' });
  }
}

export default async function handler(req, res) {
  // CORS support
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const action = (req.query?.action || req.body?.action || 'status').toLowerCase();

  try {
    // -------------------------------------------------------------
    // ACTION: TTS (Text-to-Speech)
    // -------------------------------------------------------------
    if (action === 'tts') {
      const text = (req.query?.text || req.body?.text || '').trim();
      const lang = (req.query?.lang || req.body?.lang || 'hi').toLowerCase();
      const gender = (req.query?.gender || req.body?.gender || 'female').toLowerCase();

      if (!text) {
        return res.status(400).json({ error: 'Text parameter is required for TTS' });
      }

      try {
        const bhashiniRes = await fetch(DHRUVA_PIPELINE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': BHASHINI_INFERENCE_KEY
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
            inputData: {
              input: [{ source: text }]
            }
          })
        });

        if (bhashiniRes.ok) {
          const data = await bhashiniRes.json();
          const audioBase64 = data.pipelineResponse?.[0]?.audio?.[0]?.audioContent;

          if (audioBase64) {
            // If requested via GET (e.g. from HTML5 <audio> source), stream binary WAV
            if (req.method === 'GET' || req.query?.format === 'audio') {
              const audioBuffer = Buffer.from(audioBase64, 'base64');
              res.setHeader('Content-Type', 'audio/wav');
              res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
              return res.send(audioBuffer);
            }

            return res.status(200).json({
              success: true,
              engine: 'bhashini',
              language: lang,
              audioContent: audioBase64,
              format: 'wav'
            });
          }
        }
      } catch (bhashiniErr) {
        console.warn('Bhashini TTS attempt failed, falling back:', bhashiniErr?.message);
      }

      // Fallback: If Bhashini had an issue or language was unhandled, stream Google TTS
      if (req.method === 'GET' || req.query?.format === 'audio') {
        return await streamFallbackGoogleTts(text, lang, res);
      } else {
        return res.status(200).json({
          success: false,
          fallbackUrl: `/api/tts?text=${encodeURIComponent(text)}&lang=${encodeURIComponent(lang)}`
        });
      }
    }

    // -------------------------------------------------------------
    // ACTION: TLD (Text Language Detection)
    // -------------------------------------------------------------
    if (action === 'tld') {
      const text = (req.body?.text || req.query?.text || '').trim();
      if (!text) {
        return res.status(400).json({ error: 'Text parameter is required for TLD' });
      }

      const bhashiniRes = await fetch(DHRUVA_PIPELINE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': BHASHINI_INFERENCE_KEY
        },
        body: JSON.stringify({
          pipelineTasks: [
            {
              taskType: 'txt-lang-detection',
              config: {}
            }
          ],
          inputData: {
            input: [{ source: text }]
          }
        })
      });

      if (!bhashiniRes.ok) {
        const errText = await bhashiniRes.text();
        return res.status(bhashiniRes.status).json({ error: `Bhashini TLD error: ${errText}` });
      }

      const data = await bhashiniRes.json();
      const prediction = data.pipelineResponse?.[0]?.output?.[0]?.langPrediction?.[0] || null;

      return res.status(200).json({
        success: true,
        engine: 'bhashini',
        prediction: prediction ? {
          langCode: prediction.langCode,
          scriptCode: prediction.scriptCode,
          confidence: prediction.langScore
        } : null
      });
    }

    // -------------------------------------------------------------
    // ACTION: OCR (Optical Character Recognition)
    // -------------------------------------------------------------
    if (action === 'ocr') {
      const imageBase64 = req.body?.image || req.body?.imageBase64;
      const lang = req.body?.lang || 'en';

      if (!imageBase64) {
        return res.status(400).json({ error: 'Image base64 parameter is required for OCR' });
      }

      // Strip data:image/...;base64, prefix if present
      const cleanBase64 = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;

      const bhashiniRes = await fetch(DHRUVA_PIPELINE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': BHASHINI_INFERENCE_KEY
        },
        body: JSON.stringify({
          pipelineTasks: [
            {
              taskType: 'ocr',
              config: {
                language: { sourceLanguage: lang },
                serviceId: 'bhashini/bodhan/indic-doc/ocr'
              }
            }
          ],
          inputData: {
            image: [{ imageContent: cleanBase64 }]
          }
        })
      });

      if (!bhashiniRes.ok) {
        const errText = await bhashiniRes.text();
        return res.status(bhashiniRes.status).json({ error: `Bhashini OCR error: ${errText}` });
      }

      const data = await bhashiniRes.json();
      const extractedText = data.pipelineResponse?.[0]?.output?.[0]?.source || '';

      return res.status(200).json({
        success: true,
        engine: 'bhashini',
        extractedText
      });
    }

    // -------------------------------------------------------------
    // ACTION: TRANSLATE (Neural Machine Translation)
    // -------------------------------------------------------------
    if (action === 'translate') {
      const text = (req.body?.text || '').trim();
      const sourceLang = (req.body?.sourceLang || 'en').toLowerCase();
      const targetLang = (req.body?.targetLang || 'hi').toLowerCase();

      if (!text) {
        return res.status(400).json({ error: 'Text parameter is required for translation' });
      }

      const bhashiniRes = await fetch(DHRUVA_PIPELINE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': BHASHINI_INFERENCE_KEY
        },
        body: JSON.stringify({
          pipelineTasks: [
            {
              taskType: 'translation',
              config: {
                language: {
                  sourceLanguage: sourceLang,
                  targetLanguage: targetLang
                }
              }
            }
          ],
          inputData: {
            input: [{ source: text }]
          }
        })
      });

      if (!bhashiniRes.ok) {
        const errText = await bhashiniRes.text();
        return res.status(bhashiniRes.status).json({ error: `Bhashini Translation error: ${errText}` });
      }

      const data = await bhashiniRes.json();
      const targetText = data.pipelineResponse?.[0]?.output?.[0]?.target || '';

      return res.status(200).json({
        success: true,
        engine: 'bhashini',
        source: text,
        translatedText: targetText,
        sourceLang,
        targetLang
      });
    }

    // -------------------------------------------------------------
    // DEFAULT STATUS
    // -------------------------------------------------------------
    return res.status(200).json({
      status: 'active',
      service: 'Sehat Sakha Bhashini API Gateway',
      features: ['TTS', 'OCR', 'TLD', 'NMT'],
      supportedLanguagesCount: 22
    });

  } catch (err) {
    console.error('Bhashini Gateway Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
