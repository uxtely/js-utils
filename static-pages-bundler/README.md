# Static Pages Bundler

In UI Drafter, this bundler is used for:
- https://uidrafter.com
- https://blog.uidrafter.com 
- https://docs.uidrafter.com

There are two example projects (docs, and blog) included in this repo.
 
In dev, it serves and auto reloads the browser on changes. While
in production it compiles all the pages to static HTML files.


## HTML Template
Optionally, you can create an HTML template.
For example, to handle the common header, navigation, and footer.


## Assets and CSP
The production bundler inlines the JavaScript
and CSS files. And computes their CSP nonces.


## Images and Videos
[media-remaper.js](./media-remaper.js) appends a SHA1 hash to the filenames
and takes care of rewriting their `src` in HTML (**only in HTML**).

### Images (no JPGs)
We [Conditionally Serve AVIF and WebP with Nginx](https://blog.uidrafter.com/conditional-avif-for-video-posters)
That's to say, we generate AVIF and WebP using [media-optimizer.sh](./media-optimizer.sh).

### Videos (only MP4)
We only use MP4 videos
[media-optimizer.sh (L44)](./media-optimizer.sh#L44)


## Production Build
It crawls the dev server, and saves each route as static html page.
It saves the pages without the `.html` extension for pretty URLs. 
See [Pretty routes for static HTML](https://blog.uidrafter.com/pretty-routes-for-static-html)

### Minifiers
The HTML and CSS are custom, but you can point them to
a popular NPM package like we do in [minifyJS](./minifyJS.js)

### Compression
Each HTML document, CSS and JS file is pre-compressed with brotli in parallel.
For example, there's a `dist/index` and a `dist/index.br`.


## Serving
Here's the
[nginx.conf](https://github.com/uxtely/ops-utils/blob/main/location-server/jails/nginx_j/usr/local/etc/nginx/nginx.conf)
used by UI Drafter. For the logs
database see [web-traffic-logs](https://github.com/uxtely/ops-utils/tree/main/web-traffic-logs/).


## Installation
```shell script
npm install

# Optional:
cd ~
npm install -g eslint \
  stylelint \
  stylelint-config-idiomatic-order \
  stylelint-config-recommended 
```
