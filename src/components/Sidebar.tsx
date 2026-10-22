import React from 'react';
import {
  Home,
  UploadCloud,
  FolderHeart,
  BarChart2,
  MessageSquareHeart,
  Languages,
  Settings,
  X
} from 'lucide-react';
import { SakhaMascot } from './SakhaMascot';

export type NavView = 'home' | 'upload' | 'vault' | 'detailed' | 'sakha' | 'language' | 'settings';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: NavView;
  onNavigate: (view: NavView) => void;
  hasActiveReport: boolean;
  language: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  activeView,
  onNavigate,
  hasActiveReport,
  language
}) => {
  const isHindi = language !== 'English';

  const menuItems: Array<{
    id: NavView;
    labelHi: string;
    labelEn: string;
    descHi: string;
    descEn: string;
    icon: React.ReactNode;
    disabled?: boolean;
    badge?: string;
  }> = [
    {
      id: 'home',
      labelHi: 'मुख्य पृष्ठ (होम)',
      labelEn: 'Home',
      descHi: 'सखा का मुख्य द्वार',
      descEn: 'Overview & Starting Point',
      icon: <Home size={20} />
    },
    {
      id: 'upload',
      labelHi: 'रिपोर्ट अपलोड करें',
      labelEn: 'Upload Report',
      descHi: 'फोटो या PDF जांचें',
      descEn: 'Camera Photo or PDF',
      icon: <UploadCloud size={20} />
    },
    {
      id: 'vault',
      labelHi: 'मेरी रिपोर्ट्स (तिजोरी)',
      labelEn: 'My Reports (HealthVault)',
      descHi: 'सहेजे गए सभी पर्चे',
      descEn: 'Saved Medical Records',
      icon: <FolderHeart size={20} />
    },
    {
      id: 'detailed',
      labelHi: 'विस्तृत विश्लेषण व ग्राफ',
      labelEn: 'Detailed Analysis & Graphs',
      descHi: 'संख्याएं व गेज चार्ट',
      descEn: 'Full Numbers & Indicators',
      icon: <BarChart2 size={20} />,
      disabled: !hasActiveReport,
      badge: !hasActiveReport ? (isHindi ? 'रिपोर्ट आवश्यक' : 'Needs Report') : undefined
    },
    {
      id: 'sakha',
      labelHi: 'सखा से सवाल पूछें',
      labelEn: 'Ask Sakha Assistant',
      descHi: 'आवाज़ या चैट में पूछें',
      descEn: 'Voice or Chat Guidance',
      icon: <MessageSquareHeart size={20} />
    },
    {
      id: 'language',
      labelHi: 'भाषा बदलें (Language)',
      labelEn: 'Languages of India',
      descHi: '22 संवैधानिक भाषाएं',
      descEn: '22 Eighth Schedule Languages',
      icon: <Languages size={20} />
    },
    {
      id: 'settings',
      labelHi: 'सेटिंग्स व API कुंजी',
      labelEn: 'Settings & API Key',
      descHi: 'कुंजी व सिस्टम स्थिति',
      descEn: 'Gemini Key & Controls',
      icon: <Settings size={20} />
    }
  ];

  return (
    <>
      {/* Backdrop for mobile drawer */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            zIndex: 998,
            backdropFilter: 'blur(3px)',
            transition: 'opacity 0.25s ease'
          }}
        />
      )}

      {/* Slide-out Sidebar Drawer */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          width: '310px',
          maxWidth: '85vw',
          backgroundColor: '#ffffff',
          zIndex: 999,
          boxShadow: '4px 0 24px rgba(0, 0, 0, 0.15)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          borderRight: '1.5px solid #e2e8f0'
        }}
      >
        {/* Sidebar Header */}
        <div
          style={{
            padding: '1.25rem 1.25rem 1rem 1.25rem',
            borderBottom: '1.5px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <SakhaMascot size={38} mood="greeting" />
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 900, color: '#064e3b', margin: 0, letterSpacing: '-0.3px' }}>
                सेहत सखा
              </h2>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#047857', fontWeight: 700 }}>
                Aapki Report, Aapki Bhasha
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '0.4rem',
              cursor: 'pointer',
              color: '#475569',
              display: 'flex'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Menu Navigation Items */}
        <nav style={{ flex: 1, padding: '0.85rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          {menuItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!item.disabled) {
                    onNavigate(item.id);
                    onClose();
                  }
                }}
                disabled={item.disabled}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem 0.85rem',
                  borderRadius: '12px',
                  border: isActive ? '1.5px solid #a7f3d0' : '1px solid transparent',
                  backgroundColor: isActive ? '#ecfdf5' : 'transparent',
                  color: item.disabled ? '#94a3b8' : isActive ? '#065f46' : '#1e293b',
                  cursor: item.disabled ? 'not-allowed' : 'pointer',
                  textAlign: 'left',
                  transition: 'background-color 0.15s ease',
                  opacity: item.disabled ? 0.6 : 1
                }}
              >
                <div
                  style={{
                    color: isActive ? '#059669' : item.disabled ? '#94a3b8' : '#64748b',
                    display: 'flex'
                  }}
                >
                  {item.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800 }}>
                    {isHindi ? item.labelHi : item.labelEn}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: isActive ? '#047857' : '#64748b', fontWeight: 500 }}>
                    {isHindi ? item.descHi : item.descEn}
                  </div>
                </div>
                {item.badge && (
                  <span
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      padding: '0.15rem 0.45rem',
                      borderRadius: '6px',
                      backgroundColor: '#f1f5f9',
                      color: '#64748b'
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer in Sidebar */}
        <div
          style={{
            padding: '1rem 1.25rem',
            borderTop: '1.5px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            fontSize: '0.75rem',
            color: '#64748b'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />
            <span style={{ fontWeight: 700, color: '#0f172a' }}>ग्रामीण स्वास्थ्य साथी सक्रिय</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.72rem', lineHeight: 1.4 }}>
            सुरक्षित एवं गोपनीय। कोई व्यक्तिगत डेटा साझा नहीं होता।
          </p>
        </div>
      </aside>
    </>
  );
};
