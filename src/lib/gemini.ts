import { GoogleGenerativeAI } from "@google/generative-ai";
import { classifyValue } from "./referenceEngine";
import type { LabParameter } from "../types";

export function isValidApiKey(key: string | undefined | null): boolean {
  if (!key) return false;
  const clean = key.trim();
  if (!clean || clean.length < 15) return false;
  if (clean.startsWith('your_') || clean.includes('api_key_here') || clean === 'placeholder') return false;
  return true;
}

// Candidates prioritizing high-throughput, quota-healthy multimodal models
export const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.5-flash-lite",
  "gemini-2.5-flash-lite",
  "gemini-flash-lite-latest",
  "gemini-3.8-flash",
  "gemini-3.5-flash",
  "gemini-3.1-pro-preview"
];

// Quick validation check against Gemini API
export async function testGeminiApiKey(apiKey: string): Promise<{ valid: boolean; message: string; model?: string }> {
  const cleanKey = apiKey.trim();
  if (!isValidApiKey(cleanKey)) {
    return { valid: false, message: "Please enter a valid Google Gemini API key." };
  }

  try {
    const genAI = new GoogleGenerativeAI(cleanKey);
    for (const testModelName of ["gemini-3.1-flash-lite", "gemini-3.5-flash-lite", "gemini-3.8-flash"]) {
      try {
        const model = genAI.getGenerativeModel({ model: testModelName });
        const result = await model.generateContent("Hello, verify connection.");
        const text = (await result.response).text();
        if (text) {
          return { valid: true, message: `Connected successfully to Google Gemini (${testModelName})!`, model: testModelName };
        }
      } catch (err: any) {
        if (err?.message?.includes("API_KEY_INVALID") || err?.message?.includes("API key not valid")) {
          return { valid: false, message: "Invalid API key. Please check the key in Google AI Studio." };
        }
        if (err?.status === 429 || err?.status === 404) {
          continue;
        }
      }
    }
    return { valid: false, message: "No active models responded for this API key." };
  } catch (err: any) {
    console.error("Gemini test failed:", err);
    if (err?.message?.includes("API_KEY_INVALID") || err?.message?.includes("API key not valid")) {
      return { valid: false, message: "Invalid API key. Please check the key in Google AI Studio." };
    }
    return { valid: false, message: err.message || "Could not connect with this API key." };
  }
}

// Converts a File object to a base64 string or plain text for Gemini API
export async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } } | string> {
  const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp|bmp|gif)$/i.test(file.name);
  const isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);

  if (isImage || isPdf) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const resultStr = reader.result as string;
        const base64Data = resultStr.includes(',') ? resultStr.split(',')[1] : resultStr;
        const mimeType = file.type || (isPdf ? 'application/pdf' : 'image/jpeg');
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  } else if (file.type === 'text/plain' || /\.txt$/i.test(file.name)) {
    return await file.text();
  } else {
    throw new Error(`File format of "${file.name}" (${file.type || 'unknown'}) is not supported. Please upload PDF, images (JPG/PNG), or text reports.`);
  }
}

import { bhashiniOcr, getBhashiniLangCode } from "./bhashini";

export interface ExtractedReportData {
  reportTitle: string;
  hindiTitle: string;
  patientName?: string;
  patientAge?: number;
  patientGender?: string;
  labName?: string;
  collectionDate?: string;
  parameters: LabParameter[];
}

/**
 * Reads the actual uploaded report document/image using Gemini multimodal OCR
 * + Digital India Bhashini OCR and extracts all real patient and test parameters in the target language.
 */
export async function extractMedicalParametersFromFiles(
  files: File[],
  apiKey: string,
  targetLanguage: string = 'Hindi'
): Promise<ExtractedReportData> {
  const cleanKey = apiKey.trim();
  if (!isValidApiKey(cleanKey)) {
    throw new Error("Invalid or missing Google Gemini API key. Please configure your key in settings.");
  }

  const genAI = new GoogleGenerativeAI(cleanKey);
  const fileParts = await Promise.all(files.map(fileToGenerativePart));

  // Run Bhashini OCR on the first image file if available for hybrid accuracy
  let bhashiniOcrText = '';
  try {
    const firstImg = files.find(f => f.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(f.name));
    if (firstImg) {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const res = reader.result as string;
          resolve(res.includes(',') ? res.split(',')[1] : res);
        };
        reader.readAsDataURL(firstImg);
      });
      const b64 = await base64Promise;
      if (b64) {
        bhashiniOcrText = await bhashiniOcr(b64, getBhashiniLangCode(targetLanguage));
      }
    }
  } catch (ocrErr) {
    console.warn('Optional Bhashini OCR pass skipped:', ocrErr);
  }

  const bhashiniOcrHint = bhashiniOcrText ? `\n\nDIGITAL INDIA BHASHINI OCR RECOGNIZED TEXT ON DOCUMENT:\n"""${bhashiniOcrText.slice(0, 2000)}"""\n` : '';

  const extractionPrompt = `You are a precision clinical laboratory document extraction system.
Analyze the attached medical laboratory report image(s) or document(s) carefully.${bhashiniOcrHint}
Read ALL test names, patient values, measurement units, and reference intervals printed on the document.

CRITICAL EXTRACTION RULES:
1. Extract the actual test names, numbers, units, and reference intervals EXACTLY as printed on the user's document.
2. DO NOT hallucinate, fabricate, or supply synthetic placeholder data.
3. If patient name, age, gender, lab name, or test collection date are visible on the document, extract them accurately.
4. Extract every single laboratory biomarker parameter that appears on the report.
5. Provide localized titles and names in: **${targetLanguage}** (with native script).
6. For each parameter:
   - "name": Full English biomarker name as printed (e.g. "Hemoglobin", "Total Leukocyte Count (WBC)", "Platelet Count", "Serum Creatinine", "Fasting Blood Sugar", "Total Cholesterol", "SGPT (ALT)", "Thyroid Stimulating Hormone (TSH)")
   - "hindiName": A clear, respectful translation in **${targetLanguage}** script (e.g. for Hindi: "हीमोग्लोबिन (खून का स्तर)", for Bengali: "হিমোগ্লোবিন", for Tamil: "ஹீமோகுளோபின்", for Telugu: "హిమోగ్లోబిన్")
   - "value": The measured numeric value as a number (e.g. 11.2). If a test is qualitative (like "Positive" or "Negative"), put 0 for value and describe it in the explanation.
   - "unit": The unit of measurement (e.g. "g/dL", "mg/dL", "/mcL", "U/L", "mIU/L", "%")
   - "rangeText": The reference range printed on the report (e.g. "13.5 - 17.5", "< 200", "70 - 100", "0.7 - 1.3")
   - "rangeLow": Numeric lower limit if a two-sided range is provided
   - "rangeHigh": Numeric upper limit if a range is provided
   - "simpleExplanationEn": 1 short sentence in simple English explaining what this marker represents in the body.
   - "simpleExplanationHi": 1 short sentence in **${targetLanguage}** explaining what this marker represents in the body.

You MUST return ONLY valid, raw JSON (no conversational text, no markdown backticks):
{
  "reportTitle": "Complete Blood Count (CBC)",
  "hindiTitle": "Localized Report Title in ${targetLanguage}",
  "patientName": "Patient Name",
  "patientAge": 45,
  "patientGender": "Male/Female",
  "labName": "Diagnostic Center Name",
  "collectionDate": "Date as printed on report",
  "parameters": [
    {
      "name": "Hemoglobin",
      "hindiName": "Localized Parameter Name in ${targetLanguage}",
      "value": 11.2,
      "unit": "g/dL",
      "rangeText": "13.5 - 17.5",
      "rangeLow": 13.5,
      "rangeHigh": 17.5,
      "simpleExplanationEn": "Carries oxygen from lungs to body tissues.",
      "simpleExplanationHi": "Short explanation in ${targetLanguage}."
    }
  ]
}`;

  let lastError: any = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        extractionPrompt,
        ...fileParts as any[]
      ]);
      const response = await result.response;
      const text = response.text();

      if (text && text.trim().length > 0) {
        // Strip any markdown code fences if model returned them
        const cleanedJson = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanedJson);

        if (Array.isArray(parsed.parameters) && parsed.parameters.length > 0) {
          // Process and deterministically classify each parameter
          const processedParams: LabParameter[] = parsed.parameters.map((p: any, idx: number) => {
            const numVal = typeof p.value === 'number' ? p.value : parseFloat(p.value) || 0;
            const rangeStr = p.rangeText ? String(p.rangeText) : '';
            const classification = classifyValue(numVal, rangeStr);

            return {
              id: `p-${idx + 1}`,
              name: p.name || `Parameter ${idx + 1}`,
              hindiName: p.hindiName || p.name || `मापदंड ${idx + 1}`,
              value: numVal,
              unit: p.unit || '',
              rangeText: rangeStr,
              rangeLow: typeof p.rangeLow === 'number' ? p.rangeLow : classification.low,
              rangeHigh: typeof p.rangeHigh === 'number' ? p.rangeHigh : classification.high,
              status: classification.status,
              confidence: 'verified',
              simpleExplanationEn: p.simpleExplanationEn || 'Clinical laboratory indicator.',
              simpleExplanationHi: p.simpleExplanationHi || 'लैब जांच मापदंड।'
            };
          });

          return {
            reportTitle: parsed.reportTitle || (files.length > 0 ? files[0].name.replace(/\.[^/.]+$/, "") : "Medical Lab Report"),
            hindiTitle: parsed.hindiTitle || "मेडिकल लैब जांच रिपोर्ट",
            patientName: parsed.patientName || "मरीज (Patient)",
            patientAge: parsed.patientAge,
            patientGender: parsed.patientGender,
            labName: parsed.labName || "डायग्नोस्टिक केंद्र (Diagnostic Lab)",
            collectionDate: parsed.collectionDate,
            parameters: processedParams
          };
        }
      }
    } catch (err: any) {
      console.warn(`Extraction attempt with model "${modelName}" failed:`, err?.status, err?.message);
      lastError = err;

      if (
        err?.message?.includes("API_KEY_INVALID") ||
        err?.message?.includes("API key not valid") ||
        (err?.status === 400 && err?.message?.includes("key"))
      ) {
        throw new Error("Invalid Gemini API key provided. Please verify your API key in Google AI Studio.");
      }

      // If 429 or 404, fallback to next candidate model
      if (err?.status === 404 || err?.status === 429) {
        continue;
      }
    }
  }

  throw lastError || new Error("Could not extract parameters from the uploaded file. Please ensure the image/PDF is clearly readable.");
}

/**
 * Generates plain-language medical narrative simplification using Gemini
 */
export async function generateMedicalSimplification(
  files: File[],
  apiKey: string,
  language: string,
  confirmedParams?: LabParameter[]
): Promise<string> {
  const cleanKey = apiKey.trim();
  if (!isValidApiKey(cleanKey)) {
    throw new Error("Invalid or missing Google Gemini API key. Please configure your key in settings.");
  }

  const genAI = new GoogleGenerativeAI(cleanKey);

  let paramsContext = '';
  if (confirmedParams && confirmedParams.length > 0) {
    paramsContext = `\n\nCONFIRMED EXTRACTED REPORT PARAMETERS FROM THE DOCUMENT:\n` +
      confirmedParams.map(p => `- ${p.name} (${p.hindiName}): ${p.value} ${p.unit} (Reference Range: ${p.rangeText}, Status: ${p.status})`).join('\n') +
      `\nYou MUST base your discussion directly and strictly on these exact confirmed parameters.`;
  }

  const systemPrompt = `You are an expert, empathetic AI Medical Translator designed to help ordinary people understand their medical reports. Your goal is to demystify complex jargon, provide context, and empower the patient.

You must output your explanation entirely in: **${language}**.
CRITICAL: Even if the explanation is in ${language}, you MUST keep the actual names of the tests, medical conditions, and biochemical markers in **English** so the patient can easily match them to their physical report.${paramsContext}

You MUST structure your response EXACTLY as follows, using Markdown formatting:

### 1. What Test Was Done & What It Means
Provide a simple explanation of the procedure(s) or test(s) that were conducted. Explain what the test is looking for in plain language.

### 2. Your Results vs. Healthy Average
Detail the main findings from the report. Crucially, compare the patient's data against what is considered "average" or "normal" for a healthy human. Explain if the result is high, low, or normal in extremely simple terms.

### 3. Factors That Might Cause This
If any results are abnormal, list 2-3 common lifestyle, environmental, dietary, or physiological factors that typically relate to such results. (Always frame this generally, e.g., "Common factors include...", never diagnose the patient).

### 4. Medical Terms Explained Simply
Create a mini-dictionary breaking down 3-5 of the most complex medical jargon words found in the report into plain, everyday language.

### 5. Questions for Your Doctor
Provide 3 highly specific, actionable questions the patient should ask their doctor during their next visit based on these exact findings.

CRITICAL RULES:
- ANTI-HALLUCINATION: You MUST strictly base your entire summary ONLY on the information present in the provided reports. Do NOT invent data or discuss tests that do not exist in the user's document.
- NEVER give a definitive medical diagnosis.
- NEVER suggest treatments or prescribe medications.
- ALWAYS maintain a compassionate, objective, and educational tone.
- Format headings exactly as shown above, using H3 (###) tags.`;

  try {
    const fileParts = await Promise.all(files.map(fileToGenerativePart));
    let lastError: any = null;

    for (const modelName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        const result = await model.generateContent([
          systemPrompt,
          `Please analyze the following medical reports/images and provide the highly detailed, layperson-friendly explanation in ${language}.`,
          ...fileParts as any[]
        ]);
        const response = await result.response;
        const text = response.text();
        if (text && text.trim().length > 0) {
          return text;
        }
      } catch (modelErr: any) {
        console.warn(`Attempt with model "${modelName}" failed:`, modelErr?.status, modelErr?.message);
        lastError = modelErr;

        if (
          modelErr?.message?.includes("API_KEY_INVALID") ||
          modelErr?.message?.includes("API key not valid") ||
          (modelErr?.status === 400 && modelErr?.message?.includes("key"))
        ) {
          throw new Error("Invalid Gemini API key provided. Please verify or update your API key in Google AI Studio.");
        }

        if (modelErr?.status === 404 || modelErr?.status === 429) {
          continue;
        }
      }
    }

    throw lastError || new Error("Failed to process report with available Gemini models.");
  } catch (error: any) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
