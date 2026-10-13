# सेहत सखा (Sehat Sakha) — Aapki Report, Aapki Bhasha Mein 🩺🌾

> **"Understand your health reports, one simple step at a time."**  
> Rural-first, accessible medical laboratory report simplifier with interactive graphs, deterministic reference-range classification, and the friendly digital companion **Sakha**.

[![Google Gemini](https://img.shields.io/badge/Powered_by-Gemini_3_Multimodal-059669?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![React 19](https://img.shields.io/badge/React-19-10b981?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-065f46?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite 8](https://img.shields.io/badge/Bundler-Vite_8-14b8a6?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev/)
[![Live Deployment](https://img.shields.io/badge/Live_Website-ai--medical--simplifier.vercel.app-0284c7?style=for-the-badge&logo=vercel&logoColor=white)](https://ai-medical-simplifier.vercel.app)

---

## 🌟 Defining Rule

> **AI explains. Deterministic software rules classify. Qualified healthcare professionals diagnose and treat.**

---

## 🚀 Key Features

* **🌾 Rural-First User Interface:** High-contrast, deep emerald/navy healthcare palette with large touch targets (48px+) and fully labelled controls designed for entry-level Android devices and users with limited digital literacy.
* **📱 Simple by Default, Detailed When Requested:**
  - **Mode A (Simple Explanation - Default):** Short, calming sentences answering *What is this test?*, *What does my report show?*, and *What does normal range mean?*, paired with 3 doctor questions and live audio subtitle tracking.
  - **Mode B (Detailed Analysis & Graphs):** Accessed via a clear button, rendering 3-zone visual gauge indicators, deterministic overview counts, full clinical narratives, and trend graphs *only when real past reports exist in the vault*.
* **🤖 Sakha (सखा) Mascot & AI Assistant:** An illustrated companion who greets users, guides the upload workflow, and answers questions contextually in everyday Hindi or English.
* **🇮🇳 22 Official Indian Languages Registry (8th Schedule):** Full capability transparency displaying native scripts, translation readiness, and dynamic device voice availability without false claims.
* **📊 Deterministic Reference Engine:** Visual 3-zone bullet gauges (*कम / सामान्य / अधिक*) displaying the patient's exact numeric value, units, reference interval, and human explanations without letting AI guess numbers.
* **📈 Grounded Historical Trend Comparison:** Two-point comparative analysis with previous lab tests saved in HealthVault. When only one report exists, displays an informative guide rather than inventing fake data.
* **🔍 Step-by-Step Verification Review:** Allows patients to review and correct OCR-extracted numbers before narrative generation.
* **📂 HealthVault (मेरी रिपोर्ट्स तिजोरी):** Secure client-side archive to save past reports. Zero prepopulated dummy records; shows clean, friendly empty state when no reports are saved.
* **🩺 3 Questions for Your Doctor:** Practical questions generated for the clinician, complete with a printable clinic checklist and audio read-aloud.
* **🔊 Audio Read-Aloud ("सुनकर समझें"):** Neural text-to-speech engine with sentence-level chunking and phonetic unit expansion (e.g. `mg/dL` -> *मिलीग्राम प्रति डेसीलीटर*) to prevent mobile audio cutoffs.
* **🔒 Privacy-First Architecture:** Zero remote database storage; all files and API keys remain strictly client-side.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **React 19** + **TypeScript** | Type-safe single page application |
| **Styling & Design** | CSS3 Design Tokens + Noto Sans Devanagari | High-contrast, rural-accessible healthcare UI |
| **Classification Engine** | Deterministic Reference Range Parser | Clinical range parsing and mathematical classification |
| **Mascot Illustration** | Pure Inline SVG Components | Zero network overhead, lightweight, offline-ready |
| **AI Companion** | **Google Gemini 3 Multimodal** (Flash & Pro) | Plain-language narrative translation and conversational guidance |
| **Audio** | W3C Web Speech API | Client-side neural voice synthesis (hi-IN & en-US) |
| **Vault Storage** | LocalStorage Engine | Secure client-side report archive |

---

## ⚡ Quick Start

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm** or **pnpm**
* A Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### 2. Configure Environment Variables
Copy `.env.example` to `.env` or set your key in `.env`:
```env
GEMINI_API_KEY=your_gemini_api_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run Development Server
```bash
npm run dev
```
Open **[http://localhost:5173/](http://localhost:5173/)** in your browser.

### 4. Build for Production
```bash
npm run build
```

---

## ⚠️ Medical Disclaimer

*Sehat Sakha is built strictly for educational and informational purposes. It does not provide medical diagnoses or prescribe medications. Always consult a qualified healthcare professional regarding any medical tests or conditions.*
