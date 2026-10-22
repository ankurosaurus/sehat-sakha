import React, { useState, useEffect } from 'react';
import {
  Volume2,
  VolumeX,
  Pause,
  Play,
  Printer,
  Copy,
  Check,
  FolderHeart,
  BookmarkCheck,
  BarChart2,
  ShieldAlert,
  HelpCircle,
  Activity,
  HeartPulse
} from 'lucide-react';
import type { ReportSummary } from '../types';
import { DoctorQuestions } from './DoctorQuestions';
import { speechEngine, type SpeechControllerState } from '../lib/speech';

interface SimpleExplanationViewProps {
  report: ReportSummary;
  language: string;
  onOpenDetailed: () => void;
  onSaveToVault: () => void;
  savedInVault: boolean;
}

export const SimpleExplanationView: React.FC<SimpleExplanationViewProps> = ({
  report,
  language,
  onOpenDetailed,
  onSaveToVault,
  savedInVault
}) => {
  const isHindi = language !== 'English';
  const [copied, setCopied] = useState(false);

  // Audio Playback State
  const [speechState, setSpeechState] = useState<SpeechControllerState>({
    isPlaying: false,
    isPaused: false,
    currentSentenceIndex: 0,
    totalSentences: 0,
    currentText: ''
  });
  const [activeSentence, setActiveSentence] = useState<string>('');

  useEffect(() => {
    return () => {
      speechEngine.stop();
    };
  }, [report.id]);

  const handleStartSpeaking = () => {
    if (speechState.isPlaying && !speechState.isPaused) {
      speechEngine.pause();
      setSpeechState(prev => ({ ...prev, isPaused: true }));
      return;
    }

    if (speechState.isPlaying && speechState.isPaused) {
      speechEngine.resume();
      setSpeechState(prev => ({ ...prev, isPaused: false }));
      return;
    }

    const narrative = isHindi ? report.overallSummaryHi : report.overallSummaryEn;
    const voiceInfo = speechEngine.speak(narrative, language, {
      onSentence: (idx, total, text) => {
        setSpeechState({
          isPlaying: true,
          isPaused: false,
          currentSentenceIndex: idx + 1,
          totalSentences: total,
          currentText: text
        });
        setActiveSentence(text);
      },
      onEnd: () => {
        setSpeechState({
          isPlaying: false,
          isPaused: false,
          currentSentenceIndex: 0,
          totalSentences: 0,
          currentText: ''
        });
        setActiveSentence('');
      },
      onError: (err) => {
        alert(err);
        setSpeechState({
          isPlaying: false,
          isPaused: false,
          currentSentenceIndex: 0,
          totalSentences: 0,
          currentText: ''
        });
      }
    });

    if (!voiceInfo.hasVoice && isHindi) {
      console.info('Using system fallback speech synthesiser for Hindi audio.');
    }
  };

  const handleStopSpeaking = () => {
    speechEngine.stop();
    setSpeechState({
      isPlaying: false,
      isPaused: false,
      currentSentenceIndex: 0,
      totalSentences: 0,
      currentText: ''
    });
    setActiveSentence('');
  };

  const handleCopy = () => {
    const textToCopy = isHindi ? report.overallSummaryHi : report.overallSummaryEn;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // Derive plain overview count
  const abnormalCount = report.parameters.filter(p => p.status !== 'normal').length;

  return (
    <div className="results-card" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0' }}>
      {/* Top Meta Bar */}
      <div
        className="print-hide"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.85rem',
          paddingBottom: '1.25rem',
          borderBottom: '1.5px solid #e2e8f0'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#047857', backgroundColor: '#d1fae5', padding: '0.2rem 0.55rem', borderRadius: '6px' }}>
              {isHindi ? 'सरल भाषा मोड (आसान विवरण)' : 'Simple Explanation Mode'}
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', backgroundColor: '#dcfce7', padding: '0.2rem 0.55rem', borderRadius: '6px', border: '1px solid #bbf7d0', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              ✓ {isHindi ? `मेरी रिपोर्ट्स में स्वतः सहेजा गया: ${report.collectionDate}` : `Auto-saved to My Reports: ${report.collectionDate}`}
            </span>
          </div>
          <h2 style={{ margin: '0.3rem 0 0.15rem 0', fontSize: '1.35rem', fontWeight: 900, color: '#064e3b' }}>
            {isHindi ? report.hindiTitle || report.title : report.title}
          </h2>
          <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            {report.labName} • {report.collectionDate} • {report.patientName}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button
            onClick={handleCopy}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.55rem 0.9rem' }}
          >
            {copied ? <><Check size={16} color="#059669" /> {isHindi ? 'कॉपी हुआ!' : 'Copied!'}</> : <><Copy size={16} /> {isHindi ? 'कॉपी करें' : 'Copy'}</>}
          </button>

          <button
            onClick={onSaveToVault}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.55rem 0.9rem', color: savedInVault ? '#059669' : '#0f172a' }}
          >
            {savedInVault ? <><BookmarkCheck size={16} color="#059669" /> {isHindi ? 'सहेजा गया' : 'Saved'}</> : <><FolderHeart size={16} /> {isHindi ? 'तिजोरी में रखें' : 'Save'}</>}
          </button>

          <button
            onClick={() => window.print()}
            className="btn btn-secondary"
            style={{ fontSize: '0.85rem', padding: '0.55rem 0.9rem' }}
          >
            <Printer size={16} /> {isHindi ? 'प्रिंट' : 'Print'}
          </button>
        </div>
      </div>

      {/* Medical Safety Notice */}
      <div className="disclaimer-banner" style={{ margin: '1.25rem 0' }}>
        <ShieldAlert size={26} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p style={{ fontWeight: 800, marginBottom: '0.2rem', color: '#991b1b', fontSize: '0.92rem' }}>
            {isHindi ? 'जरूरी स्वास्थ्य सूचना (Important Medical Notice)' : 'Important Medical Notice'}
          </p>
          <p style={{ margin: 0, fontSize: '0.84rem', lineHeight: 1.45 }}>
            {isHindi
              ? 'यह सरल विवरण केवल आपकी जानकारी और डॉक्टर से बातचीत की तैयारी के लिए है। यह किसी बीमारी का निदान या दवा की सलाह नहीं है।'
              : 'This simplified guide is for your understanding and doctor consultation preparation. It does not diagnose diseases or prescribe treatment.'}
          </p>
        </div>
      </div>

      {/* Voiceover Audio Player Bar */}
      <div
        className="print-hide"
        style={{
          backgroundColor: '#f0fdf4',
          border: '1.5px solid #a7f3d0',
          borderRadius: '14px',
          padding: '1rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ backgroundColor: '#059669', color: '#ffffff', padding: '0.5rem', borderRadius: '50%', display: 'flex' }}>
              <Volume2 size={20} />
            </div>
            <div>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#064e3b' }}>
                {isHindi ? 'सखा की आवाज़ में सुनें (Listen in Plain Hindi)' : 'Listen to Report Explanation'}
              </h4>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#047857', fontWeight: 600 }}>
                {speechState.isPlaying
                  ? (isHindi
                      ? `वाक्य ${speechState.currentSentenceIndex} / ${speechState.totalSentences} पढ़ा जा रहा है...`
                      : `Reading sentence ${speechState.currentSentenceIndex} of ${speechState.totalSentences}...`)
                  : (isHindi ? 'पूरी रिपोर्ट को साफ़ और धीमी आवाज़ में सुनें' : 'Listen aloud at a gentle, clear pace')}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={handleStartSpeaking}
              className="btn btn-success"
              style={{ fontSize: '0.88rem', padding: '0.55rem 1.15rem' }}
            >
              {speechState.isPlaying && !speechState.isPaused ? (
                <><Pause size={16} /> {isHindi ? 'रोकें (Pause)' : 'Pause'}</>
              ) : speechState.isPlaying && speechState.isPaused ? (
                <><Play size={16} /> {isHindi ? 'जारी रखें (Resume)' : 'Resume'}</>
              ) : (
                <><Volume2 size={16} /> {isHindi ? 'सुनना शुरू करें' : 'Play Audio'}</>
              )}
            </button>

            {speechState.isPlaying && (
              <button
                onClick={handleStopSpeaking}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.55rem 0.85rem', color: '#dc2626' }}
              >
                <VolumeX size={16} /> {isHindi ? 'बंद करें' : 'Stop'}
              </button>
            )}
          </div>
        </div>

        {/* Live Sentence Subtitle / Highlighting for elderly & rural users */}
        {activeSentence && (
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #bbf7d0',
              borderRadius: '8px',
              padding: '0.75rem 1rem',
              fontSize: '0.92rem',
              fontWeight: 700,
              color: '#065f46',
              lineHeight: 1.5
            }}
          >
            🔊 "{activeSentence}"
          </div>
        )}
      </div>

      {/* Plain Language 3 Core Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Card 1: What is this test? */}
        <div style={{ backgroundColor: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
              <HelpCircle size={18} />
            </div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              {isHindi ? '1. यह जांच किस बारे में है?' : '1. What is this test about?'}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.55 }}>
            {isHindi
              ? `यह ${report.hindiTitle || report.title} है। यह शरीर में खून के मुख्य घटकों, पोषण स्तर और बुनियादी स्वास्थ्य की जांच करता है।`
              : `This is a ${report.title}. It assesses fundamental blood counts, vital organ balance, and baseline well-being.`}
          </p>
        </div>

        {/* Card 2: What my report shows */}
        <div style={{ backgroundColor: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <div style={{ backgroundColor: abnormalCount === 0 ? '#ecfdf5' : '#fef2f2', color: abnormalCount === 0 ? '#059669' : '#dc2626', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
              <Activity size={18} />
            </div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              {isHindi ? '2. मेरी रिपोर्ट में क्या आया है?' : '2. What does my report show?'}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.55 }}>
            {isHindi ? (
              abnormalCount === 0 ? (
                'आपकी सभी जांची गई संख्याएं लैब की सामान्य सीमा के भीतर हैं। कोई चिंताजनक उतार-चढ़ाव नहीं दिखा।'
              ) : (
                `कुल ${report.parameters.length} में से ${abnormalCount} मापदंड सामान्य सीमा से थोड़े अलग हैं। डॉक्टर से इस पर सामान्य चर्चा करें।`
              )
            ) : (
              abnormalCount === 0 ? (
                'All measured indicators fall within standard laboratory reference limits.'
              ) : (
                `${abnormalCount} out of ${report.parameters.length} indicators require routine physician review.`
              )
            )}
          </p>
        </div>

        {/* Card 3: What normal range means */}
        <div style={{ backgroundColor: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.65rem' }}>
            <div style={{ backgroundColor: '#fef3c7', color: '#d97706', padding: '0.4rem', borderRadius: '8px', display: 'flex' }}>
              <HeartPulse size={18} />
            </div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              {isHindi ? '3. सामान्य सीमा का क्या मतलब है?' : '3. What does normal range mean?'}
            </h4>
          </div>
          <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.55 }}>
            {isHindi
              ? 'लैब की सामान्य सीमा स्वस्थ लोगों के औसत पर तय होती है। थोड़ा अंतर भोजन, पानी या नींद से भी हो सकता है, इसलिए घबराएं नहीं।'
              : 'Reference ranges represent averages in healthy populations. Minor variations can occur due to hydration, diet, or rest.'}
          </p>
        </div>
      </div>

      {/* 3 Doctor Questions Checklist */}
      <DoctorQuestions
        questionsEn={report.doctorQuestionsEn}
        questionsHi={report.doctorQuestionsHi}
        language={language}
      />

      {/* PROMINENT TRANSITION BUTTON: Detailed Analysis aur Graphs */}
      <div
        className="print-hide"
        style={{
          marginTop: '2rem',
          backgroundColor: '#f0fdf4',
          border: '2px solid #059669',
          borderRadius: '16px',
          padding: '1.5rem',
          textAlign: 'center',
          boxShadow: '0 4px 16px rgba(5, 150, 105, 0.12)'
        }}
      >
        <h3 style={{ margin: '0 0 0.4rem 0', fontSize: '1.2rem', fontWeight: 900, color: '#064e3b' }}>
          {isHindi ? 'क्या आप संख्याएं और रंगीन ग्राफ देखना चाहते हैं?' : 'Want to explore exact numbers and visual charts?'}
        </h3>
        <p style={{ margin: '0 auto 1.25rem auto', color: '#166534', fontSize: '0.9rem', maxWidth: '520px', lineHeight: 1.5 }}>
          {isHindi
            ? 'विस्तृत विश्लेषण में हर जांच का रंगीन गेज मीटर, पिछली रिपोर्ट से तुलना और सभी मेडिकल नंबर उपलब्ध हैं।'
            : 'Explore gauge indicators for every parameter, baseline comparisons, and full reference intervals.'}
        </p>

        <button
          onClick={onOpenDetailed}
          className="btn btn-success"
          style={{
            fontSize: '1.05rem',
            padding: '0.85rem 2rem',
            fontWeight: 800,
            boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
            margin: '0 auto'
          }}
        >
          <BarChart2 size={20} />
          <span>{isHindi ? 'Detailed Analysis aur Graphs (विस्तृत विश्लेषण देखें)' : 'Detailed Analysis & Graphs'}</span>
        </button>
      </div>
    </div>
  );
};
