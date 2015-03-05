#!/usr/bin/env bash

expLoc='dev/bin/post-deploy.sh'
curLoc="${BASH_SOURCE[0]}"

if [ "$expLoc" != "$curLoc" ]; then
    echo 'You can run this script from project root directory only'
    exit 1
fi

echo "[env-setup] updating package manager"
sudo apt-get update
sudo apt-get upgrade -y

echo "[env-setup] installing libraries"
sudo apt-get install build-essential libssl-dev -y

echo "[env-setup] installing MongoDB"
# Import the public key used by the package management system
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 7F0CEB10
# Create a list file for MongoDB
echo "deb http://repo.mongodb.org/apt/ubuntu "$(lsb_release -sc)"/mongodb-org/3.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.0.list
# Reload local package database
sudo apt-get update
# Install MongoDB
sudo apt-get install -y mongodb-org

echo "[env-setup] configuring MongoDB"
sudo wget -O /etc/rc.local https://gist.githubusercontent.com/innocentio/2bc64ba3c7e98daf955e/raw

echo "[env-setup] installing NginX"
sudo apt-get install nginx -y
#sudo update-rc.d nginx defaults

echo "[env-setup] configuring NginX"
sudo wget -O /etc/nginx/nginx.conf https://gist.githubusercontent.com/innocentio/ade7a21aacfcefce8fbd/raw


echo "[env-setup] installing Git"
sudo add-apt-repository ppa:git-core/ppa -y
sudo apt-get update
sudo apt-get install git -y
git --version


echo "[env-setup] installing NVM"
curl https://raw.githubusercontent.com/creationix/nvm/v0.23.3/install.sh | bash
source ~/.bashrc

echo "[env-setup] installing NodeJS"
nvm install stable
nvm alias default stable
node -v

echo "[env-setup] installing node packages"
npm install -g pm2

sudo reboot;
exit 0