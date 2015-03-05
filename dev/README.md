# Bevel Games Environment Configuration

> All scripts should be run from application root folder

## Local Dev Environment: dev.api.innocentio.com (Mac OS) 

### App configuration

```
cp dev/config/config-dev.json config/config.json
```

### Nginx.conf configuration

<!-- todo: add link -->
**Note:** This is part of public innocentio guide: installing-nginx-on-osx-with-macports-for-nodejs.md

```bash
# copye nginx config files
sudo cp -r nginx/* /opt/local/etc/nginx/
# enable site
sudo ln -s /opt/local/etc/nginx/sites-available/api.innocentio.com /opt/local/etc/nginx/sites-enabled/dev.api.innocentio.com
# reload nginx
sudo port unload nginx && sudo port load nginx
```
### /etc/hosts entry

Define the dev.innocentio.com host
```bash
sudo sh -c 'printf "\n127.0.0.1\tdev.api.innocentio.com" >> /private/etc/hosts'
```

## Production Environment: api.innocentio.com (Ubuntu 14.04 LTS:HMV)

### Environment setup

Create empty EC2 instance from 'innocentio-prod' AMI and when ready run

```
./dev/bin/setup/init.sh
```

### Deployment