 # Reverse proxy definitions to services
include node-upstreams/bevelgames.com.conf;

server {
    listen       80;
    server_name  dev.bevelgames.com
                 uat.bevelgames.com 
                 bevelgames.com;
                 
    client_max_body_size 1000M;

    # Endpoint mappings
    include node-endpoints/bevelgames.com.conf;

    error_page  404              /404.html;
    error_page  500 502 503 504  /50x.html;
}