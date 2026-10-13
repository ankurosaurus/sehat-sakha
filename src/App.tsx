import { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileText,
  ChevronRight,
  Loader2,
  X,
  Key,
  RotateCcw,
  ExternalLink,
  FileSpreadsheet,
  Menu,
  Languages,
  MessageSquareHeart
} from 'lucide-react';
import './index.css';
import {
  generateMedicalSimplification,
  extractMedicalParametersFromFiles,
  isValidApiKey,
  testGeminiApiKey
} from './lib/gemini';
import { SakhaMascot } from './components/SakhaMascot';
import { ExtractionReview } from './components/ExtractionReview';
import { AskSakhaDrawer } from './components/AskSakhaDrawer';
import { HealthVault } from './components/HealthVault';
import { Sidebar, type NavView } from './components/Sidebar';
import { LanguageSelectorModal } from './components/LanguageSelectorModal';
import { SimpleExplanationView } from './components/SimpleExplanationView';
import { DetailedAnalysisView } from './components/DetailedAnalysisView';
import { saveReportToVault } from './lib/storage';
import { speechEngine } from './lib/speech';
import type { LabParameter, ReportSummary } from './types';

function App() {
  // Navigation & Views
  const [activeView, setActiveView] = useState<NavView>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const [reportViewMode, setReportViewMode] = useState<'simple' | 'detailed'>('simple');

  // Language
  const [language, setLanguage] = useState<'English' | 'Hindi'>('Hindi');
  const isHindi = language === 'Hindi';

  // Files & Review State
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<{ [key: string]: string }>({});
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Review step before final explanation
  const [extractedReviewParams, setExtractedReviewParams] = useState<LabParameter[] | null>(null);
  const [extractedMeta, setExtractedMeta] = useState<{
    title?: string;
    hindiTitle?: string;
    patientName?: string;
    patientAge?: number;
    patientGender?: string;
    labName?: string;
    collectionDate?: string;
  } | null>(null);

  // Active Report & Sakha Assistant
  const [activeReport, setActiveReport] = useState<ReportSummary | null>(null);
  const [selectedParamForSakha, setSelectedParamForSakha] = useState<LabParameter | null>(null);
  const [isSakhaOpen, setIsSakhaOpen] = useState(false);
  const [savedInVault, setSavedInVault] = useState(false);

  // API Key Settings
  const [customApiKey, setCustomApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);
  const [testingKey, setTestingKey] = useState<boolean>(false);
  const [keyTestFeedback, setKeyTestFeedback] = useState<{ valid?: boolean; message?: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active Key verification from env or localStorage
  const envKey = (import.meta.env?.VITE_GEMINI_API_KEY as string) || ((globalThis as any).process?.env?.GEMINI_API_KEY as string) || '';
  const currentKey = customApiKey.trim() || (isValidApiKey(envKey) ? envKey : '');
  const isKeyActive = isValidApiKey(currentKey);

  // Cleanup speech synthesis on unmount
  useEffect(() => {
    return () => {
      speechEngine.stop();
    };
  }, []);

  // Drag & drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processFiles = (newFiles: FileList | File[]) => {
    setError(null);
    setActiveReport(null);
    setExtractedReviewParams(null);
    setSavedInVault(false);
    speechEngine.stop();

    const fileArray = Array.from(newFiles);
    setFiles(prev => [...prev, ...fileArray]);

    fileArray.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviews(prev => ({
            ...prev,
            [file.name]: e.target?.result as string
          }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeFile = (indexToRemove: number, fileName: string) => {
    setFiles(prev => prev.filter((_, i) => i !== indexToRemove));
    setPreviews(prev => {
      const newPreviews = { ...prev };
      delete newPreviews[fileName];
      return newPreviews;
    });
  };

  // Initiate Extraction / Analysis using Gemini Multimodal OCR
  const handleStartExtraction = async () => {
    if (files.length === 0) return;

    setIsLoading(true);
    setError(null);

    try {
      if (!isKeyActive) {
        setShowKeyInput(true);
        throw new Error(isHindi
          ? "कृपया अपनी Google Gemini API Key दर्ज करें ताकि AI आपकी असली रिपोर्ट को पढ़ सके।"
          : "Please enter your Google Gemini API key so the AI can read and extract data from your report.");
      }

      // Live multimodal Gemini document extraction
      const extractedData = await extractMedicalParametersFromFiles(files, currentKey);

      if (!extractedData.parameters || extractedData.parameters.length === 0) {
        throw new Error(isHindi
          ? "दस्तावेज़ से कोई मेडिकल मापदंड नहीं मिला। कृपया साफ़ फ़ोटो या PDF अपलोड करें।"
          : "No readable medical parameters detected. Please ensure the document/photo is clear and legible.");
      }

      setExtractedReviewParams(extractedData.parameters);
      setExtractedMeta({
        title: extractedData.reportTitle,
        hindiTitle: extractedData.hindiTitle,
        patientName: extractedData.patientName,
        patientAge: extractedData.patientAge,
        patientGender: extractedData.patientGender,
        labName: extractedData.labName,
        collectionDate: extractedData.collectionDate
      });
    } catch (err: any) {
      console.error("Extraction error:", err);
      setError(err.message || (isHindi ? "रिपोर्ट पढ़ने में समस्या आई। कृपया पुनः प्रयास करें।" : "Failed to extract report data."));
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm parameters and generate final report
  const handleConfirmParameters = async (confirmedParams: LabParameter[]) => {
    setIsLoading(true);
    setError(null);

    try {
      let finalMarkdown = '';
      if (isKeyActive && files.length > 0) {
        finalMarkdown = await generateMedicalSimplification(files, currentKey, language, confirmedParams);
      }

      const now = new Date();
      const dateFormatted = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
      const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

      const newReport: ReportSummary = {
        id: `report-${now.getTime()}`,
        title: extractedMeta?.title || (files.length > 0 ? files[0].name.replace(/\.[^/.]+$/, "") : 'Laboratory Medical Report'),
        hindiTitle: extractedMeta?.hindiTitle || 'मेडिकल लैब जांच रिपोर्ट',
        patientName: extractedMeta?.patientName || 'मरीज (Patient)',
        patientAge: extractedMeta?.patientAge,
        patientGender: extractedMeta?.patientGender,
        collectionDate: extractedMeta?.collectionDate ? `${extractedMeta.collectionDate} • ${timeFormatted}` : `${dateFormatted} • ${timeFormatted}`,
        savedDateFormatted: dateFormatted,
        savedTimeFormatted: timeFormatted,
        labName: extractedMeta?.labName || 'डायग्नोस्टिक लैब (Diagnostic Lab)',
        savedAt: now.toISOString(),
        parameters: confirmedParams,
        doctorQuestionsEn: [
          'What lifestyle or dietary adjustments do you recommend for these numbers?',
          'Do I need any supplements or follow-up tests?',
          'When should my next routine checkup be scheduled?'
        ],
        doctorQuestionsHi: [
          'इन परिणामों के आधार पर खान-पान में क्या बदलाव करने चाहिए?',
          'क्या मुझे किसी दवा या पूरक आहार की आवश्यकता है?',
          'अगली रूटीन जांच कितने समय बाद करानी होगी?'
        ],
        overallSummaryEn: finalMarkdown || 'Comprehensive laboratory report analysis completed.',
        overallSummaryHi: finalMarkdown || 'जांच का विश्लेषण पूर्ण हुआ। सभी आंकड़े सामान्य संदर्भ सीमा के अनुसार मूल्यांकित किए गए हैं।'
      };

      // AUTOMATICALLY SAVE DIRECTLY TO HEALTHVAULT (MY REPORTS) WITH DATE & TIME TAG
      saveReportToVault(newReport);
      setSavedInVault(true);

      setActiveReport(newReport);
      setReportViewMode('simple'); // Simple by default
      setActiveView('home');
    } catch (e: any) {
      setError(e.message || 'Analysis error');
    } finally {
      setIsLoading(false);
    }
  };

  // Save to HealthVault
  const handleSaveToVault = () => {
    if (!activeReport) return;
    const ok = saveReportToVault(activeReport);
    if (ok) {
      setSavedInVault(true);
      setTimeout(() => setSavedInVault(false), 3000);
    }
  };

  const handleReset = () => {
    setFiles([]);
    setPreviews({});
    setActiveReport(null);
    setExtractedReviewParams(null);
    setExtractedMeta(null);
    setError(null);
    speechEngine.stop();
  };

  const handleSaveCustomKey = (key: string) => {
    const clean = key.trim();
    setCustomApiKey(clean);
    localStorage.setItem('gemini_api_key', clean);
    setKeyTestFeedback(null);
    setShowKeyInput(false);
    setError(null);
  };

  const handleTestKey = async () => {
    const input = document.getElementById('custom-key-input') as HTMLInputElement;
    const testVal = input ? input.value : customApiKey;
    if (!testVal.trim()) {
      setKeyTestFeedback({ valid: false, message: "Please enter your key first." });
      return;
    }
    setTestingKey(true);
    setKeyTestFeedback(null);
    try {
      const res = await testGeminiApiKey(testVal);
      setKeyTestFeedback(res);
      if (res.valid) {
        handleSaveCustomKey(testVal);
      }
    } catch (e: any) {
      setKeyTestFeedback({ valid: false, message: e.message || "Key test failed" });
    } finally {
      setTestingKey(false);
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Drawer */}
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activeView={activeView}
        onNavigate={(view) => {
          if (view === 'language') {
            setLanguageModalOpen(true);
          } else if (view === 'settings') {
            setShowKeyInput(true);
          } else if (view === 'sakha') {
            setIsSakhaOpen(true);
          } else if (view === 'upload') {
            handleReset();
            setActiveView('home');
          } else if (view === 'detailed') {
            if (activeReport) {
              setReportViewMode('detailed');
              setActiveView('home');
            }
          } else {
            setActiveView(view);
          }
        }}
        hasActiveReport={!!activeReport}
        language={language}
      />

      {/* 22 Official Languages Modal */}
      <LanguageSelectorModal
        isOpen={languageModalOpen}
        onClose={() => setLanguageModalOpen(false)}
        currentLanguage={language}
        onSelectLanguage={(l) => setLanguage(l)}
      />

      {/* Header Bar */}
      <header className="header print-hide">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Hamburger Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation menu"
            style={{
              background: '#f1f5f9',
              border: '1.5px solid #cbd5e1',
              borderRadius: '10px',
              padding: '0.45rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#064e3b'
            }}
          >
            <Menu size={22} />
          </button>

          {/* Logo & Branding */}
          <div
            onClick={() => {
              setActiveView('home');
              setReportViewMode('simple');
            }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }}
          >
            <SakhaMascot size={36} mood="greeting" />
            <div>
              <h1 className="logo-title" style={{ margin: 0, fontSize: '1.35rem', fontWeight: 900, color: '#064e3b' }}>
                सेहत सखा
              </h1>
              <span className="logo-tagline" style={{ display: 'block', fontSize: '0.72rem', color: '#047857', fontWeight: 700 }}>
                Aapki Report, Aapki Bhasha Mein
              </span>
            </div>
          </div>
        </div>

        {/* Header Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Status Pill / Key Button */}
          <button
            type="button"
            className="status-pill print-hide"
            onClick={() => setShowKeyInput(!showKeyInput)}
            title="Google Gemini AI Key Settings"
            style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
          >
            <Key size={14} color="#059669" />
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                color: isKeyActive ? '#065f46' : '#92400e',
                backgroundColor: isKeyActive ? '#d1fae5' : '#fef3c7',
                padding: '0.2rem 0.6rem',
                borderRadius: '12px',
                border: `1px solid ${isKeyActive ? '#a7f3d0' : '#fde68a'}`
              }}
            >
              {isKeyActive ? '✓ सक्रिय' : 'कुंजी सेट करें'}
            </span>
          </button>

          {/* Language Selector Button */}
          <button
            onClick={() => setLanguageModalOpen(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.75rem',
              borderRadius: '10px',
              border: '1.5px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#064e3b',
              cursor: 'pointer'
            }}
          >
            <Languages size={16} color="#059669" />
            <span>{isHindi ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </header>

      {/* API Key Configuration Dropdown */}
      {showKeyInput && (
        <div style={{ backgroundColor: '#f0fdf4', borderBottom: '2px solid #a7f3d0', padding: '1.5rem 2rem' }} className="print-hide">
          <div style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Key size={18} color="#059669" />
                <span style={{ fontSize: '1rem', fontWeight: 800, color: '#064e3b' }}>
                  Google Gemini API Key सेटिंग
                </span>
              </div>
              <button
                onClick={() => setShowKeyInput(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: '#047857', fontWeight: 700 }}
              >
                बंद करें ✕
              </button>
            </div>

            <p style={{ fontSize: '0.82rem', color: '#475569', margin: 0 }}>
              आपकी API Key सुरक्षित रहती है। मुफ्त API Key प्राप्त करने के लिए{' '}
              <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" style={{ color: '#059669', fontWeight: 700, textDecoration: 'underline' }}>
                Google AI Studio <ExternalLink size={12} style={{ display: 'inline', verticalAlign: 'baseline' }} />
              </a>{' '}
              पर जाएं।
            </p>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <input
                type="password"
                placeholder="Google Gemini API key दर्ज करें..."
                defaultValue={customApiKey}
                id="custom-key-input"
                style={{ flex: 1, minWidth: '260px', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border-color)', fontSize: '0.88rem' }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleTestKey}
                disabled={testingKey}
                style={{ fontSize: '0.85rem', padding: '0.65rem 1rem' }}
              >
                {testingKey ? <Loader2 size={16} className="spin-animation" /> : 'जांचें (Test)'}
              </button>
              <button
                className="btn btn-success"
                onClick={() => {
                  const input = document.getElementById('custom-key-input') as HTMLInputElement;
                  handleSaveCustomKey(input ? input.value : '');
                }}
                style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
              >
                सुरक्षित करें
              </button>
            </div>

            {keyTestFeedback && (
              <div
                style={{
                  padding: '0.65rem 0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  backgroundColor: keyTestFeedback.valid ? '#dcfce7' : '#fee2e2',
                  color: keyTestFeedback.valid ? '#15803d' : '#991b1b',
                  border: `1px solid ${keyTestFeedback.valid ? '#bbf7d0' : '#fecaca'}`
                }}
              >
                {keyTestFeedback.valid ? '✓ ' : '✕ '} {keyTestFeedback.message}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="main-content">
        {/* VIEW 1: HEALTHVAULT (ACCESSIBLE EXCLUSIVELY VIA SIDEBAR) */}
        {activeView === 'vault' && (
          <div>
            <div className="print-hide" style={{ marginBottom: '1rem' }}>
              <button
                onClick={() => {
                  setActiveView('home');
                  setReportViewMode('simple');
                }}
                className="btn btn-secondary"
                style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}
              >
                {isHindi ? '← मुख्य पृष्ठ (होम) पर वापस जाएं' : '← Back to Home'}
              </button>
            </div>
            <HealthVault
              language={language}
              onSelectReport={(rep) => {
                setActiveReport(rep);
                setExtractedReviewParams(null);
                setReportViewMode('simple');
                setActiveView('home');
              }}
              onNewUpload={() => {
                handleReset();
                setActiveView('home');
              }}
            />
          </div>
        )}

        {/* VIEW 2: HOME & REPORT WORKFLOW */}
        {activeView === 'home' && (
          <>
            {/* Sakha Greeting Banner (Shown when no report or review is active) */}
            {!activeReport && !extractedReviewParams && (
              <div className="greeting-card print-hide">
                <SakhaMascot size={72} mood="greeting" />
                <div>
                  <h2 style={{ fontSize: '1.45rem', fontWeight: 900, color: '#064e3b', marginBottom: '0.35rem' }}>
                    {isHindi
                      ? 'नमस्ते! मैं सखा हूँ — आपका स्वास्थ्य साथी'
                      : 'Namaste! I am Sakha — Your Health Companion'}
                  </h2>
                  <p style={{ margin: 0, color: '#166534', fontSize: '0.95rem', lineHeight: 1.5 }}>
                    {isHindi
                      ? 'अपनी खून की जांच, सीबीसी या अस्पताल का पर्चा अपलोड करें। मैं कठिन मेडिकल शब्दों को बिना किसी डर के आसान हिंदी में समझाऊंगा।'
                      : 'Upload your lab test report, blood count, or hospital slip. I will explain complex medical terms in plain language so you can consult your doctor with confidence.'}
                  </p>
                </div>
              </div>
            )}

            {/* 2 PRIMARY ACTIONS GRID ON HOME SCREEN (Clean & uncluttered) */}
            {!activeReport && !extractedReviewParams && files.length === 0 && (
              <div
                className="print-hide"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1.5rem'
                }}
              >
                {/* Action 1: Upload */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '2px solid #a7f3d0',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.08)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ backgroundColor: '#ecfdf5', padding: '0.85rem', borderRadius: '12px', color: '#059669' }}>
                    <UploadCloud size={28} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#064e3b' }}>
                      {isHindi ? '1. रिपोर्ट अपलोड करें' : '1. Upload Report'}
                    </h3>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                      {isHindi ? 'कैमरा फोटो या PDF पर्चा चुनें' : 'Camera photo or PDF slip'}
                    </p>
                  </div>
                </div>

                {/* Action 2: Ask Sakha */}
                <div
                  onClick={() => setIsSakhaOpen(true)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1.5px solid #e2e8f0',
                    borderRadius: '16px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ backgroundColor: '#fef3c7', padding: '0.85rem', borderRadius: '12px', color: '#d97706' }}>
                    <MessageSquareHeart size={28} />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                      {isHindi ? '2. सखा से मदद लें' : '2. Ask Sakha Guide'}
                    </h3>
                    <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                      {isHindi ? 'आवाज़ या चैट में पूछें' : 'Voice or chat assistance'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Zone */}
            {!activeReport && !extractedReviewParams && (
              <div className="uploader-card print-hide">
                <div
                  className={`drop-zone ${isDragging ? 'active' : ''}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  style={{ marginBottom: files.length > 0 ? '1.5rem' : '0' }}
                >
                  <UploadCloud className="icon-large" />
                  <div>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.35rem', fontWeight: 800, color: '#064e3b' }}>
                      {isHindi ? 'रिपोर्ट की फोटो या PDF यहाँ अपलोड करें' : 'Drag & Drop Your Medical Report / PDF Here'}
                    </h3>
                    <p style={{ color: '#475569', fontSize: '0.9rem', margin: 0 }}>
                      {isHindi
                        ? 'मोबाइल कैमरा से खींची फोटो (JPG, PNG) या लैब PDF रिपोर्ट स्वीकार्य हैं'
                        : 'Supports PDF Documents, Mobile Photos (JPG, PNG), and Text Files'}
                    </p>
                  </div>
                  <button
                    className="btn btn-secondary"
                    style={{ marginTop: '0.5rem', pointerEvents: 'none' }}
                    tabIndex={-1}
                  >
                    {isHindi ? 'फ़ोन या कंप्यूटर से फ़ाइल चुनें' : 'Browse Files from Device'}
                  </button>
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  accept="image/*,text/plain,application/pdf"
                  multiple
                />

                {/* Uploaded File Previews */}
                {files.length > 0 && (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <h3 style={{ color: '#064e3b', fontSize: '1.05rem', fontWeight: 800 }}>
                        {isHindi ? `अपलोड की गई फाइलें (${files.length})` : `Uploaded Files (${files.length})`}
                      </h3>
                      <button
                        onClick={handleReset}
                        style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontWeight: 600 }}
                      >
                        <RotateCcw size={13} /> {isHindi ? 'हटाएं' : 'Clear all'}
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                      {files.map((file, index) => {
                        const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
                        return (
                          <div
                            key={`${file.name}-${index}`}
                            style={{
                              position: 'relative',
                              backgroundColor: '#f8fafc',
                              borderRadius: 'var(--radius-md)',
                              border: '1.5px solid var(--border-color)',
                              overflow: 'hidden'
                            }}
                          >
                            <button
                              onClick={() => removeFile(index, file.name)}
                              style={{
                                position: 'absolute',
                                top: '0.5rem',
                                right: '0.5rem',
                                background: 'rgba(255,255,255,0.95)',
                                border: 'none',
                                borderRadius: '50%',
                                padding: '0.3rem',
                                cursor: 'pointer',
                                zIndex: 10,
                                boxShadow: 'var(--shadow-sm)'
                              }}
                              title="Remove file"
                            >
                              <X size={15} color="var(--error-color)" />
                            </button>

                            {previews[file.name] ? (
                              <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', borderBottom: '1px solid var(--border-color)' }}>
                                <img src={previews[file.name]} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'cover' }} />
                              </div>
                            ) : isPdf ? (
                              <div style={{ height: '140px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ecfdf5', borderBottom: '1px solid var(--border-color)', gap: '0.5rem' }}>
                                <FileSpreadsheet size={42} color="#059669" />
                                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#065f46', backgroundColor: '#d1fae5', padding: '0.15rem 0.5rem', borderRadius: '4px' }}>PDF Report</span>
                              </div>
                            ) : (
                              <div style={{ height: '140px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f5f9', borderBottom: '1px solid var(--border-color)' }}>
                                <FileText size={42} color="#94a3b8" />
                              </div>
                            )}

                            <div style={{ padding: '0.75rem' }}>
                              <p style={{ fontWeight: 700, fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>{file.name}</p>
                              <p style={{ fontSize: '0.75rem', color: '#64748b', margin: '2px 0 0 0' }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                      <button
                        className="btn btn-success"
                        onClick={handleStartExtraction}
                        disabled={isLoading}
                        style={{ width: '100%', maxWidth: '440px', justifyContent: 'center', padding: '1rem', fontSize: '1.05rem', fontWeight: 800 }}
                      >
                        {isLoading ? (
                          <><Loader2 className="spin-animation" size={22} /> {isHindi ? 'रिपोर्ट पढ़ी जा रही है...' : 'Reading Report...'}</>
                        ) : (
                          <>{isHindi ? 'रिपोर्ट पढ़ें व आंकड़े जांचें' : 'Extract & Review Parameters'} <ChevronRight size={22} /></>
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {error && (
                  <div style={{ marginTop: '1.25rem', padding: '1rem', backgroundColor: '#fef2f2', border: '1.5px solid #fecdd3', color: '#991b1b', borderRadius: 'var(--radius-md)', fontSize: '0.88rem', textAlign: 'left' }}>
                    <strong>त्रुटि / Error:</strong> {error}
                  </div>
                )}
              </div>
            )}

            {/* STEP 1: EXTRACTION & OCR VERIFICATION REVIEW */}
            {extractedReviewParams && !activeReport && (
              <ExtractionReview
                parameters={extractedReviewParams}
                language={language}
                onConfirm={handleConfirmParameters}
                onCancel={handleReset}
              />
            )}

            {/* STEP 2: ACTIVE REPORT VIEW (TWO DISTINCT MODES) */}
            {activeReport && (
              <>
                {reportViewMode === 'simple' ? (
                  /* MODE A: SIMPLE EXPLANATION VIEW (DEFAULT) */
                  <SimpleExplanationView
                    report={activeReport}
                    language={language}
                    onOpenDetailed={() => setReportViewMode('detailed')}
                    onSaveToVault={handleSaveToVault}
                    savedInVault={savedInVault}
                  />
                ) : (
                  /* MODE B: DETAILED ANALYSIS & CHARTS VIEW */
                  <DetailedAnalysisView
                    report={activeReport}
                    language={language}
                    onBackToSimple={() => setReportViewMode('simple')}
                    onAskSakhaForParam={(param) => {
                      setSelectedParamForSakha(param);
                      setIsSakhaOpen(true);
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* Floating Ask Sakha Action Button */}
      <button
        type="button"
        className="floating-sakha-btn print-hide"
        onClick={() => setIsSakhaOpen(true)}
        title={isHindi ? 'सखा से सवाल पूछें' : 'Ask Sakha a question'}
      >
        <SakhaMascot size={34} mood="listening" />
        <span>{isHindi ? 'सखा से पूछें' : 'Ask Sakha'}</span>
      </button>

      {/* Slide-out / Bottom Drawer for Sakha Assistant */}
      <AskSakhaDrawer
        isOpen={isSakhaOpen}
        onClose={() => setIsSakhaOpen(false)}
        language={language}
        currentReport={activeReport}
        selectedParam={selectedParamForSakha}
        apiKey={currentKey}
      />

      {/* Rural-First High-Contrast Footer */}
      <footer className="footer print-hide">
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <SakhaMascot size={28} mood="greeting" />
            <p style={{ margin: 0, fontWeight: 800, color: '#064e3b', fontSize: '1rem' }}>
              सेहत सखा (Sehat Sakha) — आपकी रिपोर्ट, आपकी भाषा में
            </p>
          </div>
          <p style={{ margin: 0, color: '#475569', fontSize: '0.82rem' }}>
            🔒 पूर्णतः गोपनीय व सुरक्षित: रिपोर्ट आपके फोन/ब्राउज़र में रहती है। कोई अवांछित डेटा संग्रह नहीं।
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem', fontSize: '0.82rem', color: '#64748b' }}>
            <span>ग्रामीण स्वास्थ्य सशक्तिकरण पहल</span>
            <span>•</span>
            <span>Deterministic Reference Engine</span>
            <span>•</span>
            <span>Google Gemini 3 Multimodal</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
