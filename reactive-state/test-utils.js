import assert from 'node:assert/strict'


export const equal = assert.equal
export const isTrue = actual => equal(actual, true)
export const isFalse = actual => equal(actual, false)

export function Spy() {
	let callCount = 0
	function spy() {
		callCount++
	}
	spy.callCountIs = expected => equal(callCount, expected)
	return spy
}
