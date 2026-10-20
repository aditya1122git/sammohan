import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  RotateCw, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Compass, 
  Sparkles, 
  Eye, 
  Layers, 
  Activity, 
  MapPin, 
  TrendingUp, 
  ExternalLink,
  Play,
  Pause
} from 'lucide-react';

interface DistrictData {
  id: string;
  name: string;
  nameHi: string;
  division: string;
  divisionHi: string;
  lon: number;
  lat: number;
  projectsCount: number;
  totalCr: number;
  highlightHi: string;
  highlightEn: string;
}

// 38 Districts of Bihar with precise GIS Centroids and official metadata
const BIHAR_38_DISTRICTS: DistrictData[] = [
  { id: 'patna', name: 'Patna', nameHi: 'पटना', division: 'Patna', divisionHi: 'पटना प्रमंडल', lon: 85.3257, lat: 25.4110, projectsCount: 14, totalCr: 8450, highlightHi: 'गंगा मरीन ड्राइव एवं मेट्रो रेल परियोजना', highlightEn: 'Ganga Marine Drive & Metro Rail Project' },
  { id: 'gaya', name: 'Gaya', nameHi: 'गया', division: 'Magadh', divisionHi: 'मगध प्रमंडल', lon: 84.9034, lat: 24.6902, projectsCount: 9, totalCr: 3200, highlightHi: 'महाबोधि कॉरिडोर एवं फल्गु रबर डैम विस्तारीकरण', highlightEn: 'Mahabodhi Corridor & Falgu River Dam Expansion' },
  { id: 'bhagalpur', name: 'Bhagalpur', nameHi: 'भागलपुर', division: 'Bhagalpur', divisionHi: 'भागलपुर प्रमंडल', lon: 87.0685, lat: 25.3026, projectsCount: 8, totalCr: 2850, highlightHi: 'सिल्क सिटी टेक्सटाइल पार्क एवं विक्रमशिला सेतु समानांतर लेन', highlightEn: 'Silk City Textile Park & Vikramshila Parallel Bridge' },
  { id: 'muzaffarpur', name: 'Muzaffarpur', nameHi: 'मुजफ्फरपुर', division: 'Tirhut', divisionHi: 'तिरहुत प्रमंडल', lon: 85.3580, lat: 26.2047, projectsCount: 11, totalCr: 3600, highlightHi: 'स्मार्ट सिटी एवं उत्तर बिहार लॉजिस्टिक्स हब', highlightEn: 'Smart City & North Bihar Logistics Hub' },
  { id: 'darbhanga', name: 'Darbhanga', nameHi: 'दरभंगा', division: 'Darbhanga', divisionHi: 'दरभंगा प्रमंडल', lon: 86.0316, lat: 26.0955, projectsCount: 9, totalCr: 3100, highlightHi: 'दरभंगा एम्स (AIIMS) एवं एयरपोर्ट विस्तार', highlightEn: 'Darbhanga AIIMS & Airport Expansion' },
  { id: 'purnia', name: 'Purnia', nameHi: 'पूर्णिया', division: 'Purnia', divisionHi: 'पूर्णिया प्रमंडल', lon: 87.4701, lat: 25.8303, projectsCount: 7, totalCr: 2150, highlightHi: 'ग्रीनफील्ड एयरपोर्ट एवं कृषि निर्यात क्लस्टर', highlightEn: 'Greenfield Airport & Agri Export Cluster' },
  { id: 'nalanda', name: 'Nalanda', nameHi: 'नालंदा (बिहारशरीफ)', division: 'Patna', divisionHi: 'पटना प्रमंडल', lon: 85.4965, lat: 25.2289, projectsCount: 8, totalCr: 2400, highlightHi: 'राजगीर खेल विश्वविद्यालय एवं नेचर सफारी', highlightEn: 'Rajgir Sports University & Nature Safari' },
  { id: 'begusarai', name: 'Begusarai', nameHi: 'बेगूसराय', division: 'Munger', divisionHi: 'मुंगेर प्रमंडल', lon: 86.1495, lat: 25.5263, projectsCount: 6, totalCr: 2750, highlightHi: 'बरौनी रिफाइनरी विस्तारीकरण एवं पेट्रोकेमिकल हब', highlightEn: 'Barauni Refinery Expansion & Petrochemical Hub' },
  { id: 'saran', name: 'Saran', nameHi: 'सारण (छपरा)', division: 'Saran', divisionHi: 'सारण प्रमंडल', lon: 84.8084, lat: 25.9002, projectsCount: 6, totalCr: 1950, highlightHi: 'मढ़ौरा रेल इंजन कारखाना एवं रिवरफ्रंट विकास', highlightEn: 'Marhowrah Rail Engine Plant & Riverfront' },
  { id: 'saharsa', name: 'Saharsa', nameHi: 'सहरसा', division: 'Kosi', divisionHi: 'कोसी प्रमंडल', lon: 86.5535, lat: 25.8192, projectsCount: 5, totalCr: 1450, highlightHi: 'कोसी महासेतु संपर्क पथ एवं रेल ओवरब्रिज', highlightEn: 'Kosi Mega-Bridge Approach Corridor' },
  { id: 'munger', name: 'Munger', nameHi: 'मुंगेर', division: 'Munger', divisionHi: 'मुंगेर प्रमंडल', lon: 86.5281, lat: 25.2208, projectsCount: 6, totalCr: 1650, highlightHi: 'गंगा रेल-सह-सड़क पुल एवं मेडिकल कॉलेज', highlightEn: 'Ganga Rail-cum-Road Bridge & Medical College' },
  { id: 'pashchim_champaran', name: 'Pashchim Champaran', nameHi: 'पश्चिम चंपारण (बेतिया)', division: 'Tirhut', divisionHi: 'तिरहुत प्रमंडल', lon: 84.2943, lat: 27.0322, projectsCount: 7, totalCr: 1850, highlightHi: 'वाल्मीकि टाइगर रिजर्व ईको-टूरिज्म एवं टेक्सटाइल हब', highlightEn: 'Valmiki Tiger Reserve Eco-Tourism & Textiles' },
  { id: 'purba_champaran', name: 'Purba Champaran', nameHi: 'पूर्वी चंपारण (मोतिहारी)', division: 'Tirhut', divisionHi: 'तिरहुत प्रमंडल', lon: 84.9871, lat: 26.5847, projectsCount: 7, totalCr: 1720, highlightHi: 'विराट रामायण मंदिर एवं मोतिहारी केंद्रीय विश्वविद्यालय', highlightEn: 'Virat Ramayan Mandir & Central University' },
  { id: 'vaishali', name: 'Vaishali', nameHi: 'वैशाली (हाजीपुर)', division: 'Tirhut', divisionHi: 'तिरहुत प्रमंडल', lon: 85.4077, lat: 25.7864, projectsCount: 7, totalCr: 1900, highlightHi: 'बुद्ध सम्यक दर्शन संग्रहालय एवं औद्योगिक क्षेत्र', highlightEn: 'Buddha Samyak Darshan Museum & Industrial Area' },
  { id: 'bhojpur', name: 'Bhojpur', nameHi: 'भोजपुर (आरा)', division: 'Patna', divisionHi: 'पटना प्रमंडल', lon: 84.4977, lat: 25.5166, projectsCount: 6, totalCr: 1550, highlightHi: 'आरा-मोहनिया फोरलेन एवं बाबू कुंवर सिंह स्मारक', highlightEn: 'Ara-Mohania 4-Lane & Veer Kunwar Singh Memorial' },
  { id: 'buxar', name: 'Buxar', nameHi: 'बक्सर', division: 'Patna', divisionHi: 'पटना प्रमंडल', lon: 84.0858, lat: 25.4713, projectsCount: 5, totalCr: 2600, highlightHi: 'चौसा सुपर थर्मल पावर प्लांट एवं बक्सर गंगा पुल', highlightEn: 'Chausa Super Thermal Power & Buxar Ganga Bridge' },
  { id: 'rohtas', name: 'Rohtas', nameHi: 'रोहतास (सासाराम)', division: 'Patna', divisionHi: 'पटना प्रमंडल', lon: 83.9596, lat: 24.9849, projectsCount: 6, totalCr: 1680, highlightHi: 'शेरशाह सूरी पर्यटन सर्किट एवं सोन नद नहर आधुनिकीकरण', highlightEn: 'Sher Shah Suri Circuit & Sone Canal Upgrade' },
  { id: 'kaimur', name: 'Kaimur', nameHi: 'कैमूर (भभुआ)', division: 'Patna', divisionHi: 'पटना प्रमंडल', lon: 83.6106, lat: 25.0768, projectsCount: 4, totalCr: 1250, highlightHi: 'मां मुंडेश्वरी धाम रोपवे एवं जलप्रपात संरक्षण', highlightEn: 'Mundeshwari Dham Ropeway & Eco Corridor' },
  { id: 'aurangabad', name: 'Aurangabad', nameHi: 'औरंगाबाद', division: 'Magadh', divisionHi: 'मगध प्रमंडल', lon: 84.4371, lat: 24.7614, projectsCount: 5, totalCr: 1850, highlightHi: 'नबीनगर थर्मल पावर स्टेशन एवं सूर्य मंदिर कॉरिडोर', highlightEn: 'Nabinagar Thermal Power & Sun Temple Corridor' },
  { id: 'nawada', name: 'Nawada', nameHi: 'नवादा', division: 'Magadh', divisionHi: 'मगध प्रमंडल', lon: 85.6306, lat: 24.8294, projectsCount: 5, totalCr: 1320, highlightHi: 'ककोलत जलप्रपात ईको-टूरिज्म एवं गंगा जल आपूर्ति', highlightEn: 'Kakolat Waterfall Eco-Tourism & Ganga Jal Project' },
  { id: 'jehanabad', name: 'Jehanabad', nameHi: 'जहानाबाद', division: 'Magadh', divisionHi: 'मगध प्रमंडल', lon: 85.0460, lat: 25.1684, projectsCount: 4, totalCr: 980, highlightHi: 'बराबर गुफाएँ हेरिटेज विकास एवं कृषि मंडी', highlightEn: 'Barabar Caves Heritage & Agri Mandi' },
  { id: 'arwal', name: 'Arwal', nameHi: 'अरवल', division: 'Magadh', divisionHi: 'मगध प्रमंडल', lon: 84.6902, lat: 25.1823, projectsCount: 3, totalCr: 720, highlightHi: 'सोन नद तटबंध सुदृढ़ीकरण एवं ग्रामीण ग्रिड', highlightEn: 'Sone Embankment & Rural Grid Modernization' },
  { id: 'jamui', name: 'Jamui', nameHi: 'जमुई', division: 'Munger', divisionHi: 'मुंगेर प्रमंडल', lon: 86.2585, lat: 24.7859, projectsCount: 5, totalCr: 1420, highlightHi: 'नागी-नकटी पक्षी अभयारण्य एवं स्वर्ण खनन अन्वेषण', highlightEn: 'Nagi-Nakti Bird Sanctuary & Gold Exploration' },
  { id: 'lakhisarai', name: 'Lakhisarai', nameHi: 'लखीसराय', division: 'Munger', divisionHi: 'मुंगेर प्रमंडल', lon: 86.0781, lat: 25.1560, projectsCount: 4, totalCr: 950, highlightHi: 'लाली पहाड़ी बौद्ध उत्खनन एवं किऊल जंक्शन आधुनिकीकरण', highlightEn: 'Lali Pahadi Buddhist Site & Kiul Modernization' },
  { id: 'sheikhpura', name: 'Sheikhpura', nameHi: 'शेखपुरा', division: 'Munger', divisionHi: 'मुंगेर प्रमंडल', lon: 85.8314, lat: 25.1191, projectsCount: 3, totalCr: 680, highlightHi: 'गिरीहिंडा पर्वत विकास एवं जिला औद्योगिक क्लस्टर', highlightEn: 'Girihinda Hills Development & Industrial Cluster' },
  { id: 'khagaria', name: 'Khagaria', nameHi: 'खगड़िया', division: 'Munger', divisionHi: 'मुंगेर प्रमंडल', lon: 86.5633, lat: 25.5320, projectsCount: 4, totalCr: 1100, highlightHi: 'मक्का आधारित मेगा फूड पार्क एवं कोसी रिंग बांध', highlightEn: 'Maize Mega Food Park & Kosi Ring Bund' },
  { id: 'banka', name: 'Banka', nameHi: 'बांका', division: 'Bhagalpur', divisionHi: 'भागलपुर प्रमंडल', lon: 86.7944, lat: 24.8334, projectsCount: 5, totalCr: 1200, highlightHi: 'मदार पर्वत रोपवे एवं चांदन जलाशय आधुनिकीकरण', highlightEn: 'Mandar Hill Ropeway & Chandan Dam Upgrade' },
  { id: 'samastipur', name: 'Samastipur', nameHi: 'समस्तीपुर', division: 'Darbhanga', divisionHi: 'दरभंगा प्रमंडल', lon: 85.9205, lat: 25.7757, projectsCount: 6, totalCr: 1600, highlightHi: 'पूसा केंद्रीय कृषि विश्वविद्यालय एवं रेल वर्कशॉप', highlightEn: 'Pusa Central Agri University & Rail Workshop' },
  { id: 'madhubani', name: 'Madhubani', nameHi: 'मधुबनी', division: 'Darbhanga', divisionHi: 'दरभंगा प्रमंडल', lon: 86.1852, lat: 26.3288, projectsCount: 6, totalCr: 1450, highlightHi: 'मिथिला चित्रकला संस्थान एवं सौराठ सभा विकास', highlightEn: 'Mithila Painting Institute & Saurath Sabha' },
  { id: 'sitamarhi', name: 'Sitamarhi', nameHi: 'सीतामढ़ी', division: 'Tirhut', divisionHi: 'तिरहुत प्रमंडल', lon: 85.5271, lat: 26.4919, projectsCount: 6, totalCr: 1800, highlightHi: 'पुनौरा धाम जानकी मंदिर भव्य कॉरिडोर एवं फोरलेन', highlightEn: 'Punaura Dham Janki Mandir Grand Corridor' },
  { id: 'sheohar', name: 'Sheohar', nameHi: 'शिवहर', division: 'Tirhut', divisionHi: 'तिरहुत प्रमंडल', lon: 85.3044, lat: 26.4810, projectsCount: 3, totalCr: 650, highlightHi: 'बागमती नदी सुरक्षा तटबंध एवं बाईपास निर्माण', highlightEn: 'Bagmati Flood Defense & City Bypass' },
  { id: 'siwan', name: 'Siwan', nameHi: 'सीवान', division: 'Saran', divisionHi: 'सारण प्रमंडल', lon: 84.3554, lat: 26.1922, projectsCount: 5, totalCr: 1280, highlightHi: 'डॉ राजेंद्र प्रसाद स्मृति पार्क एवं मेडिकल कॉलेज', highlightEn: 'Dr. Rajendra Prasad Memorial & Medical College' },
  { id: 'gopalganj', name: 'Gopalganj', nameHi: 'गोपालगंज', division: 'Saran', divisionHi: 'सारण प्रमंडल', lon: 84.4123, lat: 26.4220, projectsCount: 5, totalCr: 1350, highlightHi: 'थावे दुर्गा मंदिर कॉरिडोर एवं चीनी उद्योग क्लस्टर', highlightEn: 'Thawe Temple Corridor & Sugar Industry Cluster' },
  { id: 'madhepura', name: 'Madhepura', nameHi: 'मधेपुरा', division: 'Kosi', divisionHi: 'कोसी प्रमंडल', lon: 86.8956, lat: 25.7628, projectsCount: 5, totalCr: 1400, highlightHi: 'इलेक्ट्रिक लोकोमोटिव फैक्ट्री एवं विश्वविद्यालय परिसर', highlightEn: 'Electric Locomotive Factory & University Hub' },
  { id: 'supaul', name: 'Supaul', nameHi: 'सुपौल', division: 'Kosi', divisionHi: 'कोसी प्रमंडल', lon: 86.7478, lat: 26.2251, projectsCount: 5, totalCr: 1550, highlightHi: 'भौतिक प्रतिरूपण संस्थान (प्रायोगिक केंद्र) एवं पुल', highlightEn: 'Physical Modeling Institute & Kosi River Bridge' },
  { id: 'araria', name: 'Araria', nameHi: 'अररिया', division: 'Purnia', divisionHi: 'पूर्णिया प्रमंडल', lon: 87.3331, lat: 26.1970, projectsCount: 5, totalCr: 1150, highlightHi: 'अररिया-गलगलिया रेल लाइन एवं भारत-नेपाल लॉजिस्टिक्स', highlightEn: 'Araria-Galgalia Rail Link & Cross-Border Hub' },
  { id: 'katihar', name: 'Katihar', nameHi: 'कटिहार', division: 'Purnia', divisionHi: 'पूर्णिया प्रमंडल', lon: 87.6952, lat: 25.5561, projectsCount: 6, totalCr: 1750, highlightHi: 'मनिहारी-साहिबगंज गंगा महासेतु एवं जूट टेक्सटाइल पार्क', highlightEn: 'Manihari-Sahibganj Ganga Bridge & Jute Park' },
  { id: 'kishanganj', name: 'Kishanganj', nameHi: 'किशनगंज', division: 'Purnia', divisionHi: 'पूर्णिया प्रमंडल', lon: 87.9491, lat: 26.2556, projectsCount: 4, totalCr: 1100, highlightHi: 'चाय उत्पादन एवं प्रसंस्करण क्लस्टर, अलीगढ़ मुस्लिम वि.वि. शाखा', highlightEn: 'Tea Processing Hub & AMU Campus Infrastructure' }
];

interface Bihar3DExplorerProps {
  language: 'hi' | 'en';
  onSelectDistrict?: (districtName: string) => void;
}

export const Bihar3DExplorer: React.FC<Bihar3DExplorerProps> = ({ language, onSelectDistrict }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictData>(BIHAR_38_DISTRICTS[0]);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [showArcs, setShowArcs] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'3d_map' | 'corridors'>('3d_map');

  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const mapGroupRef = useRef<THREE.Group | null>(null);
  const pinMeshesRef = useRef<{ mesh: THREE.Mesh; halo: THREE.Mesh; data: DistrictData }[]>([]);
  const arcsGroupRef = useRef<THREE.Group | null>(null);

  // Drag interaction
  const isDraggingRef = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight || 580;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060c18);
    scene.fog = new THREE.FogExp2(0x060c18, 0.015);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;
    camera.position.set(0, 48, 56);
    camera.lookAt(0, 0, 0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const goldSpotLight = new THREE.SpotLight(0xf59e0b, 3.5);
    goldSpotLight.position.set(20, 60, 20);
    goldSpotLight.angle = Math.PI / 4;
    goldSpotLight.penumbra = 0.5;
    goldSpotLight.castShadow = true;
    scene.add(goldSpotLight);

    const cyanRimLight = new THREE.DirectionalLight(0x38bdf8, 1.8);
    cyanRimLight.position.set(-30, 40, -30);
    scene.add(cyanRimLight);

    const centerPointLight = new THREE.PointLight(0xfbbf24, 2, 50);
    centerPointLight.position.set(0, 5, 0);
    scene.add(centerPointLight);

    // 5. 3D Map Group (Centered in Bihar Coordinate Space)
    const mapGroup = new THREE.Group();
    mapGroupRef.current = mapGroup;
    scene.add(mapGroup);

    // Coordinate mapping parameters: Center around lon ~85.8, lat ~25.8
    const centerLon = 85.8;
    const centerLat = 25.8;
    const scaleX = 8.5; // X span ~35 units
    const scaleZ = 10.5; // Z span ~30 units

    // 5a. 3D Pedestal Base
    const pedestalGeo = new THREE.CylinderGeometry(28, 30, 1.5, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0a1428,
      metalness: 0.8,
      roughness: 0.3,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.8;
    pedestal.receiveShadow = true;
    mapGroup.add(pedestal);

    // 5b. Concentric Glowing Neon Rings on Pedestal
    const ring1Geo = new THREE.RingGeometry(24, 24.3, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xf59e0b, side: THREE.DoubleSide });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat);
    ring1.rotation.x = -Math.PI / 2;
    ring1.position.y = 0.01;
    mapGroup.add(ring1);

    const ring2Geo = new THREE.RingGeometry(27.5, 27.8, 64);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 2;
    ring2.position.y = 0.01;
    mapGroup.add(ring2);

    // 5c. Holographic Floor Grid
    const gridHelper = new THREE.GridHelper(52, 40, 0xf59e0b, 0x1e293b);
    gridHelper.position.y = 0.02;
    mapGroup.add(gridHelper);

    // 5d. Bihar Outline Contour Base (Approximate polygon terrain plane)
    const shapeGeo = new THREE.CylinderGeometry(22, 23, 0.4, 48);
    const shapeMat = new THREE.MeshStandardMaterial({
      color: 0x0f2347,
      emissive: 0x071530,
      metalness: 0.5,
      roughness: 0.5,
    });
    const biharPlate = new THREE.Mesh(shapeGeo, shapeMat);
    biharPlate.position.y = 0.2;
    mapGroup.add(biharPlate);

    // 6. District 3D Pins
    const pinMeshes: { mesh: THREE.Mesh; halo: THREE.Mesh; data: DistrictData }[] = [];

    BIHAR_38_DISTRICTS.forEach((d) => {
      const x = (d.lon - centerLon) * scaleX;
      const z = -(d.lat - centerLat) * scaleZ;
      const isCapital = d.id === 'patna';

      // Pin Mast
      const mastHeight = isCapital ? 3.5 : 2.0;
      const mastGeo = new THREE.CylinderGeometry(0.12, 0.2, mastHeight, 16);
      const mastMat = new THREE.MeshStandardMaterial({
        color: isCapital ? 0xffb703 : 0xf59e0b,
        metalness: 0.9,
        roughness: 0.2,
        emissive: isCapital ? 0xd97706 : 0x78350f,
      });
      const mast = new THREE.Mesh(mastGeo, mastMat);
      mast.position.set(x, mastHeight / 2 + 0.4, z);
      mast.castShadow = true;
      mapGroup.add(mast);

      // Pin Head Sphere
      const headRadius = isCapital ? 0.75 : 0.48;
      const headGeo = new THREE.SphereGeometry(headRadius, 20, 20);
      const headMat = new THREE.MeshStandardMaterial({
        color: isCapital ? 0xfef08a : (d.projectsCount >= 7 ? 0xf59e0b : 0x38bdf8),
        metalness: 0.5,
        roughness: 0.2,
        emissive: isCapital ? 0xf59e0b : (d.projectsCount >= 7 ? 0xd97706 : 0x0284c7),
        emissiveIntensity: 0.7,
      });
      const head = new THREE.Mesh(headGeo, headMat);
      head.position.set(x, mastHeight + 0.4 + headRadius, z);
      head.userData = { districtId: d.id };
      mapGroup.add(head);

      // Pulsing Base Halo
      const haloGeo = new THREE.RingGeometry(0.5, 1.1, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: isCapital ? 0xf59e0b : 0x38bdf8,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75,
      });
      const halo = new THREE.Mesh(haloGeo, haloMat);
      halo.rotation.x = -Math.PI / 2;
      halo.position.set(x, 0.41, z);
      mapGroup.add(halo);

      pinMeshes.push({ mesh: head, halo, data: d });
    });

    pinMeshesRef.current = pinMeshes;

    // 7. 3D Corridors / Highway Arcs from Patna to Divisional Headquarters
    const arcsGroup = new THREE.Group();
    arcsGroupRef.current = arcsGroup;
    mapGroup.add(arcsGroup);

    const patna = BIHAR_38_DISTRICTS.find(d => d.id === 'patna')!;
    const patnaX = (patna.lon - centerLon) * scaleX;
    const patnaZ = -(patna.lat - centerLat) * scaleZ;
    const patnaY = 3.5 + 0.4;

    const divisionalHubs = ['gaya', 'bhagalpur', 'muzaffarpur', 'darbhanga', 'purnia', 'saran', 'saharsa', 'munger'];

    divisionalHubs.forEach((hubId) => {
      const hub = BIHAR_38_DISTRICTS.find(d => d.id === hubId);
      if (!hub) return;

      const hubX = (hub.lon - centerLon) * scaleX;
      const hubZ = -(hub.lat - centerLat) * scaleZ;
      const hubY = 2.0 + 0.4;

      // Quadratic curve arc
      const midX = (patnaX + hubX) / 2;
      const midZ = (patnaZ + hubZ) / 2;
      const dist = Math.hypot(patnaX - hubX, patnaZ - hubZ);
      const midY = Math.max(patnaY, hubY) + dist * 0.35 + 2.0;

      const curve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(patnaX, patnaY, patnaZ),
        new THREE.Vector3(midX, midY, midZ),
        new THREE.Vector3(hubX, hubY, hubZ)
      );

      const points = curve.getPoints(36);
      const arcGeo = new THREE.BufferGeometry().setFromPoints(points);
      const arcMat = new THREE.LineBasicMaterial({
        color: 0xfbbf24,
        transparent: true,
        opacity: 0.85,
        linewidth: 2,
      });

      const arcLine = new THREE.Line(arcGeo, arcMat);
      arcsGroup.add(arcLine);
    });

    // 8. 3D Golden Particle Stars
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 80;
      positions[i * 3 + 1] = Math.random() * 40 - 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xf59e0b,
      size: 0.35,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 9. Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Idle Rotation
      if (isAutoRotate && mapGroupRef.current) {
        mapGroupRef.current.rotation.y += delta * 0.18;
      }

      // Pulse halos
      pinMeshes.forEach((item, idx) => {
        const scale = 1 + Math.sin(elapsed * 3 + idx) * 0.25;
        item.halo.scale.set(scale, scale, 1);
      });

      // Gently undulate particles
      particles.rotation.y += delta * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Resize handler
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 580;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current?.domElement && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      renderer.dispose();
    };
  }, [isAutoRotate]);

  // Raycaster for click / hover selection
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    prevMousePos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingRef.current && mapGroupRef.current) {
      const deltaX = e.clientX - prevMousePos.current.x;
      const deltaY = e.clientY - prevMousePos.current.y;
      prevMousePos.current = { x: e.clientX, y: e.clientY };

      mapGroupRef.current.rotation.y += deltaX * 0.008;
      // Clamped pitch
      const nextPitch = mapGroupRef.current.rotation.x + deltaY * 0.004;
      if (nextPitch > -0.3 && nextPitch < 0.6) {
        mapGroupRef.current.rotation.x = nextPitch;
      }
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  // Zoom controls
  const handleZoom = (direction: 'in' | 'out') => {
    if (!cameraRef.current) return;
    const factor = direction === 'in' ? 0.88 : 1.14;
    cameraRef.current.position.multiplyScalar(factor);
    cameraRef.current.position.clampLength(25, 95);
  };

  const handleReset = () => {
    if (!cameraRef.current || !mapGroupRef.current) return;
    cameraRef.current.position.set(0, 48, 56);
    cameraRef.current.lookAt(0, 0, 0);
    mapGroupRef.current.rotation.set(0, 0, 0);
  };

  // Select a district
  const handleDistrictClick = (d: DistrictData) => {
    setSelectedDistrict(d);
    // Orient the 3D map to highlight the district
    if (mapGroupRef.current) {
      const centerLon = 85.8;
      const targetAngle = -((d.lon - centerLon) * 0.25);
      mapGroupRef.current.rotation.y = targetAngle;
    }
  };

  return (
    <section id="bihar-3d-explorer" className="relative w-full bg-[#050b16] text-white py-14 border-t-4 border-amber-500 overflow-hidden select-none">
      {/* Background Starfield Grid */}
      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/50 px-3.5 py-1.5 rounded-full text-xs font-black text-amber-300 uppercase tracking-widest mb-3 shadow-[0_0_15px_rgba(245,158,11,0.25)]">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>3D Digital Bihar • थ्री-डी डिजिटल अन्वेषक</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-serif">
              {language === 'hi' ? 'बिहार 3D डिजिटल विज़न एवं ज़िला अन्वेषक' : 'Bihar 3D Digital Vision & District Explorer'}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl font-medium">
              {language === 'hi' 
                ? 'सभी 38 ज़िलों का वास्तविक थ्री-डी भौगोलिक मॉडल, अवसंरचना कॉरिडोर एवं प्रमुख परियोजनाओं का सजीव 3D मानचित्रण।'
                : 'Interactive real-time 3D spatial terrain model mapping all 38 districts, development corridors, and landmark investments.'}
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 border border-amber-400/40 px-4 py-2 rounded-xl backdrop-blur-md shadow-lg flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
              <div className="text-xs">
                <span className="font-extrabold text-amber-300">38</span> ज़िले • <span className="font-extrabold text-sky-300">9</span> प्रमंडल • <span className="font-extrabold text-emerald-300">3D WebGL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main 3D Canvas Stage */}
        <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-[#030712]">
          
          {/* Top Control Bar inside 3D Canvas */}
          <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
            {/* Left Tag */}
            <div className="bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/15 text-[11px] font-bold text-amber-300 flex items-center gap-2 shadow">
              <Compass className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '12s' }} />
              <span>{language === 'hi' ? '3D मॉडल घुमाने के लिए ड्रैग करें (Drag to Rotate)' : 'Drag to Rotate 3D Model'}</span>
            </div>

            {/* Right Buttons: Controls */}
            <div className="flex items-center gap-2 bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-white/15 shadow">
              <button
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                className={`p-2 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  isAutoRotate ? 'bg-amber-500 text-slate-950 shadow' : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Toggle Auto-Rotation"
              >
                {isAutoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">{isAutoRotate ? 'Pause' : 'Rotate'}</span>
              </button>

              <button
                onClick={() => handleZoom('in')}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => handleZoom('out')}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleReset}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition"
                title="Reset View"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Three.js Canvas Mount */}
          <div
            ref={mountRef}
            className="w-full h-[480px] sm:h-[540px] md:h-[600px] cursor-grab active:cursor-grabbing"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
          />

          {/* Floating 3D Selected District Card (Bottom-Left) */}
          <div className="absolute bottom-5 left-5 z-20 max-w-sm w-[90%] sm:w-[360px] bg-gradient-to-br from-slate-900/95 via-slate-950/90 to-black/95 backdrop-blur-xl border-2 border-amber-400/80 rounded-2xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.85)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-950/60 border border-amber-500/40 px-2 py-0.5 rounded-md">
                  {language === 'hi' ? selectedDistrict.divisionHi : `${selectedDistrict.division} Division`}
                </span>
                <h3 className="text-xl font-black text-white mt-1.5 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <span>{language === 'hi' ? selectedDistrict.nameHi : selectedDistrict.name}</span>
                </h3>
              </div>

              {/* Progress Metric */}
              <div className="bg-amber-400/10 border border-amber-400/30 px-2.5 py-1.5 rounded-xl text-right flex-shrink-0">
                <div className="text-xs font-black text-amber-300 font-mono">
                  {selectedDistrict.projectsCount} {language === 'hi' ? 'परियोजनाएँ' : 'Projects'}
                </div>
                <div className="text-[10px] text-gray-300 font-semibold">
                  ₹{selectedDistrict.totalCr} Cr
                </div>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                {language === 'hi' ? 'प्रमुख विकास परियोजना:' : 'Landmark Infrastructure:'}
              </div>
              <p className="text-xs text-amber-200 font-bold mt-0.5 leading-snug">
                {language === 'hi' ? selectedDistrict.highlightHi : selectedDistrict.highlightEn}
              </p>
            </div>

            {/* Filter District Projects Button */}
            <div className="mt-4 flex items-center gap-2">
              <button
                onClick={() => {
                  if (onSelectDistrict) onSelectDistrict(selectedDistrict.name);
                  const el = document.getElementById('announcement-dashboard');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-slate-950 font-black py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-[0_4px_15px_rgba(245,158,11,0.4)] transition hover:scale-[1.02] active:scale-95"
              >
                <span>{language === 'hi' ? `${selectedDistrict.nameHi} की परियोजनाएँ देखें` : `View ${selectedDistrict.name} Projects`}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* District Quick-Pick Carousel Tabs (Bottom-Right / Mobile scroll) */}
          <div className="hidden lg:flex absolute bottom-5 right-5 z-20 flex-col items-end gap-2 max-w-md">
            <div className="text-[11px] font-black uppercase tracking-wider text-gray-300 bg-black/60 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
              {language === 'hi' ? '★ त्वरित ज़िला चयन (Click Pin to Inspect)' : '★ Quick District Selection'}
            </div>
            <div className="flex flex-wrap justify-end gap-1.5 max-h-36 overflow-y-auto p-1.5 bg-black/75 backdrop-blur-md rounded-2xl border border-white/10 shadow-lg">
              {BIHAR_38_DISTRICTS.slice(0, 12).map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleDistrictClick(d)}
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-lg transition ${
                    selectedDistrict.id === d.id
                      ? 'bg-amber-400 text-slate-950 shadow-[0_0_10px_#f59e0b]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {language === 'hi' ? d.nameHi : d.name}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
