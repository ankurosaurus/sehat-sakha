import React from 'react';
import { CheckCircle2, AlertTriangle, ArrowDownCircle, HelpCircle } from 'lucide-react';
import { getReportOverviewStats } from '../lib/referenceEngine';
import type { LabParameter } from '../types';

interface ReportOverviewBarProps {
  parameters: LabParameter[];
  language: 'English' | 'Hindi';
}

export const ReportOverviewBar: React.FC<ReportOverviewBarProps> = ({ parameters, language }) => {
  const stats = getReportOverviewStats(parameters);
  const total = stats.total || 1;

  const normalPct = (stats.normal / total) * 100;
  const highPct = (stats.high / total) * 100;
  const lowPct = (stats.low / total) * 100;
  const indetPct = (stats.indeterminate / total) * 100;

  const isHindi = language === 'Hindi';

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.25rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        marginBottom: '1.5rem'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          {isHindi ? 'रिपोर्ट संक्षिप्त सारांश (Report Overview)' : 'Report Parameter Overview'}
        </h4>
        <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
          {isHindi ? `कुल जांची गई संख्या: ${stats.total}` : `Total Tests Checked: ${stats.total}`}
        </span>
      </div>

      {/* Segmented Visual Bar */}
      <div
        style={{
          height: '14px',
          borderRadius: '9999px',
          overflow: 'hidden',
          backgroundColor: '#f1f5f9',
          display: 'flex',
          marginBottom: '1rem',
          boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'
        }}
        role="progressbar"
        aria-label="Report overview bar"
      >
        {normalPct > 0 && (
          <div style={{ width: `${normalPct}%`, backgroundColor: '#10b981', transition: 'width 0.4s' }} title={`Normal: ${stats.normal}`} />
        )}
        {highPct > 0 && (
          <div style={{ width: `${highPct}%`, backgroundColor: '#ef4444', transition: 'width 0.4s' }} title={`High: ${stats.high}`} />
        )}
        {lowPct > 0 && (
          <div style={{ width: `${lowPct}%`, backgroundColor: '#f59e0b', transition: 'width 0.4s' }} title={`Low: ${stats.low}`} />
        )}
        {indetPct > 0 && (
          <div style={{ width: `${indetPct}%`, backgroundColor: '#94a3b8', transition: 'width 0.4s' }} title={`Indeterminate: ${stats.indeterminate}`} />
        )}
      </div>

      {/* 4 Accessible Count Chips */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem', marginBottom: '0.85rem' }}>
        {/* Normal */}
        <div style={{ backgroundColor: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '10px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={20} color="#059669" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#065f46', lineHeight: 1 }}>{stats.normal}</div>
            <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 600, marginTop: '2px' }}>
              {isHindi ? 'सामान्य (Normal)' : 'Normal Range'}
            </div>
          </div>
        </div>

        {/* High */}
        <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertTriangle size={20} color="#dc2626" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#991b1b', lineHeight: 1 }}>{stats.high}</div>
            <div style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: 600, marginTop: '2px' }}>
              {isHindi ? 'अधिक (High)' : 'Above Range'}
            </div>
          </div>
        </div>

        {/* Low */}
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ArrowDownCircle size={20} color="#d97706" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#92400e', lineHeight: 1 }}>{stats.low}</div>
            <div style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600, marginTop: '2px' }}>
              {isHindi ? 'कम (Low)' : 'Below Range'}
            </div>
          </div>
        </div>

        {/* Indeterminate */}
        {stats.indeterminate > 0 && (
          <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '10px', padding: '0.65rem 0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={20} color="#64748b" style={{ flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#334155', lineHeight: 1 }}>{stats.indeterminate}</div>
              <div style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600, marginTop: '2px' }}>
                {isHindi ? 'अस्पष्ट (Review)' : 'Indeterminate'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Human Text Explanation Underneath */}
      <p style={{ margin: 0, fontSize: '0.85rem', color: '#475569', lineHeight: 1.5, backgroundColor: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '8px', borderLeft: '3px solid #10b981' }}>
        {isHindi
          ? `सरल भाषा में: आपकी इस रिपोर्ट में कुल ${stats.total} मापदंडों में से ${stats.normal} सामान्य सीमा में हैं। ${stats.high + stats.low > 0 ? `${stats.high + stats.low} परिणामों पर डॉक्टर से साधारण चर्चा करने की सलाह दी जाती है।` : 'सभी परिणाम स्वस्थ सीमा में दिख रहे हैं।'}`
          : `Plain Language Summary: Out of ${stats.total} clinical parameters, ${stats.normal} fall within standard healthy bounds. ${stats.high + stats.low > 0 ? `${stats.high + stats.low} parameter(s) vary from average and can be discussed at your next doctor visit.` : 'All examined parameters align with healthy clinical reference targets.'}`}
      </p>
    </div>
  );
};
