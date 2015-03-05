#!/usr/bin/env bash

expLoc='dev/bin/post-deploy-quick.sh'
curLoc="${BASH_SOURCE[0]}"

if [ "$expLoc" != "$curLoc" ]; then
    echo 'You can run this script from project root directory only'
    exit 1
fi

echo "stop all node apps"
pkill node

echo "starting server"
pm2 index.js

echo "THAT'S ALL FOLKS!"
exit 0