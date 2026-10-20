import React, { useState, useMemo, useRef } from 'react';
import {
  Sparkles,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Info
} from 'lucide-react';

interface DistrictHighlightsProps {
  language: 'hi' | 'en';
  onSelectDistrict?: (districtName: string) => void;
  inDashboard?: boolean;
}

const all38DistrictVisits = [
    // 1. Patna Division
    {
      id: 'patna',
      name: 'Patna',
      nameHi: 'पटना',
      division: 'Patna',
      divisionHi: 'पटना प्रमंडल',
      img: '/gallery/development/1.jpg',
      visitTitleHi: 'गंगा मरीन ड्राइव एवं जेपी गंगा पथ विस्तारीकरण निरीक्षण',
      visitTitleEn: 'Ganga Marine Drive & JP Ganga Path Inspection',
      tagHi: 'माननीय मुख्यमंत्री निरीक्षण दौरा',
      tagEn: "Hon'ble CM Inspection Tour",
    },
    {
      id: 'nalanda',
      name: 'Nalanda',
      nameHi: 'नालंदा (बिहारशरीफ)',
      division: 'Patna',
      divisionHi: 'पटना प्रमंडल',
      img: '/gallery/development/3.jpg',
      visitTitleHi: 'नालंदा मेडिकल कॉलेज व हेरिटेज सर्किट निर्माण निरीक्षण',
      visitTitleEn: 'Nalanda Medical College & Heritage Circuit Review',
      tagHi: 'निर्माण कार्य स्थलीय निरीक्षण',
      tagEn: 'On-site Construction Inspection',
    },
    {
      id: 'bhojpur',
      name: 'Bhojpur',
      nameHi: 'भोजपुर (आरा)',
      division: 'Patna',
      divisionHi: 'पटना प्रमंडल',
      img: '/gallery/development/18.jpg',
      visitTitleHi: 'सड़क चौड़ीकरण एवं बाईपास परियोजना समीक्षा बैठक',
      visitTitleEn: 'Road Widening & Bypass Projects Review Meeting',
      tagHi: 'विभागीय समीक्षा बैठक',
      tagEn: 'Departmental Review Meeting',
    },
    {
      id: 'buxar',
      name: 'Buxar',
      nameHi: 'बक्सर',
      division: 'Patna',
      divisionHi: 'पटना प्रमंडल',
      img: '/gallery/development/2.jpg',
      visitTitleHi: 'बक्सर थर्मल पावर प्लांट एवं गंगा रिवरफ्रंट निरीक्षण',
      visitTitleEn: 'Buxar Thermal Power & Ganga Riverfront Inspection',
      tagHi: 'ऊर्जा एवं अवसंरचना दौरा',
      tagEn: 'Energy & Infrastructure Tour',
    },
    {
      id: 'rohtas',
      name: 'Rohtas',
      nameHi: 'रोहतास (सासाराम)',
      division: 'Patna',
      divisionHi: 'पटना प्रमंडल',
      img: '/gallery/development/11.jpg',
      visitTitleHi: 'कैमूर पहाड़ी चेक डैम एवं कृषि सिंचाई योजना लोकार्पण',
      visitTitleEn: 'Kaimur Hill Check Dam & Irrigation Dedication',
      tagHi: 'किसान व लाभार्थी सम्मान',
      tagEn: 'Beneficiary & Farmer Program',
    },
    {
      id: 'kaimur',
      name: 'Kaimur',
      nameHi: 'कैमूर (भभुआ)',
      division: 'Patna',
      divisionHi: 'पटना प्रमंडल',
      img: '/gallery/development/8.jpg',
      visitTitleHi: 'सीमावर्ती सुरक्षा, पुलिस बल एवं ग्रामीण सड़क निरीक्षण',
      visitTitleEn: 'Border Security & Rural Roads Inspection',
      tagHi: 'कानून व्यवस्था एवं सुरक्षा समीक्षा',
      tagEn: 'Law & Order Review',
    },

    // 2. Magadh Division
    {
      id: 'gaya',
      name: 'Gaya',
      nameHi: 'गयाजी',
      division: 'Magadh',
      divisionHi: 'मगध प्रमंडल',
      img: '/gallery/development/5.jpg',
      visitTitleHi: 'फल्गु रबर डैम, विष्णुपद व महाबोधि कॉरिडोर विकास समीक्षा',
      visitTitleEn: 'Falgu Rubber Dam & Mahabodhi Corridor Review',
      tagHi: 'तीर्थ विकास एवं हेरिटेज दौरा',
      tagEn: 'Heritage & Pilgrimage Tour',
    },
    {
      id: 'aurangabad',
      name: 'Aurangabad',
      nameHi: 'औरंगाबाद',
      division: 'Magadh',
      divisionHi: 'मगध प्रमंडल',
      img: '/gallery/leadership/1.jpg',
      visitTitleHi: 'उत्तर कोयल नहर परियोजना एवं औद्योगिक क्लस्टर समीक्षा',
      visitTitleEn: 'North Koel Canal & Industrial Cluster Review',
      tagHi: 'औद्योगिक निवेश व सुशासन',
      tagEn: 'Industrial Investment & Governance',
    },
    {
      id: 'nawada',
      name: 'Nawada',
      nameHi: 'नवादा',
      division: 'Magadh',
      divisionHi: 'मगध प्रमंडल',
      img: '/gallery/development/10.jpg',
      visitTitleHi: 'ककोलत जलप्रपात ईको-टूरिज्म व गंगा जल आपूर्ति निरीक्षण',
      visitTitleEn: 'Kakolat Eco-Tourism & Ganga Water Supply Review',
      tagHi: 'जनहित योजना वितरण',
      tagEn: 'Public Welfare Distribution',
    },
    {
      id: 'jehanabad',
      name: 'Jehanabad',
      nameHi: 'जहानाबाद',
      division: 'Magadh',
      divisionHi: 'मगध प्रमंडल',
      img: '/gallery/development/12.jpg',
      visitTitleHi: 'बराबर गुफाएं हेरिटेज सर्किट एवं लोक शिकायत निवारण',
      visitTitleEn: 'Barabar Caves Heritage & Public Grievance Redressal',
      tagHi: 'जनसुनवाई एवं समीक्षा',
      tagEn: 'Public Redressal & Review',
    },
    {
      id: 'arwal',
      name: 'Arwal',
      nameHi: 'अरवल',
      division: 'Magadh',
      divisionHi: 'मगध प्रमंडल',
      img: '/gallery/development/7.jpg',
      visitTitleHi: 'सोन नदी तटबंध सुरक्षा एवं जिला समाहरणालय समीक्षा',
      visitTitleEn: 'Son Embankment Protection & Collectorate Review',
      tagHi: 'प्रशासनिक कार्यशाला',
      tagEn: 'Administrative Review',
    },

    // 3. Tirhut Division
    {
      id: 'muzaffarpur',
      name: 'Muzaffarpur',
      nameHi: 'मुजफ्फरपुर',
      division: 'Tirhut',
      divisionHi: 'तिरहुत प्रमंडल',
      img: '/gallery/development/6.jpg',
      visitTitleHi: 'एसकेएमसीएच सुपर स्पेशियलिटी ब्लॉक एवं कैंसर संस्थान शिलान्यास',
      visitTitleEn: 'SKMCH Super Specialty & Cancer Hospital Foundation',
      tagHi: 'स्वास्थ्य अवसंरचना लोकार्पण',
      tagEn: 'Healthcare Dedication',
    },
    {
      id: 'east_champaran',
      name: 'East Champaran',
      nameHi: 'पूर्वी चंपारण (मोतिहारी)',
      division: 'Tirhut',
      divisionHi: 'तिरहुत प्रमंडल',
      img: '/gallery/development/13.jpg',
      visitTitleHi: 'गांधी स्मृति संग्रहालय, आदर्श विद्यालय व छात्रा संवाद',
      visitTitleEn: 'Gandhi Memorial & Model School Student Dialogue',
      tagHi: 'शिक्षा एवं युवा संवाद दौरा',
      tagEn: 'Youth & Education Dialogue',
    },
    {
      id: 'west_champaran',
      name: 'West Champaran',
      nameHi: 'पश्चिम चंपारण (बेतिया)',
      division: 'Tirhut',
      divisionHi: 'तिरहुत प्रमंडल',
      img: '/gallery/development/14.jpg',
      visitTitleHi: 'वाल्मीकि टाइगर रिजर्व ईको-टूरिज्म व विकसित बिहार महासम्मेलन',
      visitTitleEn: 'Valmiki Tiger Reserve Eco-Tourism & State Convention',
      tagHi: 'विशाल जनसभा एवं विकास घोषणा',
      tagEn: 'Public Address & Announcements',
    },
    {
      id: 'sitamarhi',
      name: 'Sitamarhi',
      nameHi: 'सीतामढ़ी',
      division: 'Tirhut',
      divisionHi: 'तिरहुत प्रमंडल',
      img: '/gallery/development/4.jpg',
      visitTitleHi: 'पुनौरा धाम जानकी मंदिर कॉरिडोर एवं भारत-नेपाल सीमा विकास',
      visitTitleEn: 'Punaura Dham Janki Mandir Corridor & Border Review',
      tagHi: 'धार्मिक पर्यटन व सीमांत विकास',
      tagEn: 'Religious Tourism & Border Dev',
    },
    {
      id: 'sheohar',
      name: 'Sheohar',
      nameHi: 'शिवहर',
      division: 'Tirhut',
      divisionHi: 'तिरहुत प्रमंडल',
      img: '/gallery/development/16.jpg',
      visitTitleHi: 'बागमती बाढ़ सुरक्षा तटबंध एवं डिजिटल क्लासरूम शुभारंभ',
      visitTitleEn: 'Bagmati Flood Embankment & Smart Classrooms Launch',
      tagHi: 'डिजिटल शिक्षा व सुरक्षा',
      tagEn: 'Digital Education Launch',
    },
    {
      id: 'vaishali',
      name: 'Vaishali',
      nameHi: 'वैशाली (हाजीपुर)',
      division: 'Tirhut',
      divisionHi: 'तिरहुत प्रमंडल',
      img: '/gallery/development/12.jpg',
      visitTitleHi: 'बुद्ध सम्यक दर्शन संग्रहालय एवं औद्योगिक पार्क निरीक्षण',
      visitTitleEn: 'Buddha Samyak Darshan Museum & Industrial Park Visit',
      tagHi: 'उद्योग एवं संस्कृति निरीक्षण',
      tagEn: 'Industry & Culture Tour',
    },

    // 4. Saran Division
    {
      id: 'saran',
      name: 'Saran',
      nameHi: 'सारण (छपरा)',
      division: 'Saran',
      divisionHi: 'सारण प्रमंडल',
      img: '/gallery/development/8.jpg',
      visitTitleHi: 'डबल डेकर फ्लाईओवर एवं जयप्रकाश विश्वविद्यालय परिसर समीक्षा',
      visitTitleEn: 'Double Decker Flyover & JP University Campus Review',
      tagHi: 'यातायात अवसंरचना निरीक्षण',
      tagEn: 'Transit Infrastructure Review',
    },
    {
      id: 'siwan',
      name: 'Siwan',
      nameHi: 'सीवान',
      division: 'Saran',
      divisionHi: 'सारण प्रमंडल',
      img: '/gallery/leadership/2.jpg',
      visitTitleHi: 'जीरादेई प्रथम राष्ट्रपति स्मारक एवं स्वास्थ्य केंद्र निरीक्षण',
      visitTitleEn: 'Ziradei Presidential Memorial & Health Centers Tour',
      tagHi: 'प्रेस ब्रीफिंग एवं समीक्षा',
      tagEn: 'Press Briefing & Inspection',
    },
    {
      id: 'gopalganj',
      name: 'Gopalganj',
      nameHi: 'गोपालगंज',
      division: 'Saran',
      divisionHi: 'सारण प्रमंडल',
      img: '/gallery/leadership/3.jpg',
      visitTitleHi: 'थावे दुर्गा मंदिर कॉरिडोर जीर्णोद्धार एवं गन्ना उद्योग समीक्षा',
      visitTitleEn: 'Thawe Temple Corridor & Sugar Mills Revival Review',
      tagHi: 'ग्रामीण विकास एवं जनसंवाद',
      tagEn: 'Rural Development & Dialogue',
    },

    // 5. Darbhanga Division
    {
      id: 'darbhanga',
      name: 'Darbhanga',
      nameHi: 'दरभंगा',
      division: 'Darbhanga',
      divisionHi: 'दरभंगा प्रमंडल',
      img: '/gallery/development/4.jpg',
      visitTitleHi: 'एम्स (AIIMS) निर्माण स्थल एवं दरभंगा एयरपोर्ट विस्तारीकरण निरीक्षण',
      visitTitleEn: 'Darbhanga AIIMS Construction & Airport Expansion Visit',
      tagHi: 'एम्स व विमानपत्तन निरीक्षण',
      tagEn: 'AIIMS & Airport Inspection',
    },
    {
      id: 'madhubani',
      name: 'Madhubani',
      nameHi: 'मधुबनी',
      division: 'Darbhanga',
      divisionHi: 'दरभंगा प्रमंडल',
      img: '/gallery/leadership/4.jpg',
      visitTitleHi: 'मिथिला चित्रकला संस्थान एवं कन्या शिक्षा संवर्धन समीक्षा',
      visitTitleEn: 'Mithila Art Institute & Girls Education Outreach',
      tagHi: 'कला, संस्कृति व शिक्षा प्रोत्साहन',
      tagEn: 'Culture & Education Promotion',
    },
    {
      id: 'samastipur',
      name: 'Samastipur',
      nameHi: 'समस्तीपुर',
      division: 'Darbhanga',
      divisionHi: 'दरभंगा प्रमंडल',
      img: '/gallery/development/10.jpg',
      visitTitleHi: 'राजेंद्र कृषि विश्वविद्यालय रिसर्च विंग व हर घर नल का जल निरीक्षण',
      visitTitleEn: 'Agricultural University & Har Ghar Nal Ka Jal Visit',
      tagHi: 'कृषि शोध एवं नल-जल समीक्षा',
      tagEn: 'Agriculture Research & Water Dev',
    },

    // 6. Kosi Division
    {
      id: 'saharsa',
      name: 'Saharsa',
      nameHi: 'सहरसा',
      division: 'Kosi',
      divisionHi: 'कोसी प्रमंडल',
      img: '/gallery/development/16.jpg',
      visitTitleHi: 'कोसी क्षेत्रीय अस्पताल आधुनिकीकरण एवं मत्सय पालन क्लस्टर',
      visitTitleEn: 'Kosi Regional Hospital Modernization & Fisheries Cluster',
      tagHi: 'स्वास्थ्य व आजीविका दौरा',
      tagEn: 'Healthcare & Livelihood Tour',
    },
    {
      id: 'supaul',
      name: 'Supaul',
      nameHi: 'सुपौल',
      division: 'Kosi',
      divisionHi: 'कोसी प्रमंडल',
      img: '/gallery/development/2.jpg',
      visitTitleHi: 'कोसी बराज तटबंध सुदृढ़ीकरण एवं 132KV ग्रिड सब-स्टेशन निरीक्षण',
      visitTitleEn: 'Kosi Barrage Embankment & 132KV Grid Sub-station Visit',
      tagHi: 'ऊर्जा एवं बाढ़ सुरक्षा निरीक्षण',
      tagEn: 'Flood Defense & Power Review',
    },
    {
      id: 'madhepura',
      name: 'Madhepura',
      nameHi: 'मधेपुरा',
      division: 'Kosi',
      divisionHi: 'कोसी प्रमंडल',
      img: '/gallery/development/9.jpg',
      visitTitleHi: 'इलेक्ट्रिक लोकोमोटिव फैक्ट्री व जननायक कर्पूरी ठाकुर मेडिकल कॉलेज',
      visitTitleEn: 'Electric Locomotive Plant & Medical College Review',
      tagHi: 'औद्योगिक व चिकित्सा समीक्षा',
      tagEn: 'Industry & Medical Inspection',
    },

    // 7. Purnia Division
    {
      id: 'purnia',
      name: 'Purnia',
      nameHi: 'पूर्णिया',
      division: 'Purnia',
      divisionHi: 'पूर्णिया प्रमंडल',
      img: '/gallery/development/7.jpg',
      visitTitleHi: 'पूर्णिया एयरपोर्ट सिविल एन्क्लेव एवं मक्का-मखाना प्रोसेसिंग हब',
      visitTitleEn: 'Purnia Airport Civil Enclave & Agro Processing Hub',
      tagHi: 'विमानन एवं कृषि उद्योग समीक्षा',
      tagEn: 'Aviation & Agro Review',
    },
    {
      id: 'katihar',
      name: 'Katihar',
      nameHi: 'कटिहार',
      division: 'Purnia',
      divisionHi: 'पूर्णिया प्रमंडल',
      img: '/gallery/development/15.jpg',
      visitTitleHi: 'मनिहारी-साहिबगंज गंगा सेतु व सामाजिक सुरक्षा पेंशन वितरण',
      visitTitleEn: 'Manihari Ganga Bridge & DBT Social Security Distribution',
      tagHi: 'पेंशन डीबीटी व सेतु निरीक्षण',
      tagEn: 'DBT Launch & Bridge Review',
    },
    {
      id: 'araria',
      name: 'Araria',
      nameHi: 'अररिया',
      division: 'Purnia',
      divisionHi: 'पूर्णिया प्रमंडल',
      img: '/gallery/development/3.jpg',
      visitTitleHi: 'जोकीहाट ग्रामीण सड़क नवीनीकरण एवं सीमावर्ती व्यापार सुविधा केंद्र',
      visitTitleEn: 'Rural Roads Upgrade & Border Trade Facilitation Centre',
      tagHi: 'सड़क एवं व्यापार समीक्षा',
      tagEn: 'Roads & Trade Review',
    },
    {
      id: 'kishanganj',
      name: 'Kishanganj',
      nameHi: 'किशनगंज',
      division: 'Purnia',
      divisionHi: 'पूर्णिया प्रमंडल',
      img: '/gallery/development/1.jpg',
      visitTitleHi: 'चाय बगान प्रसंस्करण इकाइयां एवं अल्पसंख्यक कन्या आवासीय विद्यालय',
      visitTitleEn: 'Tea Processing Units & Girls Residential School Visit',
      tagHi: 'कल्याणकारी योजना निरीक्षण',
      tagEn: 'Welfare Schemes Inspection',
    },

    // 8. Bhagalpur Division
    {
      id: 'bhagalpur',
      name: 'Bhagalpur',
      nameHi: 'भागलपुर',
      division: 'Bhagalpur',
      divisionHi: 'भागलपुर प्रमंडल',
      img: '/gallery/development/2.jpg',
      visitTitleHi: 'विक्रमशिला सेतु समानांतर फोर-लेन पुल व सिल्क पार्क निरीक्षण',
      visitTitleEn: 'Vikramshila 4-Lane Parallel Bridge & Silk Park Visit',
      tagHi: 'मेगा ब्रिज एवं सिल्क क्लस्टर',
      tagEn: 'Mega Bridge & Silk Cluster',
    },
    {
      id: 'banka',
      name: 'Banka',
      nameHi: 'बाँका',
      division: 'Bhagalpur',
      divisionHi: 'भागलपुर प्रमंडल',
      img: '/gallery/development/5.jpg',
      visitTitleHi: 'मदार पर्वत रोपवे एवं ओढ़नी डैम ईको-पर्यटन केंद्र समीक्षा',
      visitTitleEn: 'Mandar Hill Ropeway & Odhani Dam Eco-Tourism Review',
      tagHi: 'ईको-टूरिज्म विकास दौरा',
      tagEn: 'Eco-Tourism Development',
    },

    // 9. Munger Division
    {
      id: 'munger',
      name: 'Munger',
      nameHi: 'मुंगेर',
      division: 'Munger',
      divisionHi: 'मुंगेर प्रमंडल',
      img: '/gallery/development/17.jpg',
      visitTitleHi: 'मुंगेर गंगा रेल-सह-सड़क पुल अप्रोच रोड व विश्वविद्यालय भवन',
      visitTitleEn: 'Ganga Rail-cum-Road Bridge Approach & University Campus',
      tagHi: 'प्रमंडलीय विकास समीक्षा',
      tagEn: 'Divisional Review',
    },
    {
      id: 'begusarai',
      name: 'Begusarai',
      nameHi: 'बेगूसराय',
      division: 'Munger',
      divisionHi: 'मुंगेर प्रमंडल',
      img: '/gallery/development/9.jpg',
      visitTitleHi: 'बरौनी रिफाइनरी विस्तारीकरण, उर्वरक संयंत्र व युवा रोजगार मेला',
      visitTitleEn: 'Barauni Refinery & Fertilizer Plant & Employment Fair',
      tagHi: 'औद्योगिक रोजगार व नियुक्ति',
      tagEn: 'Industrial Jobs & Appointments',
    },
    {
      id: 'khagaria',
      name: 'Khagaria',
      nameHi: 'खगड़िया',
      division: 'Munger',
      divisionHi: 'मुंगेर प्रमंडल',
      img: '/gallery/development/14.jpg',
      visitTitleHi: 'कोसी-बागमती संगम सुरक्षा तटबंध व मक्का आधारित खाद्य प्रसंस्करण',
      visitTitleEn: 'Kosi-Bagmati Confluence Embankment & Maize Food Park',
      tagHi: 'खाद्य प्रसंस्करण व बांध समीक्षा',
      tagEn: 'Food Park & Flood Control',
    },
    {
      id: 'jamui',
      name: 'Jamui',
      nameHi: 'जमुई',
      division: 'Munger',
      divisionHi: 'मुंगेर प्रमंडल',
      img: '/gallery/leadership/3.jpg',
      visitTitleHi: 'नागी-नकटी पक्षी अभयारण्य पर्यटन व मेडिकल कॉलेज निर्माण निरीक्षण',
      visitTitleEn: 'Nagi-Nakti Bird Sanctuary & Medical College Site Review',
      tagHi: 'चिकित्सा महाविद्यालय निरीक्षण',
      tagEn: 'Medical College Inspection',
    },
    {
      id: 'lakhisarai',
      name: 'Lakhisarai',
      nameHi: 'लखीसराय',
      division: 'Munger',
      divisionHi: 'मुंगेर प्रमंडल',
      img: '/gallery/development/6.jpg',
      visitTitleHi: 'अशोक धाम मंदिर कॉरिडोर विकास एवं क्यूल नदी रिवरफ्रंट',
      visitTitleEn: 'Ashok Dham Temple Corridor & Kiul Riverfront Visit',
      tagHi: 'धार्मिक कॉरिडोर व घाट निर्माण',
      tagEn: 'Corridor & Ghats Development',
    },
    {
      id: 'sheikhpura',
      name: 'Sheikhpura',
      nameHi: 'शेखपुरा',
      division: 'Munger',
      divisionHi: 'मुंगेर प्रमंडल',
      img: '/gallery/development/18.jpg',
      visitTitleHi: 'गिरिहिंडा पहाड़ पर्यटन स्थल व जिला समाहरणालय सुशासन कार्यशाला',
      visitTitleEn: 'Girihinda Tourism & District Collectorate Governance Workshop',
      tagHi: 'सुशासन एवं विकास कार्यशाला',
      tagEn: 'Governance & Development Review',
    },
  ];

const divisionsList = [
    { id: 'ALL', nameHi: 'सभी 38 जिले', nameEn: 'All 38 Districts', count: 38 },
    { id: 'Patna', nameHi: 'पटना', nameEn: 'Patna', count: 6 },
    { id: 'Magadh', nameHi: 'मगध', nameEn: 'Magadh', count: 5 },
    { id: 'Tirhut', nameHi: 'तिरहुत', nameEn: 'Tirhut', count: 6 },
    { id: 'Saran', nameHi: 'सारण', nameEn: 'Saran', count: 3 },
    { id: 'Darbhanga', nameHi: 'दरभंगा', nameEn: 'Darbhanga', count: 3 },
    { id: 'Kosi', nameHi: 'कोसी', nameEn: 'Kosi', count: 3 },
    { id: 'Purnia', nameHi: 'पूर्णिया', nameEn: 'Purnia', count: 4 },
    { id: 'Bhagalpur', nameHi: 'भागलपुर', nameEn: 'Bhagalpur', count: 2 },
    { id: 'Munger', nameHi: 'मुंगेर', nameEn: 'Munger', count: 6 },
  ];

export const DistrictHighlights: React.FC<DistrictHighlightsProps> = ({
  language,
  onSelectDistrict,
  inDashboard = false,
}) => {
  const [selectedDivision, setSelectedDivision] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<'slider' | 'grid'>('slider');
  const sliderRef = useRef<HTMLDivElement>(null);

  const scrollSlider = (direction: 'left' | 'right') => {
    if (!sliderRef.current) return;
    const scrollAmount = 340;
    sliderRef.current.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const filteredVisits = useMemo(() => {
    return all38DistrictVisits.filter((d) => {
      const matchDivision = selectedDivision === 'ALL' || d.division === selectedDivision;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.nameHi.toLowerCase().includes(q) ||
        d.visitTitleHi.toLowerCase().includes(q) ||
        d.visitTitleEn.toLowerCase().includes(q);
      return matchDivision && matchSearch;
    });
  }, [selectedDivision, searchQuery]);

  return (
    <section
      id="district-highlights"
      className={inDashboard
        ? 'bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6'
        : 'bg-[#f8fafc] py-14 border-b border-slate-300'
      }
    >
      <div className={inDashboard ? 'w-full' : 'max-w-7xl mx-auto px-4 sm:px-6'}>
        {/* Header with Badges */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-orange-900 text-xs font-bold mb-2 shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-orange-600" />
              <span>
                {language === 'hi'
                  ? 'माननीय मुख्यमंत्री श्री सम्राट चौधरी • 38 जिला निरीक्षण दौरा'
                  : "Hon'ble CM Samrat Choudhary • 38 Districts Inspection Tour"}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-serif tracking-tight">
              {language === 'hi' ? 'प्रमुख जिला झलकियाँ' : 'District Highlights'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mt-1">
              {language === 'hi'
                ? 'बिहार के सभी 38 जिलों में विकास योजनाओं, आधारभूत संरचना, स्वास्थ्य, शिक्षा एवं जनकल्याणकारी परियोजनाओं का स्थलीय निरीक्षण'
                : 'On-site field inspections and governance reviews across all 38 districts of Bihar'}
            </p>
          </div>
        </div>

        {/* Toolbar: Divisions Filter, Search, View Mode & Slider Navigation */}
        <div className="bg-slate-50 p-3 sm:p-4 rounded-2xl border border-slate-200/90 mb-6 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
          {/* Division Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 custom-scrollbar">
            {divisionsList.map((div) => (
              <button
                key={div.id}
                type="button"
                onClick={() => setSelectedDivision(div.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  selectedDivision === div.id
                    ? 'bg-[#18327b] text-white shadow-xs font-bold'
                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                }`}
              >
                <span>{language === 'hi' ? div.nameHi : div.nameEn}</span>
                <span className="ml-1.5 opacity-70 text-[10px]">({div.count})</span>
              </button>
            ))}
          </div>

          {/* Right: Search, Mode Toggle & Slider Arrows */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'hi' ? 'जिला खोजें...' : 'Search district...'}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-[#18327b] bg-white"
              />
            </div>

            {/* Grid / Slider Toggle */}
            <div className="flex items-center bg-white p-0.5 rounded-lg border border-slate-200 text-xs font-bold">
              <button
                type="button"
                onClick={() => setViewMode('slider')}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                  viewMode === 'slider' ? 'bg-[#18327b] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                {language === 'hi' ? 'स्लाइडर' : 'Slider'}
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded transition cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#18327b] text-white shadow-xs' : 'text-slate-600'
                }`}
              >
                {language === 'hi' ? 'सभी 38' : 'All 38'}
              </button>
            </div>

            {/* Slider Nav Buttons */}
            {viewMode === 'slider' && (
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => scrollSlider('left')}
                  title="Previous"
                  className="w-7 h-7 rounded-full bg-white hover:bg-slate-100 active:scale-95 text-slate-700 flex items-center justify-center transition border border-slate-300 cursor-pointer shadow-2xs"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollSlider('right')}
                  title="Next"
                  className="w-7 h-7 rounded-full bg-[#18327b] hover:bg-[#12255c] active:scale-95 text-white flex items-center justify-center transition shadow-xs cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Display: Slider Mode or Grid Mode */}
        {viewMode === 'slider' ? (
          <div
            ref={sliderRef}
            className="flex items-stretch gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth custom-scrollbar"
          >
            {filteredVisits.map((dist, dIdx) => (
              <div
                key={dist.id || dIdx}
                onClick={() => onSelectDistrict && onSelectDistrict(dist.name)}
                className="flex-shrink-0 w-72 sm:w-80 bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer group border border-slate-200 snap-start flex flex-col justify-between"
              >
                {/* Image Area */}
                <div className="h-44 overflow-hidden relative bg-slate-900">
                  <img
                    src={dist.img}
                    alt={`${dist.name} CM Visit`}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  {/* Top Tag Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-amber-300 shadow-sm">
                      {language === 'hi' ? dist.tagHi : dist.tagEn}
                    </span>
                  </div>

                  {/* Bottom Image Overlay: District Name & Division */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-black tracking-tight drop-shadow-md">
                        {language === 'hi' ? dist.nameHi : dist.name}
                      </span>
                      <span className="text-[10px] font-semibold text-sky-300">
                        {language === 'hi' ? dist.divisionHi : `${dist.division} Div`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-3.5 flex flex-col flex-grow justify-between bg-white">
                  <div>
                    <div className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#18327b] transition">
                      {language === 'hi' ? dist.visitTitleHi : dist.visitTitleEn}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#18327b] font-bold">
                    <span className="group-hover:underline">
                      {language === 'hi' ? 'परियोजनाएँ व प्रगति देखें' : 'View Projects & Progress'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredVisits.map((dist, dIdx) => (
              <div
                key={dist.id || dIdx}
                onClick={() => onSelectDistrict && onSelectDistrict(dist.name)}
                className="bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer group border border-slate-200 flex flex-col justify-between"
              >
                {/* Image Area */}
                <div className="h-40 overflow-hidden relative bg-slate-900">
                  <img
                    src={dist.img}
                    alt={`${dist.name} CM Visit`}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />

                  {/* Top Tag Badge */}
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[10px] font-bold text-amber-300 shadow-sm">
                      {language === 'hi' ? dist.tagHi : dist.tagEn}
                    </span>
                  </div>

                  {/* District Name */}
                  <div className="absolute bottom-2.5 left-3 right-3 text-white">
                    <div className="flex items-baseline justify-between">
                      <span className="text-base font-black tracking-tight drop-shadow-md">
                        {language === 'hi' ? dist.nameHi : dist.name}
                      </span>
                      <span className="text-[10px] font-semibold text-sky-300">
                        {language === 'hi' ? dist.divisionHi : `${dist.division} Div`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-3.5 flex flex-col flex-grow justify-between bg-white">
                  <div>
                    <div className="text-xs font-bold text-slate-800 line-clamp-2 leading-snug group-hover:text-[#18327b] transition">
                      {language === 'hi' ? dist.visitTitleHi : dist.visitTitleEn}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#18327b] font-bold">
                    <span className="group-hover:underline">
                      {language === 'hi' ? 'परियोजनाएँ व प्रगति देखें' : 'View Projects & Progress'}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredVisits.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-600">
              {language === 'hi' ? 'इस प्रमंडल या खोज के लिए कोई जिला नहीं मिला।' : 'No districts found for this division or query.'}
            </p>
            <button
              onClick={() => { setSelectedDivision('ALL'); setSearchQuery(''); }}
              className="mt-3 px-4 py-1.5 rounded-xl bg-[#18327b] text-white text-xs font-bold cursor-pointer"
            >
              {language === 'hi' ? 'सभी 38 जिले देखें' : 'Show all 38 districts'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
