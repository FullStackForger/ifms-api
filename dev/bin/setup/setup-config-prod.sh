#!/usr/bin/env bash

expLoc='dev/bin/setup/setup-config-prod.sh'
curLoc="${BASH_SOURCE[0]}"

if [[ ! "$curLoc" =~ "$expLoc" ]]; then
    echo 'You can run this script from project root directory only'
    exit 1
fi

echo "loading nvm"
export NVM_DIR="/home/ubuntu/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

echo "npm update"
npm update

echo "updating config.json"
mkdir -p config
cp dev/config/config-prod.json config/config.json

echo "updating nginx config files"
sudo cp -r dev/nginx/* /etc/nginx/

echo "forcing site enabling symplink"
sudo ln -sf /etc/nginx/sites-available/api.innocentio.com /etc/nginx/sites-enabled/api.innocentio.com

echo "reloading nginx"
sudo service nginx restart

exit 0