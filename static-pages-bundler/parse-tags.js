/**
 * NOTE: Run minifyHTML first, because this code
 * doesn't support tags within comments nor multiline tags.
 */

const reExtractStyleSheets = /(?<=<link\s.*href=")[^."]+\.css/g
const reExtractScripts = /(?<=<script\s.*src=")[^."]+\.js/g

export const extractStyleSheetHrefs = html =>
	Array.from(html.matchAll(reExtractStyleSheets), m => m[0])

export const extractJavaScriptSources = html =>
	Array.from(html.matchAll(reExtractScripts), m => m[0])

export const removeLineContaining = (html, str) =>
	html.replace(new RegExp('^.*' + str + '.*\n', 'm'), '')

