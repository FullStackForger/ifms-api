#!/usr/bin/env bash

expLoc='dev/bin/setup/init.sh'
curLoc="${BASH_SOURCE[0]}"

if [ "$expLoc" != "$curLoc" ]; then
    echo 'You can run this script from project root directory only'
    exit 1
fi

# update ssh key
ssh-keygen -R api.innocentio.com
ssh-keyscan -t rsa api.innocentio.com >> ~/.ssh/known_hosts
# execute environment setup script remotely
ssh api.innocentio.com "bash -s" < ./dev/bin/setup/setup-environment.sh
# setup directories for deploy and clone repository
deploy prod setup
# run initial deployment
deploy -c ./dev/config/deploy-init prod-init