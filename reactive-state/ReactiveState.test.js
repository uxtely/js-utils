import test from 'node:test'
import { ReactiveState } from './ReactiveState.js'
import { Spy, equal, isTrue, isFalse } from './test-utils.js'


console.log('ReactiveState')
test('Gets the value', () => {
	const defaultValue = true
	const rs = new ReactiveState(defaultValue)
	equal(rs.valueOf(), defaultValue)
})

test('Emits changes to all listeners', () => {
	const defaultValue = false
	const rs = new ReactiveState(defaultValue)
	const listener0 = Spy()
	const listener1 = Spy()
	rs.addListener(listener0)
	rs.addListener(listener1)
	rs.set(true)
	listener0.callCountIs(1)
	listener1.callCountIs(1)
})

test('Does not emit when setting the current value', () => {
	const defaultValue = false
	const rs = new ReactiveState(defaultValue)
	const listener0 = Spy()
	rs.addListener(listener0)
	rs.set(false)
	listener0.callCountIs(0)
})

test('Emits when the value changes', () => {
	const defaultValue = 'a'
	const rs = new ReactiveState(defaultValue)
	const listener0 = Spy()
	rs.addListener(listener0)
	rs.set('b')
	listener0.callCountIs(1)
})


test('bindState creates a new state object', () => {
	const rs = new ReactiveState(true)
	const rc = new class ReactComponent {
		constructor() { rs.bindState(this, 'state_key') }
	}
	isTrue(rc.state.state_key)
})

test('bindState preserves the original state object', () => {
	const rs = new ReactiveState(true)
	const rc = new class ReactComponent {
		constructor() {
			this.state = { alpha: 'originalValue' }
			rs.bindState(this, 'state_key')
		}
	}
	equal(rc.state.alpha, 'originalValue')
	isTrue(rc.state.state_key)
})

test('bindState fires setState, and unbinds the emitter on CWU', () => {
	const rs = new ReactiveState(true)
	const rc = new class ReactComponent {
		constructor() { rs.bindState(this, 'state_key') }
		setState(obj) { Object.assign(this.state, obj) }
		componentDidMount() {}
		componentWillUnmount() {}
	}
	isTrue(rc.state.state_key)
	rc.componentDidMount()
	rs.set(false)
	isFalse(rc.state.state_key)

	// unbinds
	rc.componentWillUnmount()
	rs.set(true)
	isFalse(rc.state.state_key)
})