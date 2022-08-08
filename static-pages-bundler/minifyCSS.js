/**
 * minifyCSS and minifyHTML are not perfect solutions, but I wrote my own not only
 * for learning, but because popular CSS and HTML minifiers were causing issues.
 *
 * For example, in CSS some minifiers reorder rules (for compression) but
 * that messed up workarounds, for example, with browser-specific prefixes.
 *
 * Similarly, in HTML the messed up the relevant spaces
 * between tags, and others did not handle <pre>
 */

// TODO
// - Handle nested comments like /*/* foo */*/
// - Preserve anything within data-uri, nor content strings.
//   - we could do like in minifyHTML. i.e. stacking all the things to
//   be preserved and replace them with a magic string then pop the stack to re-replace.
// - Remove all empty	rules
// - Optimize the regexes that handle optional whitespace, but that's stripped out in an older step.


const reBlockComments = /\/\*(\*(?!\/)|[^*])*\*\//g
const reLeadingAndTrailingWhitespace = /^\s*|\s*$/gm
const rePropValueWhitespaceSeparator = /(?<=:)\s*/gm
const reNewlines = /\n/gm
const reWhitespaceBeforeBraces = /\s*(?=[{}])/gm
const reWhitespaceAfterBraces = /(?<=[{}])\s*/gm
const reLastSemicolonInSet = /;(?=})/gm
const reSpacesAfterComma = /(?<=,)\s+/g
const reVarDefinitions = /\s*--[\w-]*:\s*[^;\n}]*;?\s*/g // e.g. --foo: 10px;
const reVarNames = /var\(\s*(--[\w-]*)\s*\)/g // e.g. var(--foo)
const reVarName = /var\(\s*(--[\w-]*)\s*\)/ // e.g. var(--foo)
const reFinalSemicolon = /;$/
const reIsVar = /^var\(/


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
	return css.replace(':root{}', '')
}

function inlineVars(css) {
	const defs = findVariablesDefinitions(css)
	css = css.replace(reVarDefinitions, '')
	return css.replace(reVarNames, (_, varName) => defs.get(varName))
}

function findVariablesDefinitions(css) {
	const defs = new Map()
	const pendingDefs = new Map()

	for (const [expr] of css.matchAll(reVarDefinitions)) {
		const [name, _value] = expr.split(':').map(s => s.trim())
		const value = _value.replace(reFinalSemicolon, '')

		if (!reIsVar.test(value)) // is a non-nested variable
			defs.set(name, value)
		else {
			const [, nestedName] = value.match(reVarName)
			if (isLateDefinedOrMultiNested(nestedName))
				pendingDefs.set(name, value)
			else
				defs.set(name, defs.get(nestedName))
		}
	}

	while (pendingDefs.size)
		for (const [name, value] of pendingDefs) {
			const [, nestedName] = value.match(reVarName)
			if (isLateDefinedOrMultiNested(nestedName))
				continue
			pendingDefs.delete(name)
			defs.set(name, defs.get(nestedName))
		}

	function isLateDefinedOrMultiNested(nestedName) {
		return !defs.has(nestedName) || reIsVar.test(defs.get(nestedName))
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

