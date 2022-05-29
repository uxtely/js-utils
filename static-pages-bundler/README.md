# Static Pages Bundler

In UI Drafter, this bundler is used for:
- https://uidrafter.com
- https://blog.uidrafter.com [example-blog/](./example-blog)
- https://docs.uidrafter.com [example-docs/](./example-docs)
 
In dev, iy serves and auto reloads the browser on changes. While
in production it compiles all the pages to static HTML files.


## HTML Template
Optionally, you can create an HTML template.
For example, to handle the common header, navigation, and footer.

### [parseHeadAndBody.js](./parseHeadAndBody.js)
This function is used because the pages are partial HTML documents
(e.g. [shortcuts.html](./example-docs/root/shortcuts.html), they have
an optional head section and the rest is considered part of the body.




## Assets and CSP
The production bundler inlines the JavaScript and CSS. Also, it
computes their corresponding CSP nonce and injects it as well.


## Images and Videos
[media-remaper.js](./media-remaper.js) appends a SHA1 hash to the filenames
and takes care of rewriting their `src` in HTML (**only in HTML**).

If you want to use media files in CSS, create a similar function to
`remapMediaInHTML` but with a regex for replacing the `url(...)` content.                         

### Images (no JPGs)
We [Conditionally Serve AVIF and WebP with Nginx](https://blog.uidrafter.com/conditional-avif-for-video-posters)
That's to say, we generate AVIF and WebP using [media-optimizer.sh](./media-optimizer.sh).

For color consistency (especially for app screenshots), we always use PNGs (no JPGs).

If you want to use JPGs:
- Add its Media Type to [mimes.js](./mimes.js)
- Add its extension to [media-remaper.js](./media-remaper.js) to the `listFiles` regex
- Remove the JPG check in [media-optimizer.sh (L22)](./media-optimizer.sh#L22)

### Videos (only MP4)
We only use MP4 videos
[media-optimizer.sh (L44)](./media-optimizer.sh#L44)


## Production Build
It crawls the dev server, and saves each route as static html page.
It saves the pages without the `.html` extension for pretty URLs. 
See [Pretty routes for static HTML](https://blog.uidrafter.com/pretty-routes-for-static-html)

### Minifiers
The HTML and CSS are custom (an incomplete), but you can make them point to a popular 
NPM package like we do in [minifyJS](./minifyJS.js)



## Installation
```shell script
cd ~
npm install -g eslint \
  stylelint \
  stylelint-config-idiomatic-order \
  stylelint-config-recommended 
  
cd .  
npm install
```
