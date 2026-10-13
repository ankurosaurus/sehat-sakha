import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, Calendar, GitCompare, Info } from 'lucide-react';
import type { LabParameter } from '../types';
import { getHistoricalParameterValues } from '../lib/storage';

interface TrendGraphProps {
  parameters: LabParameter[];
  language: 'English' | 'Hindi';
}

export const TrendGraph: React.FC<TrendGraphProps> = ({ parameters, language }) => {
  const isHindi = language === 'Hindi';

  // Check if any parameter has historical data recorded in storage or on the parameter itself
  const paramsWithHistory: Array<{
    param: LabParameter;
    history: Array<{ date: string; value: number; reportTitle: string }>;
  }> = [];

  for (const p of parameters) {
    const historicalRecords = getHistoricalParameterValues(p.name);
    // If we have records from vault (must have at least 2 points to compare)
    if (historicalRecords.length >= 2) {
      paramsWithHistory.push({
        param: p,
        history: historicalRecords
      });
    } else if (p.previousValue !== undefined && p.previousDate) {
      paramsWithHistory.push({
        param: p,
        history: [
          { date: p.previousDate, value: p.previousValue, reportTitle: 'पिछली रिपोर्ट' },
          { date: 'आज की रिपोर्ट', value: p.value, reportTitle: 'वर्तमान रिपोर्ट' }
        ]
      });
    }
  }

  const [selectedParamIndex, setSelectedParamIndex] = useState<number>(0);

  if (paramsWithHistory.length === 0) {
    return (
      <div
        style={{
          backgroundColor: '#f8fafc',
          border: '1.5px dashed #cbd5e1',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.85rem'
        }}
      >
        <div
          style={{
            backgroundColor: '#e2e8f0',
            color: '#475569',
            padding: '0.5rem',
            borderRadius: '10px',
            display: 'flex',
            flexShrink: 0
          }}
        >
          <Info size={20} />
        </div>
        <div>
          <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
            {isHindi ? 'पिछली रिपोर्ट से तुलना (Historical Comparison):' : 'Historical Trend Comparison:'}
          </h4>
          <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
            {isHindi
              ? 'पिछली रिपोर्ट उपलब्ध होने पर तुलना ग्राफ यहाँ दिखाई देगा। जब आप अपनी दूसरी या पुरानी रिपोर्ट तिजोरी (HealthVault) में सहेजेंगे, तो हम दोनों के बीच का बदलाव यहाँ ग्राफ में दिखाएंगे।'
              : 'Historical comparison graphs will appear here once two or more reports are saved in your HealthVault. As you add past records, trends between tests will be charted automatically.'}
          </p>
        </div>
      </div>
    );
  }

  const activeItem = paramsWithHistory[selectedParamIndex] || paramsWithHistory[0];
  const activeParam = activeItem.param;
  const historyPoints = activeItem.history;
  const prevPoint = historyPoints[0];
  const currPoint = historyPoints[historyPoints.length - 1];

  const prevVal = prevPoint.value;
  const currVal = currPoint.value;
  const delta = +(currVal - prevVal).toFixed(2);
  const hasIncreased = delta > 0;
  const hasDecreased = delta < 0;

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.25rem',
        marginBottom: '1.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <GitCompare size={20} color="#059669" />
          <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            {isHindi ? 'पिछली रिपोर्ट से तुलना (Historical Comparison)' : 'Comparison with Previous Report'}
          </h4>
        </div>

        {/* Parameter Selector Dropdown */}
        {paramsWithHistory.length > 1 && (
          <select
            value={selectedParamIndex}
            onChange={(e) => setSelectedParamIndex(Number(e.target.value))}
            style={{
              padding: '0.4rem 0.75rem',
              borderRadius: '8px',
              border: '1.5px solid #cbd5e1',
              backgroundColor: '#f8fafc',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              color: '#0f172a'
            }}
          >
            {paramsWithHistory.map((item, idx) => (
              <option key={item.param.id} value={idx}>
                {item.param.name} {isHindi && item.param.hindiName ? `(${item.param.hindiName})` : ''}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* 2-Column Comparison Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '0.75rem', alignItems: 'center', marginBottom: '1.25rem' }}>
        {/* Previous Value Card */}
        <div style={{ backgroundColor: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '0.85rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#64748b', marginBottom: '0.3rem' }}>
            <Calendar size={13} />
            <span>{prevPoint.date}</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#334155' }}>
            {prevVal} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748b' }}>{activeParam.unit}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px', fontWeight: 600 }}>
            {isHindi ? 'पिछला परिणाम' : 'Previous Result'}
          </div>
        </div>

        {/* Change Indicator / Arrow */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '0 0.5rem' }}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: hasIncreased ? '#fef2f2' : hasDecreased ? '#eff6ff' : '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `1.5px solid ${hasIncreased ? '#fecaca' : hasDecreased ? '#bfdbfe' : '#cbd5e1'}`
            }}
          >
            {hasIncreased ? (
              <TrendingUp size={20} color="#b91c1c" />
            ) : hasDecreased ? (
              <TrendingDown size={20} color="#0284c7" />
            ) : (
              <Minus size={20} color="#64748b" />
            )}
          </div>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: hasIncreased ? '#b91c1c' : hasDecreased ? '#0284c7' : '#64748b', marginTop: '4px' }}>
            {delta > 0 ? `+${delta}` : `${delta}`}
          </span>
        </div>

        {/* Current Value Card */}
        <div style={{ backgroundColor: '#ecfdf5', border: '1.5px solid #a7f3d0', borderRadius: '12px', padding: '0.85rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#047857', marginBottom: '0.3rem' }}>
            <Calendar size={13} />
            <span>{currPoint.date}</span>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#065f46' }}>
            {currVal} <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#047857' }}>{activeParam.unit}</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: '2px' }}>
            {isHindi ? 'वर्तमान परिणाम' : 'Current Result'}
          </div>
        </div>
      </div>

      {/* SVG Trend Line Visual */}
      <div style={{ backgroundColor: '#fcfdfc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '0.75rem', marginBottom: '0.85rem' }}>
        <svg width="100%" height="60" viewBox="0 0 300 60" preserveAspectRatio="none" style={{ overflow: 'visible' }}>
          {/* Base midline */}
          <line x1="20" y1="30" x2="280" y2="30" stroke="#e2e8f0" strokeDasharray="4 4" strokeWidth="1.5" />
          {/* Trend vector line */}
          <line
            x1="50"
            y1={prevVal < currVal ? "45" : prevVal > currVal ? "15" : "30"}
            x2="250"
            y2={prevVal < currVal ? "15" : prevVal > currVal ? "45" : "30"}
            stroke="#059669"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          {/* Previous node circle */}
          <circle cx="50" cy={prevVal < currVal ? "45" : prevVal > currVal ? "15" : "30"} r="6" fill="#3b82f6" stroke="#ffffff" strokeWidth="2" />
          {/* Current node circle */}
          <circle cx="250" cy={prevVal < currVal ? "15" : prevVal > currVal ? "45" : "30"} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
        </svg>
      </div>

      {/* Factual, Non-judgmental Text Explanation */}
      <p style={{ margin: 0, fontSize: '0.85rem', color: '#334155', lineHeight: 1.5, backgroundColor: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', borderLeft: '3px solid #059669' }}>
        {isHindi ? (
          <>
            <strong>सरल विवरण:</strong> {activeParam.name} ({activeParam.hindiName || ''}) का स्तर पिछली तारीख ({prevPoint.date}) में <strong>{prevVal} {activeParam.unit}</strong> था, जो अब इस रिपोर्ट में <strong>{currVal} {activeParam.unit}</strong> दर्ज हुआ है (बदलाव: {delta > 0 ? `+${delta}` : `${delta}`} {activeParam.unit})। सामान्य संदर्भ सीमा: {activeParam.rangeText}।
          </>
        ) : (
          <>
            <strong>Objective Trend:</strong> For {activeParam.name}, recorded measurement was <strong>{prevVal} {activeParam.unit}</strong> on {prevPoint.date} and is <strong>{currVal} {activeParam.unit}</strong> on this test (delta: {delta > 0 ? `+${delta}` : `${delta}`} {activeParam.unit}). Laboratory reference interval: {activeParam.rangeText}.
          </>
        )}
      </p>
    </div>
  );
};
