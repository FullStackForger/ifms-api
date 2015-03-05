#!/usr/bin/env bash

####
## Ubuntu 14.04 LTS Configuration Script
####

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
# load NVM
export NVM_DIR="/home/ubuntu/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

echo "[env-setup] installing NodeJS"
nvm install stable
nvm alias default stable
node -v

echo "[env-setup] installing node packages"
# install pm2
npm install -g pm2@latest
# generate startup script
pm2 startup

echo "[env-setup] adding fingerprints to known_hosts"
ssh-keygen -R bitbucket.org
ssh-keyscan -t rsa bitbucket.org >> ~/.ssh/known_hosts
ssh-keygen -R github.com
ssh-keyscan -t rsa github.com >> ~/.ssh/known_hosts

echo "[env-setup] generate new ssh key (auto confirm overwrite)"
echo -e  'y\n'|ssh-keygen -q -t rsa -N "" -f ~/.ssh/id_rsa

echo "[env-setup] To continue setup below ssh key as deployment key in your repository!"
echo "[env-setup] Use below id_rsa.pub to allow access"
cat ~/.ssh/id_rsa.pub

echo "\n\n"
read -p "Press [Enter] to continue... "

exit 0