import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'mr', name: 'Marathi', native: 'मराठी' },
  { code: 'bn', name: 'Bengali', native: 'বাংলা' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'gu', name: 'Gujarati', native: 'ગુજરાતી' },
];

export const TRANSLATIONS = {
  en: {
    home: 'Home',
    courses: 'Courses',
    portfolios: 'Portfolios',
    opportunities: 'Opportunities',
    applications: 'Applications',
    dashboard: 'Dashboard',
    login: 'Log In',
    signup: 'Sign Up',
    exploreOpportunities: 'Explore Opportunities',
    startLearning: 'Start Learning Free',
    whatWeDo: 'What We Do',
    whatWeDoSubtitle: 'Empowering women with market-relevant skills, portfolio proof, and direct income opportunities.',
    heroTitle: 'Learn Skills. Build Portfolio. Earn Income.',
    heroSubtitle: 'HerEarn is India’s free upskilling platform connecting women to real income opportunities, freelance micro-gigs, and professional growth.',
    exploreCourses: 'Explore Skill Tracks',
    buildPortfolio: 'Build Portfolio',
    aiGuidance: 'AI Career Guidance',
    supportLanguage: 'Language',
  },
  hi: {
    home: 'मुख्य पृष्ठ',
    courses: 'पाठ्यक्रम',
    portfolios: 'पोर्टफोलियो',
    opportunities: 'अवसर',
    applications: 'आवेदन',
    dashboard: 'डैशबोर्ड',
    login: 'लॉग इन',
    signup: 'साइन अप',
    exploreOpportunities: 'अवसर देखें',
    startLearning: 'मुफ्त सीखना शुरू करें',
    whatWeDo: 'हम क्या करते हैं',
    whatWeDoSubtitle: 'महिलाओं को कौशल, पोर्टफोलियो प्रमाण और सीधे आय के अवसरों से सशक्त बनाना।',
    heroTitle: 'कौशल सीखें। पोर्टफोलियो बनाएं। आय कमाएं।',
    heroSubtitle: 'HerEarn भारत का मुफ्त अपस्किलिंग प्लेटफॉर्म है जो महिलाओं को वास्तविक आय के अवसरों और फ्रीलांस माइक्रो-गिग्स से जोड़ता है।',
    exploreCourses: 'कौशल ट्रैक देखें',
    buildPortfolio: 'पोर्टफोलियो बनाएं',
    aiGuidance: 'एआई करियर मार्गदर्शन',
    supportLanguage: 'भाषा',
  },
  mr: {
    home: 'मुख्यपृष्ठ',
    courses: 'कोर्सेस',
    portfolios: 'पोर्टफोलिओ',
    opportunities: 'संधी',
    applications: 'अर्ज',
    dashboard: 'डॅशबोर्ड',
    login: 'लॉगिन',
    signup: 'साइन अप',
    exploreOpportunities: 'संधी शोधा',
    startLearning: 'मोफत शिकण्यास सुरुवात करा',
    whatWeDo: 'आम्ही काय करतो',
    whatWeDoSubtitle: 'महिलांना कौशल्याने समृद्ध करून रोजगाराच्या थेट संधी उपलब्ध करून देणे.',
    heroTitle: 'कौशल्य शिका. पोर्टफोलिओ बनवा. उत्पन्न कमवा.',
    heroSubtitle: 'HerEarn हे भारतातील मोफत कौशल्य विकास प्लॅटफॉर्म आहे जे महिलांना काम आणि उत्पन्नाच्या संधींशी जोडते.',
    exploreCourses: 'कौशल्य ट्रॅक्स',
    buildPortfolio: 'पोर्टफोलिओ बनवा',
    aiGuidance: 'एआय करिअर मार्गदर्शन',
    supportLanguage: 'भाषा',
  },
  bn: {
    home: 'হোম',
    courses: 'কোর্সসমূহ',
    portfolios: 'পোর্টফোলিও',
    opportunities: 'সুযোগসমূহ',
    applications: 'আবেদনসমূহ',
    dashboard: 'ড্যাশবোর্ড',
    login: 'লগ ইন',
    signup: 'সাইন আপ',
    exploreOpportunities: 'সুযোগ খুঁজুন',
    startLearning: 'বিনামূল্যে শেখা শুরু করুন',
    whatWeDo: 'আমরা যা করি',
    whatWeDoSubtitle: 'মহিলাদের দক্ষতা অর্জন, পোর্টফোলিও তৈরি এবং আয়ের সুযোগের সাথে যুক্ত করা।',
    heroTitle: 'দক্ষতা শিখুন। পোর্টফোলিও গড়ুন। আয় করুন।',
    heroSubtitle: 'HerEarn ভারতের বিনামূল্যে দক্ষতা বৃদ্ধির প্ল্যাটফর্ম যা মহিলাদের প্রকৃত আয়ের সুযোগের সাথে সংযুক্ত করে।',
    exploreCourses: 'কোর্স দেখুন',
    buildPortfolio: 'পোর্টফোলিও তৈরি করুন',
    aiGuidance: 'এআই ক্যারিয়ার নির্দেশিকা',
    supportLanguage: 'ভাষা',
  },
  ta: {
    home: 'முகப்பு',
    courses: 'பயிற்சிகள்',
    portfolios: 'போர்ட்ஃபோலியோ',
    opportunities: 'வாய்ப்புகள்',
    applications: 'விண்ணப்பங்கள்',
    dashboard: 'டாஷ்போர்டு',
    login: 'உள்நுழை',
    signup: 'பதிவுசெய்',
    exploreOpportunities: 'வாய்ப்புகளைக் காண்க',
    startLearning: 'இலவசமாகக் கற்கத் தொடங்குங்கள்',
    whatWeDo: 'நாங்கள் செய்வது என்ன',
    whatWeDoSubtitle: 'பெண்களுக்குத் திறன் பயிற்சி அளித்து வருமான வாய்ப்புகளுடன் இணைக்கிறோம்.',
    heroTitle: 'திறன் கற்பீர். போர்ட்ஃபோலியோ உருவாக்குவீர். சம்பாதிப்பீர்.',
    heroSubtitle: 'HerEarn பெண்களுக்கு நேரடி வருமான வாய்ப்புகளை வழங்கும் இலவசத் தளமாகும்.',
    exploreCourses: 'பயிற்சிகளைக் காண்க',
    buildPortfolio: 'போர்ட்ஃபோலியோ உருவாக்கு',
    aiGuidance: 'AI தொழில் வழிகாட்டி',
    supportLanguage: 'மொழி',
  },
  te: {
    home: 'హోమ్',
    courses: 'కోర్సులు',
    portfolios: 'పోర్ట్‌ఫోలియో',
    opportunities: 'అవకాశాలు',
    applications: 'దరఖాస్తులు',
    dashboard: 'డాష్‌బోర్డ్',
    login: 'లాగిన్',
    signup: 'సైన్ అప్',
    exploreOpportunities: 'అవకాశాలను అన్వేషించండి',
    startLearning: 'ఉచితంగా నేర్చుకోవడం ప్రారంభించండి',
    whatWeDo: 'మేము ఏమి చేస్తాము',
    whatWeDoSubtitle: 'మహిళలకు నైపుణ్యాలు నేర్పించి నేరుగా ఆదాయ అవకాశాలతో అనుసంధానించడం.',
    heroTitle: 'నైపుణ్యాలు నేర్చుకోండి. పోర్ట్‌ఫోలియో నిర్మించండి. ఆదాయం సంపాదించండి.',
    heroSubtitle: 'HerEarn మహిళలకు ఉపాధి అవకాశాలను అందించే ఉచిత నైపుణ్య వేదిక.',
    exploreCourses: 'కోర్సులను చూడండి',
    buildPortfolio: 'పోర్ట్‌ఫోలియో నిర్మించండి',
    aiGuidance: 'AI కెరీర్ మార్గదర్శకత్వం',
    supportLanguage: 'భాష',
  },
  gu: {
    home: 'હોમ',
    courses: 'કોર્સ',
    portfolios: 'પોર્ટફોલિયો',
    opportunities: 'તકો',
    applications: 'અરજીઓ',
    dashboard: 'ડેશબોર્ડ',
    login: 'લોગ ઇન',
    signup: 'સાઇન અપ',
    exploreOpportunities: 'તકો શોધો',
    startLearning: 'મફત શીખવાનું શરૂ કરો',
    whatWeDo: 'અમે શું કરીએ છીએ',
    whatWeDoSubtitle: 'મહિલાઓને કૌશલ્ય અને આવકની તકો સાથે સશક્ત બનાવવું.',
    heroTitle: 'કૌશલ્ય શીખો. પોર્ટફોલિયો બનાવો. આવક કમાઓ.',
    heroSubtitle: 'HerEarn મહિલાઓને વાસ્તવિક આવકની તકો સાથે જોડતું મફત કૌશલ્ય પ્લેટફોર્મ છે.',
    exploreCourses: 'કોર્સ જુઓ',
    buildPortfolio: 'પોર્ટફોલિયો બનાવો',
    aiGuidance: 'એઆઈ કારકિર્દી માર્ગદર્શન',
    supportLanguage: 'ભાષા',
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('herearn_language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('herearn_language', language);
  }, [language]);

  const t = (key) => {
    return TRANSLATIONS[language]?.[key] || TRANSLATIONS.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
