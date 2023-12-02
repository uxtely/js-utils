import fs from 'node:fs'


const mimes = { // JPG is deliberately omitted (explained in ./media-optimizer)
	html: 'text/html; charset=utf8',
	txt: 'text/plain; charset=utf8', // e.g. robots.txt when running lighthouse
	js: 'application/javascript; charset=utf8',
	json: 'application/json; charset=utf8',
	css: 'text/css; charset=utf8',
	less: 'text/plain; charset=utf8',
	svg: 'image/svg+xml; charset=utf8',
	zip: 'application/zip',
	ico: 'image/x-icon',
	png: 'image/png',
	avif: 'image/avif',
	mp4: 'video/mp4',
	webp: 'image/webp'
}
function mimeFor(filename) {
	const mime = mimes[filename.replace(/.*\./, '')]
	if (mime)
		return mime
	throw `Missing MIME for ${filename}`
}


export function routerForStaticPages(rootPath, routes, templatePath, templateConstArg) {
	const altRoot = '/root-meta'
	return async function ({ url, headers }, response) {
		try {
			/* Rewrite to "/index" or fallback to the first route */
			if (url === '/')
				url = routes[Math.max(0, routes.indexOf('/index'))]

			/* Serve Documents */
			if (routes.includes(url)) {
				let htmlTemplate = html => html
				if (templatePath) {
					const t = (await import(templatePath + '?' + Date.now())).default // The date is a cache workaround
					htmlTemplate = templateConstArg ? t.bind(null, templateConstArg) : t
				}
				const html = await fs.promises.readFile(rootPath + url + '.html')
				response.setHeader('Content-Type', mimeFor('html'))
				response.end(htmlTemplate(html, routes.indexOf(url)))
				return
			}

			/* Serve Videos (Partial Content) */
			if (headers.range) {
				const { size } = await fs.promises.lstat(rootPath + url)
				let [start, end] = headers.range.replace(/bytes=/, '').split('-').map(n => parseInt(n, 10))
				if (isNaN(end)) end = size - 1
				if (isNaN(start)) start = size - end

				if (start < 0 || start > end || start >= size || end >= size) {
					response.statusCode = 416 // Range Not Satisfiable
					response.setHeader('Content-Range', `bytes */${size}`)
					response.end()
				}
				else {
					response.statusCode = 206 // Partial Content
					response.setHeader('Accept-Ranges', 'bytes')
					response.setHeader('Content-Range', `bytes ${start}-${end}/${size}`)
					response.setHeader('Content-Type', mimeFor(url))
					const reader = fs.createReadStream(rootPath + url, { start, end })
					reader.on('open', function () { this.pipe(response) })
					reader.on('error', function (error) { onError(error, response) })
				}
				return
			}

			/* Serve Static Assets */
			response.setHeader('Content-Type', mimeFor(url))
			const reader = fs.existsSync(rootPath + url)
				? fs.createReadStream(rootPath + url)
				: fs.createReadStream(rootPath + altRoot + url)
			reader.on('open', function () { this.pipe(response) })
			reader.on('error', function (error) { onError(error, response) })
		}

		catch (error) {
			onError(error, response)
		}
	}
}

function onError(error, response) {
	console.error(error)
	response.statusCode = 404
	response.end()
}