import assert from 'node:assert'


export const strictEqual = assert.strictEqual
export const throws = assert.throws

export const isTrue = actual => strictEqual(actual, true)
export const isFalse = actual => strictEqual(actual, false)


export function Spy() {
	let callCount = 0
	function spy() {
		callCount++
	}
	spy.callCountIs = expected => strictEqual(callCount, expected)
	return spy
}


export function arraysAreShallowEqual(a1, a2) {
	if (a1.length !== a2.length)
		return false

	for (let i = 0; i < a1.length; i++)
		if (a1[i] !== a2[i])
			return false

	return true
}

