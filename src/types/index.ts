export type ClassificationStatus = 'low' | 'normal' | 'high' | 'indeterminate';

export type ConfidenceStatus = 'verified' | 'manual' | 'uncertain';

export interface LabParameter {
  id: string;
  name: string;
  hindiName: string;
  value: number;
  unit: string;
  rangeText: string;
  rangeLow?: number;
  rangeHigh?: number;
  status: ClassificationStatus;
  confidence: ConfidenceStatus;
  simpleExplanationEn: string;
  simpleExplanationHi: string;
  previousValue?: number;
  previousDate?: string;
}

export interface ReportSummary {
  id: string;
  title: string;
  hindiTitle: string;
  patientName: string;
  patientAge?: number;
  patientGender?: string;
  collectionDate: string;
  labName: string;
  parameters: LabParameter[];
  doctorQuestionsEn: string[];
  doctorQuestionsHi: string[];
  overallSummaryEn: string;
  overallSummaryHi: string;
  rawText?: string;
  savedAt: string;
  savedDateFormatted?: string;
  savedTimeFormatted?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'sakha';
  textEn: string;
  textHi: string;
  timestamp: string;
  suggestedAction?: string;
}
