/**
 * Sehat Sakha - Eighth Schedule 22 Official Indian Languages Registry
 * Powered by Digital India Bhashini (National Language Translation Mission)
 */

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
  script: string;
  bcp47: string;
  hasUiText: boolean;
  bhashiniSupported: boolean;
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
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI पूर्ण समर्थन (सरल भाषा व आवाज़)',
    statusNoteEn: 'Full Bhashini AI Support (Voice & Translation)'
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    script: 'Latin',
    bcp47: 'en-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'पूर्ण समर्थन (अंग्रेजी)',
    statusNoteEn: 'Full Support (English)'
  },
  {
    code: 'bn',
    name: 'Bengali',
    nativeName: 'বাংলা',
    script: 'Bengali',
    bcp47: 'bn-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (বাংলা ভাষা ও কণ্ঠস্বর)',
    statusNoteEn: 'Bhashini AI Active (Bengali Voice & Text)'
  },
  {
    code: 'mr',
    name: 'Marathi',
    nativeName: 'मराठी',
    script: 'Devanagari',
    bcp47: 'mr-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (मराठी भाषा व आवाज)',
    statusNoteEn: 'Bhashini AI Active (Marathi Voice & Text)'
  },
  {
    code: 'te',
    name: 'Telugu',
    nativeName: 'తెలుగు',
    script: 'Telugu',
    bcp47: 'te-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (తెలుగు భాష మరియు స్వరం)',
    statusNoteEn: 'Bhashini AI Active (Telugu Voice & Text)'
  },
  {
    code: 'ta',
    name: 'Tamil',
    nativeName: 'தமிழ்',
    script: 'Tamil',
    bcp47: 'ta-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (தமிழ் மொழி & குரல்)',
    statusNoteEn: 'Bhashini AI Active (Tamil Voice & Text)'
  },
  {
    code: 'gu',
    name: 'Gujarati',
    nativeName: 'ગુજરાતી',
    script: 'Gujarati',
    bcp47: 'gu-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (ગુજરાતી ભાષા અને અવાજ)',
    statusNoteEn: 'Bhashini AI Active (Gujarati Voice & Text)'
  },
  {
    code: 'ur',
    name: 'Urdu',
    nativeName: 'اردو',
    script: 'Perso-Arabic',
    bcp47: 'ur-IN',
    hasUiText: true,
    bhashiniSupported: true,
    isRtl: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (اردو زبان و آواز)',
    statusNoteEn: 'Bhashini AI Active (Urdu Voice & Text)'
  },
  {
    code: 'kn',
    name: 'Kannada',
    nativeName: 'ಕನ್ನಡ',
    script: 'Kannada',
    bcp47: 'kn-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (ಕನ್ನಡ ಭಾಷೆ ಮತ್ತು ಧ್ವನಿ)',
    statusNoteEn: 'Bhashini AI Active (Kannada Voice & Text)'
  },
  {
    code: 'ml',
    name: 'Malayalam',
    nativeName: 'മലയാളം',
    script: 'Malayalam',
    bcp47: 'ml-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (മലയാളം ഭാഷയും ശബ്ദവും)',
    statusNoteEn: 'Bhashini AI Active (Malayalam Voice & Text)'
  },
  {
    code: 'pa',
    name: 'Punjabi',
    nativeName: 'ਪੰਜਾਬੀ',
    script: 'Gurmukhi',
    bcp47: 'pa-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਅਤੇ ਆਵਾਜ਼)',
    statusNoteEn: 'Bhashini AI Active (Punjabi Voice & Text)'
  },
  {
    code: 'or',
    name: 'Odia',
    nativeName: 'ଓଡ଼ିଆ',
    script: 'Odia',
    bcp47: 'or-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (ଓଡ଼ିଆ ଭାଷା ଏବଂ ସ୍ୱର)',
    statusNoteEn: 'Bhashini AI Active (Odia Voice & Text)'
  },
  {
    code: 'as',
    name: 'Assamese',
    nativeName: 'অসমীয়া',
    script: 'Bengali-Assamese',
    bcp47: 'as-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (অসমীয়া ভাষা আৰু কণ্ঠ)',
    statusNoteEn: 'Bhashini AI Active (Assamese Voice & Text)'
  },
  {
    code: 'mai',
    name: 'Maithili',
    nativeName: 'मैथिली',
    script: 'Devanagari',
    bcp47: 'mai-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (मैथिली भाषा व आवाज़)',
    statusNoteEn: 'Bhashini AI Active (Maithili Voice & Text)'
  },
  {
    code: 'ne',
    name: 'Nepali',
    nativeName: 'नेपाली',
    script: 'Devanagari',
    bcp47: 'ne-NP',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (नेपाली भाषा र आवाज)',
    statusNoteEn: 'Bhashini AI Active (Nepali Voice & Text)'
  },
  {
    code: 'sa',
    name: 'Sanskrit',
    nativeName: 'संस्कृतम्',
    script: 'Devanagari',
    bcp47: 'sa-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (संस्कृतम् अनुवाद व वाणी)',
    statusNoteEn: 'Bhashini AI Active (Sanskrit Voice & Text)'
  },
  {
    code: 'ks',
    name: 'Kashmiri',
    nativeName: 'कॉशुर / کٲشُر',
    script: 'Perso-Arabic/Devanagari',
    bcp47: 'ks-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (कश्मीरी अनुवाद व आवाज़)',
    statusNoteEn: 'Bhashini AI Active (Kashmiri Voice & Text)'
  },
  {
    code: 'kok',
    name: 'Konkani',
    nativeName: 'कोंकणी',
    script: 'Devanagari',
    bcp47: 'kok-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (कोंकणी भाषा व आवाज)',
    statusNoteEn: 'Bhashini AI Active (Konkani Voice & Text)'
  },
  {
    code: 'sd',
    name: 'Sindhi',
    nativeName: 'सिन्धी / سنڌي',
    script: 'Perso-Arabic/Devanagari',
    bcp47: 'sd-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (सिन्धी अनुवाद व आवाज़)',
    statusNoteEn: 'Bhashini AI Active (Sindhi Voice & Text)'
  },
  {
    code: 'doi',
    name: 'Dogri',
    nativeName: 'डोगरी',
    script: 'Devanagari',
    bcp47: 'doi-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (डोगरी भाषा व आवाज)',
    statusNoteEn: 'Bhashini AI Active (Dogri Voice & Text)'
  },
  {
    code: 'mni',
    name: 'Manipuri',
    nativeName: 'ꯃꯤꯇꯩꯂꯣꯟ / মণিপুরী',
    script: 'Meetei Mayek / Bengali',
    bcp47: 'mni-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (মণিপুরী অনুবাদ ও কণ্ঠ)',
    statusNoteEn: 'Bhashini AI Active (Manipuri Voice & Text)'
  },
  {
    code: 'sat',
    name: 'Santali',
    nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ',
    script: 'Ol Chiki',
    bcp47: 'sat-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (ᱥᱟᱱᱛᱟᱲᱤ ᱨᱚᱲ ᱟᱨ ᱥᱟᱰᱮ)',
    statusNoteEn: 'Bhashini AI Active (Santali Voice & Text)'
  },
  {
    code: 'brx',
    name: 'Bodo',
    nativeName: 'बर\'',
    script: 'Devanagari',
    bcp47: 'brx-IN',
    hasUiText: true,
    bhashiniSupported: true,
    statusNoteHi: 'भाषिणी AI सक्रिय (बर\' राव आरो सद्रोब)',
    statusNoteEn: 'Bhashini AI Active (Bodo Voice & Text)'
  }
];

export function getLanguageByCode(code: string): LanguageInfo {
  const clean = (code || 'hi').toLowerCase();
  return (
    INDIAN_LANGUAGES.find(l => l.code === clean || l.name.toLowerCase() === clean) ||
    INDIAN_LANGUAGES[0]
  );
}

export function checkBrowserVoiceSupport(bcp47: string, availableVoices: SpeechSynthesisVoice[]): boolean {
  if (!availableVoices || availableVoices.length === 0) return false;
  const targetPrefix = bcp47.split('-')[0].toLowerCase();
  return availableVoices.some(voice => {
    const vLang = voice.lang.toLowerCase();
    return vLang.startsWith(targetPrefix) || vLang.includes(targetPrefix);
  });
}

/**
 * Common UI localized strings across languages with fallback to Hindi / English
 */
export interface UiTranslations {
  tagline: string;
  uploadReport: string;
  myReports: string;
  askSakha: string;
  simpleExplanation: string;
  detailedGraphs: string;
  normalRange: string;
  aboveNormal: string;
  belowNormal: string;
  attentionNeeded: string;
  verifiedBadge: string;
  listenToAudio: string;
  doctorQuestions: string;
  emptyVaultTitle: string;
  emptyVaultSubtitle: string;
}

const UI_DICTIONARY: Record<string, UiTranslations> = {
  hi: {
    tagline: 'आपकी रिपोर्ट, आपकी भाषा में',
    uploadReport: 'रिपोर्ट अपलोड करें',
    myReports: 'मेरी रिपोर्ट्स तिजोरी',
    askSakha: 'सखा से पूछें',
    simpleExplanation: 'सरल व्याख्या',
    detailedGraphs: 'ग्राफ और चार्ट देखें',
    normalRange: 'सामान्य सीमा में',
    aboveNormal: 'सामान्य से अधिक',
    belowNormal: 'सामान्य से कम',
    attentionNeeded: 'ध्यान देने योग्य',
    verifiedBadge: 'जांचा गया',
    listenToAudio: 'पूरी बात सुनें',
    doctorQuestions: 'डॉक्टर से पूछने योग्य सवाल',
    emptyVaultTitle: 'अभी कोई रिपोर्ट सेव नहीं है',
    emptyVaultSubtitle: 'अपनी पहली रिपोर्ट अपलोड करके शुरू करें'
  },
  en: {
    tagline: 'Your Report, In Your Language',
    uploadReport: 'Upload Report',
    myReports: 'My Reports Vault',
    askSakha: 'Ask Sakha',
    simpleExplanation: 'Simple Explanation',
    detailedGraphs: 'View Detailed Graphs',
    normalRange: 'Within Normal Range',
    aboveNormal: 'Above Normal Range',
    belowNormal: 'Below Normal Range',
    attentionNeeded: 'Needs Attention',
    verifiedBadge: 'Verified',
    listenToAudio: 'Listen to Explanation',
    doctorQuestions: 'Questions for Your Doctor',
    emptyVaultTitle: 'No Reports Saved Yet',
    emptyVaultSubtitle: 'Upload your first medical report to get started'
  },
  bn: {
    tagline: 'আপনার রিপোর্ট, আপনার ভাষায়',
    uploadReport: 'রিপোর্ট আপলোড করুন',
    myReports: 'আমার রিপোর্ট ভল্ট',
    askSakha: 'সখাকে জিজ্ঞাসা করুন',
    simpleExplanation: 'সহজ ব্যাখ্যা',
    detailedGraphs: 'গ্রাফ এবং চার্ট দেখুন',
    normalRange: 'স্বাভাবিক সীমার মধ্যে',
    aboveNormal: 'স্বাভাবিকের চেয়ে বেশি',
    belowNormal: 'স্বাভাবিকের চেয়ে কম',
    attentionNeeded: 'মনোযোগ প্রয়োজন',
    verifiedBadge: 'যাচাইকৃত',
    listenToAudio: 'সম্পূর্ণ শুনুন',
    doctorQuestions: 'ডাক্তারকে জিজ্ঞাসা করার প্রশ্ন',
    emptyVaultTitle: 'এখনও কোনো রিপোর্ট সংরক্ষিত নেই',
    emptyVaultSubtitle: 'আপনার প্রথম রিপোর্ট আপলোড করে শুরু করুন'
  },
  te: {
    tagline: 'మీ నివేదిక, మీ భాషలో',
    uploadReport: 'రిపోర్ట్ అప్‌లోడ్ చేయండి',
    myReports: 'నా రిపోర్ట్స్ వాల్ట్',
    askSakha: 'సఖాను అడగండి',
    simpleExplanation: 'సరళమైన వివరణ',
    detailedGraphs: 'గ్రాఫ్‌లు మరియు చార్ట్‌లను చూడండి',
    normalRange: 'సాధారణ పరిధిలో ఉంది',
    aboveNormal: 'సాధారణం కంటే ఎక్కువ',
    belowNormal: 'సాధారణం కంటే తక్కువ',
    attentionNeeded: 'శ్రద్ధ అవసరం',
    verifiedBadge: 'ధృవీకరించబడింది',
    listenToAudio: 'ఆడియో వినండి',
    doctorQuestions: 'వైద్యుడిని అడగవలసిన ప్రశ్నలు',
    emptyVaultTitle: 'ఇంకా రిపోర్టులు ఏవీ సేవ్ కాలేదు',
    emptyVaultSubtitle: 'మీ మొదటి నివేదికను అప్‌లోడ్ చేయడం ద్వారా ప్రారంభించండి'
  },
  ta: {
    tagline: 'உங்கள் அறிக்கை, உங்கள் மொழியில்',
    uploadReport: 'அறிக்கையைப் பதிவேற்றவும்',
    myReports: 'எனது அறிக்கைகள் பெட்டகம்',
    askSakha: 'சகாவிடம் கேளுங்கள்',
    simpleExplanation: 'எளிய விளக்கம்',
    detailedGraphs: 'வரைபடங்கள் மற்றும் விளக்கப்படங்களைப் பார்க்கவும்',
    normalRange: 'இயல்பான வரம்பிற்குள்',
    aboveNormal: 'இயல்பை விட அதிகம்',
    belowNormal: 'இயல்பை விடக் குறைவு',
    attentionNeeded: 'கவனம் தேவை',
    verifiedBadge: 'சரிபார்க்கப்பட்டது',
    listenToAudio: 'விளக்கத்தைக் கேளுங்கள்',
    doctorQuestions: 'மருத்துவரிடம் கேட்க வேண்டிய கேள்விகள்',
    emptyVaultTitle: 'இதுவரை எந்த அறிக்கையும் சேமிக்கப்படவில்லை',
    emptyVaultSubtitle: 'தொடங்குவதற்கு உங்கள் முதல் மருத்துவ அறிக்கையைப் பதிவேற்றவும்'
  },
  mr: {
    tagline: 'तुमचा अहवाल, तुमच्या भाषेत',
    uploadReport: 'अहवाल अपलोड करा',
    myReports: 'माझे अहवाल व्हॉल्ट',
    askSakha: 'सखाला विचारा',
    simpleExplanation: 'सोपे स्पष्टीकरण',
    detailedGraphs: 'आलेख आणि चार्ट पहा',
    normalRange: 'सामान्य श्रेणीत आहे',
    aboveNormal: 'सामान्यापेक्षा जास्त',
    belowNormal: 'सामान्यापेक्षा कमी',
    attentionNeeded: 'लक्ष देणे आवश्यक',
    verifiedBadge: 'तपासलेले',
    listenToAudio: 'संपूर्ण स्पष्टीकरण ऐका',
    doctorQuestions: 'डॉक्टरांना विचारण्याचे प्रश्न',
    emptyVaultTitle: 'अद्याप कोणताही अहवाल सेव्ह केलेला नाही',
    emptyVaultSubtitle: 'तुमचा पहिला अहवाल अपलोड करून सुरुवात करा'
  },
  gu: {
    tagline: 'તમારો રિપોર્ટ, તમારી ભાષામાં',
    uploadReport: 'રિપોર્ટ અપલોડ કરો',
    myReports: 'મારા રિપોર્ટ્સ વૉલ્ટ',
    askSakha: 'સખાને પૂછો',
    simpleExplanation: 'સરળ સમજૂતી',
    detailedGraphs: 'ગ્રાફ અને ચાર્ટ જુઓ',
    normalRange: 'સામાન્ય શ્રેણીમાં છે',
    aboveNormal: 'સામાન્ય કરતાં વધુ',
    belowNormal: 'સામાન્ય કરતાં ઓછું',
    attentionNeeded: 'ધ્યાન આપવું જરૂરી',
    verifiedBadge: 'ચકાસાયેલ',
    listenToAudio: 'ઓડિયો સાંભળો',
    doctorQuestions: 'ડૉક્ટરને પૂછવા માટેના પ્રશ્નો',
    emptyVaultTitle: 'હજી સુધી કોઈ રિપોર્ટ સાચવેલ નથી',
    emptyVaultSubtitle: 'તમારો પ્રથમ રિપોર્ટ અપલોડ કરીને શરૂ કરો'
  },
  kn: {
    tagline: 'ನಿಮ್ಮ ವರದಿ, ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ',
    uploadReport: 'ವರದಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ',
    myReports: 'ನನ್ನ ವರದಿಗಳ ವಾಲ್ಟ್',
    askSakha: 'ಸಖಾನನ್ನು ಕೇಳಿ',
    simpleExplanation: 'ಸರಳ ವಿವರಣೆ',
    detailedGraphs: 'ಗ್ರಾಫ್ ಮತ್ತು ಚಾರ್ಟ್ ವೀಕ್ಷಿಸಿ',
    normalRange: 'ಸಾಮಾನ್ಯ ವ್ಯಾಪ್ತಿಯಲ್ಲಿದೆ',
    aboveNormal: 'ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚು',
    belowNormal: 'ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಕಡಿಮೆ',
    attentionNeeded: 'ಗಮನ ಅಗತ್ಯ',
    verifiedBadge: 'ಪರಿಶೀಲಿಸಲಾಗಿದೆ',
    listenToAudio: 'ಆಡಿಯೋ ಆಲಿಸಿ',
    doctorQuestions: 'ವೈದ್ಯರಿಗೆ ಕೇಳಬೇಕಾದ ಪ್ರಶ್ನೆಗಳು',
    emptyVaultTitle: 'ಇನ್ನೂ ಯಾವುದೇ ವರದಿ ಉಳಿಸಲಾಗಿಲ್ಲ',
    emptyVaultSubtitle: 'ಪ್ರಾರಂಭಿಸಲು ನಿಮ್ಮ ಮೊದಲ ವೈದ್ಯಕೀಯ ವರದಿಯನ್ನು ಅಪ್‌ಲೋಡ್ ಮಾಡಿ'
  },
  ml: {
    tagline: 'നിങ്ങളുടെ റിപ്പോർട്ട്, നിങ്ങളുടെ ഭാഷയിൽ',
    uploadReport: 'റിപ്പോർട്ട് അപ്‌ലോഡ് ചെയ്യുക',
    myReports: 'എന്റെ റിപ്പോർട്ടുകൾ',
    askSakha: 'സഖയോട് ചോദിക്കുക',
    simpleExplanation: 'ലളിതമായ വിവരണം',
    detailedGraphs: 'ഗ്രാഫുകളും ചാർട്ടുകളും കാണുക',
    normalRange: 'സാധാരണ പരിധിയിൽ',
    aboveNormal: 'സാധാരണയേക്കാൾ കൂടുതൽ',
    belowNormal: 'സാധാരണയേക്കാൾ കുറവ്',
    attentionNeeded: 'ശ്രദ്ധിക്കേണ്ടതുണ്ട്',
    verifiedBadge: 'സ്ഥിരീകരിച്ചു',
    listenToAudio: 'ശബ്‌ദം കേൾക്കുക',
    doctorQuestions: 'ഡോക്ടറോട് ചോദിക്കേണ്ട ചോദ്യങ്ങൾ',
    emptyVaultTitle: 'റിപ്പോർട്ടുകളൊന്നും ഇതുവരെ സംരക്ഷിച്ചിട്ടില്ല',
    emptyVaultSubtitle: 'ആരംഭിക്കുന്നതിന് നിങ്ങളുടെ ആദ്യ റിപ്പോർട്ട് അപ്‌ലോഡ് ചെയ്യുക'
  },
  pa: {
    tagline: 'ਤੁਹਾਡੀ ਰਿਪੋਰਟ, ਤੁਹਾਡੀ ਭਾਸ਼ਾ ਵਿੱਚ',
    uploadReport: 'ਰਿਪੋਰਟ ਅੱਪਲੋਡ ਕਰੋ',
    myReports: 'ਮੇਰੀਆਂ ਰਿਪੋਰਟਾਂ ਵਾਲਟ',
    askSakha: 'ਸਖਾ ਨੂੰ ਪੁੱਛੋ',
    simpleExplanation: 'ਸਧਾਰਨ ਵਿਆਖਿਆ',
    detailedGraphs: 'ਗ੍ਰਾਫ਼ ਅਤੇ ਚਾਰਟ ਵੇਖੋ',
    normalRange: 'ਸਧਾਰਣ ਸੀਮਾ ਵਿੱਚ',
    aboveNormal: 'ਸਧਾਰਣ ਤੋਂ ਵੱਧ',
    belowNormal: 'ਸਧਾਰਣ ਤੋਂ ਘੱਟ',
    attentionNeeded: 'ਧਿਆਨ ਦੇਣ ਦੀ ਲੋੜ',
    verifiedBadge: 'ਜਾਂਚਿਆ ਗਿਆ',
    listenToAudio: 'ਆਡੀਓ ਸੁਣੋ',
    doctorQuestions: 'ਡਾਕਟਰ ਨੂੰ ਪੁੱਛਣ ਵਾਲੇ ਸਵਾਲ',
    emptyVaultTitle: 'ਅਜੇ ਕੋਈ ਰਿਪੋਰਟ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਹੈ',
    emptyVaultSubtitle: 'ਆਪਣੀ ਪਹਿਲੀ ਰਿਪੋਰਟ ਅੱਪਲੋਡ ਕਰਕੇ ਸ਼ੁਰੂ ਕਰੋ'
  },
  or: {
    tagline: 'ଆପଣଙ୍କର ରିପୋର୍ଟ, ଆପଣଙ୍କ ଭାଷାରେ',
    uploadReport: 'ରିପୋର୍ଟ ଅପଲୋଡ୍ କରନ୍ତୁ',
    myReports: 'ମୋର ରିପୋର୍ଟ ଭଲ୍ଟ',
    askSakha: 'ସଖାଙ୍କୁ ପଚାରନ୍ତୁ',
    simpleExplanation: 'ସରଳ ବ୍ୟାଖ୍ୟା',
    detailedGraphs: 'ଗ୍ରାଫ୍ ଏବଂ ଚାର୍ଟ ଦେଖନ୍ତୁ',
    normalRange: 'ସାଧାରଣ ସୀମା ମଧ୍ୟରେ',
    aboveNormal: 'ସାଧାରଣଠାରୁ ଅଧିକ',
    belowNormal: 'ସାଧାରଣଠାରୁ କମ୍',
    attentionNeeded: 'ଧ୍ୟାନ ଆବଶ୍ୟକ',
    verifiedBadge: 'ଯାଞ୍ଚ ହୋଇଛି',
    listenToAudio: 'ଅଡିଓ ଶୁଣନ୍ତୁ',
    doctorQuestions: 'ଡାକ୍ତରଙ୍କୁ ପଚାରିବାକୁ ଥିବା ପ୍ରଶ୍ନ',
    emptyVaultTitle: 'ଏପର୍ଯ୍ୟନ୍ତ କୌଣସି ରିପୋର୍ଟ ସଂରକ୍ଷିତ ହୋଇନାହିଁ',
    emptyVaultSubtitle: 'ଆପଣଙ୍କର ପ୍ରଥମ ରିପୋର୍ଟ ଅପଲୋଡ୍ କରି ଆରମ୍ଭ କରନ୍ତୁ'
  },
  as: {
    tagline: 'আপোনাৰ প্ৰতিবেদন, আপোনাৰ ভাষাত',
    uploadReport: 'প্ৰতিবেদন আপলোড কৰক',
    myReports: 'মোৰ প্ৰতিবেদন ভঁৰাল',
    askSakha: 'সখাক সোধক',
    simpleExplanation: 'সহজ ব্যাখ্যা',
    detailedGraphs: 'গ্ৰাফ আৰু চাৰ্ট চাওক',
    normalRange: 'স্বাভাৱিক পৰিসীমাৰ ভিতৰত',
    aboveNormal: 'স্বাভাৱিকতকৈ বেছি',
    belowNormal: 'স্বাভাৱিকতকৈ কম',
    attentionNeeded: 'মনোযোগ দিয়াৰ প্ৰয়োজন',
    verifiedBadge: 'পৰীক্ষিত',
    listenToAudio: 'অডিঅ’ শুনক',
    doctorQuestions: 'চিকিৎসকক সোধিবলগীয়া প্ৰশ্ন',
    emptyVaultTitle: 'এতিয়ালৈকে কোনো প্ৰতিবেদন সংৰক্ষণ কৰা হোৱা নাই',
    emptyVaultSubtitle: 'আপোনাৰ প্ৰথম প্ৰতিবেদন আপলোড কৰি আৰম্ভ কৰক'
  },
  ur: {
    tagline: 'آپ کی رپورٹ، آپ کی زبان میں',
    uploadReport: 'رپورٹ اپ لوڈ کریں',
    myReports: 'میری رپورٹس والٹ',
    askSakha: 'سکھا سے پوچھیں',
    simpleExplanation: 'آسان وضاحت',
    detailedGraphs: 'گراف اور چارٹ دیکھیں',
    normalRange: 'عام حد میں ہے',
    aboveNormal: 'عام سے زیادہ',
    belowNormal: 'عام سے کم',
    attentionNeeded: 'توجہ طلب',
    verifiedBadge: 'تصدیق شدہ',
    listenToAudio: 'وضاحت سنیں',
    doctorQuestions: 'ڈاکٹر سے پوچھنے والے سوالات',
    emptyVaultTitle: 'ابھی تک کوئی رپورٹ محفوظ نہیں ہے',
    emptyVaultSubtitle: 'شروع کرنے کے لیے اپنی پہلی رپورٹ اپ لوڈ کریں'
  }
};

export function getUiStrings(langCode: string): UiTranslations {
  const code = (langCode || 'hi').toLowerCase().slice(0, 2);
  if (UI_DICTIONARY[code]) {
    return UI_DICTIONARY[code];
  }
  // Default to Hindi if available or English
  return UI_DICTIONARY['hi'] || UI_DICTIONARY['en'];
}
