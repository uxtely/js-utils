import test from 'node:test'
import { PassiveState } from './PassiveState.js'
import { strictEqual, isTrue, isFalse, throws } from './test-utils.js'


console.log('PassiveState')
test('Constructs using a value', () => {
	const defaultValue = {}
	const ps = new PassiveState(defaultValue)
	strictEqual(ps.get, defaultValue)
})

test('Constructs using an identify function as default', () => {
	const ps = new PassiveState()
	ps.set(1)
	strictEqual(ps.get, 1)
})

test('Resets to the passed default value', () => {
	const defaultValue = 0
	const ps = new PassiveState(defaultValue)
	ps.set(1)
	strictEqual(ps.get, 1)
	ps.reset()
	strictEqual(ps.get, defaultValue)
})

test('Toggles the value', () => {
	const defaultValue = true
	const ps = new PassiveState(defaultValue)
	ps.toggle()
	strictEqual(ps.get, !defaultValue)
})

test('Constructs using a custom setter function', () => {
	const defaultValue = 0
	const customSetterAddition = (a, b) => a + b
	const ps = new PassiveState(defaultValue, customSetterAddition)
	ps.set(1, 2)
	strictEqual(ps.get, 1 + 2)
})

test('Constructs using a custom setter function', () => {
	const defaultValue = 0
	const customSetterAddition = (a, b) => a + b
	const ps = new PassiveState(defaultValue, customSetterAddition)
	ps.set(1, 2)
	strictEqual(ps.get, 1 + 2)
})

test('.is compares strict equality', () => {
	const defaultValue = true
	const ps = new PassiveState(defaultValue)
	isTrue(ps.is(true))
})

test('.isTrue', () => {
	isTrue(new PassiveState(true).isTrue)
	throws(() => new PassiveState([]).isTrue, /TypeError/)
})