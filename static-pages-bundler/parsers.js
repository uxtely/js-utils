import { removeCommentsFromHTML } from './minifyHTML.js'


export const extractStyleSheetHrefs = html => Array.from(html.matchAll(/(?<=<link\s.*href=")[^."]+\.css/g), m => m[0])
export const extractJavaScriptSources = html => Array.from(html.matchAll(/(?<=<script\s.*src=")[^."]+\.js/g), m => m[0])

export const removeLineContaining = (html, str) => html.replace(new RegExp('^.*' + str + '.*\n', 'm'), '')


/**
 * As our pages are partial HTML documents, they have an
 * optional head section and the rest is considered part of the body
 */
export function parseHeadAndBody(html) {
	html = removeCommentsFromHTML(html)
	const openTag = '<head>'
	const closeTag = '</head>'

	const iOpenTag = html.indexOf(openTag)
	if (iOpenTag < 0)
		return ['', html] // no head

	const iCloseTag = html.indexOf(closeTag)
	const iContentStart = iOpenTag + openTag.length
	if (iCloseTag > iContentStart)
		return [
			html.substring(iContentStart, iCloseTag), // headTagContent
			html.substring(iCloseTag + closeTag.length) // everything after the headTag
		]

	throw `Missing or Misplaced ${closeTag}`
}
