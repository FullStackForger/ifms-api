#!/usr/bin/env bash

expLoc='dev/bin/setup/init.sh'
curLoc="${BASH_SOURCE[0]}"

if [[ ! "$curLoc" =~ "$expLoc" ]]; then
    echo 'You can run this script from project root directory only'
    exit 1
fi

# update ssh key
ssh-keygen -R api.innocentio.com
ssh-keyscan -t rsa api.innocentio.com >> ~/.ssh/known_hosts
# execute environment setup script remotely
ssh api.innocentio.com "bash -s" < ./dev/bin/setup/setup-environment.sh

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
ssh api.innocentio.com "sudo reboot"