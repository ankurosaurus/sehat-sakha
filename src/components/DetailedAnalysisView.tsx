import React from 'react';
import { ArrowLeft, BarChart2, ShieldAlert, Sparkles, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import type { LabParameter, ReportSummary } from '../types';
import { ReportOverviewBar } from './ReportOverviewBar';
import { HealthPieChart } from './HealthPieChart';
import { BuildingBarGraph } from './BuildingBarGraph';
import { RangeIndicator } from './RangeIndicator';
import { TrendGraph } from './TrendGraph';

interface DetailedAnalysisViewProps {
  report: ReportSummary;
  language: 'English' | 'Hindi';
  onBackToSimple: () => void;
  onAskSakhaForParam: (param: LabParameter) => void;
}

export const DetailedAnalysisView: React.FC<DetailedAnalysisViewProps> = ({
  report,
  language,
  onBackToSimple,
  onAskSakhaForParam
}) => {
  const isHindi = language === 'Hindi';

  return (
    <div className="results-card" style={{ padding: '1.5rem', backgroundColor: '#ffffff', borderRadius: '18px', border: '1.5px solid #e2e8f0' }}>
      {/* Navigation & Header */}
      <div
        className="print-hide"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          paddingBottom: '1.25rem',
          borderBottom: '1.5px solid #e2e8f0',
          marginBottom: '1.5rem'
        }}
      >
        <button
          onClick={onBackToSimple}
          className="btn btn-secondary"
          style={{ fontSize: '0.88rem', padding: '0.55rem 1rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
        >
          <ArrowLeft size={16} />
          <span>{isHindi ? '← सरल विवरण पर वापस जाएं' : '← Back to Simple View'}</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#065f46', backgroundColor: '#d1fae5', padding: '0.25rem 0.65rem', borderRadius: '6px' }}>
            <BarChart2 size={13} style={{ display: 'inline', marginRight: '4px' }} />
            {isHindi ? 'विस्तृत विश्लेषण व ग्राफ मोड' : 'Detailed Analysis & Charts Mode'}
          </span>
          <button
            onClick={() => window.print()}
            className="btn btn-secondary"
            style={{ fontSize: '0.82rem', padding: '0.5rem 0.85rem' }}
          >
            <Printer size={15} /> {isHindi ? 'प्रिंट' : 'Print'}
          </button>
        </div>
      </div>

      {/* Title & Info */}
      <div style={{ marginBottom: '1.25rem' }}>
        <div style={{ marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#15803d', backgroundColor: '#dcfce7', padding: '0.2rem 0.55rem', borderRadius: '6px', border: '1px solid #bbf7d0', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            ✓ {isHindi ? `मेरी रिपोर्ट्स में स्वतः सहेजा गया: ${report.collectionDate}` : `Auto-saved to My Reports: ${report.collectionDate}`}
          </span>
        </div>
        <h2 style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#064e3b' }}>
          {isHindi ? report.hindiTitle || report.title : report.title} — {isHindi ? 'विस्तृत रिपोर्ट व ग्राफ' : 'Detailed Analysis & Charts'}
        </h2>
        <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
          {report.labName} • {report.collectionDate} • {report.patientName}
        </p>
      </div>

      {/* Safety Notice */}
      <div className="disclaimer-banner" style={{ marginBottom: '1.5rem' }}>
        <ShieldAlert size={24} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p style={{ fontWeight: 800, marginBottom: '0.2rem', color: '#991b1b', fontSize: '0.88rem' }}>
            {isHindi ? 'मेडिकल संदर्भ सूचना' : 'Medical Reference Information'}
          </p>
          <p style={{ margin: 0, fontSize: '0.82rem', lineHeight: 1.45 }}>
            {isHindi
              ? 'ये सभी ग्राफ व आंकड़े आपकी लैब द्वारा निर्धारित सामान्य संदर्भ सीमा (Reference Interval) पर आधारित हैं।'
              : 'These indicators and charts are plotted strictly against published laboratory reference intervals.'}
          </p>
        </div>
      </div>

      {/* 1. Report Overview Bar (Deterministic) */}
      <ReportOverviewBar
        parameters={report.parameters}
        language={language}
      />

      {/* 2. Health Pie Chart (Visual Proportion Breakdown) */}
      <HealthPieChart
        parameters={report.parameters}
        language={language}
      />

      {/* 3. Building / Pillar Comparative Bar Chart */}
      <BuildingBarGraph
        parameters={report.parameters}
        language={language}
        onSelectParam={onAskSakhaForParam}
      />

      {/* 4. Historical Trend Graph (Grounded in real HealthVault records) */}
      <TrendGraph
        parameters={report.parameters}
        language={language}
      />

      {/* 5. Individual Lab Parameter Range Indicators */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#064e3b', margin: 0, display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
            <Sparkles size={18} color="#059669" />
            {isHindi ? 'प्रत्येक जांच का रंगीन गेज मीटर (Parameter Indicators):' : 'Individual Parameter Indicators:'}
          </h4>
          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
            {isHindi ? 'सुई का स्थान जांचें' : 'Check needle position'}
          </span>
        </div>

        {report.parameters.map((param) => (
          <RangeIndicator
            key={param.id}
            param={param}
            language={language}
            onAskSakha={onAskSakhaForParam}
          />
        ))}
      </div>

      {/* 6. Narrative Explanation */}
      <div style={{ backgroundColor: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#064e3b', marginBottom: '0.75rem' }}>
          {isHindi ? 'सविस्तार मेडिकल विवरण (Full Clinical Narrative):' : 'Detailed Narrative Summary:'}
        </h4>
        <div className="markdown-body">
          <ReactMarkdown>
            {isHindi ? report.overallSummaryHi : report.overallSummaryEn}
          </ReactMarkdown>
        </div>
      </div>

      {/* Bottom Back Button */}
      <div className="print-hide" style={{ display: 'flex', justifyContent: 'center', borderTop: '1.5px solid #e2e8f0', paddingTop: '1.5rem' }}>
        <button
          onClick={onBackToSimple}
          className="btn btn-secondary"
          style={{ fontSize: '0.95rem', padding: '0.65rem 1.5rem' }}
        >
          <ArrowLeft size={16} />
          <span>{isHindi ? 'सरल विवरण पर वापस लौटें' : 'Back to Simple Explanation'}</span>
        </button>
      </div>
    </div>
  );
};
