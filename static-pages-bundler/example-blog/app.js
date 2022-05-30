import { basename } from 'node:path'
import { listFiles } from '../../fs-utils.js'
import { routerForStaticPages } from '../routerForStaticPages.js'
import { buildStaticPages, devStaticPages } from '../builders.js'

import { htmlTemplate } from './htmlTemplate.js'


const routes = listFiles('root', /\.html$/).map(file => '/' + basename(file, '.html'))
const router = routerForStaticPages('root', routes, htmlTemplate.bind(null, routes))

switch (process.argv[2]) {
	case 'development':
		devStaticPages(router)
		break

	case 'production':
		// For drafting blog posts, we exclude files starting with an underscore from the production build.
		buildStaticPages(router, routes.filter(r => !r.startsWith('/_')), 'blog.uidrafter.com')
		break

	default:
		console.error('Error')
}
