# 🚀 دليل نشر الموقع على VPS Linux
## جمعية الأعمال الاجتماعية - سيدي بوقنادل

---

## 📋 المتطلبات

| البرنامج | الإصدار المطلوب |
|----------|----------------|
| Ubuntu/Debian | 20.04 أو أحدث |
| Node.js | 18.x أو أحدث |
| npm/bun | أحدث إصدار |
| Nginx | 1.18 أو أحدث |
| PM2 | عالمي |
| Certbot | للشهادات SSL |

---

## 🔧 خطوات التثبيت

### 1. تحديث النظام
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. تثبيت Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# أو استخدام bun (أسرع)
curl -fsSL https://bun.sh/install | bash
```

### 3. تثبيت Nginx
```bash
sudo apt install -y nginx
sudo systemctl enable nginx
sudo systemctl start nginx
```

### 4. تثبيت PM2
```bash
sudo npm install -g pm2
```

### 5. تثبيت Certbot (للشهادات SSL)
```bash
sudo apt install -y certbot python3-certbot-nginx
```

---

## 📁 نقل الملفات

### الطريقة 1: باستخدام SCP
```bash
# من جهازك المحلي
scp -r /home/z/my-project/* user@your-vps-ip:/var/www/aos-bouknadel/
```

### الطريقة 2: باستخدام rsync (موصى به)
```bash
rsync -avz --exclude 'node_modules' --exclude '.next' \
  /home/z/my-project/ user@your-vps-ip:/var/www/aos-bouknadel/
```

---

## ⚙️ إعداد التطبيق

### 1. إنشاء المجلدات
```bash
sudo mkdir -p /var/www/aos-bouknadel
sudo mkdir -p /var/log/aos-bouknadel
sudo chown -R $USER:$USER /var/www/aos-bouknadel
sudo chown -R $USER:$USER /var/log/aos-bouknadel
```

### 2. الدخول للمجلد
```bash
cd /var/www/aos-bouknadel
```

### 3. تثبيت التبعيات
```bash
npm install
# أو
bun install
```

### 4. إعداد ملف البيئة
```bash
cp .env.production .env
# عدّل الملف حسب احتياجاتك
nano .env
```

### 5. بناء التطبيق
```bash
npm run build
# أو
bun run build
```

### 6. تهيئة قاعدة البيانات
```bash
npx prisma generate
npx prisma db push
```

---

## 🌐 إعداد Nginx

### 1. نسخ ملف الإعداد
```bash
sudo cp nginx.conf /etc/nginx/sites-available/aos-bouknadel
sudo ln -s /etc/nginx/sites-available/aos-bouknadel /etc/nginx/sites-enabled/
```

### 2. اختبار الإعداد
```bash
sudo nginx -t
```

### 3. إعادة تحميل Nginx
```bash
sudo systemctl reload nginx
```

---

## 🔒 تثبيت شهادة SSL

```bash
sudo certbot --nginx -d aos-bouknadel.dabahelp.com
```

اختر الخيار 2 لإعادة التوجيه التلقائي من HTTP إلى HTTPS.

---

## 🚀 تشغيل التطبيق

### باستخدام PM2
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### أو يدوياً
```bash
npm run start
# أو
PORT=3000 node .next/standalone/server.js
```

---

## 🔄 تحديث الموقع

### سكريبت تحديث سريع
```bash
cd /var/www/aos-bouknadel

# سحب التحديثات (إذا كنت تستخدم git)
git pull

# تثبيت التبعيات الجديدة
npm install

# بناء التطبيق
npm run build

# تحديث قاعدة البيانات
npx prisma db push

# إعادة تشغيل PM2
pm2 restart aos-bouknadel
```

---

## 📊 مراقبة التطبيق

### عرض الحالة
```bash
pm2 status
pm2 logs aos-bouknadel
pm2 monit
```

### عرض السجلات
```bash
tail -f /var/log/aos-bouknadel/out.log
tail -f /var/log/aos-bouknadel/error.log
```

---

## 🛠️ أوامر مفيدة

| الأمر | الوصف |
|-------|-------|
| `pm2 start all` | تشغيل جميع التطبيقات |
| `pm2 stop all` | إيقاف جميع التطبيقات |
| `pm2 restart all` | إعادة تشغيل جميع التطبيقات |
| `pm2 logs` | عرض السجلات |
| `pm2 monit` | مراقبة الأداء |
| `sudo systemctl status nginx` | حالة Nginx |
| `sudo systemctl restart nginx` | إعادة تشغيل Nginx |

---

## 🔥 جدار الحماية (Firewall)

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw enable
sudo ufw status
```

---

## 📞 بيانات الدخول

| الدور | اسم المستخدم | كلمة المرور |
|-------|-------------|-------------|
| **المدير** | admin | admin123 |
| **منخرط تجريبي** | M001 | member123 |

---

## 🌐 روابط الموقع

- **الموقع:** https://aos-bouknadel.dabahelp.com
- **لوحة الإدارة:** https://aos-bouknadel.dabahelp.com/admin
- **بوابة المنخرطين:** https://aos-bouknadel.dabahelp.com/member-portal
