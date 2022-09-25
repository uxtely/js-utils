/**
 * Without an AST, finds the indices of the propTypes statements, so
 * e.g. regionsToKeep = [0,40, 79,99, 209,text.length]
 * @returns text.substring(0,40) + text.substring(79,99) + text.substring(209,text.length)
 */
export function removePropTypes(text) {
	const regionsToKeep = [0]
	const reStatementStart = /.*\.propTypes\s*=\s*{/g
	for (const { index } of text.matchAll(reStatementStart))
		regionsToKeep.push(index, indexOfMatchingClosingBrace(text, index) + 1)
	regionsToKeep.push(text.length)

	let res = ''
	for (let i = 0; i < regionsToKeep.length - 1; i += 2)
		res += text.substring(regionsToKeep[i], regionsToKeep[i + 1])
	return res
}

function indexOfMatchingClosingBrace(text, statementStart) {
	const stack = []
	for (let i = text.indexOf('{', statementStart) + 1; i < text.length; i++)
		switch (text[i]) {
			case '}':
				if (!stack.length)
					return i
				stack.pop()
				break
			case '{':
				stack.push('{')
		}
	if (stack.length)
		throw 'Error: matching "}" ' + stack
}