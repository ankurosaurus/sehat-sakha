import React, { useState } from 'react';
import { PieChart, CheckCircle2, AlertTriangle, AlertCircle, HelpCircle } from 'lucide-react';
import type { LabParameter } from '../types';

interface HealthPieChartProps {
  parameters: LabParameter[];
  language: 'English' | 'Hindi';
}

export const HealthPieChart: React.FC<HealthPieChartProps> = ({ parameters, language }) => {
  const isHindi = language === 'Hindi';
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  if (!parameters || parameters.length === 0) return null;

  const total = parameters.length;
  const normal = parameters.filter(p => p.status === 'normal').length;
  const low = parameters.filter(p => p.status === 'low').length;
  const high = parameters.filter(p => p.status === 'high').length;
  const indeterminate = parameters.filter(p => p.status === 'indeterminate').length;

  const normalPct = Math.round((normal / total) * 100);
  const lowPct = Math.round((low / total) * 100);
  const highPct = Math.round((high / total) * 100);
  const indetPct = Math.round((indeterminate / total) * 100);

  // SVG Donut calculation
  // Radius = 65, Circumference = 2 * PI * 65 ≈ 408.4
  const radius = 65;
  const circumference = 2 * Math.PI * radius;

  const slices = [
    {
      id: 'normal',
      labelHi: 'सामान्य (Normal)',
      labelEn: 'Normal Baseline',
      count: normal,
      pct: normalPct,
      color: '#10b981', // Emerald green
      hoverColor: '#059669',
      dashLength: (normal / total) * circumference,
      icon: <CheckCircle2 size={16} color="#10b981" />
    },
    {
      id: 'low',
      labelHi: 'सामान्य से कम (Low)',
      labelEn: 'Below Range',
      count: low,
      pct: lowPct,
      color: '#f59e0b', // Amber
      hoverColor: '#d97706',
      dashLength: (low / total) * circumference,
      icon: <AlertTriangle size={16} color="#f59e0b" />
    },
    {
      id: 'high',
      labelHi: 'सामान्य से अधिक (High)',
      labelEn: 'Above Range',
      count: high,
      pct: highPct,
      color: '#ef4444', // Red
      hoverColor: '#dc2626',
      dashLength: (high / total) * circumference,
      icon: <AlertCircle size={16} color="#ef4444" />
    },
    {
      id: 'indeterminate',
      labelHi: 'अनिर्णीत (Check)',
      labelEn: 'Indeterminate',
      count: indeterminate,
      pct: indetPct,
      color: '#94a3b8', // Gray
      hoverColor: '#64748b',
      dashLength: (indeterminate / total) * circumference,
      icon: <HelpCircle size={16} color="#94a3b8" />
    }
  ].filter(s => s.count > 0);

  // Calculate cumulative offsets
  let accumulatedOffset = 0;
  const renderedSlices = slices.map(s => {
    const offset = accumulatedOffset;
    accumulatedOffset += s.dashLength;
    return {
      ...s,
      dashOffset: -offset
    };
  });

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.04)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '0.45rem', borderRadius: '10px', display: 'flex' }}>
            <PieChart size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#064e3b' }}>
              {isHindi ? 'रिपोर्ट स्वास्थ्य संतुलन (पाई चार्ट / Pie Chart)' : 'Health Balance Pie Chart'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
              {isHindi ? 'सभी जांचे गए मापदंडों का रंगीन अनुपात' : 'Visual distribution of your measured test parameters'}
            </p>
          </div>
        </div>

        <span
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '0.2rem 0.65rem',
            borderRadius: '20px',
            backgroundColor: normalPct >= 70 ? '#dcfce7' : '#fef3c7',
            color: normalPct >= 70 ? '#15803d' : '#b45309',
            border: `1px solid ${normalPct >= 70 ? '#bbf7d0' : '#fde68a'}`
          }}
        >
          {normalPct}% {isHindi ? 'मापदंड सामान्य' : 'Within Normal Range'}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', alignItems: 'center' }}>
        {/* SVG Donut Chart */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
            {/* Background ring */}
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="24"
            />

            {/* Slices */}
            {renderedSlices.map((slice) => {
              const isHovered = hoveredSlice === slice.id;
              return (
                <circle
                  key={slice.id}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke={isHovered ? slice.hoverColor : slice.color}
                  strokeWidth={isHovered ? "28" : "24"}
                  strokeDasharray={`${slice.dashLength} ${circumference}`}
                  strokeDashoffset={slice.dashOffset}
                  strokeLinecap="round"
                  style={{
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                  onMouseEnter={() => setHoveredSlice(slice.id)}
                  onMouseLeave={() => setHoveredSlice(null)}
                />
              );
            })}
          </svg>

          {/* Center Metric Label */}
          <div
            style={{
              position: 'absolute',
              textAlign: 'center',
              pointerEvents: 'none',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}
          >
            <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#064e3b', lineHeight: 1 }}>
              {total}
            </span>
            <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '2px' }}>
              {isHindi ? 'कुल जांचें' : 'Total Tests'}
            </span>
          </div>
        </div>

        {/* Legend Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {slices.map((slice) => {
            const isHovered = hoveredSlice === slice.id;
            return (
              <div
                key={slice.id}
                onMouseEnter={() => setHoveredSlice(slice.id)}
                onMouseLeave={() => setHoveredSlice(null)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '10px',
                  border: isHovered ? `1.5px solid ${slice.color}` : '1.5px solid #e2e8f0',
                  backgroundColor: isHovered ? '#f8fafc' : '#ffffff',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span
                    style={{
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      backgroundColor: slice.color,
                      display: 'inline-block'
                    }}
                  />
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                    {isHindi ? slice.labelHi : slice.labelEn}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: slice.color }}>
                    {slice.count} {isHindi ? 'जांचें' : 'items'}
                  </span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', backgroundColor: '#f1f5f9', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    {slice.pct}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grounded Rural Plain Hindi Explanation */}
      <div
        style={{
          marginTop: '1.25rem',
          backgroundColor: '#f8fafc',
          borderLeft: '4px solid #10b981',
          padding: '0.75rem 1rem',
          borderRadius: '8px',
          fontSize: '0.85rem',
          color: '#334155',
          lineHeight: 1.5
        }}
      >
        <strong>{isHindi ? 'सखा की सलाह:' : 'Sakha Summary:'}</strong>{' '}
        {isHindi
          ? `आपकी रिपोर्ट में कुल ${total} में से ${normal} मापदंड (${normalPct}%) पूरी तरह सामान्य सीमा में हैं। ${
              high + low > 0
                ? `${high + low} मापदंडों में थोड़ा उतार-चढ़ाव दिखा है, जिस पर डॉक्टर से साधारण परामर्श लें।`
                : 'सभी मापदंड संतुलित हैं।'
            }`
          : `${normal} out of ${total} measured indicators (${normalPct}%) are firmly within expected normal bounds. ${
              high + low > 0
                ? `${high + low} indicator(s) show minor variation suitable for routine clinical review.`
                : 'All parameters reflect steady baseline balance.'
            }`}
      </div>
    </div>
  );
};
