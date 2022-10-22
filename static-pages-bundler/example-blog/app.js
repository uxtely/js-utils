import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

import { listFiles, removeExtension } from '../../fs-utils.js'
import { routerForStaticPages } from '../routerForStaticPages.js'
import { buildProduction, startDev } from '../builders.js'


const __dirname = dirname(fileURLToPath(import.meta.url))

// The file list is read only once (it doesn't auto-reload).
const routes = listFiles('root', /\.html$/).map(file => '/' + removeExtension(file))
const router = routerForStaticPages('root', routes, __dirname + '/root/htmlTemplate.js', routes)

switch (process.argv[2]) {
	case 'development':
		startDev(router)
		break

	case 'production':
		// For drafting blog posts, we exclude files starting with an underscore from the production build.
		buildProduction(router, routes.filter(r => !r.startsWith('/_')), 'blog.uidrafter.com', '$blog_csp')
		break

	default:
		console.error('Error')
}
