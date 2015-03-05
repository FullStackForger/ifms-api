#!/usr/bin/env bash

####
## Completion script
####

printf "\n\n"
echo "[env-setup] CONGRATULATIONS! Setup complete."
echo "\n\n"
echo "[env-setup] Is your server running yet. It should if all went ok..."
printf "\n\n"

read -p "Press [Enter] key reboot the instance..."

sudo reboot;
exit;