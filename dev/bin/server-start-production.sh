#!/usr/bin/env bash

expLoc='dev/bin/server-start-production.sh'
curLoc="${BASH_SOURCE[0]}"


if [ "$expLoc" != "$curLoc" ]; then
    echo 'You can run this script from project root directory only'
    exit 1
fi

found="$(pm2 list|grep api)"

if [ -n "$found" ]; then
    pm2 restart api
else
    NODE_ENV='production' pm2 start index.js --name api
fi
exit 0