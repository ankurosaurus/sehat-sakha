import React, { useState } from 'react';
import { Stethoscope, Volume2, Copy, Check, Printer } from 'lucide-react';

interface DoctorQuestionsProps {
  questionsEn: string[];
  questionsHi: string[];
  language: string;
}

export const DoctorQuestions: React.FC<DoctorQuestionsProps> = ({
  questionsEn,
  questionsHi,
  language
}) => {
  const isHindi = language !== 'English';
  const questions = isHindi ? questionsHi : questionsEn;
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleCopy = () => {
    const text = questions.map((q, i) => `${i + 1}. ${q}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSpeak = () => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = questions.join('. ');
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = isHindi ? 'hi-IN' : 'en-US';
    utterance.rate = 0.92;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handlePrintChecklist = () => {
    window.print();
  };

  if (!questions || questions.length === 0) return null;

  return (
    <div
      style={{
        backgroundColor: '#f0fdf4',
        border: '1.5px solid #86efac',
        borderRadius: '16px',
        padding: '1.35rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.08)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ backgroundColor: '#059669', padding: '0.4rem', borderRadius: '8px', color: '#ffffff', display: 'flex' }}>
            <Stethoscope size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#064e3b' }}>
              {isHindi ? 'डॉक्टर से क्या पूछें? (3 जरूरी सवाल)' : 'Questions for Your Doctor (3 Key Questions)'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#047857', fontWeight: 600 }}>
              {isHindi ? 'अगले क्लिनिक परामर्श के लिए आसान चेकलिस्ट' : 'Consultation checklist for your next clinic visit'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} className="print-hide">
          <button
            type="button"
            onClick={handleSpeak}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: isSpeaking ? '#fee2e2' : '#ffffff',
              color: isSpeaking ? '#dc2626' : '#059669',
              border: '1px solid #a7f3d0',
              padding: '0.4rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Volume2 size={15} />
            <span>{isSpeaking ? (isHindi ? 'रोकें' : 'Stop') : (isHindi ? 'सुनकर समझें' : 'Read Aloud')}</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              padding: '0.4rem 0.75rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {copied ? <><Check size={15} color="#059669" /> {isHindi ? 'कॉपी हो गया' : 'Copied'}</> : <><Copy size={15} /> {isHindi ? 'कॉपी करें' : 'Copy'}</>}
          </button>

          <button
            type="button"
            onClick={handlePrintChecklist}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#059669',
              color: '#ffffff',
              border: 'none',
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <Printer size={15} />
            <span>{isHindi ? 'पर्चे के लिए प्रिंट' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* 3 Questions List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {questions.map((q, idx) => (
          <div
            key={idx}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #bbf7d0',
              borderRadius: '10px',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem'
            }}
          >
            <span
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.85rem',
                flexShrink: 0
              }}
            >
              {idx + 1}
            </span>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#0f172a', fontWeight: 600, lineHeight: 1.45 }}>
              "{q}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
