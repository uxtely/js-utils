import { ReactiveState } from '../src/ReactiveState.js'
import { Spy, strictEqual, isTrue, isFalse, arraysAreShallowEqual } from './utils.js'


describe('ReactiveState', () => {
	it('Gets the value', () => {
		const defaultValue = true
		const rs = new ReactiveState(defaultValue)
		strictEqual(rs.get, defaultValue)
	})

	it('Emits changes to all listeners', () => {
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

	it('Does not emit when setting the current value', () => {
		const defaultValue = false
		const rs = new ReactiveState(defaultValue)
		const listener0 = Spy()
		rs.addListener(listener0)
		rs.set(false)
		listener0.callCountIs(0)
	})

	it('Emits when an object value changed shallowly', () => {
		const defaultValue = {}
		const rs = new ReactiveState(defaultValue)
		const listener0 = Spy()
		rs.addListener(listener0)
		rs.set({ a: 1 })
		listener0.callCountIs(1)
	})

	it('Does not emit when an object did not change (shallowly)', () => {
		const defaultValue = { a: 1 }
		const areEqual = (x, y) => x.a === y.a
		const rs = new ReactiveState(defaultValue, undefined, areEqual)
		const listener0 = Spy()
		rs.addListener(listener0)
		rs.set({ a: 1 })
		listener0.callCountIs(0)
	})

	it('Emits when an array value changed shallowly', () => {
		const defaultValue = [0]
		const rs = new ReactiveState(defaultValue)
		const listener0 = Spy()
		rs.addListener(listener0)
		rs.set([1])
		listener0.callCountIs(1)
	})

	it('Does not emit when an array did not change (shallowly)', () => {
		const defaultValue = [0]
		const rs = new ReactiveState(defaultValue, undefined, arraysAreShallowEqual)
		const listener0 = Spy()
		rs.addListener(listener0)
		rs.set([0])
		listener0.callCountIs(0)
	})

	it('Emits when resetting to a value that changed shallowly', () => {
		const defaultValue = [0]
		const rs = new ReactiveState(defaultValue)
		const listener0 = Spy()
		rs.addListener(listener0)
		rs.set([1])
		rs.reset()
		listener0.callCountIs(2)
	})

	it('Does not emit when resetting to a value that did not change', () => {
		const defValue = [0]
		const rs = new ReactiveState(defValue)
		const listener0 = Spy()
		rs.addListener(listener0)
		rs.reset()
		listener0.callCountIs(0)
	})

	it('Emits on toggle', () => {
		const defaultValue = false
		const rs = new ReactiveState(defaultValue)
		const listener0 = Spy()
		rs.addListener(listener0)
		rs.toggle()
		listener0.callCountIs(1)
	})

	it('.is compares using the custom setFn', () => {
		const areEqual = (x, y) => x.a === y.a && x.b === y.b
		const rs = new ReactiveState({ a: 1, b: 2 }, (a, b) => ({
			a,
			b
		}), areEqual)
		isTrue(rs.is(1, 2))
		rs.set(10, 20)
		isFalse(rs.is(1, 2))
	})

	it('.is compares primitives', () => {
		const defaultValue = false
		const rs = new ReactiveState(defaultValue)
		isTrue(rs.is(false))
		rs.toggle()
		isFalse(rs.is(false))
	})

	it('bitwise', () => {
		const rs = new ReactiveState(0)
		rs.setBit(1 << 1)
		strictEqual(rs.get, 2)
		rs.setBit(1 << 2)
		rs.setBit(1 << 2)
		strictEqual(rs.get, 6)
		rs.toggleBit(1 << 2)
		strictEqual(rs.get, 2)
		rs.toggleBit(1 << 2)
		strictEqual(rs.get, 6)
		rs.clearBit(1 << 2)
		strictEqual(rs.get, 2)
	})


	it('bindState creates a new state object', () => {
		const rs = new ReactiveState(true)
		const rc = new class ReactComponent {
			constructor() { rs.bindState(this, 'state_key') }
		}
		isTrue(rc.state.state_key)
	})

	it('bindState preserves the original state object', () => {
		const rs = new ReactiveState(true)
		const rc = new class ReactComponent {
			constructor() {
				this.state = { alpha: 'originalValue' }
				rs.bindState(this, 'state_key')
			}
		}
		strictEqual(rc.state.alpha, 'originalValue')
		isTrue(rc.state.state_key)
	})

	it('bindState fires setState, and unbinds the emitter on CWU', () => {
		const rs = new ReactiveState(true)
		const rc = new class ReactComponent {
			constructor() { rs.bindState(this, 'state_key') }
			setState(obj) { Object.assign(this.state, obj) }
		}
		isTrue(rc.state.state_key)
		rc.componentDidMount()
		rs.toggle()
		isFalse(rc.state.state_key)

		// unbinds
		rc.componentWillUnmount()
		rs.toggle()
		isFalse(rc.state.state_key)
	})
})
