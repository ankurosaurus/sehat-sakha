import type { ClassificationStatus, LabParameter } from '../types';

/**
 * Deterministically parses a laboratory reference range string into numerical bounds.
 * Examples supported:
 * - "13.5 - 17.5" or "13.5-17.5"
 * - "80.0 to 100.0"
 * - "< 200" or "<= 200"
 * - "> 50" or ">= 50"
 * - "0 - 15"
 */
export function parseRangeBounds(rangeStr: string): { low?: number; high?: number; isOneSided?: '<' | '>' } {
  if (!rangeStr || typeof rangeStr !== 'string') return {};
  const clean = rangeStr.trim();

  // One-sided: < X or <= X
  const lessMatch = clean.match(/^[<≤]\s*=?\s*([0-9]+(?:\.[0-9]+)?)/);
  if (lessMatch) {
    return { high: parseFloat(lessMatch[1]), isOneSided: '<' };
  }

  // One-sided: > X or >= X
  const greaterMatch = clean.match(/^[>≥]\s*=?\s*([0-9]+(?:\.[0-9]+)?)/);
  if (greaterMatch) {
    return { low: parseFloat(greaterMatch[1]), isOneSided: '>' };
  }

  // Two-sided: A - B or A to B
  const twoSidedMatch = clean.match(/([0-9]+(?:\.[0-9]+)?)\s*(?:-|–|—|to)\s*([0-9]+(?:\.[0-9]+)?)/i);
  if (twoSidedMatch) {
    const low = parseFloat(twoSidedMatch[1]);
    const high = parseFloat(twoSidedMatch[2]);
    return { low, high };
  }

  return {};
}

/**
 * Classifies a numerical value deterministically against reference bounds.
 * Rule: Software rules classify strictly according to clinical range bounds.
 */
export function classifyValue(value: number, rangeStr: string): { status: ClassificationStatus; low?: number; high?: number } {
  if (isNaN(value) || value === null || value === undefined) {
    return { status: 'indeterminate' };
  }

  const { low, high, isOneSided } = parseRangeBounds(rangeStr);

  if (isOneSided === '<' && high !== undefined) {
    return {
      status: value <= high ? 'normal' : 'high',
      high
    };
  }

  if (isOneSided === '>' && low !== undefined) {
    return {
      status: value >= low ? 'normal' : 'low',
      low
    };
  }

  if (low !== undefined && high !== undefined) {
    if (value < low) return { status: 'low', low, high };
    if (value > high) return { status: 'high', low, high };
    return { status: 'normal', low, high };
  }

  return { status: 'indeterminate' };
}

/**
 * Calculates needle / marker percentage position on a visual 3-zone range bar.
 * Zone 1 (0% to 33%): Below Range
 * Zone 2 (33% to 66%): Normal Range (Safe Green Zone)
 * Zone 3 (66% to 100%): Above Range
 */
export function calculateRangePosition(value: number, low?: number, high?: number): number {
  if (isNaN(value)) return 50;

  // If we have both low and high bounds
  if (low !== undefined && high !== undefined && high > low) {
    const rangeSpan = high - low;

    if (value < low) {
      // Below range zone: 5% to 33%
      const underRatio = (low - value) / (rangeSpan || 1);
      const pos = 33 - (underRatio * 25);
      return Math.max(6, Math.min(32, pos));
    } else if (value > high) {
      // Above range zone: 66% to 94%
      const overRatio = (value - high) / (rangeSpan || 1);
      const pos = 66 + (overRatio * 25);
      return Math.max(67, Math.min(94, pos));
    } else {
      // Within normal zone: 33% to 66%
      const insideRatio = (value - low) / rangeSpan;
      return 33 + (insideRatio * 33);
    }
  }

  // One-sided: upper limit only (< high)
  if (high !== undefined && low === undefined) {
    if (value <= high) {
      const ratio = value / high;
      return Math.max(10, Math.min(50, ratio * 50));
    } else {
      const ratio = (value - high) / high;
      return Math.min(94, 50 + (ratio * 40));
    }
  }

  // One-sided: lower limit only (> low)
  if (low !== undefined && high === undefined) {
    if (value >= low) {
      return 60;
    } else {
      return 20;
    }
  }

  return 50;
}

/**
 * Computes deterministic overview metrics for a list of lab parameters.
 */
export function getReportOverviewStats(parameters: LabParameter[]) {
  let normal = 0;
  let high = 0;
  let low = 0;
  let indeterminate = 0;

  parameters.forEach(p => {
    if (p.status === 'normal') normal++;
    else if (p.status === 'high') high++;
    else if (p.status === 'low') low++;
    else indeterminate++;
  });

  return {
    total: parameters.length,
    normal,
    high,
    low,
    indeterminate
  };
}

/**
 * Human-friendly bilingual status labels and colors.
 */
export function getStatusDisplay(status: ClassificationStatus, language: 'English' | 'Hindi') {
  switch (status) {
    case 'normal':
      return {
        label: language === 'Hindi' ? 'सामान्य सीमा में' : 'Within Normal Range',
        sublabel: language === 'Hindi' ? 'सुरक्षित स्तर' : 'Healthy Level',
        badgeClass: 'badge-normal',
        color: '#15803d',
        bgColor: '#dcfce7',
        borderColor: '#86efac'
      };
    case 'high':
      return {
        label: language === 'Hindi' ? 'सामान्य से अधिक' : 'Above Normal Range',
        sublabel: language === 'Hindi' ? 'डॉक्टर से परामर्श लें' : 'Consult Doctor',
        badgeClass: 'badge-high',
        color: '#b91c1c',
        bgColor: '#fee2e2',
        borderColor: '#fca5a5'
      };
    case 'low':
      return {
        label: language === 'Hindi' ? 'सामान्य से कम' : 'Below Normal Range',
        sublabel: language === 'Hindi' ? 'कम स्तर' : 'Low Level',
        badgeClass: 'badge-low',
        color: '#b45309',
        bgColor: '#fef3c7',
        borderColor: '#fde68a'
      };
    case 'indeterminate':
    default:
      return {
        label: language === 'Hindi' ? 'अस्पष्ट / समीक्षा आवश्यक' : 'Indeterminate Range',
        sublabel: language === 'Hindi' ? 'जांच आवश्यक' : 'Review Needed',
        badgeClass: 'badge-indeterminate',
        color: '#475569',
        bgColor: '#f1f5f9',
        borderColor: '#cbd5e1'
      };
  }
}
