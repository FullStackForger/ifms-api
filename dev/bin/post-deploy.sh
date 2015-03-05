#!/usr/bin/env bash

expLoc='dev/bin/post-deploy-quick.sh'
curLoc="${BASH_SOURCE[0]}"

if [[ ! "$curLoc" =~ "$expLoc" ]]; then
    echo 'You can run this script from project root directory only'
    exit 1
fi

echo "start server"
./dev/bin/server-start-production.sh

echo "THAT'S ALL FOLKS!"
exit 0