/**
 * Sehat Sakha - Eighth Schedule 22 Official Indian Languages Registry
 *
 * Implements capability transparency:
 * - Never claims voice works if no TTS voice exists
 * - Explicitly marks UI translation readiness
 */

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  bcp47: string;
  hasUiText: boolean;
  isRtl?: boolean;
  statusNoteHi: string;
  statusNoteEn: string;
}

export const INDIAN_LANGUAGES: LanguageInfo[] = [
  {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    script: 'Devanagari',
    bcp47: 'hi-IN',
    hasUiText: true,
    statusNoteHi: 'पूर्ण समर्थन (सरल भाषा व आवाज़)',
    statusNoteEn: 'Full Support (Simple Language & Voice)'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    bcp47: 'en-IN',
    hasUiText: true,
    statusNoteHi: 'पूर्ण समर्थन (अंग्रेजी)',
    statusNoteEn: 'Full Support (English)'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    bcp47: 'bn-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    bcp47: 'mr-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    bcp47: 'te-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    bcp47: 'ta-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    bcp47: 'gu-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Perso-Arabic',
    bcp47: 'ur-IN',
    hasUiText: false,
    isRtl: true,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    bcp47: 'kn-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    bcp47: 'ml-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    bcp47: 'pa-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    bcp47: 'or-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Bengali-Assamese',
    bcp47: 'as-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    script: 'Devanagari',
    bcp47: 'mai-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    script: 'Devanagari',
    bcp47: 'ne-NP',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    script: 'Devanagari',
    bcp47: 'sa-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'कॉशुर / کٲشُر',
    script: 'Perso-Arabic/Devanagari',
    bcp47: 'ks-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    script: 'Devanagari',
    bcp47: 'kok-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'सिन्धी / سنڌي',
    script: 'Perso-Arabic/Devanagari',
    bcp47: 'sd-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    script: 'Devanagari',
    bcp47: 'doi-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'mni',
    name: 'Manipuri',
    nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ / মণিপুরী',
    script: 'Meetei Mayek / Bengali',
    bcp47: 'mni-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'sat',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    script: 'Ol Chiki',
    bcp47: 'sat-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  },
  {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बर\'',
    script: 'Devanagari',
    bcp47: 'brx-IN',
    hasUiText: false,
    statusNoteHi: 'प्रगति पर (शीघ्र उपलब्ध)',
    statusNoteEn: 'In development (Coming soon)'
  }
];

/**
 * Check if the user's browser device has a compatible text-to-speech voice installed
 */
export function checkBrowserVoiceSupport(bcp47: string, availableVoices: SpeechSynthesisVoice[]): boolean {
  if (!availableVoices || availableVoices.length === 0) return false;
  const targetPrefix = bcp47.split('-')[0].toLowerCase();
  return availableVoices.some(voice => {
    const vLang = voice.lang.toLowerCase();
    return vLang.startsWith(targetPrefix) || vLang.includes(targetPrefix);
  });
}
