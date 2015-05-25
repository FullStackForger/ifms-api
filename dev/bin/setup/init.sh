#!/usr/bin/env bash

expLoc='dev/bin/setup/init.sh'
curLoc="${BASH_SOURCE[0]}"

if [[ ! "$curLoc" =~ "$expLoc" ]]; then
    echo 'You can run this script from project root directory only'
    exit 1
fi

# update ssh keys
echo "[env-init] authorising api.indieforger.com"
hostName=api.indieforger.com
hostAddr=$(host $hostName | awk '/address*/{print substr($4,0)}')
ssh-keygen -R "$hostAddr"
ssh-keygen -R "$hostName"
ssh-keyscan -t rsa "$hostAddr" >> ~/.ssh/known_hosts
ssh-keyscan -t rsa "$hostName" >> ~/.ssh/known_hosts

echo "[env-init] setting up environment"

# execute environment setup script remotely
ssh api.indieforger.com "bash -s" < ./dev/bin/setup/setup-environment.sh

read -p "Authorise key and press [enter] to continue when done..."
 
# setup directories for deploy and clone repository
deploy prod setup
# run initial deployment
deploy -c ./dev/config/deploy-init.conf prod-init


# complettion message with prompt
printf "\n\n"
printf "\tCONGRATULATIONS! Setup complete."
printf "\tIs your server set up yet?"
printf "\n\n"
read -p "Press [Enter] key reboot the instance..."

# server reboot
ssh api.indieforger.com "sudo reboot"