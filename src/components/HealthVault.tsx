import React, { useState } from 'react';
import { FolderHeart, Trash2, Eye, Search, PlusCircle, FileText, UploadCloud, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import type { ReportSummary } from '../types';
import { getSavedReports, deleteReportFromVault } from '../lib/storage';

interface HealthVaultProps {
  language: string;
  onSelectReport: (report: ReportSummary) => void;
  onNewUpload: () => void;
}

export const HealthVault: React.FC<HealthVaultProps> = ({
  language,
  onSelectReport,
  onNewUpload
}) => {
  const isHindi = language !== 'English';
  const [reports, setReports] = useState<ReportSummary[]>(() => getSavedReports());
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filtered = reports.filter((r: ReportSummary) =>
    r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.hindiTitle && r.hindiTitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
    r.labName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmMsg = isHindi
      ? 'क्या आप सचमुच इस रिपोर्ट को अपनी सुरक्षित तिजोरी से हटाना चाहते हैं?'
      : 'Are you sure you want to delete this saved report?';
    if (window.confirm(confirmMsg)) {
      deleteReportFromVault(id);
      setReports(getSavedReports());
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
        marginBottom: '2rem'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{ backgroundColor: '#ecfdf5', padding: '0.5rem', borderRadius: '10px', color: '#059669', display: 'flex' }}>
            <FolderHeart size={24} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#064e3b' }}>
              {isHindi ? 'मेरी रिपोर्ट्स (HealthVault)' : 'My Reports (HealthVault)'}
            </h3>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
              {isHindi ? 'आपकी सभी सुरक्षित रखी गई मेडिकल जांचें' : 'Your saved medical test reports archive'}
            </p>
          </div>
        </div>

        {reports.length > 0 && (
          <button
            className="btn btn-success"
            onClick={onNewUpload}
            style={{ fontSize: '0.88rem', padding: '0.55rem 1.1rem' }}
          >
            <PlusCircle size={16} /> {isHindi ? 'नई रिपोर्ट जोड़ें' : 'Upload New Report'}
          </button>
        )}
      </div>

      {/* When no reports exist in vault: Exact required empty state */}
      {reports.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem 1.5rem',
            backgroundColor: '#f8fafc',
            border: '2px dashed #cbd5e1',
            borderRadius: '14px',
            margin: '1rem 0'
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem auto',
              color: '#059669'
            }}
          >
            <FileText size={32} />
          </div>
          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            {isHindi ? 'अभी कोई रिपोर्ट सेव नहीं है।' : 'No reports saved yet.'}
          </h4>
          <p style={{ color: '#475569', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto 1.5rem auto', lineHeight: 1.5 }}>
            {isHindi
              ? 'अपनी पहली रिपोर्ट अपलोड करके शुरू करें।'
              : 'Start by uploading your first lab report.'}
          </p>
          <button
            className="btn btn-success"
            onClick={onNewUpload}
            style={{ fontSize: '1rem', padding: '0.75rem 1.75rem', fontWeight: 800, margin: '0 auto' }}
          >
            <UploadCloud size={20} />
            <span>{isHindi ? 'रिपोर्ट अपलोड करें' : 'Upload Report'}</span>
          </button>
        </div>
      ) : (
        <>
          {/* Search Input */}
          <div style={{ position: 'relative', marginBottom: '1rem' }}>
            <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder={isHindi ? 'रिपोर्ट या लैब के नाम से खोजें...' : 'Search saved reports by name or lab...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 0.75rem 0.6rem 2.4rem',
                borderRadius: '10px',
                border: '1px solid #cbd5e1',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
          </div>

          {/* Search No Results */}
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '12px' }}>
              <FileText size={36} color="#94a3b8" style={{ margin: '0 auto 0.5rem auto' }} />
              <p style={{ margin: 0, fontWeight: 600 }}>
                {isHindi ? 'कोई सहेजी गई रिपोर्ट नहीं मिली' : 'No matching reports found'}
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.85rem' }}>
              {filtered.map((report: ReportSummary) => (
                <div
                  key={report.id}
                  onClick={() => onSelectReport(report)}
                  style={{
                    backgroundColor: '#f8fafc',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '0.75rem'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#059669';
                    e.currentTarget.style.backgroundColor = '#ecfdf5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', backgroundColor: '#d1fae5', padding: '0.2rem 0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Calendar size={12} />
                          {report.savedDateFormatted || report.collectionDate.split('•')[0].trim()}
                        </span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e40af', backgroundColor: '#dbeafe', padding: '0.2rem 0.5rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Clock size={12} />
                          {report.savedTimeFormatted || (report.collectionDate.includes('•') ? report.collectionDate.split('•')[1].trim() : new Date(report.savedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }))}
                        </span>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.2rem', backgroundColor: '#ecfdf5', padding: '0.15rem 0.4rem', borderRadius: '4px' }}>
                          <CheckCircle2 size={11} />
                          {isHindi ? 'स्वतः सहेजा गया' : 'Auto-Saved'}
                        </span>
                      </div>
                      <button
                        onClick={(e) => handleDelete(report.id, e)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '0.2rem' }}
                        title={isHindi ? 'हटाएं' : 'Delete'}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                    <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      {isHindi ? report.hindiTitle || report.title : report.title}
                    </h4>
                    <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                      {report.labName} • {report.patientName}
                    </p>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #e2e8f0', paddingTop: '0.65rem' }}>
                    <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>
                      {isHindi ? `${report.parameters.length} मापदंड जाँचे गए` : `${report.parameters.length} parameters logged`}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Eye size={14} /> {isHindi ? 'देखें' : 'View'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
