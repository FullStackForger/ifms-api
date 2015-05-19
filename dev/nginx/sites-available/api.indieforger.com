 # Reverse proxy definitions to services
include node-upstreams/api.indieforger.com.conf;

server {
    listen       80;
    server_name  dev.api.indieforger.com
                 uat.api.indieforger.com
                 api.indieforger.com;
                 
    client_max_body_size 10M;

    # Endpoint mappings
    include node-endpoints/api.indieforger.com.conf;

    error_page  404              /404.html;
    error_page  500 502 503 504  /50x.html;
}