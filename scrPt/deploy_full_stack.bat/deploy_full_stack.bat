@echo off

echo ===============================
echo        DEVOPS AUTO DEPLOY
echo ===============================

set SERVER_IP=173.249.8.125
set PROJECT_NAME=project
set DOMAIN=aos-bouknadeldabahelp.com
set PORT=3001
set BRANCH=main

echo.
echo ====== GIT PUSH ======
git add .
set /p msg=Commit message: 
git commit -m "update homepage"
git push origin main

echo.
echo ====== VPS DEPLOY ======

ssh root@173.249.8.125 ^
"mkdir -p /var/www/aosbouknadel && \
cd /var/www/aosbouknadel && \
if [ ! -d .git ]; then \
git clone https://github.com/mestrenabil/aosbouknadel.git . ; \
else \
git pull origin main ; \
fi && \
npm install && \
npm run build && \
pm2 delete aosbouknadel || true && \
PORT=3001 pm2 start npm --name aosbouknadel -- start && \
pm2 save"

echo.
echo ====== NGINX CONFIG ======

ssh root@173.249.8.125 ^
"echo 'server {
listen 80;
server_name aosbouknadel www.aosbouknadel.dabahelp.com;

location / {
proxy_pass http://127.0.0.1:3001;
proxy_http_version 1.1;
proxy_set_header Upgrade \$http_upgrade;
proxy_set_header Connection keep-alive;
proxy_set_header Host \$host;
proxy_cache_bypass \$http_upgrade;
}
}' > /etc/nginx/sites-available/aosbouknadel"

ssh root@173.249.8.125 ^
"ln -sf /etc/nginx/sites-available/aosbouknadel /etc/nginx/sites-enabled/aosbouknadel && \
nginx -t && \
systemctl restart nginx"

echo.
echo ===============================
echo      WEBSITE DEPLOYED
echo ===============================

pause