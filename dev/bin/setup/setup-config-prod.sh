#!/usr/bin/env bash

expLoc='dev/bin/setup/setup-config-prod.sh'
curLoc="${BASH_SOURCE[0]}"

if [[ ! "$curLoc" =~ "$expLoc" ]]; then
    echo 'You can run this script from project root directory only'
    exit 1
fi

echo "updating config.json"
mkdir -p config
cp dev/config/config-prod.json config/config.json


if [ -e /etc/nginx/sites-enabled/default ]; then
	sudo echo "deleting: /etc/nginx/sites-enabled/default"
	rm /etc/nginx/sites-enabled/default
fi

echo "updating nginx config files"
sudo cp -r dev/nginx/* /etc/nginx/


echo "forcing site enabling symplink"
sudo ln -sf /etc/nginx/sites-available/api.indieforger.com /etc/nginx/sites-enabled/api.indieforger.com

echo "reloading nginx"
sudo service nginx restart

exit 0