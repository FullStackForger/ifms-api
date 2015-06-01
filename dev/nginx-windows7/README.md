
# Windows setup notes

Although **IT IS NOT RECOMMENDED** to develop IndieForger API Windows platform here is quick quire how to  set it up.

## Environment setup

Below setup assumes nginx is installed in c:\dev folder

### Update PATH environment variable

Add below to PATH environment variables

```
C:\dev\nginx;C:\dev\php
```

### Local port maping for api.indieforger.com

Windows hosts file doesn't allow mapping on port so you have to use Fidler 2 application to do the mapping `dev.api.indieforger.com` to `127.0.0.1:8001`. Navigate to: `Tools > HOSTS` and paste below line.
 
```
127.0.0.1:8001    dev.api.indieforger.com
```