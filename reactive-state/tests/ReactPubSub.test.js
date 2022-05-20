import { ReactPubSub } from '../src/ReactPubSub.js'
import { Spy } from './utils.js'


describe('ReactPubSub', () => {
	let emitter
	beforeEach(() => {
		emitter = new ReactPubSub()
	})

	it('Calls the listener on emit', () => {
		const spy = Spy()
		emitter.addListener(spy)
		emitter.emit()
		emitter.emit()
		spy.callCountIs(2)
	})

	it('Removes the event listener via its handler', () => {
		const spy = Spy()
		const removeSpy = emitter.addListener(spy)
		emitter.emit()
		removeSpy()
		emitter.emit()
		spy.callCountIs(1)
	})

	it('Notifies many listeners', () => {
		const spy1 = Spy()
		const spy2 = Spy()
		const removeSpy1 = emitter.addListener(spy1)
		const removeSpy2 = emitter.addListener(spy2)
		emitter.emit()
		emitter.emit()
		removeSpy1()
		emitter.emit()
		removeSpy2()
		emitter.emit()
		spy1.callCountIs(2)
		spy2.callCountIs(3)
	})


	it('Mounts on didMount and preserves the original calls to didMount and willUnmount', () => {
		const spy = Spy()
		const spyCWU = Spy()

		const rc = new class ReactComponent {
			constructor() { emitter.on(this, spy) }
			componentDidMount() { emitter.emit() }
			componentWillUnmount() { spyCWU() }
		}

		spy.callCountIs(0)
		rc.componentDidMount()
		spy.callCountIs(1)
		spyCWU.callCountIs(0)
		rc.componentWillUnmount()
		spyCWU.callCountIs(1)
	})


	it('Adds the listener on didMount and removes it on willUnmount', () => {
		const spy = Spy()

		const rc = new class ReactComponent {
			constructor() { emitter.on(this, spy) }
		}

		emitter.emit()
		spy.callCountIs(0)
		rc.componentDidMount()
		spy.callCountIs(0)
		emitter.emit()
		spy.callCountIs(1)
		rc.componentWillUnmount()
		emitter.emit()
		spy.callCountIs(1)
	})
})
