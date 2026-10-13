import { MessageSquare } from 'lucide-react';
import type { LabParameter } from '../types';
import { calculateRangePosition, getStatusDisplay } from '../lib/referenceEngine';

interface RangeIndicatorProps {
  param: LabParameter;
  language: 'English' | 'Hindi';
  onAskSakha?: (param: LabParameter) => void;
}

export const RangeIndicator: React.FC<RangeIndicatorProps> = ({ param, language, onAskSakha }) => {
  const isHindi = language === 'Hindi';
  const statusDisplay = getStatusDisplay(param.status, language);
  const positionPercent = calculateRangePosition(param.value, param.rangeLow, param.rangeHigh);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: `1.5px solid ${param.status === 'normal' ? '#e2e8f0' : statusDisplay.borderColor}`,
        borderRadius: '14px',
        padding: '1.15rem',
        marginBottom: '1rem',
        boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Parameter Header: Name, Value, Status Badge */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              {param.name}
            </h4>
            {param.hindiName && (
              <span style={{ fontSize: '0.85rem', color: '#475569', fontWeight: 500 }}>
                ({param.hindiName})
              </span>
            )}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
            {isHindi ? 'प्रयोगशाला सामान्य सीमा:' : 'Lab Reference Range:'} <strong>{param.rangeText || 'उपलब्ध नहीं'}</strong>
          </div>
        </div>

        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
          <div style={{ fontSize: '1.35rem', fontWeight: 800, color: statusDisplay.color, lineHeight: 1 }}>
            {param.value} <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>{param.unit}</span>
          </div>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor: statusDisplay.bgColor,
              color: statusDisplay.color,
              border: `1px solid ${statusDisplay.borderColor}`
            }}
          >
            {statusDisplay.label}
          </span>
        </div>
      </div>

      {/* Visual 3-Zone Range Bar with Needle Indicator */}
      <div style={{ margin: '1.1rem 0 0.85rem 0' }}>
        <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
          {/* Background 3 Segments */}
          <div
            style={{
              width: '100%',
              height: '10px',
              borderRadius: '6px',
              display: 'flex',
              overflow: 'hidden',
              backgroundColor: '#f1f5f9'
            }}
          >
            {/* Low Zone (33%) */}
            <div style={{ width: '33%', backgroundColor: '#fef3c7', borderRight: '1px solid #ffffff' }} title="Below Range" />
            {/* Normal Green Zone (34%) */}
            <div style={{ width: '34%', backgroundColor: '#dcfce7', borderRight: '1px solid #ffffff' }} title="Normal Range" />
            {/* High Zone (33%) */}
            <div style={{ width: '33%', backgroundColor: '#fee2e2' }} title="Above Range" />
          </div>

          {/* Value Needle / Marker */}
          <div
            style={{
              position: 'absolute',
              left: `${positionPercent}%`,
              transform: 'translateX(-50%)',
              top: '-3px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              zIndex: 5
            }}
          >
            <div
              style={{
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: statusDisplay.color,
                border: '2.5px solid #ffffff',
                boxShadow: '0 2px 4px rgba(0,0,0,0.25)'
              }}
            />
            <div
              style={{
                width: '2px',
                height: '14px',
                backgroundColor: statusDisplay.color
              }}
            />
          </div>
        </div>

        {/* 3 Zone Text Labels Below Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>
          <span style={{ color: '#b45309' }}>{isHindi ? 'कम (Low)' : 'Below Range'}</span>
          <span style={{ color: '#15803d', textAlign: 'center' }}>{isHindi ? '✓ सामान्य (Normal Range)' : '✓ Healthy Normal'}</span>
          <span style={{ color: '#b91c1c', textAlign: 'right' }}>{isHindi ? 'अधिक (High)' : 'Above Range'}</span>
        </div>
      </div>

      {/* Human Plain-Language Explanation */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          borderLeft: `3px solid ${statusDisplay.color}`,
          padding: '0.65rem 0.85rem',
          borderRadius: '4px',
          fontSize: '0.85rem',
          color: '#334155',
          lineHeight: 1.5,
          marginTop: '0.65rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem'
        }}
      >
        <p style={{ margin: 0, flex: 1, minWidth: '220px' }}>
          {isHindi ? param.simpleExplanationHi : param.simpleExplanationEn}
        </p>

        {onAskSakha && (
          <button
            type="button"
            onClick={() => onAskSakha(param)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              padding: '0.35rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              flexShrink: 0
            }}
            title={isHindi ? 'सखा से इस टेस्ट के बारे में पूछें' : 'Ask Sakha about this parameter'}
          >
            <MessageSquare size={13} color="#059669" />
            <span>{isHindi ? 'सखा से पूछें' : 'Ask Sakha'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
