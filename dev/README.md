Bevel Games Environment Configuration
=====================================

Local Dev Environment: dev.bevelgames.com (Mac OS) 
--------------------------------------------------

### Nginx.conf configuration

**Note:** This is part of public [guide][guide-link] but makes sure main `nginx.conf` loads right configs.
[guide-link]: https://bitbucket.org/rusticode/rusticode/wiki/installing-nginx-on-osx-with-macports-for-nodejs.md


Edit the main `nginx.conf` and in the http section add:
```
include node-apps.conf
```

Copy the files in the dev/nginx directory to the nginx config directory.

```bash
sudo cp -r nginx/* /opt/local/etc/nginx/
```

Enable bevelgames.com
```
cd /opt/local/etc/nginx/sites-enabled/
sudo ln -s ../sites-available/bevelgames.com
```

Reload nginx
```
sudo port unload nginx && sudo port load nginx
```
### /etc/hosts entry

Define the dev.bevelgames.com host
sudo vim 
```bash
sudo sh -c 'printf "\n127.0.0.1\tdev.bevelgames.com" >> /private/etc/hosts'
```