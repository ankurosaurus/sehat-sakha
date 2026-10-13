export default async function handler(req, res) {
  try {
    const text = req.query?.text || '';
    const lang = req.query?.lang || 'hi';

    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const targetUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text.trim())}&tl=${encodeURIComponent(lang)}&client=tw-ob`;

    const fetchRes = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://translate.google.com/'
      }
    });

    if (!fetchRes.ok) {
      return res.status(fetchRes.status).send(`TTS provider error ${fetchRes.status}`);
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    const buffer = Buffer.from(await fetchRes.arrayBuffer());
    return res.send(buffer);
  } catch (err) {
    console.error('Vercel TTS function error:', err);
    return res.status(500).json({ error: err.message || 'TTS Serverless Error' });
  }
}
