import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Volume2, Loader2 } from 'lucide-react';
import { SakhaMascot } from './SakhaMascot';
import type { LabParameter, ReportSummary } from '../types';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { CANDIDATE_MODELS, isValidApiKey } from '../lib/gemini';
import { speechEngine } from '../lib/speech';

interface AskSakhaDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  language: 'English' | 'Hindi';
  currentReport?: ReportSummary | null;
  selectedParam?: LabParameter | null;
  apiKey?: string;
}

interface Message {
  sender: 'user' | 'sakha';
  text: string;
}

export const AskSakhaDrawer: React.FC<AskSakhaDrawerProps> = ({
  isOpen,
  onClose,
  language,
  currentReport,
  selectedParam,
  apiKey = ''
}) => {
  const isHindi = language === 'Hindi';
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'sakha',
      text: isHindi
        ? 'नमस्ते! मैं सखा हूँ। मैं आपकी मेडिकल रिपोर्ट को सरल भाषा में समझने में आपकी मदद करूँगा। आप मुझसे कोई भी सवाल पूछ सकते हैं।'
        : "Hello! I am Sakha, your health companion. I am here to help you understand your laboratory report in simple everyday language. What would you like to know?"
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

    const newMsgs: Message[] = [...messages, { sender: 'user', text: userQuestion }];
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

      const prompt = `You are Sakha, a kind, empathetic health companion helping a rural Indian patient understand their lab test in ${language}.
Patient context: ${contextText || 'General medical report guidance.'}
Patient question: "${userQuestion}"

STRICT RULES:
1. Speak in warm, simple, supportive everyday language (${language}).
2. If language is Hindi, keep medical test names in English so patient can match their slip.
3. NEVER diagnose any disease or recommend treatment or medication.
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

      setMessages((prev: Message[]) => [...prev, { sender: 'sakha', text: reply }]);
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

  const handleSpeak = (text: string, idx: number) => {
    if (speakingIdx === idx) {
      speechEngine.stop();
      setSpeakingIdx(null);
      return;
    }

    setSpeakingIdx(idx);
    speechEngine.speak(text, language, {
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
        maxWidth: '460px',
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
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#064e3b' }}>
              {isHindi ? 'सखा से पूछें (Ask Sakha)' : 'Ask Sakha'}
            </h3>
            <p style={{ margin: 0, fontSize: '0.72rem', color: '#047857', fontWeight: 600 }}>
              {isHindi ? 'आपका स्वास्थ्य मित्र • सरल व सुरक्षित' : 'Your Digital Health Companion'}
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
                backgroundColor: m.sender === 'user' ? '#059669' : '#f8fafc',
                color: m.sender === 'user' ? '#ffffff' : '#0f172a',
                padding: '0.75rem 1rem',
                borderRadius: '14px',
                borderBottomRightRadius: m.sender === 'user' ? '2px' : '14px',
                borderBottomLeftRadius: m.sender === 'sakha' ? '2px' : '14px',
                border: m.sender === 'sakha' ? '1px solid #e2e8f0' : 'none',
                fontSize: '0.9rem',
                lineHeight: 1.5,
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              {m.text}
            </div>

            {m.sender === 'sakha' && (
              <button
                type="button"
                onClick={() => handleSpeak(m.text, idx)}
                style={{
                  alignSelf: 'flex-start',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  background: 'none',
                  border: 'none',
                  color: speakingIdx === idx ? '#dc2626' : '#059669',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: '0.1rem 0.3rem'
                }}
              >
                <Volume2 size={13} />
                <span>{speakingIdx === idx ? (isHindi ? 'रोकें' : 'Stop') : (isHindi ? 'सुनकर समझें' : 'Read Aloud')}</span>
              </button>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: '#f1f5f9', borderRadius: '12px' }}>
            <Loader2 size={16} className="spin-animation" color="#059669" />
            <span style={{ fontSize: '0.82rem', color: '#475569' }}>
              {isHindi ? 'सखा सोच रहा है...' : 'Sakha is thinking...'}
            </span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions */}
      <div style={{ padding: '0.5rem 1rem', borderTop: '1px solid #f1f5f9', backgroundColor: '#fafbfc', overflowX: 'auto', whiteSpace: 'nowrap', display: 'flex', gap: '0.5rem' }}>
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '9999px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#1e293b',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <div style={{ padding: '0.75rem 1rem', borderTop: '1.5px solid #e2e8f0', display: 'flex', gap: '0.5rem', backgroundColor: '#ffffff' }}>
        <input
          type="text"
          placeholder={isHindi ? 'सखा से अपना सवाल पूछें...' : 'Ask Sakha a question in Hindi or English...'}
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(inputVal)}
          style={{
            flex: 1,
            padding: '0.65rem 0.9rem',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            fontSize: '0.88rem',
            outline: 'none'
          }}
        />
        <button
          onClick={() => handleSend(inputVal)}
          disabled={!inputVal.trim() || loading}
          style={{
            backgroundColor: '#059669',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            padding: '0.65rem 1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
