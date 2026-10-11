import { GoogleGenerativeAI } from "@google/generative-ai";

// Converts a File object to a base64 string
async function fileToGenerativePart(file: File): Promise<{ inlineData: { data: string; mimeType: string } } | string> {
  if (file.type.startsWith('image/')) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = (reader.result as string).split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type
          }
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  } else if (file.type === 'text/plain') {
    return await file.text();
  } else {
    throw new Error(`File type ${file.type} for file ${file.name} is not supported. Please upload images or text files.`);
  }
}

export async function generateMedicalSimplification(files: File[], apiKey: string, language: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(apiKey);

  const systemPrompt = `You are an expert, empathetic AI Medical Translator designed to help ordinary people understand their medical reports. Your goal is to demystify complex jargon, provide context, and empower the patient.

You must output your explanation entirely in: **${language}**.
CRITICAL: Even if the explanation is in ${language}, you MUST keep the actual names of the tests, medical conditions, and biochemical markers in **English** so the patient can easily match them to their physical report.

You MUST structure your response EXACTLY as follows, using Markdown formatting:

### 1. What Test Was Done & What It Means
Provide a simple explanation of the procedure(s) or test(s) that were conducted. Explain what the test is looking for in plain language.

### 2. Your Results vs. Healthy Average
Detail the main findings from the report. Crucially, compare the patient's data against what is considered "average" or "normal" for a healthy human. Explain if the result is high, low, or normal in extremely simple terms.

### 3. Factors That Might Cause This
If any results are abnormal, list 2-3 common lifestyle, environmental, dietary, or genetic factors that typically cause such results. (Always frame this generally, e.g., "Common causes for this include...", do not diagnose the patient).

### 4. Medical Terms Explained Simply
Create a mini-dictionary breaking down 3-5 of the most complex medical jargon words found in the report into plain, everyday English.

### 5. Questions for Your Doctor
Provide 3 highly specific, actionable questions the patient should ask their doctor during their next visit based on these exact findings.

CRITICAL RULES:
- ANTI-HALLUCINATION: You MUST strictly base your entire summary ONLY on the information present in the provided reports. Do NOT invent data, do NOT add unnecessary generic filler talk, and do NOT discuss conditions or tests that are not explicitly mentioned in the user's files.
- NEVER give a definitive medical diagnosis.
- NEVER suggest treatments or prescribe medications.
- ALWAYS maintain a compassionate, objective, and educational tone.
- Format headings exactly as shown above, using H3 (###) tags.`;

  try {
    const fileParts = await Promise.all(files.map(fileToGenerativePart));
    
    let result;
    try {
      const primaryModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
      result = await primaryModel.generateContent([
        systemPrompt,
        `Please analyze the following medical reports/images and provide the highly detailed, layperson-friendly explanation in ${language}.`,
        ...fileParts as any[]
      ]);
    } catch (primaryErr) {
      console.warn("Primary gemini-2.5-flash error, trying gemini-2.5-pro:", primaryErr);
      const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });
      result = await fallbackModel.generateContent([
        systemPrompt,
        `Please analyze the following medical reports/images and provide the highly detailed, layperson-friendly explanation in ${language}.`,
        ...fileParts as any[]
      ]);
    }
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
}
