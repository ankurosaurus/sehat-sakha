import React from 'react';

export type MascotMood = 'greeting' | 'explaining' | 'thinking' | 'listening' | 'success';

interface SakhaMascotProps {
  mood?: MascotMood;
  size?: number;
  className?: string;
  speechText?: string;
  language?: 'English' | 'Hindi';
}

export const SakhaMascot: React.FC<SakhaMascotProps> = ({
  mood = 'greeting',
  size = 56,
  className = '',
  speechText
}) => {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', verticalAlign: 'middle' }} className={className}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="सखा - आपका स्वास्थ्य मित्र (Sakha Mascot)"
        style={{ flexShrink: 0, filter: 'drop-shadow(0 2px 4px rgba(16, 185, 129, 0.2))' }}
      >
        {/* Soft Aura / Background Circle */}
        <circle cx="50" cy="50" r="46" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="2.5" />

        {/* Mascot Body */}
        <path
          d="M32 78 C32 60, 68 60, 68 78 C68 86, 32 86, 32 78 Z"
          fill="#10b981"
        />

        {/* Caring Emblem / Cross-Leaf on Chest */}
        <circle cx="50" cy="74" r="8" fill="#ffffff" />
        <path d="M50 69 V79 M45 74 H55" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" />

        {/* Mascot Head */}
        <circle cx="50" cy="42" r="24" fill="#10b981" />
        <circle cx="50" cy="42" r="21" fill="#34d399" />

        {/* Warm Ears / Antennas */}
        <circle cx="30" cy="30" r="5" fill="#059669" />
        <circle cx="70" cy="30" r="5" fill="#059669" />

        {/* Big Friendly Eyes */}
        {mood === 'thinking' ? (
          <>
            <circle cx="43" cy="40" r="3.5" fill="#064e3b" />
            <path d="M56 42 Q60 38 64 42" stroke="#064e3b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : mood === 'listening' ? (
          <>
            <path d="M40 41 Q43 37 46 41" stroke="#064e3b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            <path d="M54 41 Q57 37 60 41" stroke="#064e3b" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          </>
        ) : (
          <>
            <circle cx="42" cy="40" r="3.5" fill="#064e3b" />
            <circle cx="58" cy="40" r="3.5" fill="#064e3b" />
            {/* Eye sparkle reflection */}
            <circle cx="43.5" cy="38.5" r="1.2" fill="#ffffff" />
            <circle cx="59.5" cy="38.5" r="1.2" fill="#ffffff" />
          </>
        )}

        {/* Rosy Cheeks */}
        <circle cx="37" cy="45" r="3" fill="#f472b6" opacity="0.6" />
        <circle cx="63" cy="45" r="3" fill="#f472b6" opacity="0.6" />

        {/* Friendly Smile */}
        {mood === 'success' ? (
          <path d="M44 46 Q50 54 56 46" stroke="#064e3b" strokeWidth="2.5" strokeLinecap="round" fill="#ffffff" />
        ) : (
          <path d="M45 47 Q50 52 55 47" stroke="#064e3b" strokeWidth="2.2" strokeLinecap="round" fill="none" />
        )}

        {/* Hand Gesture based on mood */}
        {mood === 'greeting' ? (
          /* Waving Hand */
          <g>
            <path d="M68 64 C74 58, 80 50, 78 45 C75 42, 70 48, 66 56" fill="#10b981" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="78" cy="45" r="3.5" fill="#34d399" />
          </g>
        ) : mood === 'explaining' ? (
          /* Holding a small magnifying lens/report */
          <g>
            <rect x="66" y="52" width="12" height="16" rx="2" fill="#ffffff" stroke="#059669" strokeWidth="1.5" />
            <line x1="69" y1="56" x2="75" y2="56" stroke="#10b981" strokeWidth="1.5" />
            <line x1="69" y1="60" x2="75" y2="60" stroke="#10b981" strokeWidth="1.5" />
          </g>
        ) : mood === 'listening' ? (
          /* Soft headphones */
          <g>
            <path d="M26 42 C26 28, 74 28, 74 42" stroke="#0284c7" strokeWidth="3" strokeLinecap="round" fill="none" />
            <rect x="23" y="38" width="6" height="10" rx="3" fill="#0284c7" />
            <rect x="71" y="38" width="6" height="10" rx="3" fill="#0284c7" />
          </g>
        ) : null}
      </svg>

      {/* Optional Speech Bubble if provided */}
      {speechText && (
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '2px solid #a7f3d0',
            borderRadius: '14px',
            padding: '0.6rem 0.9rem',
            position: 'relative',
            boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
            fontSize: '0.88rem',
            color: '#064e3b',
            lineHeight: 1.45,
            fontWeight: 500
          }}
        >
          {speechText}
        </div>
      )}
    </div>
  );
};
