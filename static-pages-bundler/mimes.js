import { extname } from 'node:path'

// JPG is deliberately omitted (explained in ./media-optimizer)

const mimes = {
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


export function mimeFor(filename) {
	const mime = mimes[extname(filename)]

	if (mime)
		return mime

	throw `Missing MIME for ${filename}`
}
