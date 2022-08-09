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


const BlockComments = /\/\*(\*(?!\/)|[^*])*\*\//g
const LeadingAndTrailingWhitespace = /^\s*|\s*$/gm
const PropValueWhitespaceSeparator = /(?<=:)\s*/gm
const Newlines = /\n/gm
const WhitespaceBeforeBraces = /\s*(?=[{}])/gm
const WhitespaceAfterBraces = /(?<=[{}])\s*/gm
const LastSemicolonInSet = /;(?=})/gm
const SpacesAfterComma = /(?<=,)\s+/g
const VarDefinitions = /\s*--[\w-]*:\s*[^;\n}]*;?\s*/g // e.g. --foo_Bar-9: 10px;
const VarNames = /var\(\s*(--[\w-]*)\s*\)/g // e.g. var(--foo_Bar-9)
const VarName = /var\(\s*(--[\w-]*)\s*\)/
const FinalSemicolon = /;$/
const IsVar = /^var\(/


export function minifyCSS(css) {
	css = css
		.replace(BlockComments, '')
		.replace(LeadingAndTrailingWhitespace, '')
		.replace(PropValueWhitespaceSeparator, '')
		.replace(Newlines, '')
		.replace(WhitespaceBeforeBraces, '')
		.replace(WhitespaceAfterBraces, '')
		.replace(LastSemicolonInSet, '')
		.replace(SpacesAfterComma, '')
	css = inlineVars(css)
	return css.replace(':root{}', '')
}

function inlineVars(css) {
	const defs = findVariablesDefinitions(css)
	css = css.replace(VarDefinitions, '')
	return css.replace(VarNames, (_, varName) => defs.get(varName))
}

function findVariablesDefinitions(css) {
	const defs = new Map()
	const pendingDefs = new Map()

	for (const [expr] of css.matchAll(VarDefinitions)) {
		const [name, _value] = expr.split(':').map(s => s.trim())
		const value = _value.replace(FinalSemicolon, '')

		if (IsVar.test(value)) {
			const [, nestedName] = value.match(VarName)
			if (isLateDefinedOrMultiNested(nestedName))
				pendingDefs.set(name, value)
			else
				defs.set(name, defs.get(nestedName))
		}
		else
			defs.set(name, value)
	}


	let nSafeCycles = 1000
	while (pendingDefs.size && --nSafeCycles)
		for (const [name, value] of pendingDefs) {
			const [, nestedName] = value.match(VarName)
			if (!isLateDefinedOrMultiNested(nestedName)) {
				defs.set(name, defs.get(nestedName))
				pendingDefs.delete(name)
			}
		}

	if (!nSafeCycles)
		throw pendingDefs

	return defs

	function isLateDefinedOrMultiNested(nestedName) {
		return !defs.has(nestedName) || IsVar.test(defs.get(nestedName))
	}
}


export const Testable = {
	BlockComments,
	LeadingAndTrailingWhitespace,
	PropValueWhitespaceSeparator,
	Newlines,
	WhitespaceBeforeBraces,
	WhitespaceAfterBraces,
	LastSemicolonInSet,
	SpacesAfterComma,
	findVariablesDefinitions,
	inlineVars
}

