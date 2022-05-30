/**
 * See minifyCSS for why.
 * 
 * This is a simple (incomplete) regex-based minifier. Incomplete because
 * we just minify what's safe and regexable.
 *
 * We don't remove \n because for example <kbd> and <a>
 * would need rules to have a space in-place of that \n.
 *
 * In HTML there are a few tags that should not be minified (same with
 * strings). This algorithm basically collects all those tags and replaces
 * them with a known magic string "<preserved>". Then, at the end, goes in
 * order replacing those magic strings with the original tag and its content.
 *
 * "cb" means: the replacer value for `str.replace()`, it can be a String|Function
 *
 * Based on https://gist.github.com/espretto/1b3cb7e8b01fa7daaaac
 */


const reComments = /<!--(?!\s*?\[\s*?if)[\s\S]*?-->/gi

const rePreserveTags = /<(pre|style|script(?![^>]*?src))[^>]*>[\s\S]*?<\/\1>/gi
const reInsertTags = /<PreServed>/g

const reReduceAttributeDelimiters = /\s{2,}(?=[^<]*>)/g
const reLeadingWhitespace = /^\s*/gm


export function minifyHTML(html) {
	const preservedTags = []

	function cbPreserveTags(tag) {
		preservedTags.push(tag)
		return '<PreServed>' // Temp Placeholder
	}

	function cbInsertTags() {
		return preservedTags.shift() // popLeft() Rewrites the Placeholder back with the original tag
	}

	return html
		.replace(reComments, '')
		.replace(rePreserveTags, cbPreserveTags)
		.replace(reReduceAttributeDelimiters, ' ')
		.replace(reLeadingWhitespace, '')
		.replace(reInsertTags, cbInsertTags)
		.trim()
}


export const removeCommentsFromHTML = html =>
	html.replace(reComments, '')
