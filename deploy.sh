#!/bin/bash

# ===========================================
# سكريبت نشر موقع جمعية الأعمال الاجتماعية
# AOS Sidi Bouknadel Deployment Script
# ===========================================

set -e

# الألوان للطباعة
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# إعدادات
APP_NAME="aos-bouknadel"
APP_DIR="/var/www/$APP_NAME"
LOG_DIR="/var/log/$APP_NAME"
GIT_REPO="" # أضف رابط المستودع إذا كان موجوداً

echo -e "${GREEN}=== بدء عملية النشر ===${NC}"

# التحقق من التبعيات
echo -e "${YELLOW}التحقق من التبعيات...${NC}"
command -v node >/dev/null 2>&1 || { echo -e "${RED}Node.js غير مثبت!${NC}"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}npm غير مثبت!${NC}"; exit 1; }
command -v pm2 >/dev/null 2>&1 || { echo -e "${YELLOW}تثبيت PM2...${NC}"; npm install -g pm2; }

# إنشاء المجلدات
echo -e "${YELLOW}إنشاء المجلدات...${NC}"
sudo mkdir -p $APP_DIR
sudo mkdir -p $LOG_DIR
sudo chown -R $USER:$USER $APP_DIR
sudo chown -R $USER:$USER $LOG_DIR

# الدخول لمجلد التطبيق
cd $APP_DIR

# نسخ الملفات (إذا كانت موجودة محلياً)
echo -e "${YELLOW}نسخ ملفات التطبيق...${NC}"
# إذا كنت تنقل الملفات عبر scp أو git:
# git clone $GIT_REPO . || git pull

# تثبيت التبعيات
echo -e "${YELLOW}تثبيت التبعيات...${NC}"
npm install --production

# بناء التطبيق (إذا لم يكن مبني)
if [ ! -d ".next" ]; then
    echo -e "${YELLOW}بناء التطبيق...${NC}"
    npm run build
fi

# تهيئة قاعدة البيانات
echo -e "${YELLOW}تهيئة قاعدة البيانات...${NC}"
npx prisma generate
npx prisma db push

# إيقاف التطبيق القديم وإعادة تشغيله
echo -e "${YELLOW}إعادة تشغيل التطبيق...${NC}"
pm2 delete $APP_NAME 2>/dev/null || true
pm2 start ecosystem.config.js --env production
pm2 save

# إعادة تحميل Nginx
echo -e "${YELLOW}إعادة تحميل Nginx...${NC}"
sudo nginx -t && sudo systemctl reload nginx

echo -e "${GREEN}=== تم النشر بنجاح! ===${NC}"
echo -e "${GREEN}الموقع: https://aos-bouknadel.dabahelp.com${NC}"
echo -e "${GREEN}لوحة الإدارة: https://aos-bouknadel.dabahelp.com/admin${NC}"
