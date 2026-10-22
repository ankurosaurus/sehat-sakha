import React, { useState } from 'react';
import { Check, Edit3, ArrowRight, RotateCcw } from 'lucide-react';
import type { LabParameter } from '../types';
import { classifyValue } from '../lib/referenceEngine';

interface ExtractionReviewProps {
  parameters: LabParameter[];
  language: string;
  onConfirm: (confirmedParams: LabParameter[]) => void;
  onCancel: () => void;
}

export const ExtractionReview: React.FC<ExtractionReviewProps> = ({
  parameters,
  language,
  onConfirm,
  onCancel
}) => {
  const isHindi = language !== 'English';
  const [params, setParams] = useState<LabParameter[]>(parameters);
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleValueChange = (id: string, newVal: number) => {
    setParams((prev: LabParameter[]) => prev.map((p: LabParameter) => {
      if (p.id === id) {
        const recheck = classifyValue(newVal, p.rangeText);
        return {
          ...p,
          value: newVal,
          status: recheck.status,
          confidence: 'manual'
        };
      }
      return p;
    }));
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid #059669',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem',
        boxShadow: '0 4px 12px rgba(5, 150, 105, 0.08)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ backgroundColor: '#ecfdf5', color: '#059669', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 800 }}>
              चरण 1 / STEP 1
            </span>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#064e3b', margin: 0 }}>
              {isHindi ? 'रिपोर्ट के आंकड़े जांचें (Review Extracted Values)' : 'Review Extracted Laboratory Values'}
            </h3>
          </div>
          <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.85rem', color: '#475569' }}>
            {isHindi
              ? 'एआई ने आपकी रिपोर्ट से नीचे दिए गए आंकड़े पढ़े हैं। यदि कोई संख्या गलत हो, तो आप इसे ठीक कर सकते हैं।'
              : 'Our system extracted the laboratory parameters below. Please verify that numbers match your physical slip before continuing.'}
          </p>
        </div>
      </div>

      {/* Review Table / Cards */}
      <div style={{ overflowX: 'auto', marginBottom: '1.25rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
          <thead>
            <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '2px solid #cbd5e1', textAlign: 'left' }}>
              <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#1e293b' }}>
                {isHindi ? 'जांच का नाम (Test)' : 'Test Name'}
              </th>
              <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#1e293b', width: '140px' }}>
                {isHindi ? 'संख्या / परिणाम' : 'Value & Unit'}
              </th>
              <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#1e293b' }}>
                {isHindi ? 'सामान्य सीमा (Range)' : 'Reference Range'}
              </th>
              <th style={{ padding: '0.65rem 0.75rem', fontWeight: 700, color: '#1e293b' }}>
                {isHindi ? 'सत्यापन स्थिति' : 'Verification Status'}
              </th>
            </tr>
          </thead>
          <tbody>
            {params.map((p: LabParameter) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #e2e8f0', backgroundColor: editingId === p.id ? '#fefce8' : 'transparent' }}>
                <td style={{ padding: '0.75rem' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{p.name}</div>
                  {p.hindiName && <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{p.hindiName}</div>}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  {editingId === p.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <input
                        type="number"
                        step="any"
                        defaultValue={p.value}
                        onChange={(e) => handleValueChange(p.id, parseFloat(e.target.value))}
                        style={{ width: '75px', padding: '0.3rem 0.45rem', borderRadius: '4px', border: '1px solid #059669', fontSize: '0.88rem', fontWeight: 700 }}
                      />
                      <button
                        onClick={() => setEditingId(null)}
                        style={{ background: '#059669', color: '#ffffff', border: 'none', borderRadius: '4px', padding: '0.3rem 0.5rem', cursor: 'pointer' }}
                        title="Done editing"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 800, color: '#064e3b' }}>{p.value}</span>
                      <span style={{ color: '#64748b', fontSize: '0.78rem' }}>{p.unit}</span>
                      <button
                        onClick={() => setEditingId(p.id)}
                        style={{ background: 'none', border: 'none', color: '#0284c7', cursor: 'pointer', padding: '0.2rem' }}
                        title={isHindi ? 'संख्या बदलें' : 'Edit value'}
                      >
                        <Edit3 size={13} />
                      </button>
                    </div>
                  )}
                </td>
                <td style={{ padding: '0.75rem', color: '#475569', fontSize: '0.82rem' }}>
                  {p.rangeText}
                </td>
                <td style={{ padding: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      backgroundColor: p.confidence === 'manual' ? '#fef3c7' : p.confidence === 'uncertain' ? '#fee2e2' : '#dcfce7',
                      color: p.confidence === 'manual' ? '#92400e' : p.confidence === 'uncertain' ? '#991b1b' : '#15803d'
                    }}
                  >
                    {p.confidence === 'manual'
                      ? (isHindi ? 'संशोधित (Manual Edit)' : 'Manually Corrected')
                      : p.confidence === 'uncertain'
                      ? (isHindi ? 'समीक्षा आवश्यक' : 'Uncertain OCR')
                      : (isHindi ? '✓ सत्यापित (Verified)' : '✓ Verified Extracted')}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Confirmation Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
        <button
          className="btn btn-secondary"
          onClick={onCancel}
          style={{ fontSize: '0.85rem' }}
        >
          <RotateCcw size={16} /> {isHindi ? 'रद्द करें' : 'Back / Re-upload'}
        </button>

        <button
          className="btn btn-success"
          onClick={() => onConfirm(params)}
          style={{ fontSize: '1rem', padding: '0.85rem 1.6rem', fontWeight: 800 }}
        >
          {isHindi ? '✓ आंकड़े सही हैं, रिपोर्ट समझाइए' : '✓ Confirm & Generate Plain-Language Explanation'} <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
