import type { ReportSummary } from '../types';

const VAULT_STORAGE_KEY = 'sehat_sakha_vault';

/**
 * Retrieve saved reports strictly from local storage.
 * Per strict product specifications, no mock or synthetic health records are seeded.
 */
export function getSavedReports(): ReportSummary[] {
  try {
    const raw = localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed: ReportSummary[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }
    // Filter out any legacy dummy/seed data if it was previously stored
    const realOnly = parsed.filter(r => r.id !== 'vault-cbc-prev' && !r.id.startsWith('dummy-'));
    // Sort with newest date & time first
    realOnly.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
    return realOnly;
  } catch (e) {
    console.error('Error reading reports vault:', e);
    return [];
  }
}

/**
 * Save a real report to HealthVault.
 */
export function saveReportToVault(report: ReportSummary): boolean {
  try {
    const existing = getSavedReports();
    // Prepend new report and deduplicate by id
    const updated = [report, ...existing.filter(r => r.id !== report.id)];
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('Error saving report to vault:', e);
    return false;
  }
}

/**
 * Delete a report from HealthVault by ID.
 */
export function deleteReportFromVault(reportId: string): boolean {
  try {
    const existing = getSavedReports();
    const updated = existing.filter(r => r.id !== reportId);
    localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('Error deleting report from vault:', e);
    return false;
  }
}

/**
 * Find historical values for a parameter across real saved reports in the vault.
 * Returns array of { date: string, value: number, reportTitle: string } sorted by date.
 */
export function getHistoricalParameterValues(parameterName: string): Array<{ date: string; value: number; reportTitle: string }> {
  const reports = getSavedReports();
  if (reports.length === 0) return [];

  const history: Array<{ date: string; value: number; reportTitle: string }> = [];
  const queryName = parameterName.toLowerCase().trim();

  for (const report of reports) {
    for (const param of report.parameters) {
      const pName = param.name.toLowerCase().trim();
      const pHiName = (param.hindiName || '').toLowerCase().trim();
      if (pName.includes(queryName) || queryName.includes(pName) || (pHiName && pHiName.includes(queryName))) {
        history.push({
          date: report.collectionDate || new Date(report.savedAt).toLocaleDateString('en-GB'),
          value: param.value,
          reportTitle: report.hindiTitle || report.title
        });
        break;
      }
    }
  }

  return history;
}
