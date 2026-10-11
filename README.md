# MediSimplify AI — Medical Report & Scan Simplifier 🩺

[![Live Demo](https://img.shields.io/badge/Live_Demo-ai--med--simp--2026--xyz.web.app-2563eb?style=for-the-badge&logo=firebase&logoColor=white)](https://ai-med-simp-2026-xyz.web.app)
[![Google Gemini](https://img.shields.io/badge/Powered_by-Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**MediSimplify AI** is an intelligent, patient-first web application that transforms complex, jargon-heavy medical test reports, pathology results, X-rays, and prescriptions into clear, understandable language. Powered by **Google Gemini 2.5 Flash Multimodal Vision**, it provides structured comparisons against healthy averages, plain-English explanations of clinical markers, and spoken voice read-aloud in both **English and Hindi**.

---

## 🌟 Key Features

* **📄 Multimodal Document Analysis:** Upload single or multiple medical files simultaneously — supports photos (JPG, PNG) of lab slips, pathology reports, X-rays, and plain text files.
* **🧠 Structured 5-Part Breakdown:**
  1. **What Test Was Done & What It Means:** Clear explanation of the procedure.
  2. **Your Results vs. Healthy Average:** Benchmark patient biomarkers against clinical normal ranges.
  3. **Factors That Might Cause This:** Evidence-backed lifestyle, dietary, or environmental factors.
  4. **Medical Terms Explained Simply:** Pocket dictionary breaking down complex medical terminology.
  5. **Questions for Your Doctor:** Actionable, specific questions to ask your healthcare provider.
* **🌐 Bilingual Support (English & Hindi):** Toggle between English and natural Hindi at any time. Keeps test names in English so patients can easily match them to physical signboards and lab slips.
* **🔊 Text-to-Speech (Audio Read-Aloud):** Integrated W3C Web Speech synthesis engine reads out the entire simplified report aloud, complete with memory-anchored utterance management to eliminate browser cutoffs.
* **🖨️ One-Click PDF Export:** Clean, formatted print stylesheet to save or print the simplified summary for your next doctor consultation.
* **🔒 Privacy-First & Zero Logging:** Direct client-side API interaction. Your health reports are never stored in a third-party database.
* **🔑 Flexible API Key Handling:** Runs using configured environment variables or allows users to provide their own free Google Gemini API key via the UI header.

---

## 🚀 Live Demo

Experience the live deployed application on Firebase Hosting:
👉 **[https://ai-med-simp-2026-xyz.web.app](https://ai-med-simp-2026-xyz.web.app)**

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **React 19** + **TypeScript** | Component-driven, type-safe architecture |
| **Bundler & Dev Server** | **Vite 8** | Sub-second HMR and optimized production bundling |
| **AI Engine** | **Google Gemini 2.5 Flash** | Multimodal OCR, report translation, and clinical NLP |
| **SDK** | @google/generative-ai | Direct client-to-Gemini API interface |
| **Styling & UI** | CSS3 Custom Properties + Glassmorphism | Clean, accessible clinical design system |
| **Icons** | **Lucide React** | High-contrast clinical and UI icons |
| **Audio** | **W3C Web Speech API** | Client-side neural voice synthesis (en-US & hi-IN) |
| **Hosting** | **Firebase Hosting** | Globally distributed Edge CDN |

---

## 📂 Project Structure

```text
ai-medical-simplifier/
├── docs/
│   ├── TECHNICAL_DOCUMENTATION.md      # Detailed engineering and architecture report
│   └── RESEARCH_AND_TECHNICAL_REPORT.md # Field research, feasibility & clinical studies
├── public/
│   ├── favicon.svg                     # Medical cross favicon
│   └── icons.svg
├── src/
│   ├── assets/                         # Static UI assets
│   ├── lib/
│   │   └── gemini.ts                   # Gemini API client, system prompt & fallbacks
│   ├── App.css                         # App specific layout styles
│   ├── App.tsx                         # Main UI component & state engine
│   ├── index.css                       # Design tokens, typography & print styles
│   └── main.tsx                        # React DOM root entry
├── .env.example                        # Template for environment variables (NO SECRETS)
├── .gitignore                          # Git rules (excludes .env and build output)
├── firebase.json                       # Firebase Hosting configuration
├── index.html                          # Root HTML template
├── package.json                        # Dependencies and scripts
├── tsconfig.json                       # TypeScript compiler configuration
└── vite.config.ts                      # Vite build configuration
```

---

## ⚡ Quick Start

### 1. Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm** or **pnpm**
* A free **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/)

### 2. Clone the Repository
```bash
git clone https://github.com/<your-username>/ai-medical-simplifier.git
cd ai-medical-simplifier
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Copy `.env.example` to `.env` and add your Gemini API Key:
```bash
cp .env.example .env
```
Open `.env` and insert your key:
```env
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: `.env` is strictly ignored in `.gitignore` and will never be pushed to public repositories).*

### 5. Run the Local Development Server
```bash
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

### 6. Build for Production
```bash
npm run build
```
Production assets are generated into the `dist/` directory.

---

## 🛡️ Medical Safety & Anti-Hallucination Guidelines

MediSimplify AI operates under strict clinical prompt guardrails:
* **Anti-Hallucination Directive:** The AI is strictly prohibited from inventing symptoms, test results, or diseases not present in the uploaded files.
* **No Medical Diagnosis:** Always emphasizes educational explanation over clinical diagnosis.
* **No Treatment or Prescription:** Never recommends medications or specific treatments; directs patients to consult their licensed doctor.
* **Disclaimer Requirement:** A persistent medical disclaimer is rendered with every generated report.

---

## 📖 Extended Documentation

* 📘 [Technical Documentation](docs/TECHNICAL_DOCUMENTATION.md) — Comprehensive technical overview, approach, problems faced, and future scaling.
* 📗 [Research & Clinical Report](docs/RESEARCH_AND_TECHNICAL_REPORT.md) — Clinical OPD congestion studies, linguistic accessibility, impact and feasibility analysis.

---

## ⚖️ License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

## ⚠️ Disclaimer

*This application is built for educational and informational purposes only. It is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.*
