import React, { useState } from 'react';
import { Building2, Info, ArrowUpRight, ArrowDownRight, Check } from 'lucide-react';
import type { LabParameter } from '../types';

interface BuildingBarGraphProps {
  parameters: LabParameter[];
  language: 'English' | 'Hindi';
  onSelectParam?: (param: LabParameter) => void;
}

export const BuildingBarGraph: React.FC<BuildingBarGraphProps> = ({
  parameters,
  language,
  onSelectParam
}) => {
  const isHindi = language === 'Hindi';
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!parameters || parameters.length === 0) return null;

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
      {/* Title & Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <div style={{ backgroundColor: '#eff6ff', color: '#2563eb', padding: '0.45rem', borderRadius: '10px', display: 'flex' }}>
            <Building2 size={22} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#064e3b' }}>
              {isHindi ? 'मापदंड स्तंभ ग्राफ (Building Bar Chart)' : 'Comparative Building Bar Chart'}
            </h4>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
              {isHindi ? 'हर जांच की इमारत सामान्य सीमा की तुलना में' : 'Visualizing each parameter as an architectural health pillar'}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem', fontWeight: 700 }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#059669' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#10b981' }} />
            {isHindi ? 'सामान्य' : 'Normal'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#d97706' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#f59e0b' }} />
            {isHindi ? 'कम' : 'Low'}
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#dc2626' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#ef4444' }} />
            {isHindi ? 'अधिक' : 'High'}
          </span>
        </div>
      </div>

      {/* Buildings Container (Horizontally Scrollable if many parameters) */}
      <div
        style={{
          overflowX: 'auto',
          paddingBottom: '0.75rem',
          paddingTop: '1rem'
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: '1.25rem',
            alignItems: 'flex-end',
            minHeight: '260px',
            padding: '0 0.5rem',
            borderBottom: '3px solid #cbd5e1'
          }}
        >
          {parameters.map((param) => {
            const isSelected = selectedId === param.id;

            // Compute normalized height percentage (between 25% and 95%)
            let fillHeightPct = 60; // default for normal
            let color = '#10b981';
            let statusBadge = isHindi ? 'सामान्य' : 'Normal';
            let icon = <Check size={12} color="#ffffff" />;

            if (param.status === 'low') {
              fillHeightPct = 32;
              color = '#f59e0b';
              statusBadge = isHindi ? 'कम' : 'Low';
              icon = <ArrowDownRight size={12} color="#ffffff" />;
            } else if (param.status === 'high') {
              fillHeightPct = 94;
              color = '#ef4444';
              statusBadge = isHindi ? 'अधिक' : 'High';
              icon = <ArrowUpRight size={12} color="#ffffff" />;
            } else if (param.status === 'indeterminate') {
              fillHeightPct = 50;
              color = '#94a3b8';
              statusBadge = isHindi ? 'जांचें' : 'Check';
              icon = <Info size={12} color="#ffffff" />;
            }

            return (
              <div
                key={param.id}
                onClick={() => {
                  setSelectedId(param.id);
                  onSelectParam?.(param);
                }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  minWidth: '105px',
                  maxWidth: '120px',
                  flex: '0 0 auto',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  transform: isSelected ? 'scale(1.04)' : 'scale(1)'
                }}
              >
                {/* Roof Value Flag */}
                <div
                  style={{
                    backgroundColor: color,
                    color: '#ffffff',
                    padding: '0.25rem 0.45rem',
                    borderRadius: '8px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    marginBottom: '0.45rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {icon}
                  <span>{param.value} {param.unit}</span>
                </div>

                {/* Building Structure */}
                <div
                  style={{
                    width: '64px',
                    height: '180px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '8px 8px 0 0',
                    border: isSelected ? `2px solid ${color}` : '1.5px solid #cbd5e1',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    overflow: 'hidden',
                    boxShadow: isSelected ? '0 0 12px rgba(5, 150, 105, 0.2)' : 'none'
                  }}
                >
                  {/* Building Windows / Grid Lines */}
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.06) 1px, transparent 1px)',
                      backgroundSize: '100% 16px',
                      pointerEvents: 'none',
                      zIndex: 2
                    }}
                  />

                  {/* Target Reference Range Corridor Guideline (from 40% to 75% height) */}
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '35%',
                      height: '40%',
                      width: '100%',
                      borderTop: '1.5px dashed #059669',
                      borderBottom: '1.5px dashed #059669',
                      backgroundColor: 'rgba(16, 185, 129, 0.08)',
                      pointerEvents: 'none',
                      zIndex: 1
                    }}
                    title="Normal Healthy Reference Range Zone"
                  />

                  {/* Colored Filled Floor (Patient's actual level) */}
                  <div
                    style={{
                      width: '100%',
                      height: `${fillHeightPct}%`,
                      backgroundColor: color,
                      opacity: 0.88,
                      transition: 'height 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      position: 'relative',
                      zIndex: 3
                    }}
                  />
                </div>

                {/* Ground Level: Parameter Label */}
                <div style={{ marginTop: '0.5rem', textAlign: 'center', width: '100%' }}>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      color: '#0f172a',
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                    title={param.name}
                  >
                    {isHindi && param.hindiName ? param.hindiName.split(' ')[0] : param.name.split(' ')[0]}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: '0.68rem',
                      color: '#64748b',
                      marginTop: '2px',
                      fontWeight: 600
                    }}
                  >
                    {param.rangeText}
                  </span>
                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      color: color,
                      marginTop: '2px'
                    }}
                  >
                    {statusBadge}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Guide Note */}
      <div
        style={{
          marginTop: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          color: '#475569',
          backgroundColor: '#f8fafc',
          padding: '0.5rem 0.85rem',
          borderRadius: '8px'
        }}
      >
        <Info size={16} color="#059669" style={{ flexShrink: 0 }} />
        <span>
          {isHindi
            ? 'स्तंभ ग्राफ का नियम: बीच की हरी पट्टी सामान्य सीमा है। यदि खंभा हरी पट्टी में है, तो स्तर सुरक्षित है।'
            : 'How to read: The middle shaded corridor represents the healthy reference zone. Pillars inside the corridor reflect steady balance.'}
        </span>
      </div>
    </div>
  );
};
