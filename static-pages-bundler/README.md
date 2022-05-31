# Static Site Generator

This is a tiny (363 LoC) bundler used for:
- [docs.uidrafter.com](https://docs.uidrafter.com)
- [blog.uidrafter.com](https://blog.uidrafter.com)
- [uidrafter.com](https://uidrafter.com)

In dev, it serves and auto reloads the browser on changes. While
in production it compiles all the pages to static HTML files.


## HTML Template
Optionally, you can use an HTML template. For example,
to handle the common header, navigation, and footer.


## Assets and CSP
In production, the JS and CSS gets inlined with their corresponding CSP nonces.


## Images and Videos (immutable naming)
For long term caching, [media-remaper.js](./media-remaper.js) appends
a SHA-1 hash to the filenames and rewrites their `src` in HTML.

### Images
We [Conditionally Serve AVIF and WebP with Nginx](https://blog.uidrafter.com/conditional-avif-for-video-posters)
That's to say, we generate AVIF and WebP using [media-optimizer.sh](./media-optimizer.sh).

### Videos (only MP4)
Videos get rewritten if needed for fast playback, see [media-optimizer.sh (L44)](./media-optimizer.sh#L44)


## Production Build
It crawls the dev server and saves each route as static html page. For pretty
URLs, it saves the pages without the `.html` extension, see [Pretty routes
for static HTML](https://blog.uidrafter.com/pretty-routes-for-static-html)

### Minifiers
The HTML and CSS are custom, but you can point them to
a popular NPM package like we do in [minifyJS](./minifyJS.js)

### Compression
Each HTML document, CSS and JS file is compressed with brotli in parallel.
For example, there's a `dist/index` and a `dist/index.br` for enabling
[`brotli_static`](https://github.com/google/ngx_brotli#brotli_static) in Nginx.

### Report
The `packed-sizes.json` report is handy for showing size deltas. Also, it
computes SHA-1 hashes, which are handy for example for updating minifiers.

### Sitemap
Builds a `sitemap.txt`


## Serving
Here's an
[nginx.conf](https://github.com/uxtely/ops-utils/blob/main/location-server/jails/nginx_j/usr/local/etc/nginx/nginx.conf)
example. For the logs
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


## Counting Lines of Code
```shell
cloc . --not-match-d=./ --fullpath
```


## Deployment Tips
- [Hitting 304s Across Servers](https://blog.uidrafter.com/hitting-304-across-servers)
- [Deploy Assets Before Documents](https://blog.uidrafter.com/deploy-assets-before-documents)
- [Securely creating TLS certificates with Let's Encrypt](https://blog.uidrafter.com/isolated-tls-certificate-creation)
