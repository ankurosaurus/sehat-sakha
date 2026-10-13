import type { ReportSummary } from '../types';

export interface SampleReportItem {
  id: string;
  title: string;
  hindiTitle: string;
  badgeEn: string;
  badgeHi: string;
  descriptionEn: string;
  descriptionHi: string;
  reportData: ReportSummary;
}

export const SAMPLE_REPORTS: SampleReportItem[] = [
  {
    id: 'cbc-report',
    title: 'Complete Blood Count (CBC) with Trend',
    hindiTitle: 'कम्प्लीट ब्लड काउंट (सीबीसी) व पुरानी तुलना',
    badgeEn: 'Blood & Immune Health',
    badgeHi: 'रक्त व रोग प्रतिरोधक जांच',
    descriptionEn: 'Elevated WBC (14,200) & mild low Hemoglobin (11.2) with comparison from 3 months ago',
    descriptionHi: 'सफेद रक्त कोशिकाएं अधिक (14,200) व हीमोग्लोबिन 11.2 (3 महीने पुरानी रिपोर्ट से तुलना सहित)',
    reportData: {
      id: 'sample-cbc-2026',
      title: 'Complete Blood Count (CBC) with Differential',
      hindiTitle: 'कम्प्लीट ब्लड काउंट (सीबीसी) व डिफरेंशियल जांच',
      patientName: 'सुरेश कुमार (Suresh Kumar)',
      patientAge: 42,
      patientGender: 'Male',
      collectionDate: '12 Oct 2026',
      labName: 'जन सेवा पैथोलॉजी केंद्र (Jan Seva Pathology)',
      savedAt: '2026-10-12T10:00:00.000Z',
      overallSummaryEn: `Your **Complete Blood Count (CBC)** measures oxygen-carrying red cells, infection-fighting white cells, and blood-clotting platelets.
* **White Blood Cells (14,200 /mcL):** Elevated, indicating your immune system is actively combating a recent infection or temporary inflammation.
* **Hemoglobin (11.2 g/dL):** Slightly below healthy average (13.5 - 17.5), showing mild nutritional anemia, but improving from your earlier baseline of 10.4 g/dL.
* **Platelets (285,000 /mcL):** In optimal normal range.`,
      overallSummaryHi: `आपकी **Complete Blood Count (CBC)** जांच में खून की लाल कोशिकाएं, रोग प्रतिरोधक सफेद कोशिकाएं और प्लेटलेट्स मापे गए हैं।
* **सफेद रक्त कोशिकाएं (WBC: 14,200 /mcL):** सामान्य से अधिक हैं, जो दर्शाता है कि शरीर किसी हालिया संक्रमण या सूजन से सक्रिय रूप से लड़ रहा है।
* **हीमोग्लोबिन (11.2 g/dL):** सामान्य स्तर (13.5 - 17.5) से थोड़ा कम है, हालांकि पिछली रिपोर्ट (10.4) से इसमें सुधार दिख रहा है।
* **प्लेटलेट्स (285,000 /mcL):** पूरी तरह सुरक्षित और सामान्य सीमा में हैं।`,
      doctorQuestionsEn: [
        'Given my elevated White Blood Cell count (14,200), do you suspect a specific recent infection?',
        'My Hemoglobin improved from 10.4 to 11.2 g/dL. Should I continue the current iron-rich diet and supplements?',
        'When should we repeat this test to confirm that white blood cells have returned to normal?'
      ],
      doctorQuestionsHi: [
        'सफेद रक्त कोशिकाओं (14,200) के बढ़े होने पर क्या किसी विशेष संक्रमण का संदेह है?',
        'मेरा हीमोग्लोबिन 10.4 से बढ़कर 11.2 हुआ है। क्या मुझे आयरन का खान-पान और दवाएं जारी रखनी चाहिए?',
        'सफेद रक्त कोशिकाओं के सामान्य होने की पुष्टि के लिए दोबारा टेस्ट कब कराना होगा?'
      ],
      parameters: [
        {
          id: 'cbc-wbc',
          name: 'Total WBC Count',
          hindiName: 'सफेद रक्त कोशिकाएं (रोग प्रतिरोधक)',
          value: 14200,
          unit: '/mcL',
          rangeText: '4000 - 11000',
          rangeLow: 4000,
          rangeHigh: 11000,
          status: 'high',
          confidence: 'verified',
          simpleExplanationEn: 'White blood cells are your body’s defense army. Higher counts usually mean fighting an infection or healing from inflammation.',
          simpleExplanationHi: 'यह शरीर की सुरक्षा सेना है। अधिक संख्या आमतौर पर किसी इन्फेक्शन या शारीरिक तनाव से लड़ने का संकेत देती है।',
          previousValue: 8500,
          previousDate: '15 Jan 2026'
        },
        {
          id: 'cbc-hb',
          name: 'Hemoglobin (Hb)',
          hindiName: 'हीमोग्लोबिन (खून में लाल तत्व)',
          value: 11.2,
          unit: 'g/dL',
          rangeText: '13.5 - 17.5',
          rangeLow: 13.5,
          rangeHigh: 17.5,
          status: 'low',
          confidence: 'verified',
          simpleExplanationEn: 'Hemoglobin carries oxygen to muscles and brain. A level of 11.2 is slightly low, though better than your past 10.4 measurement.',
          simpleExplanationHi: 'यह फेफड़ों से शरीर में ऑक्सीजन पहुंचाता है। 11.2 स्तर सामान्य से हल्का कम है, हालांकि पिछली 10.4 की माप से बेहतर है।',
          previousValue: 10.4,
          previousDate: '15 Jan 2026'
        },
        {
          id: 'cbc-neutro',
          name: 'Neutrophils',
          hindiName: 'न्यूट्रोफिल्स (बैक्टीरिया रक्षक)',
          value: 78,
          unit: '%',
          rangeText: '40 - 70',
          rangeLow: 40,
          rangeHigh: 70,
          status: 'high',
          confidence: 'verified',
          simpleExplanationEn: 'The primary white cells that neutralize bacteria. Elevated along with total WBC.',
          simpleExplanationHi: 'यह बैक्टीरिया से लड़ने वाली मुख्य कोशिकाएं हैं। कुल WBC के साथ इनका प्रतिशत भी बढ़ा हुआ है।',
          previousValue: 62,
          previousDate: '15 Jan 2026'
        },
        {
          id: 'cbc-plt',
          name: 'Platelet Count',
          hindiName: 'प्लेटलेट्स (थक्का जमाने वाले सेल)',
          value: 285000,
          unit: '/mcL',
          rangeText: '150000 - 450000',
          rangeLow: 150000,
          rangeHigh: 450000,
          status: 'normal',
          confidence: 'verified',
          simpleExplanationEn: 'Crucial for stopping bleeding and wound recovery. Perfectly within healthy bounds.',
          simpleExplanationHi: 'चोट लगने पर खून रोकने के लिए जरूरी कोशिकाएं। यह पूरी तरह स्वस्थ सीमा में हैं।',
          previousValue: 240000,
          previousDate: '15 Jan 2026'
        }
      ]
    }
  },
  {
    id: 'lipid-report',
    title: 'Fasting Lipid (Cholesterol) Profile',
    hindiTitle: 'लिपिड प्रोफाइल (कोलेस्ट्रॉल व दिल का स्वास्थ्य)',
    badgeEn: 'Heart & Artery Wellness',
    badgeHi: 'हृदय व धमनियों का स्वास्थ्य',
    descriptionEn: 'Total Cholesterol 245 mg/dL & LDL 165 mg/dL with HDL 38 mg/dL',
    descriptionHi: 'कुल कोलेस्ट्रॉल 245 व खराब एलडीएल 165 (खान-पान व व्यायाम से सुधार योग्य)',
    reportData: {
      id: 'sample-lipid-2026',
      title: 'Fasting Lipid Profile (Comprehensive)',
      hindiTitle: 'फास्टिंग लिपिड प्रोफाइल (कोलेस्ट्रॉल जांच)',
      patientName: 'कमला देवी (Kamla Devi)',
      patientAge: 49,
      patientGender: 'Female',
      collectionDate: '10 Oct 2026',
      labName: 'अपोलो क्लिनिकल लैब्स (Apollo Labs)',
      savedAt: '2026-10-10T10:00:00.000Z',
      overallSummaryEn: `Your **Lipid Profile** checks fats and cholesterol in your circulation.
* **Total Cholesterol (245 mg/dL):** Above the desirable ceiling of 200 mg/dL.
* **LDL ("Bad" Cholesterol: 165 mg/dL):** High compared to optimal target (< 100 mg/dL). Excess amounts can deposit on arterial walls.
* **Triglycerides (210 mg/dL):** Borderline high (target < 150 mg/dL).
* **HDL ("Good" Protective Cholesterol: 38 mg/dL):** Below the optimal 50 mg/dL benchmark for females.`,
      overallSummaryHi: `आपकी **Lipid Profile** खून में वसा और कोलेस्ट्रॉल की जांच करती है।
* **कुल कोलेस्ट्रॉल (245 mg/dL):** वांछनीय 200 mg/dL सीमा से अधिक है।
* **एलडीएल ("खराब" कोलेस्ट्रॉल: 165 mg/dL):** सामान्य 100 mg/dL से अधिक है। यह नसों में रुकावट पैदा कर सकता है।
* **ट्राइग्लिसराइड्स (210 mg/dL):** सामान्य 150 mg/dL से बढ़ा हुआ है।
* **एचडीएल ("अच्छा" कोलेस्ट्रॉल: 38 mg/dL):** महिलाओं के लिए 50 mg/dL से अधिक होना बेहतर होता है।`,
      doctorQuestionsEn: [
        'What dietary changes (cooking oils, snacks) do you suggest to lower LDL and Triglycerides?',
        'Do I need regular walking or specific physical exercise to increase my protective HDL?',
        'In how many months should we repeat this fasting test to observe changes?'
      ],
      doctorQuestionsHi: [
        'खराब कोलेस्ट्रॉल कम करने के लिए खाने-पीने और तेल में क्या बदलाव करने चाहिए?',
        'अच्छे एचडीएल कोलेस्ट्रॉल को बढ़ाने के लिए क्या नियमित टहलना पर्याप्त होगा?',
        'इन बदलावों के कितने महीनों बाद दोबारा खाली पेट जांच करानी चाहिए?'
      ],
      parameters: [
        {
          id: 'lipid-chol',
          name: 'Total Cholesterol',
          hindiName: 'कुल कोलेस्ट्रॉल (खून में वसा)',
          value: 245,
          unit: 'mg/dL',
          rangeText: '< 200',
          rangeHigh: 200,
          status: 'high',
          confidence: 'verified',
          simpleExplanationEn: 'Overall measure of fatty compounds. 245 is elevated above the 200 threshold.',
          simpleExplanationHi: 'खून में कुल वसा का माप। 245 स्तर 200 की सामान्य सीमा से ऊपर है।',
          previousValue: 260,
          previousDate: '12 Nov 2025'
        },
        {
          id: 'lipid-ldl',
          name: 'LDL Cholesterol ("Bad")',
          hindiName: 'खराब कोलेस्ट्रॉल (एलडीएल)',
          value: 165,
          unit: 'mg/dL',
          rangeText: '< 100',
          rangeHigh: 100,
          status: 'high',
          confidence: 'verified',
          simpleExplanationEn: 'Can accumulate along artery walls over years. Healthy target is below 100.',
          simpleExplanationHi: 'यह धमनियों की दीवारों पर जम सकता है। स्वस्थ लक्ष्य 100 से कम होना चाहिए।',
          previousValue: 180,
          previousDate: '12 Nov 2025'
        },
        {
          id: 'lipid-trig',
          name: 'Serum Triglycerides',
          hindiName: 'ट्राइग्लिसराइड्स (भंडारित चर्बी)',
          value: 210,
          unit: 'mg/dL',
          rangeText: '< 150',
          rangeHigh: 150,
          status: 'high',
          confidence: 'verified',
          simpleExplanationEn: 'Stored fat from excess calories and sweets. 210 is above the 150 target.',
          simpleExplanationHi: 'अतिरिक्त कैलोरी और मीठे से बनने वाली चर्बी। 210 का स्तर 150 से अधिक है।',
          previousValue: 230,
          previousDate: '12 Nov 2025'
        },
        {
          id: 'lipid-hdl',
          name: 'HDL Cholesterol ("Good")',
          hindiName: 'अच्छा कोलेस्ट्रॉल (सुरक्षा कवच)',
          value: 38,
          unit: 'mg/dL',
          rangeText: '> 50',
          rangeLow: 50,
          status: 'low',
          confidence: 'verified',
          simpleExplanationEn: 'Helps clear bad fats out of circulation. 38 is below the optimal 50 target.',
          simpleExplanationHi: 'यह अतिरिक्त वसा को साफ करने में मदद करता है। 38 का स्तर 50 से कम है।',
          previousValue: 35,
          previousDate: '12 Nov 2025'
        }
      ]
    }
  },
  {
    id: 'ambiguous-report',
    title: 'Biomarker Panel (Missing Range / Uncertain OCR)',
    hindiTitle: 'अस्पष्ट रिपोर्ट (मिसिंग रेंज व समीक्षा उदाहरण)',
    badgeEn: 'Validation Demo',
    badgeHi: 'सत्यापन डेमो उदाहरण',
    descriptionEn: 'Demonstrates how Sehat Sakha safely flags uncertain OCR and unprovided laboratory ranges',
    descriptionHi: 'यह दिखाता है कि कैसे अस्पष्ट आंकड़े व छूटी हुई रेंज को सुरक्षित रूप से चिह्नित किया जाता है',
    reportData: {
      id: 'sample-ambiguous-2026',
      title: 'Specialized Metabolic & Enzyme Screen',
      hindiTitle: 'मेटाबॉलिक व एंजाइम स्क्रीन (अस्पष्ट उदाहरण)',
      patientName: 'अमित वर्मा (Amit Verma)',
      patientAge: 35,
      patientGender: 'Male',
      collectionDate: '08 Oct 2026',
      labName: 'सिटी हेल्थ डायग्नोस्टिक्स (City Health)',
      savedAt: '2026-10-08T10:00:00.000Z',
      overallSummaryEn: `This demonstration showcases how **Sehat Sakha** never fabricates ranges or treats uncertain OCR as definite facts.
* **Vitamin D3 (18.5 ng/mL):** Deficient (< 20 ng/mL), commonly corrected with physician-guided sun exposure or supplement.
* **Specialized Enzyme (Isozyme B):** The laboratory did not print a biological reference interval. Classified as **Indeterminate** pending clinical verification.
* **Serum Ferritin (28 ng/mL):** Within standard normal range (20 - 250 ng/mL).`,
      overallSummaryHi: `यह उदाहरण प्रदर्शित करता है कि कैसे **सेहत सखा** बिना पुष्टि के कोई झूठी रेंज नहीं बनाता और मरीज की सुरक्षा सर्वोपरि रखता है।
* **विटामिन डी3 (18.5 ng/mL):** सामान्य 20 से कम (हल्की कमी), डॉक्टर की सलाह से धूप या सप्लीमेंट द्वारा ठीक हो सकता है।
* **विशेष एंजाइम (Isozyme B):** पर्चे पर कोई रेफरेंस रेंज छपी नहीं थी। इसे **अस्पष्ट (समीक्षा आवश्यक)** श्रेणी में रखा गया है।
* **सीरम फेरिटिन (28 ng/mL):** पूरी तरह सामान्य सीमा (20 - 250 ng/mL) में है।`,
      doctorQuestionsEn: [
        'What dosage of Vitamin D3 supplement is right for my deficiency (18.5 ng/mL)?',
        'Could you verify the normal laboratory reference standard for Isozyme B in our hospital?',
        'Does my Ferritin level (28 ng/mL) indicate sufficient iron stores?'
      ],
      doctorQuestionsHi: [
        'विटामिन डी3 (18.5) की कमी पूरी करने के लिए मुझे कितनी मात्रा में दवा लेनी चाहिए?',
        'इस अस्पताल की लैब में Isozyme B की सामान्य सीमा क्या मानी जाती है?',
        'क्या 28 ng/mL फेरिटिन शरीर में पर्याप्त आयरन भंडार दर्शाता है?'
      ],
      parameters: [
        {
          id: 'ambig-vitd',
          name: 'Vitamin D3 (25-OH)',
          hindiName: 'विटामिन डी3 (हड्डी व धूप तत्व)',
          value: 18.5,
          unit: 'ng/mL',
          rangeText: '20.0 - 50.0',
          rangeLow: 20.0,
          rangeHigh: 50.0,
          status: 'low',
          confidence: 'verified',
          simpleExplanationEn: 'Critical for bone strength and immunity. 18.5 is slightly below the 20 sufficiency mark.',
          simpleExplanationHi: 'हड्डियों की मजबूती के लिए आवश्यक। 18.5 का स्तर 20 की सामान्य सीमा से थोड़ा कम है।'
        },
        {
          id: 'ambig-isozyme',
          name: 'Isozyme B Fraction',
          hindiName: 'विशेष आइसोएंजाइम बी',
          value: 4.8,
          unit: 'U/L',
          rangeText: 'उपलब्ध नहीं (Not Specified)',
          status: 'indeterminate',
          confidence: 'uncertain',
          simpleExplanationEn: 'No biological reference range provided by the lab slip. Please verify directly with your physician.',
          simpleExplanationHi: 'इस पर्चे पर कोई सामान्य सीमा दर्ज नहीं थी। कृपया डॉक्टर से सीधे इसकी सामान्य रेंज पूछें।'
        },
        {
          id: 'ambig-ferritin',
          name: 'Serum Ferritin',
          hindiName: 'फेरिटिन (आयरन स्टोरेज)',
          value: 28,
          unit: 'ng/mL',
          rangeText: '20 - 250',
          rangeLow: 20,
          rangeHigh: 250,
          status: 'normal',
          confidence: 'verified',
          simpleExplanationEn: 'Measures your stored iron reserve. In the healthy normal zone.',
          simpleExplanationHi: 'शरीर में जमा आयरन का भंडार। यह सुरक्षित सामान्य सीमा में है।'
        }
      ]
    }
  }
];
