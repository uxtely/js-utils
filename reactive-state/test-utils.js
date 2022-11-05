import assert from 'node:assert'


export const strictEqual = assert.strictEqual
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
