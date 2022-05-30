import fs from 'node:fs'
import { extname } from 'node:path'


const mimes = { // JPG is deliberately omitted (explained in ./media-optimizer)
	'.js': 'application/javascript',
	'.zip': 'application/zip',
	'.json': 'application/json',

	'.ico': 'image/x-icon',
	'.png': 'image/png',
	'.svg': 'image/svg+xml',
	'.avif': 'image/avif',
	'.webp': 'image/webp',

	'.css': 'text/css',
	'.html': 'text/html',

	'.txt': 'text/plain', // e.g. for robots.txt when running lighthouse
	'.less': 'text/plain',
	'.scss': 'text/plain',

	'.mp4': 'video/mp4'
}

function mimeFor(filename) {
	const mime = mimes[extname(filename)]
	if (mime)
		return mime
	throw `Missing MIME for ${filename}`
}



export function routerForStaticPages(rootPath, routes, htmlTemplate = a => a) {
	const altRoot = '/root-meta'

	return async function ({ url, headers }, response) {
		try {
			if (url === '/') { /* Redirect to "/index" or fallback to the first route */
				response.statusCode = 302 // Found (Temporary Redirect)
				response.setHeader('Location', routes[Math.max(0, routes.indexOf('/index'))])
				response.end()
			}

			else if (routes.includes(url)) { /* Serve Documents */
				const f = await fs.promises.readFile(rootPath + url + '.html')
				response.setHeader('Content-Type', 'text/html')
				response.end(htmlTemplate(f, routes.indexOf(url)))
			}

			else if (headers.range) { /* Serve Videos (by range) */
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
			}

			else { /* Serve Static Assets */
				response.setHeader('Content-Type', mimeFor(url))
				const reader = fs.existsSync(rootPath + url)
					? fs.createReadStream(rootPath + url)
					: fs.createReadStream(rootPath + altRoot + url) // @Convention
				reader.on('open', function () { this.pipe(response) })
				reader.on('error', function (error) { onError(error, response) })
			}
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
