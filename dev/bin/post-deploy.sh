#!/usr/bin/env bash

expLoc='dev/bin/post-deploy.sh'
curLoc="${BASH_SOURCE[0]}"

if [[ ! "$curLoc" =~ "$expLoc" ]]; then
    echo 'You can run this script from project root directory only'
    exit 1
fi

echo "[post-deploy] start server"
./dev/bin/server-start.sh

exit 0