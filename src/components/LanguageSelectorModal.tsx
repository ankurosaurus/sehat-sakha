import React, { useState, useEffect } from 'react';
import { Languages, X, Check, Volume2, Search, Sparkles } from 'lucide-react';
import { INDIAN_LANGUAGES, checkBrowserVoiceSupport, type LanguageInfo } from '../lib/languages';
import { speechEngine } from '../lib/speech';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (lang: string) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const isHindi = currentLanguage === 'Hindi';

  useEffect(() => {
    if (isOpen) {
      setAvailableVoices(speechEngine.getVoices());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filtered = INDIAN_LANGUAGES.filter(
    l =>
      l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.script.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(3px)'
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '740px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1.5px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '0.5rem', borderRadius: '10px' }}>
              <Languages size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#064e3b' }}>
                  {isHindi ? 'भारत की 22 आधिकारिक भाषाएं (8वीं अनुसूची)' : '22 Official Languages of India'}
                </h3>
                <span
                  style={{
                    backgroundColor: '#dbeafe',
                    color: '#1e40af',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <Sparkles size={11} /> भाषिणी AI संचालित
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                {isHindi
                  ? 'अपनी पसंदीदा भाषा चुनें — सरल अनुवाद, दृश्य रिपोर्ट और डिजिटल इंडिया भाषिणी आवाज़ उपलब्ध'
                  : 'Select your preferred language — Simplified explanations and Bhashini AI voice ready'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748b',
              padding: '0.4rem',
              borderRadius: '8px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div style={{ padding: '1rem 1.5rem 0.5rem 1.5rem' }}>
          <div style={{ position: 'relative' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={isHindi ? 'भाषा या लिपि खोजें (उदा: हिन्दी, বাংলা, தமிழ், मराठी, తెలుగు)...' : 'Search language or script (e.g. Hindi, Bengali, Tamil, Telugu, Marathi)...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Language Grid */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1rem 1.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '0.75rem'
          }}
        >
          {filtered.map((lang: LanguageInfo) => {
            const isSelected =
              currentLanguage.toLowerCase() === lang.name.toLowerCase() ||
              currentLanguage.toLowerCase() === lang.code.toLowerCase();
            const hasBrowserVoice = checkBrowserVoiceSupport(lang.bcp47, availableVoices);

            return (
              <div
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.name);
                  onClose();
                }}
                style={{
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #059669' : '1.5px solid #e2e8f0',
                  backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                      {lang.nativeName}
                    </span>{' '}
                    <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
                      ({lang.name})
                    </span>
                  </div>
                  {isSelected && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#059669', fontSize: '0.75rem', fontWeight: 800 }}>
                      <Check size={16} /> सक्रिय
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                  <span style={{ color: '#64748b' }}>
                    लिपि: <strong>{lang.script}</strong>
                  </span>

                  <span
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: '#dcfce7',
                      color: '#15803d'
                    }}
                  >
                    <Volume2 size={12} /> भाषिणी AI
                  </span>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#047857', fontWeight: 500 }}>
                  {isHindi ? lang.statusNoteHi : lang.statusNoteEn}
                  {hasBrowserVoice && ' • डिवाइस आवाज़'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div
          style={{
            padding: '0.85rem 1.5rem',
            borderTop: '1.5px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            fontSize: '0.78rem',
            color: '#64748b',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <span>
            🇮🇳 <strong>डिजिटल इंडिया भाषिणी (Digital India Bhashini)</strong> — राष्ट्रीय भाषा अनुवाद मिशन द्वारा समर्थित।
          </span>
          <button
            onClick={onClose}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
          >
            {isHindi ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
