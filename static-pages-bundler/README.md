# Static Site Generator

This is a tiny (under 400 LoC) bundler used for:
- [docs.uidrafter.com](https://docs.uidrafter.com)
- [blog.uidrafter.com](https://blog.uidrafter.com)
- [uidrafter.com](https://uidrafter.com)


## HTML Template
Optionally, you can use an HTML template. For example,
to handle the common header, navigation, and footer.


## Development Build
It serves and auto reloads the browser on changes.


## Production Build
It crawls the dev server and saves each route as static html page. For pretty
URLs, it saves the pages without the `.html` extension, see [Pretty routes
for static HTML](https://blog.uidrafter.com/pretty-routes-for-static-html)

- **Assets:** JS and CSS files get inlined with their corresponding CSP nonces.

- **Minifiers:** The HTML and CSS minifiers are custom, but you can point them to
  a popular NPM package like we do in [minifyJS](./minifyJS.js)

- [**media-optimizer.sh**](./media-optimizer.sh):
    - **Images**: We [Conditionally Serve AVIF and WebP with
      Nginx](https://blog.uidrafter.com/conditional-avif-for-video-posters). So
      it auto-generates AVIF and WebP from each PNG.
    - **Videos:** MP4 get rewritten if needed for fast playback.

- **media (immutable naming):** for long term caching,
  [media-remaper.js](./media-remaper.js) appends a SHA-1
  hash to the filenames and rewrites their `src` in HTML.

- **Report:** The `packed-sizes.json` report is handy for showing size
  deltas. Also, it computes SHA-1 hashes, which are handy for example
  for updating dependencies and seeing if they affected the output.

- **Sitemap:** Builds a `sitemap.txt`

- **CSP Header:** It creates a route/CSP map for Nginx in `dist/csp-map.nginx`.
  For that, the `nginx.conf` will need to include it and add the header. For example:
```confg
  # …
  include                   /usr/local/DistBundles/Blog/csp-map.nginx;
  server {
    server_name             blog.example.com;
    location / {
      add_header            Content-Security-Policy $blog_csp;
    }
```

## Serving
Here’s an
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


## Deployment Tips
- [Hitting 304s Across Servers](https://blog.uidrafter.com/hitting-304-across-servers)
- [Deploy Assets Before Documents](https://blog.uidrafter.com/deploy-assets-before-documents)
- [Securely creating TLS certificates with Let's Encrypt](https://blog.uidrafter.com/isolated-tls-certificate-creation)


## CDN Media Uploading
See [bunnycdn-uploader.js](../bunnycdn-uploader.js) for a script to upload video files to BunnyCDN.
It's no longer used in UI Drafter, and it hasn't been used it in a while…
