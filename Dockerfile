FROM nginx:1.10

# gcr.io/habemus-web/static-assets-starter-projects

MAINTAINER Simon Fan <simon.fan@habem.us>

# nginx configuration files
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf

# files to be served
COPY ./dist /data/www
