import { connectDatabase, db, disconnectDatabase } from '../database/mongo';


const projectsData = [
  {
    referenceId: 'BHR-ANNC-2024-001',
    department: 'Urban Development & Housing (नगर विकास एवं आवास विभाग)',
    commitment: 'पटना मेट्रो रेल परियोजना — दानापुर से खेमनीचक एवं पटना जंक्शन से न्यू आईएसबीटी कॉरिडोर',
    location: 'Patna (Danapur to Khemnichak Corridor)',
    beneficiaries: '25,00,000 citizens in Patna metropolitan region',
    districtName: 'Patna',
    financialStatus: 'Sanctioned: ₹13,365.77 Cr | Released: ₹7,800.00 Cr | Utilized: ₹6,420.30 Cr (82.3%)',
    sanctionedAmountCr: 13365.77,
    utilizedAmountCr: 6420.30,
    currentStage: 'UNDER_CONSTRUCTION',
    verifiedProgress: 58,
    nextMilestone: 'Underground tunneling completion between Rajendra Nagar and Patna Junction by 30-Nov-2026',
    nextMilestoneDate: new Date('2026-11-30'),
    delayOrObstacle: 'Utility shifting at Mithapur bypass & traffic diversion clearance',
    isDelayed: true,
    source: "Hon'ble CM Announcement (माननीय मुख्यमंत्री घोषणा)",
    communicationStatus: 'ACTION_INITIATED (कार्रवाई प्रारंभ)',
    documents: JSON.stringify([
      { name: 'Patna_Metro_Cabinet_Sanction.pdf', url: '#' },
      { name: 'Monthly_Progress_Report_Sep2026.pdf', url: '#' }
    ])
  },
  {
    referenceId: 'BHR-ANNC-2024-002',
    department: 'Water Resources (जल संसाधन विभाग)',
    commitment: 'गंगा जल आपूर्ति योजना (हर घर गंगाजल) — नवादा, गया, बोधगया एवं राजगीर में निरंतर शुद्ध पेयजल आपूर्ति',
    location: 'Gaya, Nawada, Nalanda (Rajgir)',
    beneficiaries: '40,00,000 residents and international pilgrims',
    districtName: 'Gaya',
    financialStatus: 'Sanctioned: ₹4,174.00 Cr | Released: ₹4,174.00 Cr | Utilized: ₹3,920.00 Cr (93.9%)',
    sanctionedAmountCr: 4174.00,
    utilizedAmountCr: 3920.00,
    currentStage: 'COMMISSIONED',
    verifiedProgress: 96,
    nextMilestone: 'Final hydraulic load testing for Nawada urban booster line by 25-Oct-2026',
    nextMilestoneDate: new Date('2026-10-25'),
    delayOrObstacle: 'None / On Schedule (समयबद्ध प्रगति पर)',
    isDelayed: false,
    source: 'Cabinet Decision (मंत्रिमंडल निर्णय)',
    communicationStatus: 'COMPLIANCE_VERIFIED (सत्यापित एवं अनुपालन पूर्ण)',
    documents: JSON.stringify([
      { name: 'Gangajal_Commissioning_Report.pdf', url: '#' }
    ])
  },
  {
    referenceId: 'BHR-ANNC-2024-003',
    department: 'Road Construction (पथ निर्माण विभाग)',
    commitment: 'पटना-बिहटा 4-लेन एलिवेटेड कॉरिडोर एवं बिहटा अंतरराष्ट्रीय हवाईअड्डा संपर्क मार्ग',
    location: 'Patna (Danapur - Bihta Section)',
    beneficiaries: 'Commuters to Bihta Airport, IIT Patna & Greater Patna',
    districtName: 'Patna',
    financialStatus: 'Sanctioned: ₹4,561.00 Cr | Released: ₹2,800.00 Cr | Utilized: ₹2,150.00 Cr (76.8%)',
    sanctionedAmountCr: 4561.00,
    utilizedAmountCr: 2150.00,
    currentStage: 'UNDER_CONSTRUCTION',
    verifiedProgress: 49,
    nextMilestone: 'Erection of precast superstructure girders at Shivala Junction by 15-Dec-2026',
    nextMilestoneDate: new Date('2026-12-15'),
    delayOrObstacle: 'Railway clearance for ROB span at Danapur yard',
    isDelayed: true,
    source: "Hon'ble CM Announcement (माननीय मुख्यमंत्री घोषणा)",
    communicationStatus: 'PENDING_REVIEW (समीक्षा लंबित)',
    documents: JSON.stringify([
      { name: 'RCD_Elevated_Corridor_Alignment.pdf', url: '#' }
    ])
  },
  {
    referenceId: 'BHR-ANNC-2024-004',
    department: 'Health (स्वास्थ्य विभाग)',
    commitment: 'एम्स दरभंगा (AIIMS Darbhanga) — 750-बेड सुपर स्पेशलिटी अस्पताल, मेडिकल कॉलेज एवं पहुंच मार्ग',
    location: 'Darbhanga (Shobhan-Ekmi Bypass)',
    beneficiaries: 'Over 3 Crore residents of North Bihar & Mithilanchal',
    districtName: 'Darbhanga',
    financialStatus: 'Sanctioned: ₹1,264.00 Cr | Released: ₹600.00 Cr | Utilized: ₹430.00 Cr (71.7%)',
    sanctionedAmountCr: 1264.00,
    utilizedAmountCr: 430.00,
    currentStage: 'UNDER_CONSTRUCTION',
    verifiedProgress: 38,
    nextMilestone: 'Earth filling and boundary compaction up to High Flood Level (HFL) by 10-Nov-2026',
    nextMilestoneDate: new Date('2026-11-10'),
    delayOrObstacle: 'Monsoonal soil stabilization and low-lying land compaction',
    isDelayed: true,
    source: 'Pragati Review Meeting (समीक्षा बैठक)',
    communicationStatus: 'ACTION_INITIATED (कार्रवाई प्रारंभ)',
    documents: JSON.stringify([
      { name: 'AIIMS_Darbhanga_Land_Handover.pdf', url: '#' }
    ])
  },
  {
    referenceId: 'BHR-ANNC-2024-005',
    department: 'Energy (ऊर्जा विभाग)',
    commitment: 'कजरा 250 मेगावाट सौर ऊर्जा संयंत्र एवं 120 MWh बैटरी ऊर्जा भंडारण प्रणाली (BESS)',
    location: 'Lakhisarai (Kajra Solar Park)',
    beneficiaries: 'Clean renewable power for Bihar State Power Transmission Grid',
    districtName: 'Lakhisarai',
    financialStatus: 'Sanctioned: ₹1,850.00 Cr | Released: ₹1,100.00 Cr | Utilized: ₹890.00 Cr (80.9%)',
    sanctionedAmountCr: 1850.00,
    utilizedAmountCr: 890.00,
    currentStage: 'UNDER_CONSTRUCTION',
    verifiedProgress: 62,
    nextMilestone: 'Battery energy storage system (BESS) installation and grid tie-in by 20-Jan-2027',
    nextMilestoneDate: new Date('2027-01-20'),
    delayOrObstacle: 'Transmission line right-of-way clearance in 2 village panchayats',
    isDelayed: false,
    source: 'Budget Speech (बजट अभिभाषण)',
    communicationStatus: 'ACTION_INITIATED (कार्रवाई प्रारंभ)',
    documents: JSON.stringify([
      { name: 'BSPHCL_Kajra_Solar_MoU.pdf', url: '#' }
    ])
  },
  {
    referenceId: 'BHR-ANNC-2024-006',
    department: 'Civil Aviation & Cabinet (नागरिक विमानन एवं मंत्रिमंडल सचिवालय)',
    commitment: 'पूर्णिया एयरपोर्ट — सिविल एन्क्लेव एवं वाणिज्यिक यात्री हवाई सेवा का संचालन',
    location: 'Purnea (Chunapur Air Base Link)',
    beneficiaries: 'Kosi & Seemanchal business commuters and tourists',
    districtName: 'Purnea',
    financialStatus: 'Sanctioned: ₹680.00 Cr | Released: ₹350.00 Cr | Utilized: ₹310.00 Cr (88.6%)',
    sanctionedAmountCr: 680.00,
    utilizedAmountCr: 310.00,
    currentStage: 'TENDERING',
    verifiedProgress: 31,
    nextMilestone: 'Award of EPC contract for terminal building and apron by 05-Nov-2026',
    nextMilestoneDate: new Date('2026-11-05'),
    delayOrObstacle: 'Security perimeter handover from defense authorities',
    isDelayed: true,
    source: "Hon'ble CM Announcement (माननीय मुख्यमंत्री घोषणा)",
    communicationStatus: 'QUERY_RAISED (स्पष्टीकरण मांगा गया)',
    documents: JSON.stringify([
      { name: 'Purnea_Airport_MoU_AAI.pdf', url: '#' }
    ])
  },
  {
    referenceId: 'BHR-ANNC-2024-007',
    department: 'Labour Resources (श्रम संसाधन विभाग)',
    commitment: 'मेगा स्किल डेवलपमेंट सेंटर एवं सेंटर ऑफ एक्सीलेंस — 5 प्रमंडलों में आधुनिक कौशल उन्नयन',
    location: 'Muzaffarpur, Bhagalpur, Gaya, Purnea, Saran',
    beneficiaries: '1,50,000 youth trained annually in industrial robotics and EV tech',
    districtName: 'Muzaffarpur',
    financialStatus: 'Sanctioned: ₹540.00 Cr | Released: ₹540.00 Cr | Utilized: ₹480.00 Cr (88.9%)',
    sanctionedAmountCr: 540.00,
    utilizedAmountCr: 480.00,
    currentStage: 'OPERATIONAL',
    verifiedProgress: 100,
    nextMilestone: 'Inauguration of specialized robotics and AI lab batch by 01-Nov-2026',
    nextMilestoneDate: new Date('2026-11-01'),
    delayOrObstacle: 'None / Completed (कार्य पूर्ण)',
    isDelayed: false,
    source: 'Cabinet Decision (मंत्रिमंडल निर्णय)',
    communicationStatus: 'COMPLIANCE_VERIFIED (सत्यापित एवं अनुपालन पूर्ण)',
    documents: JSON.stringify([
      { name: 'Mega_Skill_Centre_Handover_Cert.pdf', url: '#' }
    ])
  },
  {
    referenceId: 'BHR-ANNC-2024-008',
    department: 'Information Technology (सूचना प्रावैधिकी विभाग)',
    commitment: 'बिहटा आईटी पार्क एवं सेमीकंडक्टर क्लस्टर — उच्च तकनीक हार्डवेयर व सॉफ्टवेयर हब',
    location: 'Patna (Bihta Industrial Hub)',
    beneficiaries: 'Technology startups, IT professionals & engineering graduates',
    districtName: 'Patna',
    financialStatus: 'Sanctioned: ₹350.00 Cr | Released: ₹200.00 Cr | Utilized: ₹145.00 Cr (72.5%)',
    sanctionedAmountCr: 350.00,
    utilizedAmountCr: 145.00,
    currentStage: 'UNDER_CONSTRUCTION',
    verifiedProgress: 44,
    nextMilestone: 'Structural framing of Tower B and data center sub-station by 30-Dec-2026',
    nextMilestoneDate: new Date('2026-12-30'),
    delayOrObstacle: 'Vendor supply chain lead time for high-efficiency HVAC chillers',
    isDelayed: false,
    source: 'Budget Speech (बजट अभिभाषण)',
    communicationStatus: 'ACTION_INITIATED (कार्रवाई प्रारंभ)',
    documents: JSON.stringify([
      { name: 'IT_Park_Bihta_Master_Plan.pdf', url: '#' }
    ])
  },
  {
    referenceId: 'BHR-ANNC-2024-009',
    department: 'Education (शिक्षा विभाग)',
    commitment: 'राज्य के सभी गैर-आच्छादित अनुमंडलों में नए डिग्री कॉलेजों की स्थापना एवं आधुनिक लैब',
    location: '38 Districts across Bihar',
    beneficiaries: '2,80,000 undergraduate students in rural assembly segments',
    districtName: 'Nalanda',
    financialStatus: 'Sanctioned: ₹1,480.00 Cr | Released: ₹1,250.00 Cr | Utilized: ₹1,120.00 Cr (89.6%)',
    sanctionedAmountCr: 1480.00,
    utilizedAmountCr: 1120.00,
    currentStage: 'COMMISSIONED',
    verifiedProgress: 89,
    nextMilestone: 'Laboratory equipment commissioning in 12 remaining colleges by 15-Nov-2026',
    nextMilestoneDate: new Date('2026-11-15'),
    delayOrObstacle: 'None / On Schedule (समयबद्ध प्रगति पर)',
    isDelayed: false,
    source: "Hon'ble CM Announcement (माननीय मुख्यमंत्री घोषणा)",
    communicationStatus: 'COMPLIANCE_VERIFIED (सत्यापित एवं अनुपालन पूर्ण)',
    documents: JSON.stringify([
      { name: 'Degree_Colleges_Progress_Q3.pdf', url: '#' }
    ])
  },
  {
    referenceId: 'BHR-ANNC-2024-010',
    department: 'Water Resources (जल संसाधन विभाग)',
    commitment: 'कोसी-गंडक तटबंध सुदृढ़ीकरण एवं कटाव निरोधी बाढ़ प्रबंधन कार्य',
    location: 'Supaul, Saharsa, Madhepura',
    beneficiaries: '35,00,000 farming families in flood-prone belts',
    districtName: 'Supaul',
    financialStatus: 'Sanctioned: ₹920.00 Cr | Released: ₹800.00 Cr | Utilized: ₹740.00 Cr (92.5%)',
    sanctionedAmountCr: 920.00,
    utilizedAmountCr: 740.00,
    currentStage: 'UNDER_CONSTRUCTION',
    verifiedProgress: 82,
    nextMilestone: 'Geo-textile laying and porcupine spur erection before winter flow by 28-Nov-2026',
    nextMilestoneDate: new Date('2026-11-28'),
    delayOrObstacle: 'River current velocity at vulnerable spurs',
    isDelayed: false,
    source: 'Pragati Review Meeting (समीक्षा बैठक)',
    communicationStatus: 'COMPLIANCE_VERIFIED (सत्यापित एवं अनुपालन पूर्ण)',
    documents: JSON.stringify([
      { name: 'Kosi_Flood_Protection_Report.pdf', url: '#' }
    ])
  },
  {
    referenceId: 'BHR-ANNC-2024-011',
    department: 'Industries (उद्योग विभाग)',
    commitment: 'मुजफ्फरपुर एवं बेला औद्योगिक क्षेत्र — मेगा टेक्सटाइल एवं लेदर क्लस्टर',
    location: 'Muzaffarpur (Bela Industrial Area)',
    beneficiaries: '45,000 direct and indirect employment opportunities',
    districtName: 'Muzaffarpur',
    financialStatus: 'Sanctioned: ₹760.00 Cr | Released: ₹550.00 Cr | Utilized: ₹520.00 Cr (94.5%)',
    sanctionedAmountCr: 760.00,
    utilizedAmountCr: 520.00,
    currentStage: 'UNDER_CONSTRUCTION',
    verifiedProgress: 73,
    nextMilestone: 'Common Effluent Treatment Plant (CETP) test run by 15-Dec-2026',
    nextMilestoneDate: new Date('2026-12-15'),
    delayOrObstacle: 'Environmental clearance amendment for capacity expansion',
    isDelayed: true,
    source: 'Cabinet Decision (मंत्रिमंडल निर्णय)',
    communicationStatus: 'ACTION_INITIATED (कार्रवाई प्रारंभ)',
    documents: JSON.stringify([
      { name: 'Textile_Policy_Allotment_Bela.pdf', url: '#' }
    ])
  },
  {
    referenceId: 'BHR-ANNC-2024-012',
    department: 'Tourism (पर्यटन विभाग)',
    commitment: 'नालंदा, वैशाली एवं राजगीर हेरिटेज सर्किट — आधुनिक पर्यटक सुविधा केंद्र व साउंड-लाइट शो',
    location: 'Nalanda, Vaishali, Rajgir',
    beneficiaries: '80,00,000 annual heritage tourists and local hospitality workers',
    districtName: 'Nalanda',
    financialStatus: 'Sanctioned: ₹410.00 Cr | Released: ₹320.00 Cr | Utilized: ₹295.00 Cr (92.2%)',
    sanctionedAmountCr: 410.00,
    utilizedAmountCr: 295.00,
    currentStage: 'UNDER_CONSTRUCTION',
    verifiedProgress: 77,
    nextMilestone: 'Sound & light amphitheatre and visitor facilitation center hand-over by 10-Dec-2026',
    nextMilestoneDate: new Date('2026-12-10'),
    delayOrObstacle: 'ASI clearance near protected monument buffer zone',
    isDelayed: false,
    source: "Hon'ble CM Announcement (माननीय मुख्यमंत्री घोषणा)",
    communicationStatus: 'ACTION_INITIATED (कार्रवाई प्रारंभ)',
    documents: JSON.stringify([
      { name: 'Heritage_Circuit_Heritage_NOC.pdf', url: '#' }
    ])
  },
  {
    referenceId: 'BHR-ANNC-2024-013',
    department: 'Minor Water Resources (लघु जल संसाधन विभाग)',
    commitment: 'रोहतास एवं कैमूर पहाड़ी चेक डैम जीर्णोद्धार एवं सतही सिंचाई क्षमता संवर्धन',
    location: 'Rohtas & Kaimur',
    beneficiaries: '1,20,000 hectares of command agricultural land',
    districtName: 'Rohtas',
    financialStatus: 'Sanctioned: ₹320.00 Cr | Released: ₹150.00 Cr | Utilized: ₹110.00 Cr (73.3%)',
    sanctionedAmountCr: 320.00,
    utilizedAmountCr: 110.00,
    currentStage: 'TENDERING',
    verifiedProgress: 28,
    nextMilestone: 'Financial bid evaluation and technical sanction by 20-Nov-2026',
    nextMilestoneDate: new Date('2026-11-20'),
    delayOrObstacle: 'Forest department diversion NOC for dam catchment perimeter',
    isDelayed: true,
    source: 'Pragati Review Meeting (समीक्षा बैठक)',
    communicationStatus: 'QUERY_RAISED (स्पष्टीकरण मांगा गया)',
    documents: JSON.stringify([
      { name: 'Forest_Clearance_Application_Rohtas.pdf', url: '#' }
    ])
  },
  {
    referenceId: 'BHR-ANNC-2024-014',
    department: 'Health (स्वास्थ्य विभाग)',
    commitment: '25 जिला अस्पतालों में 100-बेड क्रिटिकल केयर ब्लॉक (CCB) एवं आधुनिक आईसीयू स्थापना',
    location: 'Across 25 Districts (Bhagalpur, Gaya, Muzaffarpur, Saran, etc.)',
    beneficiaries: 'Emergency ICU and pediatric trauma patients statewide',
    districtName: 'Bhagalpur',
    financialStatus: 'Sanctioned: ₹875.00 Cr | Released: ₹680.00 Cr | Utilized: ₹610.00 Cr (89.7%)',
    sanctionedAmountCr: 875.00,
    utilizedAmountCr: 610.00,
    currentStage: 'UNDER_CONSTRUCTION',
    verifiedProgress: 71,
    nextMilestone: 'Medical gas pipeline installation in 14 district hospital blocks by 30-Nov-2026',
    nextMilestoneDate: new Date('2026-11-30'),
    delayOrObstacle: 'Structural audit of existing hospital civil tie-ins',
    isDelayed: false,
    source: 'Cabinet Decision (मंत्रिमंडल निर्णय)',
    communicationStatus: 'COMPLIANCE_VERIFIED (सत्यापित एवं अनुपालन पूर्ण)',
    documents: JSON.stringify([
      { name: 'Critical_Care_Blocks_Design_Approval.pdf', url: '#' }
    ])
  },
  {
    referenceId: 'BHR-ANNC-2024-015',
    department: 'Panchayati Raj (पंचायती राज विभाग)',
    commitment: '8,053 ग्राम पंचायतों में हर घर नल का जल आईओटी (IoT) सेंसर आधारित जल गुणवत्ता व आपूर्ति मॉनिटरिंग',
    location: '8,053 Gram Panchayats statewide',
    beneficiaries: 'Rural population drinking water safety & pressure assurance',
    districtName: 'Samastipur',
    financialStatus: 'Sanctioned: ₹240.00 Cr | Released: ₹210.00 Cr | Utilized: ₹190.00 Cr (90.5%)',
    sanctionedAmountCr: 240.00,
    utilizedAmountCr: 190.00,
    currentStage: 'COMMISSIONED',
    verifiedProgress: 92,
    nextMilestone: 'Telemetry gateway integration into state-level SCADA dashboard by 15-Nov-2026',
    nextMilestoneDate: new Date('2026-11-15'),
    delayOrObstacle: 'Cellular network connectivity in 182 remote flood basin wards',
    isDelayed: false,
    source: "Hon'ble CM Announcement (माननीय मुख्यमंत्री घोषणा)",
    communicationStatus: 'COMPLIANCE_VERIFIED (सत्यापित एवं अनुपालन पूर्ण)',
    documents: JSON.stringify([
      { name: 'IoT_Telemetry_Deployment_Status.pdf', url: '#' }
    ])
  }
];

async function main() {
  await connectDatabase();
  console.log('Seeding Announcement & Project Tracking database...');

  // Match district names to IDs
  const districts = await db.district.findMany();
  const districtMap = new Map<string, number>();
  districts.forEach(d => districtMap.set(d.name.toLowerCase(), d.id));

  for (const item of projectsData) {
    let districtId: number | undefined = undefined;
    if (item.districtName) {
      const match = districtMap.get(item.districtName.toLowerCase());
      if (match) districtId = match;
    }

    await db.projectAnnouncement.upsert({
      where: { referenceId: item.referenceId },
      update: {
        department: item.department,
        commitment: item.commitment,
        location: item.location,
        beneficiaries: item.beneficiaries,
        districtId: districtId,
        districtName: item.districtName,
        financialStatus: item.financialStatus,
        sanctionedAmountCr: item.sanctionedAmountCr,
        utilizedAmountCr: item.utilizedAmountCr,
        currentStage: item.currentStage,
        verifiedProgress: item.verifiedProgress,
        nextMilestone: item.nextMilestone,
        nextMilestoneDate: item.nextMilestoneDate,
        delayOrObstacle: item.delayOrObstacle,
        isDelayed: item.isDelayed,
        source: item.source,
        communicationStatus: item.communicationStatus,
        documents: item.documents
      },
      create: {
        referenceId: item.referenceId,
        department: item.department,
        commitment: item.commitment,
        location: item.location,
        beneficiaries: item.beneficiaries,
        districtId: districtId,
        districtName: item.districtName,
        financialStatus: item.financialStatus,
        sanctionedAmountCr: item.sanctionedAmountCr,
        utilizedAmountCr: item.utilizedAmountCr,
        currentStage: item.currentStage,
        verifiedProgress: item.verifiedProgress,
        nextMilestone: item.nextMilestone,
        nextMilestoneDate: item.nextMilestoneDate,
        delayOrObstacle: item.delayOrObstacle,
        isDelayed: item.isDelayed,
        source: item.source,
        communicationStatus: item.communicationStatus,
        documents: item.documents
      }
    });
  }

  const count = await db.projectAnnouncement.count();
  console.log(`Successfully seeded ${count} Announcement & Project records.`);
}

main()
  .catch((e) => {
    console.error('Error seeding projects:', e);
    process.exit(1);
  })
  .finally(async () => {
    await disconnectDatabase();
  });
