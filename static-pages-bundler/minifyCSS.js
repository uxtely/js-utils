/**
 * minifyCSS and minifyHTML are not perfect solutions, but I wrote my own not only
 * for learning, but because popular CSS and HTML minifiers were causing issues.
 *
 * For example, in CSS some minifiers reorder rules (for compression) but
 * that messed up workaround for example with browser-specific prefixes.
 *
 * Similarly, in HTML the messed up the relevant spaces
 * between tags, and others did not handle <pre>
 */

// TODO 
// - it doesn't handle nested comments like /*/* foo */*/
// - it doesn't preserve anything within data-uri, nor content strings.
//   - we could do like in minifyHTML, commit e5448b2. i.e. stacking all the things to
//   be preserved and replace them with a magic string then pop the stack to re-replace.
// - remove all empty	rules


const reBlockComments = /\/\*(\*(?!\/)|[^*])*\*\//g
const reLeadingAndTrailingWhitespace = /^\s*|\s*$/gm
const rePropValueWhitespaceSeparator = /(?<=:)\s*/gm
const reNewlines = /\n/gm
const reWhitespaceBeforeBraces = /\s*(?=[{}])/gm
const reWhitespaceAfterBraces = /(?<=[{}])\s*/gm
const reLastSemicolonInSet = /;(?=})/gm
const reSpacesAfterComma = /(?<=,)\s+/g
const reVarsDefinitions = /\s*--\w*:\s*[^;\n}]*;?\s*/g


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
	css = css.replace(':root{}', '') // TODO remove all empty
	return css
}

function inlineVars(css) {
	const defs = findVariablesDefinitions(css)
	for (const [varName, varValue] of defs)
		css = css.replace(RegExp('var\\(\\s*' + varName + '\\s*\\)', 'g'), varValue)
	css = css.replace(reVarsDefinitions, '')
	return css
}

function findVariablesDefinitions(css) {
	const defs = []
	for (const def of css.matchAll(reVarsDefinitions)) {
		const tupple = def[0].split(':').map(s => s.trim())
		tupple[1] = tupple[1].replace(/;$/, '') // removes semicolon from value
		defs.push(tupple)
	}
	return defs
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
	findVariablesDefinitions,
	inlineVars
}
