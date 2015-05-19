#!/usr/bin/env bash

expLoc='dev/bin/server-start.sh'
curLoc="${BASH_SOURCE[0]}"


if [[ ! "$curLoc" =~ "$expLoc" ]]; then
    echo 'You can run this script from project root directory only'
    exit 1
fi

echo '[server-start]: Local directory'
pwd

found="$(pm2 list|grep api)"

if [ -n "$found" ]; then
    SRV_AUTOSTART='true' pm2 restart api
else
    SRV_AUTOSTART='true' pm2 start index.js --name api
fi
exit 0