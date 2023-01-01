import http from 'node:http'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { copy } from '../../fs-utils.js'
import { DevHost } from '../../Environment.js'

import { minifyHTML } from '../minifyHTML.js'
import { routerForStaticPages } from '../routerForStaticPages.js'
import { startDev, httpGet, buildProduction } from '../builders.js'


const hasDivider = true

// Hardcoding the routes because the order is important for the navigation.
export const RouteDefs = [
	['/workspaces', 'Workspaces'],
	['/cards', 'Cards'],
	['/shortcuts', 'Shortcuts', hasDivider]
]

const __dirname = dirname(fileURLToPath(import.meta.url))

const routes = RouteDefs.map(r => r[0])
const router = routerForStaticPages('root', routes, __dirname + '/root/htmlTemplate.js', RouteDefs)


switch (process.argv[2]) {
	case 'development':
		startDev(router)
		break

	case 'production':
		buildProduction(router, routes, 'docs.uidrafter.com', '$docs_csp').then(async () => {
			const server = http.createServer(router)
			server.listen(0, DevHost, async error => {
				if (error)
					console.error(error)

				await throwIfHasDeadLinks(server.address().port)

				// Default to the first route (using a copy to avoid redirect)
				copy('dist' + routes[0], 'dist/index')
				server.close()
			})
		})
		break

	default:
		console.error('Error')
}


async function throwIfHasDeadLinks(port) {
	const knownLinks = [
		'//uidrafter.com',
		'//uxtely.com',
		'https://github.com/uxtely/server-side-card-api-examples',
		'https://github.com/uxtely/css-editor-connector'
	]
	const serverAddr = `http://${DevHost}:${port}`
	const nonLocalLinks = new Set()

	for (const route of routes) {
		const body = await httpGet(serverAddr + route)
		const html = minifyHTML(body) // So it removes links within comments

		for (const [, href] of html.matchAll(/href="(.*?)"/g)) {
			if (href.startsWith('#'))
				ensureHasElementWithFragmentId(html, href, route)
			else if (href.startsWith('/') && !href.startsWith('//'))
				nonLocalLinks.add(serverAddr + href)
			else if (!/\.(js|css)$/.test(href) && !href.startsWith('favicon') && !knownLinks.includes(href))
				console.log('Please manually verify the link:', href)
		}
	}

	for (const href of nonLocalLinks) {
		const body = await httpGet(href) // Ensures the Status is 200 OK
		if (/#/.test(href))
			ensureHasElementWithFragmentId(minifyHTML(body), href, href)
	}
}


function ensureHasElementWithFragmentId(html, href, route) {
	const id = href.split('#')[1]
	if (!RegExp(`id="${id}"`).test(html))
		throw `===> DEAD LINK <=== Missing id="${id}" in ${route}`
}

