# 🏛️ JanSetu Bihar — Official Governance Portal & Project Tracking Dashboard
### सम्पूर्ण डेप्लॉयमेंट गाइड (Comprehensive Production Deployment Guide)

---

## 📋 अवलोकन (Overview)
यह पैकेज **जनसेतु बिहार / सम्मोहन** (JanSetu Bihar Portal) का पूर्णतः संकलित, प्रोडक्शन-रेडी डेप्लॉयमेंट पैकेज है।
इसमें फ़्रंटएंड, बैकएंड (Express Node.js), MongoDB डेटाबेस, सार्वजनिक असेट्स, तथा डॉकर/ग्निक्स/पीएम2 विन्यास पूर्ण रूप से एकीकृत हैं।

---

## 🚀 1. विंडोज़ पर एक-क्लिक में शुरू करें (1-Click Windows Launch)
1. इस फोल्डर में मौजूद **`START_SERVER.bat`** पर डबल-क्लिक करें।
2. सर्वर स्वतः पोर्ट `5000` पर शुरू हो जाएगा।
3. आपका डिफ़ॉल्ट वेब ब्राउज़र स्वतः **`http://localhost:5000`** पर खुल जाएगा।
4. सर्वर बंद करने के लिए कमांड विंडो में `Ctrl + C` दबाएं।

---

## 🐧 2. लिनक्स / क्लाउड वीपीएस पर डेप्लॉयमेंट (Linux / VPS Deployment)

### आवश्यकताएं:
- Node.js 18.x या 20.x
- NPM

### चरण:
```bash
# 1. निष्पादन अनुमति प्रदान करें
chmod +x START_SERVER.sh

# 2. सर्वर प्रारंभ करें
./START_SERVER.sh
```

### PM2 के साथ बैकग्राउंड में चलाना (Recommended for 24/7 Uptime):
```bash
# PM2 स्थापित करें (यदि नहीं है)
npm install -g pm2

# पैकेज डायरेक्टरी में PM2 चलाएं
pm2 start ecosystem.config.js

# बूट पर ऑटो-स्टार्ट सक्षम करें
pm2 save
pm2 startup
```

---

## 🐳 3. डॉकर डेप्लॉयमेंट (Docker & Docker Compose)

यदि आप Docker का उपयोग कर रहे हैं:
```bash
# कंटेनर बनाएं और बैकग्राउंड में चलाएं
docker-compose up -d

# स्थिति जांचें
docker-compose ps

# लॉग्स देखें
docker-compose logs -f
```
पोर्ट: `http://<YOUR_SERVER_IP>:5000`

---

## 🌐 4. Nginx रिवर्स प्रॉक्सी सेटअप (Nginx Reverse Proxy)
पैकेज में शामिल **`nginx.conf`** को `/etc/nginx/sites-available/jansetu` में कॉपी करें और सिम्लिंक बनाएं:
```bash
sudo cp nginx.conf /etc/nginx/sites-available/jansetu
sudo ln -s /etc/nginx/sites-available/jansetu /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

---

## 🔐 5. लॉगिन क्रेडेंशियल्स एवं आरबीएसी (Login Credentials & RBAC)

| भूमिका (Role) | यूज़रनेम (Username) | पासवर्ड (Password) | अनुमतियां (Permissions) |
|---|---|---|---|
| **सुपर एडमिन (Admin)** | `admin` | `admin123` | सभी 48 विभागों, परियोजनाओं का संपादन, डेटा प्रविष्टि, निर्यात व प्रबंधन |
| **सार्वजनिक उपयोगकर्ता (Public)** | *लॉगिन आवश्यक नहीं* | *लॉगिन आवश्यक नहीं* | मुख्य लैंडिंग पृष्ठ, 48 विभाग निर्देशिका, परियोजना सांख्यिकी, 3D नक्शा अवलोकन |

---

## 📁 6. पैकेज डायरेक्टरी संरचना (Directory Structure)

```
JanSetu-Bihar-Deployment/
├── START_SERVER.bat          <- विंडोज़ 1-क्लिक स्टार्टर
├── START_SERVER.sh           <- लिनक्स/वीपीएस स्टार्टर
├── DEPLOYMENT_GUIDE.md       <- विस्तृत डेप्लॉयमेंट मार्गदर्शिका
├── VERIFY_DEPLOYMENT.py      <- 10-पॉइंट स्वचालित सत्यापन स्क्रिप्ट
├── Dockerfile                <- डॉकर कंटेनर विन्यास
├── docker-compose.yml        <- डॉकर कम्पोज़ फ़ाइल
├── nginx.conf                <- Nginx रिवर्स प्रॉक्सी विन्यास
├── ecosystem.config.js       <- PM2 प्रोसेस मैनेजर विन्यास
├── .env                      <- प्रोडक्शन पर्यावरण चर
├── dist/                     <- स्टैंडअलोन स्टैटिक फ़्रंटएंड बिल्ड
├── server/                   <- प्रोडक्शन नोड सर्वर + इंटीग्रेटेड फ़्रंटएंड
│   ├── dist/                 <- संकलित सर्वर कोड + public/ फ़्रंटएंड
│   ├── src/database/mongo.ts <- MongoDB models and data layer
│   └── node_modules/         <- आउट-ऑफ-द-बॉक्स रनटाइम डिपेंडेंसीज़
└── client/                   <- पूर्ण स्वच्छ रिएक्ट स्रोत कोड (TypeScript)
```

---

## 🧪 7. सिस्टम सत्यापन (Health & Security Verification)
सर्वर चलने के बाद सत्यापन चलाने के लिए:
```bash
python VERIFY_DEPLOYMENT.py
```
यह 10 प्रमुख सुरक्षा व फंक्शनल बिंदुओं (Health, API, RBAC, Captcha, Log Delivery, Static Assets) की स्वतः जांच करता है।
