# Bevel Games Environment Configuration

> All scripts should be run from application root folder

## Local Dev Environment: dev.api.indieforger.com (Mac OS) 

### App configuration

First copy appropriate environment config into `./config` folder.
```
cp dev/config/config-dev.json config/config.json
```
Then update facebook clientId and clientSecret keys. 


### Nginx.conf configuration

<!-- todo: add link -->
**Note:** This is part of public indieforger guide: installing-nginx-on-osx-with-macports-for-nodejs.md

```bash
# copy nginx config files  
sudo cp -r nginx/* /opt/local/etc/nginx/
# enable site  
sudo ln -s /opt/local/etc/nginx/sites-available/api.indieforger.com /opt/local/etc/nginx/sites-enabled/dev.api.indieforger.com
# reload nginx  
sudo port unload nginx && sudo port load nginx
```
### /etc/hosts entry

Define the dev.indieforger.com host
```bash
sudo sh -c 'printf "\n127.0.0.1\tdev.api.indieforger.com" >> /private/etc/hosts'
```

## Production Environment: api.indieforger.com (Ubuntu 14.04 LTS:HMV)

### Environment setup

Create empty EC2 instance from 'indieforger-prod' AMI and when ready run

```
./dev/bin/setup/init.sh
```

### Deployment