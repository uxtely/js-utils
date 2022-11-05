import test from 'node:test'
import { strictEqual } from './test-utils.js'
import { PassiveState } from './PassiveState.js'


console.log('PassiveState')
test('Uses the default value', () => {
	const defaultValue = {}
	const ps = new PassiveState(defaultValue)
	strictEqual(ps.valueOf(), defaultValue)
})

test('Sets', () => {
	const ps = new PassiveState()
	ps.set(1)
	strictEqual(ps.valueOf(), 1)
})

test('Resets to the default value', () => {
	const defaultValue = 0
	const ps = new PassiveState(defaultValue)
	ps.set(1)
	strictEqual(ps.valueOf(), 1)
	ps.reset()
	strictEqual(ps.valueOf(), defaultValue)
})