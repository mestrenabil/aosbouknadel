@echo off

echo ===============================
echo        DEVOPS AUTO DEPLOY
echo ===============================

set SERVER_IP=173.249.8.125
set PROJECT_NAME=aosbouknadel
set DOMAIN=aosbouknadel.dabahelp.com
set PORT=3000
set BRANCH=main
set GITHUB_REPO=https://github.com/mestrenabil/aosbouknadel.git
echo.
echo ===== STEP 1 : GIT PUSH =====

git add .
set /p msg=Commit message:
git commit -m "%msg%"
git push origin %BRANCH%

echo.
echo ===== STEP 2 : VPS DEPLOY =====

ssh root@173.249.8.125 ^
"mkdir -p /var/www/aosbouknadel && \
cd /var/www/aosbouknadel && \
if [ ! -d .git ]; then \
git clone %GITHUB_REPO% . ; \
else \
git pull origin %BRANCH% ; \
fi && \
npm install && \
npm run build && \
pm2 delete aosbouknadel || true && \
PORT=3000 pm2 start npm --name aosbouknadel -- start && \
pm2 save"

echo.
echo ===== STEP 3 : CREATE NGINX CONFIG =====

ssh root@173.249.8.125 ^
"echo 'server {
listen 80;
server_name aosbouknadel.dabahelp.com www.aosbouknadel.dabahelp.com;

location / {
proxy_pass http://127.0.0.1:3000;
proxy_http_version 1.1;
proxy_set_header Upgrade \$http_upgrade;
proxy_set_header Connection keep-alive;
proxy_set_header Host \$host;
proxy_cache_bypass \$http_upgrade;
}
}' > /etc/nginx/sites-available/aosbouknadel"

echo.
echo ===== STEP 4 : ENABLE SITE =====

ssh root@173.249.8.125 ^
"ln -sf /etc/nginx/sites-available/aosbouknadel /etc/nginx/sites-enabled/aosbouknadel && \
nginx -t && \
systemctl restart nginx"

echo.
echo ===== STEP 5 : INSTALL SSL =====

ssh root@173.249.8.125 ^
"apt install certbot python3-certbot-nginx -y && \
certbot --nginx -d aosbouknadel.dabahelp.com -d www.aosbouknadel.dabahelp.com --non-interactive --agree-tos -m admin@aosbouknadel.dabahelp.com"

echo.
echo ==========================================
echo           WEBSITE DEPLOYED
echo ==========================================

echo.
echo Your website:
echo https://aosbouknadel.dabahelp.com

pause