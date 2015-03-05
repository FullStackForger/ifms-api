#!/usr/bin/env bash

expLoc='dev/bin/post-deploy.sh'
curLoc="${BASH_SOURCE[0]}"

if [ "$expLoc" != "$curLoc" ]; then
    echo 'You can run this script from project root directory only'
    exit 1
fi

echo "stop all node apps"
pkill node

#extended hook .start

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

#extended hook .end

echo "starting server"
node index.js &

echo "THAT'S ALL FOLKS!"
exit 0