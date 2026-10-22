/**
 * Sehat Sakha - Digital India Bhashini Client SDK
 *
 * Integrates:
 * 1. TTS (Text-to-Speech) - High-fidelity Indian neural voices across all 22 languages
 * 2. OCR (Optical Character Recognition) - Regional and English medical document OCR
 * 3. TLD (Text Language Detection) - Automatic detection of user language and script
 * 4. NMT (Neural Machine Translation) - Translation between English and all 22 scheduled Indian languages
 */

export interface BhashiniTldResult {
  langCode: string;
  scriptCode: string;
  confidence: number;
}

export interface BhashiniTtsResult {
  success: boolean;
  audioUrl?: string;
  audioContent?: string;
  format?: string;
  engine?: string;
}

// Map English language names or codes to standard Bhashini 2-letter ISO codes
export const LANGUAGE_NAME_TO_CODE: Record<string, string> = {
  'Hindi': 'hi',
  'English': 'en',
  'Bengali': 'bn',
  'Marathi': 'mr',
  'Telugu': 'te',
  'Tamil': 'ta',
  'Gujarati': 'gu',
  'Urdu': 'ur',
  'Kannada': 'kn',
  'Malayalam': 'ml',
  'Punjabi': 'pa',
  'Odia': 'or',
  'Assamese': 'as',
  'Maithili': 'mai',
  'Nepali': 'ne',
  'Sanskrit': 'sa',
  'Kashmiri': 'ks',
  'Konkani': 'kok',
  'Sindhi': 'sd',
  'Dogri': 'doi',
  'Manipuri': 'mni',
  'Santali': 'sat',
  'Bodo': 'brx'
};

export const LANGUAGE_CODE_TO_NAME: Record<string, string> = Object.entries(LANGUAGE_NAME_TO_CODE).reduce(
  (acc, [name, code]) => {
    acc[code] = name;
    return acc;
  },
  {} as Record<string, string>
);

export function getBhashiniLangCode(lang: string): string {
  if (!lang) return 'hi';
  const clean = lang.trim();
  if (LANGUAGE_NAME_TO_CODE[clean]) {
    return LANGUAGE_NAME_TO_CODE[clean];
  }
  const lower = clean.toLowerCase();
  for (const [name, code] of Object.entries(LANGUAGE_NAME_TO_CODE)) {
    if (name.toLowerCase() === lower || code.toLowerCase() === lower) {
      return code;
    }
  }
  return lower.slice(0, 2);
}

/**
 * Text Language Detection (TLD)
 * Automatically detects which Indian language / script a user input is in.
 */
export async function bhashiniDetectLanguage(text: string): Promise<BhashiniTldResult | null> {
  if (!text || !text.trim()) return null;

  try {
    const res = await fetch('/api/bhashini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'tld',
        text: text.trim()
      })
    });

    if (!res.ok) {
      console.warn('Bhashini TLD endpoint returned:', res.status);
      return null;
    }

    const data = await res.json();
    if (data.success && data.prediction) {
      return {
        langCode: data.prediction.langCode,
        scriptCode: data.prediction.scriptCode,
        confidence: data.prediction.confidence
      };
    }
    return null;
  } catch (err) {
    console.error('Bhashini TLD error:', err);
    return null;
  }
}

/**
 * Optical Character Recognition (OCR)
 * Extracts text from an image base64 using Bhashini Indic document OCR.
 */
export async function bhashiniOcr(imageBase64: string, sourceLang: string = 'en'): Promise<string> {
  if (!imageBase64) return '';

  try {
    const res = await fetch('/api/bhashini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'ocr',
        image: imageBase64,
        lang: getBhashiniLangCode(sourceLang)
      })
    });

    if (!res.ok) {
      console.warn('Bhashini OCR endpoint returned:', res.status);
      return '';
    }

    const data = await res.json();
    return data.extractedText || '';
  } catch (err) {
    console.error('Bhashini OCR error:', err);
    return '';
  }
}

/**
 * Text-to-Speech (TTS)
 * Synthesizes natural speech audio in any of the 22 Indian languages.
 */
export async function bhashiniTts(
  text: string,
  lang: string,
  gender: 'female' | 'male' = 'female'
): Promise<BhashiniTtsResult> {
  if (!text || !text.trim()) {
    return { success: false };
  }

  const langCode = getBhashiniLangCode(lang);
  const streamUrl = `/api/bhashini?action=tts&text=${encodeURIComponent(text.trim())}&lang=${encodeURIComponent(langCode)}&gender=${gender}`;

  return {
    success: true,
    audioUrl: streamUrl,
    engine: 'bhashini',
    format: 'wav'
  };
}

/**
 * Neural Machine Translation (NMT)
 * Translates text between English and any Indian language or between language pairs.
 */
export async function bhashiniTranslate(
  text: string,
  sourceLang: string,
  targetLang: string
): Promise<string> {
  if (!text || !text.trim()) return '';

  const sCode = getBhashiniLangCode(sourceLang);
  const tCode = getBhashiniLangCode(targetLang);

  if (sCode === tCode) return text;

  try {
    const res = await fetch('/api/bhashini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'translate',
        text: text.trim(),
        sourceLang: sCode,
        targetLang: tCode
      })
    });

    if (!res.ok) {
      console.warn('Bhashini Translation returned:', res.status);
      return text;
    }

    const data = await res.json();
    return data.translatedText || text;
  } catch (err) {
    console.error('Bhashini Translation error:', err);
    return text;
  }
}
