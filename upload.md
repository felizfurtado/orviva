# 1 Git Upload 

git add .
git commit -m "Your message here"
git push

# 2 vps Login
ssh root@72.60.203.148

cd /var/www/orviva
git pull
systemctl restart orviva