#!/usr/bin/env bash

expLoc='dev/bin/post-deploy-fast.sh'
curLoc="${BASH_SOURCE[0]}"

if [[ ! "$curLoc" =~ "$expLoc" ]]; then
    echo 'You can run this script from project root directory only'
    exit 1
fi

echo "[post-deploy] setting up paths"
export NVM_DIR="/home/ubuntu/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"  # This loads nvm

echo "[post-deploy] start server"
./dev/bin/server-start.sh

exit 0;