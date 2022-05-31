import http from 'node:http'
import { spawn } from 'node:child_process'
import { createHash } from 'node:crypto'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import watch from 'node-watch'

import { minifyJS } from './minifyJS.js'
import { minifyCSS } from './minifyCSS.js'
import { minifyHTML } from './minifyHTML.js'
import { remapMediaInHTML, copyDirWithHashedNames } from './media-remaper.js'
import { extractStyleSheetHrefs, extractJavaScriptSources, removeLineContaining } from './parsers.js'

import { Pool } from '../parallel.js'
import { DevHost, browser } from '../Environment.js'
import { read, write, copyDir, removeDir, sizeOf, sha1, exists, saveAsJSON } from '../fs-utils.js'


const __dirname = dirname(fileURLToPath(import.meta.url))


export function devStaticPages(router, rootDir = './root') {
	const server = http.createServer(router)
	server.listen(0, DevHost, error => {
		if (error)
			console.error(error)
		else {
			const serverAddr = `http://${DevHost}:${server.address().port}`
			spawn(browser(), [serverAddr])
			console.log(serverAddr)
			watch(rootDir, { recursive: true }, () => {
				spawn(__dirname + '/reload-browser')
			})
		}
	})
}


export async function buildStaticPages(router, routes, sitemapDomain) {
	const pSource = 'root/'
	const pMedia = 'root/media'
	const pMeta = 'root/root-meta'
	const pDist = 'dist'
	const pDistMedia = 'dist/media'
	const pSizesReport = 'packed-sizes.json'

	const server = http.createServer(router)
	server.listen(0, DevHost, async error => {
		try {
			if (error)
				throw error

			const { port } = server.address()
			const serverAddr = `http://${DevHost}:${port}`

			removeDir(pDist)
			const mediaHashes = copyDirWithHashedNames(pMedia, pDistMedia)

			const brotliPool = new Pool(__dirname + '/worker-for-brotli.js')
			let nFinishedBrotliWorkers = 0

			for (const route of routes) {
				let html = await httpGet(serverAddr + route)
				html = minifyHTML(html) // To remove comments and format multi-line tags (needed for `removeLineContaining`)
				html = remapMediaInHTML(mediaHashes, html)

				let css = ''
				for (const sheet of extractStyleSheetHrefs(html)) {
					css += read(pSource + sheet)
					html = removeLineContaining(html, `href="${sheet}"`)
				}

				let js = ''
				for (const script of extractJavaScriptSources(html)) {
					js += read(pSource + script)
					html = removeLineContaining(html, `src="${script}"`)
				}

				css = minifyCSS(css)
				js = await minifyJS(js)

				const cssNonce = cspNonce(css)
				const jsNonce = cspNonce(js) || 'self'
				const csp = [
					`default-src 'self'`,
					`img-src 'self' data:`, // data: is for Safari's video player icons and for CSS bg images
					`style-src '${cssNonce}'`,
					`script-src '${jsNonce}'`
				].join(';')

				html = html // Adds CSP rules, and injects (inlines) the CSS and JS
					.replace('<head>', '<head>'
						+ `<meta http-equiv="Content-Security-Policy" content="${csp};">`
						+ `<style nonce="${cssNonce}">${css}</style>`)
					.replace('</body>', `<script nonce="${jsNonce}">${js}</script></body>`)

				write(pDist + route, html)
				brotliPool.run(pDist + route, error => {
					if (error)
						console.error(error)

					if (++nFinishedBrotliWorkers === routes.length) {
						brotliPool.close()

						if (sitemapDomain) {
							let sitemap = ''
							for (const route of routes)
								if (route !== '/index')
									sitemap += `https://${sitemapDomain + route}\n`
							write(`${pDist}/sitemap.txt`, sitemap)
						}

						copyDir(pMeta, pDist)
						reportSizes(pSizesReport, pDist, routes)
					}
				})
			}
		}
		catch (error) {
			console.error(error)
			process.exitCode = 1
		}
		finally {
			server.close()
		}
	})
}


export function httpGet(url) {
	return new Promise((resolve, reject) => {
		http.get(url, response => {
			if (response.statusCode !== 200)
				reject(`URL: ${url}, Status: ${response.statusCode}`)

			response.setEncoding('utf8')
			let body = ''
			response.on('data', chunk => { body += chunk })
			response.on('end', () => resolve(body))
		}).on('error', reject)
	})
}

function cspNonce(data) {
	return data
		? 'sha256-' + createHash('sha256').update(data).digest('base64')
		: ''
}

function reportSizes(reportFilename, baseDir, files) {
	const oldReport = JSON.parse(read(reportFilename))
	const newReport = {}

	for (const f of files) {
		const fPath = join(baseDir, f)
		const size = sizeOf(fPath)
		newReport[f] = {
			hash: sha1(fPath),
			delta: size - oldReport[f]?.size,
			size: size
		}
		if (exists(fPath + '.br')) {
			const size = sizeOf(fPath + '.br')
			newReport[f].brotliedSize = size
			newReport[f].brotliedDelta = size - oldReport[f]?.brotliedSize
		}
	}

	console.table(newReport)
	saveAsJSON(reportFilename, newReport)
}

