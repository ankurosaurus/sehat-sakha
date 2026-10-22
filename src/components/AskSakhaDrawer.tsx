import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Volume2, Loader2, Sparkles } from 'lucide-react';
import { SakhaMascot } from './SakhaMascot';
import type { LabParameter, ReportSummary } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CANDIDATE_MODELS, isValidApiKey } from '../lib/gemini';
import { speechEngine } from '../lib/speech';
import { bhashiniDetectLanguage, LANGUAGE_CODE_TO_NAME } from '../lib/bhashini';

interface AskSakhaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: string;
  currentReport?: ReportSummary | null;
  selectedParam?: LabParameter | null;
  apiKey?: string;
}

interface Message {
  sender: 'user' | 'sakha';
  text: string;
  detectedLang?: string;
  detectedEngine?: string;
}

export const AskSakhaDrawer: React.FC<AskSakhaDrawerProps> = ({
  isOpen,
  onClose,
  language = 'Hindi',
  currentReport,
  selectedParam,
  apiKey = ''
}) => {
  const isHindi = language === 'Hindi';
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'sakha',
      text: isHindi
        ? 'नमस्ते! मैं सखा हूँ। मैं आपकी मेडिकल रिपोर्ट को सरल भाषा में समझने में आपकी मदद करूँगा। आप मुझसे भारत की किसी भी भाषा में सवाल पूछ सकते हैं।'
        : `Hello! I am Sakha, your health companion. I am powered by Digital India Bhashini to explain your laboratory report in 22 Indian languages. What would you like to know?`
    }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [speakingIdx, setSpeakingIdx] = useState<number | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // If user selected a parameter, offer relevant question
  useEffect(() => {
    if (selectedParam) {
      const paramNote = isHindi
        ? `आपने **${selectedParam.name}** (${selectedParam.hindiName || ''}) चुना है (परिणाम: ${selectedParam.value} ${selectedParam.unit}, सामान्य सीमा: ${selectedParam.rangeText})। आप इसके बारे में क्या जानना चाहते हैं?`
        : `You selected **${selectedParam.name}** (Result: ${selectedParam.value} ${selectedParam.unit}, Reference Range: ${selectedParam.rangeText}). What would you like to know about it?`;

      setMessages((prev: Message[]) => [...prev, { sender: 'sakha', text: paramNote }]);
    }
  }, [selectedParam, isHindi]);

  const quickQuestions = isHindi ? [
    'इस टेस्ट का मतलब क्या है?',
    'यह रेंज क्या बताती है?',
    'इस ग्राफ को कैसे समझें?',
    'डॉक्टर से क्या पूछना चाहिए?',
    'मेरी पिछली रिपोर्ट से क्या बदला?'
  ] : [
    'What does this test measure?',
    'What does the reference range mean?',
    'How do I interpret the range graph?',
    'What should I ask my doctor?',
    'What changed from my previous test?'
  ];

  const handleSend = async (userQuestion: string) => {
    if (!userQuestion.trim()) return;

    // Detect language using Digital India Bhashini TLD
    let detectedLangName = '';
    try {
      const tld = await bhashiniDetectLanguage(userQuestion);
      if (tld && tld.langCode && tld.confidence > 0.5) {
        detectedLangName = LANGUAGE_CODE_TO_NAME[tld.langCode] || tld.langCode;
      }
    } catch (e) {
      console.warn('TLD check error:', e);
    }

    const effectiveLang = detectedLangName || language;

    const newMsgs: Message[] = [
      ...messages,
      {
        sender: 'user',
        text: userQuestion,
        detectedLang: detectedLangName,
        detectedEngine: detectedLangName ? 'Bhashini TLD' : undefined
      }
    ];
    setMessages(newMsgs);
    setInputVal('');
    setLoading(true);

    try {
      // Build context from current report and selected parameter
      let contextText = '';
      if (currentReport) {
        contextText += `Current Report: ${currentReport.title}. Parameters: `;
        contextText += currentReport.parameters.map(p => `${p.name}: ${p.value} ${p.unit} (Range: ${p.rangeText}, Status: ${p.status})`).join('; ');
      }
      if (selectedParam) {
        contextText += `\nCurrently Selected Parameter: ${selectedParam.name} = ${selectedParam.value} ${selectedParam.unit} (Range: ${selectedParam.rangeText}, Status: ${selectedParam.status}). Explanation: ${selectedParam.simpleExplanationEn}`;
      }

      const prompt = `You are Sakha, a kind, empathetic health companion helping an Indian patient understand their lab test in: **${effectiveLang}**.
Patient context: ${contextText || 'General medical report guidance.'}
Patient question: "${userQuestion}"

STRICT RULES:
1. Speak in warm, simple, supportive everyday language (${effectiveLang}).
2. Keep medical test names in English in parentheses if helpful so patient can match their physical paper report.
3. NEVER diagnose any disease or recommend treatment or prescription medication.
4. Keep answers short (3-4 sentences max), clear, and reassuring.
5. If asked for a medical diagnosis, politely state that you are an assistant to help explain terms, and advise them to consult their licensed doctor.`;

      let reply = '';
      if (isValidApiKey(apiKey)) {
        const genAI = new GoogleGenerativeAI(apiKey.trim());
        for (const modelName of CANDIDATE_MODELS) {
          try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            reply = (await result.response).text();
            if (reply) break;
          } catch (e: any) {
            if (e?.status === 429 || e?.status === 404) continue;
          }
        }
      }

      if (!reply) {
        // Fallback empathetic canned explanation based on question keywords
        if (userQuestion.includes('ग्राफ') || userQuestion.toLowerCase().includes('graph')) {
          reply = isHindi
            ? 'ग्राफ में हरा हिस्सा (बीच का भाग) स्वस्थ सामान्य सीमा दिखाता है। यदि बिंदु बाईं ओर है तो परिणाम कम है, और यदि दाईं ओर है तो परिणाम अधिक है। यह केवल तुलना के लिए है।'
            : 'In the graph, the green central section indicates the standard healthy range. Markers to the left mean below range, and markers to the right mean above range.';
        } else if (userQuestion.includes('डॉक्टर') || userQuestion.toLowerCase().includes('doctor')) {
          reply = isHindi
            ? 'डॉक्टर से पूछें: 1. इस परिणाम का मेरे स्वास्थ्य पर क्या प्रभाव है? 2. क्या मुझे खान-पान में कोई बदलाव करना चाहिए? 3. अगली जांच कब करानी होगी?'
            : 'Ask your doctor: 1. What does this specific value mean for me? 2. Do I need any lifestyle changes? 3. When should we repeat this test?';
        } else if (userQuestion.includes('रेंज') || userQuestion.toLowerCase().includes('range')) {
          reply = isHindi
            ? 'रेफरेंस रेंज वह सीमा होती है जो अधिकांश स्वस्थ लोगों में पाई जाती है। यदि आपका मान थोड़ा बाहर है, तो यह तनाव, खान-पान या हालिया इन्फेक्शन के कारण भी हो सकता है।'
            : 'The reference range shows the typical values found in healthy individuals. Slight variations can occur due to hydration, diet, or recent infection.';
        } else {
          reply = isHindi
            ? 'यह जांच आपके शरीर की कोशिकाओं और अंगों के कामकाज का आधारभूत स्तर दर्शाती है। किसी भी असामान्य मान पर चिंता न करें, अपने डॉक्टर से परामर्श अवश्य लें।'
            : 'This investigation establishes a functional baseline for your cellular markers. Please consult your physician for individualized clinical interpretation.';
        }
      }

      setMessages((prev: Message[]) => [
        ...prev,
        {
          sender: 'sakha',
          text: reply,
          detectedLang: effectiveLang,
          detectedEngine: 'Bhashini AI'
        }
      ]);
    } catch (err: any) {
      setMessages((prev: Message[]) => [
        ...prev,
        {
          sender: 'sakha',
          text: isHindi
            ? 'माफ कीजिए, इस समय मैं उत्तर तैयार नहीं कर सका। कृपया थोड़ी देर बाद पुनः प्रयास करें या अपने डॉक्टर से परामर्श लें।'
            : 'Apologies, I encountered a brief issue generating that response. Please consult your doctor for detailed medical advice.'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string, idx: number, msgLang?: string) => {
    if (speakingIdx === idx) {
      speechEngine.stop();
      setSpeakingIdx(null);
      return;
    }

    setSpeakingIdx(idx);
    const speakLang = msgLang || language;
    speechEngine.speak(text, speakLang, {
      onEnd: () => setSpeakingIdx(null),
      onError: () => setSpeakingIdx(null)
    });
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        right: 0,
        width: '100%',
        maxWidth: '480px',
        height: '85vh',
        maxHeight: '680px',
        backgroundColor: '#ffffff',
        borderTopLeftRadius: '20px',
        borderTopRightRadius: '20px',
        boxShadow: '0 -4px 24px rgba(0,0,0,0.18)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        border: '1.5px solid #a7f3d0'
      }}
      role="dialog"
      aria-label="Ask Sakha Assistant"
    >
      {/* Header */}
      <div
        style={{
          padding: '1rem 1.25rem',
          backgroundColor: '#ecfdf5',
          borderBottom: '1.5px solid #a7f3d0',
          borderTopLeftRadius: '18px',
          borderTopRightRadius: '18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <SakhaMascot size={42} mood="listening" />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#064e3b' }}>
                {isHindi ? 'सखा से पूछें (Ask Sakha)' : 'Ask Sakha'}
              </h3>
              <span
                style={{
                  backgroundColor: '#dbeafe',
                  color: '#1e40af',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0.1rem 0.45rem',
                  borderRadius: '999px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem'
                }}
              >
                <Sparkles size={10} /> भाषिणी TLD
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#047857', fontWeight: 600 }}>
              {isHindi ? '22 भाषाओं में बातचीत व आवाज़ • सुरक्षित स्वास्थ्य मित्र' : '22 Indian Languages & Voice Supported'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.4rem',
            borderRadius: '50%',
            color: '#064e3b'
          }}
          title={isHindi ? 'बंद करें' : 'Close'}
        >
          <X size={22} />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {messages.map((m: Message, idx: number) => (
          <div
            key={idx}
            style={{
              alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.3rem'
            }}
          >
            <div
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '14px',
                backgroundColor: m.sender === 'user' ? '#064e3b' : '#f8fafc',
                color: m.sender === 'user' ? '#ffffff' : '#0f172a',
                border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                fontSize: '0.88rem',
                lineHeight: 1.5,
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
              }}
            >
              {m.text}
            </div>

            {/* Language Detection Tag & Spoken Audio Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start'
              }}
            >
              {m.detectedLang && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    color: '#047857',
                    backgroundColor: '#dcfce7',
                    padding: '0.1rem 0.4rem',
                    borderRadius: '4px',
                    fontWeight: 600
                  }}
                >
                  🇮🇳 {m.detectedEngine || 'भाषिणी'}: {m.detectedLang}
                </span>
              )}

              {m.sender === 'sakha' && (
                <button
                  onClick={() => handleSpeak(m.text, idx, m.detectedLang)}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: speakingIdx === idx ? '#059669' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                    padding: '0.15rem 0.35rem',
                    borderRadius: '4px'
                  }}
                  title="Listen in Indian Voice"
                >
                  <Volume2 size={14} className={speakingIdx === idx ? 'animate-pulse' : ''} />
                  {speakingIdx === idx ? 'बोल रहे हैं...' : 'सुनें (Listen)'}
                </button>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontSize: '0.82rem', padding: '0.5rem' }}>
            <Loader2 size={16} className="animate-spin" />
            <span>सखा सोच रहे हैं (Sakha is preparing explanation)...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Suggestion Chips */}
      <div
        style={{
          padding: '0.5rem 1rem',
          display: 'flex',
          gap: '0.4rem',
          overflowX: 'auto',
          borderTop: '1px solid #f1f5f9',
          backgroundColor: '#fafafa'
        }}
      >
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            style={{
              whiteSpace: 'nowrap',
              fontSize: '0.75rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '999px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: '#334155',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Field */}
      <div
        style={{
          padding: '0.75rem 1rem',
          borderTop: '1.5px solid #e2e8f0',
          backgroundColor: '#ffffff',
          display: 'flex',
          gap: '0.5rem'
        }}
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSend(inputVal);
            }
          }}
          placeholder={
            isHindi
              ? 'सखा से कोई भी सवाल पूछें (उदा: हीमोग्लोबिन क्या है?)...'
              : `Ask Sakha in any of 22 Indian languages...`
          }
          style={{
            flex: 1,
            padding: '0.65rem 0.85rem',
            borderRadius: '12px',
            border: '1.5px solid #cbd5e1',
            fontSize: '0.88rem',
            outline: 'none'
          }}
        />

        <button
          onClick={() => handleSend(inputVal)}
          disabled={!inputVal.trim() || loading}
          style={{
            backgroundColor: '#064e3b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '12px',
            padding: '0.65rem 1rem',
            cursor: inputVal.trim() && !loading ? 'pointer' : 'not-allowed',
            opacity: inputVal.trim() && !loading ? 1 : 0.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
