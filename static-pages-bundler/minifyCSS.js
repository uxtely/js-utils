/**
 * minifyCSS and minifyHTML are not perfect solutions, but I wrote my own not only
 * for learning, but because popular CSS and HTML minifiers were causing issues.
 *
 * For example, in CSS some minifiers reorder rules (for compression) but
 * that messed up workarounds with browser-specific prefixes. 
 *
 * Similarly, in HTML the messed up the relevant spaces
 * between tags, and others did not handle <pre>
 *
 * At any rate, see minifyJS if you want to hook up a different minifier.
 */

// TODO
// - it doesn't handle nested comments like /*/* foo */*/
// - it doesn't preserve anything within data-uri, nor content strings.
//   - we could do like in minifyHTML, commit e5448b2. i.e. stacking all the things to
//   be preserved and replace them with a magic string then pop the stack to re-replace.
// - handle variables in multiple :root and other selectors


const reBlockComments = /\/\*(\*(?!\/)|[^*])*\*\//g
const reLeadingAndTrailingWhitespace = /^\s*|\s*$/gm
const rePropValueWhitespaceSeparator = /(?<=:)\s*/gm
const reNewlines = /\n/gm
const reWhitespaceBeforeBraces = /\s*(?=[{}])/gm
const reWhitespaceAfterBraces = /(?<=[{}])\s*/gm
const reLastSemicolonInSet = /;(?=})/gm
const reSpacesAfterComma = /(?<=,)\s+/g

const reRootPseudoClassBody = /:root\s*{\s*([^}]+)}/m
const reRootPseudoClass = /:root(.*?)}/m

const reVars = /\Wvar\(.*/g


export function minifyCSS(css) {
	css = css
		.replace(reBlockComments, '')
		.replace(reLeadingAndTrailingWhitespace, '')
		.replace(rePropValueWhitespaceSeparator, '')
		.replace(reNewlines, '')
		.replace(reWhitespaceBeforeBraces, '')
		.replace(reWhitespaceAfterBraces, '')
		.replace(reLastSemicolonInSet, '')
		.replace(reSpacesAfterComma, '')

	css = inlineVars(css)
		.replace(reRootPseudoClass, '')

	if (reVars.test(css))
		throw 'ERROR: undefined or nested var(), or multiple ":root". ' + css.match(reVars)[0].substr(0, 24)

	return css
}

function inlineVars(css) {
	const res = css.match(reRootPseudoClassBody)
	if (res && res[1]) {
		const kvs = res[1].split(';')
			.map(line => line.split(':')
				.map(str => str.trim().replace(/;$/, '')))

		for (const [varName, varValue] of kvs)
			css = css.replace(RegExp('var\\(\\s*' + varName + '\\s*\\)', 'g'), varValue)
	}
	return css
}


export const Testable = {
	reBlockComments,
	reLeadingAndTrailingWhitespace,
	rePropValueWhitespaceSeparator,
	reNewlines,
	reWhitespaceBeforeBraces,
	reWhitespaceAfterBraces,
	reLastSemicolonInSet,
	reSpacesAfterComma,

	reRootPseudoClassBody,
	inlineVars,
	reVars
}


