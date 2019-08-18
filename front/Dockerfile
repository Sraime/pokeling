FROM httpd

COPY ./dist/ngCliWebpackSample /usr/local/apache2/htdocs/
COPY ./.htaccess /usr/local/apache2/htdocs/
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf


WORKDIR /usr/local/apache2/htdocs