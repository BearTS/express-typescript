FROM nginx:alpine

RUN mkdir -p /etc/nginx/cert

COPY cert/cert.crt /etc/nginx/cert/cert.crt
COPY cert/privateKey.key /etc/nginx/cert/privateKey.key

COPY default.conf /etc/nginx/conf.d/
# Expose the port for access
EXPOSE 80/tcp

# Run the Nginx server
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]