/**
 * Sehat Sakha - Real Spoken Audio Engine for 22 Indian Languages
 * Powered by Digital India Bhashini (NLTM) + Google Neural + Browser Speech Fallback
 *
 * Tier 1: Digital India Bhashini Neural TTS (/api/bhashini?action=tts)
 * Tier 2: Google Neural TTS streaming (/api/tts)
 * Tier 3: Browser Web Speech API fallback (SpeechSynthesisUtterance)
 *
 * Progressive sentence chunking with live subtitle updates, pause, resume, and stop controls.
 */

import { getBhashiniLangCode } from './bhashini';

export interface SpeechControllerState {
  isPlaying: boolean;
  isPaused: boolean;
  currentSentenceIndex: number;
  totalSentences: number;
  currentText: string;
}

type SentenceCallback = (sentenceIndex: number, total: number, sentence: string) => void;
type EndCallback = () => void;
type ErrorCallback = (errorMsg: string) => void;

class SpeechEngine {
  private currentAudio: HTMLAudioElement | null = null;
  private sentenceQueue: string[] = [];
  private currentIndex = 0;
  private isCancelled = false;
  private isPausedInternal = false;
  private onSentenceCb?: SentenceCallback;
  private onEndCb?: EndCallback;
  private onErrorCb?: ErrorCallback;
  private selectedLang: string = 'Hindi';
  private browserVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadBrowserVoices();
      window.speechSynthesis.onvoiceschanged = () => {
        this.loadBrowserVoices();
      };
    }
  }

  public loadBrowserVoices(): SpeechSynthesisVoice[] {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
    this.browserVoices = window.speechSynthesis.getVoices() || [];
    return this.browserVoices;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.browserVoices.length === 0) {
      return this.loadBrowserVoices();
    }
    return this.browserVoices;
  }

  /**
   * Sanitizes markdown artifacts and expands technical medical units into clear spoken words
   */
  public sanitizeMedicalText(rawText: string, language: string = 'Hindi'): string {
    if (!rawText) return '';

    let clean = rawText
      // Remove markdown headings, bold, italic, backticks
      .replace(/#{1,6}\s+/g, '')
      .replace(/[*_~`]/g, '')
      // Remove markdown links [text](url) -> text
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      // Remove emojis & symbols
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}]/gu, '')
      // Replace bullet marks
      .replace(/^\s*[-•*]\s+/gm, '')
      .replace(/\r\n/g, '\n');

    const code = getBhashiniLangCode(language);

    if (code === 'hi') {
      clean = clean
        .replace(/mg\/dL/gi, ' मिलीग्राम प्रति डेसीलीटर ')
        .replace(/g\/dL/gi, ' ग्राम प्रति डेसीलीटर ')
        .replace(/\/mcL/gi, ' प्रति माइक्रोलीटर ')
        .replace(/fL/gi, ' फेम्प्टोलीटर ')
        .replace(/pg/gi, ' पिकोग्राम ')
        .replace(/mm\/hr/gi, ' मिलीमीटर प्रति घंटा ')
        .replace(/U\/L/gi, ' यूनिट प्रति लीटर ')
        .replace(/%/g, ' प्रतिशत ')
        .replace(/CBC/gi, ' कम्प्लीट ब्लड काउंट ')
        .replace(/WBC/gi, ' सफेद रक्त कोशिकाएं ')
        .replace(/RBC/gi, ' लाल रक्त कोशिकाएं ')
        .replace(/Hb/gi, ' हीमोग्लोबिन ');
    } else if (code === 'bn') {
      clean = clean
        .replace(/mg\/dL/gi, ' মিলিগ্রাম প্রতি ডেসিলিটার ')
        .replace(/g\/dL/gi, ' গ্রাম প্রতি ডেসিলিটার ')
        .replace(/%/g, ' শতাংশ ');
    } else if (code === 'te') {
      clean = clean
        .replace(/mg\/dL/gi, ' మిల్లీగ్రాములు ప్రతి డెసిలీటర్ ')
        .replace(/%/g, ' శాతం ');
    } else if (code === 'ta') {
      clean = clean
        .replace(/mg\/dL/gi, ' மில்லிகிராம் ஒரு டெசிலிட்டருக்கு ')
        .replace(/%/g, ' சதவீதம் ');
    }

    return clean;
  }

  /**
   * Splits narrative text into bite-sized spoken sentences (<140 characters each)
   */
  public chunkIntoSentences(text: string): string[] {
    const rawChunks = text
      .split(/(?<=[।?!.\n])\s+/)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !/^[-•*]$/.test(s));

    const sentences: string[] = [];
    for (const chunk of rawChunks) {
      if (chunk.length > 140) {
        const parts = chunk.split(/(?<=[,;])\s+/);
        sentences.push(...parts.map(p => p.trim()).filter(p => p.length > 0));
      } else {
        sentences.push(chunk);
      }
    }

    return sentences.length > 0 ? sentences : [text];
  }

  /**
   * Primary entry point: Speaks the text in any of the 22 Indian languages or English
   */
  public speak(
    text: string,
    language: string = 'Hindi',
    callbacks?: {
      onSentence?: SentenceCallback;
      onEnd?: EndCallback;
      onError?: ErrorCallback;
    }
  ): { hasVoice: boolean; voiceName: string } {
    this.stop();

    this.selectedLang = language;
    this.onSentenceCb = callbacks?.onSentence;
    this.onEndCb = callbacks?.onEnd;
    this.onErrorCb = callbacks?.onError;
    this.isCancelled = false;
    this.isPausedInternal = false;

    const sanitized = this.sanitizeMedicalText(text, language);
    this.sentenceQueue = this.chunkIntoSentences(sanitized);
    this.currentIndex = 0;

    if (this.sentenceQueue.length === 0) {
      this.onEndCb?.();
      return { hasVoice: false, voiceName: '' };
    }

    this.playNextChunk();

    return {
      hasVoice: true,
      voiceName: `Bhashini AI ${language} Voice`
    };
  }

  private playNextChunk() {
    if (this.isCancelled) return;

    if (this.currentIndex >= this.sentenceQueue.length) {
      this.currentAudio = null;
      this.onEndCb?.();
      return;
    }

    const sentence = this.sentenceQueue[this.currentIndex];
    this.onSentenceCb?.(this.currentIndex, this.sentenceQueue.length, sentence);

    const langCode = getBhashiniLangCode(this.selectedLang);

    // Primary: Bhashini IndicTTS stream via /api/bhashini
    const bhashiniUrl = `/api/bhashini?action=tts&text=${encodeURIComponent(sentence)}&lang=${langCode}&gender=female&format=audio`;
    // Secondary: Direct /api/tts proxy fallback
    const proxyUrl = `/api/tts?text=${encodeURIComponent(sentence)}&lang=${langCode}`;
    // Direct Google TTS fallback
    const directUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(sentence)}&tl=${langCode}&client=tw-ob`;

    const audio = new Audio();
    this.currentAudio = audio;

    let hasHandledEnd = false;
    const advance = () => {
      if (hasHandledEnd || this.isCancelled) return;
      hasHandledEnd = true;
      this.currentIndex++;
      this.playNextChunk();
    };

    audio.onended = advance;

    audio.onerror = () => {
      if (this.isCancelled) return;
      console.warn('Bhashini audio stream failed on sentence, trying secondary proxy:', sentence);

      const secondaryAudio = new Audio(proxyUrl);
      this.currentAudio = secondaryAudio;
      secondaryAudio.onended = advance;

      secondaryAudio.onerror = () => {
        const directAudio = new Audio(directUrl);
        this.currentAudio = directAudio;
        directAudio.onended = advance;
        directAudio.onerror = () => {
          this.fallbackToBrowserSpeech(sentence, advance);
        };
        directAudio.play().catch(() => {
          this.fallbackToBrowserSpeech(sentence, advance);
        });
      };

      secondaryAudio.play().catch(() => {
        this.fallbackToBrowserSpeech(sentence, advance);
      });
    };

    audio.src = bhashiniUrl;
    audio.play().catch((playErr) => {
      console.warn('Bhashini audio play rejected, trying fallback:', playErr);
      audio.src = proxyUrl;
      audio.play().catch(() => {
        this.fallbackToBrowserSpeech(sentence, advance);
      });
    });
  }

  /**
   * Browser SpeechSynthesis fallback for offline or restricted environments
   */
  private fallbackToBrowserSpeech(sentence: string, onDone: () => void) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onDone();
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(sentence);
      const langCode = getBhashiniLangCode(this.selectedLang);
      utterance.lang = langCode === 'en' ? 'en-IN' : `${langCode}-IN`;
      utterance.rate = 0.92;

      const voices = this.getVoices();
      const matchedVoice = voices.find(v => {
        const vLang = v.lang.toLowerCase();
        return vLang.startsWith(langCode) || vLang.includes(langCode);
      });
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }

      utterance.onend = () => onDone();
      utterance.onerror = (err) => {
        this.onErrorCb?.(err?.error ? `Audio speech error: ${err.error}` : 'Audio playback error');
        onDone();
      };

      window.speechSynthesis.speak(utterance);
    } catch (e: any) {
      console.error('Browser speech fallback failed:', e);
      this.onErrorCb?.(e?.message || 'Audio playback error');
      onDone();
    }
  }

  public pause() {
    this.isPausedInternal = true;
    if (this.currentAudio && !this.currentAudio.paused) {
      this.currentAudio.pause();
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
    }
  }

  public resume() {
    this.isPausedInternal = false;
    if (this.currentAudio && this.currentAudio.paused) {
      this.currentAudio.play().catch(e => console.warn('Audio resume error:', e));
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
  }

  public stop() {
    this.isCancelled = true;
    this.isPausedInternal = false;
    this.currentIndex = 0;
    this.sentenceQueue = [];

    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.src = '';
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public isSpeaking(): boolean {
    if (this.currentAudio && !this.currentAudio.paused) return true;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      return window.speechSynthesis.speaking;
    }
    return false;
  }

  public isPaused(): boolean {
    return this.isPausedInternal;
  }
}

export const speechEngine = new SpeechEngine();
