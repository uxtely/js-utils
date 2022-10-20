import { ReactPubSub } from './ReactPubSub.js'


export class ReactiveState extends ReactPubSub {
	constructor(
		defaultValue,
		setterFn = a => a,
		comparerFn = (a, b) => a === b
	) {
		super()
		this.defaultValueº = defaultValue
		this.valueº = defaultValue
		this.setterFnº = setterFn
		this.equalsº = comparerFn
	}

	bindState(reactComponent, stateKey) {
		if (!reactComponent.state)
			reactComponent.state = {}

		reactComponent.state[stateKey] = this.valueº

		this.on(reactComponent, () => {
			reactComponent.setState({ [stateKey]: this.valueº })
		})
	}


	get get() { return this.valueº }
	is(a, b) { return this.equalsº(this.setterFnº(a, b), this.valueº) }

	get isTrue() {
		if (typeof this.valueº !== 'boolean')
			throw TypeError(`ReactiveState value is not boolean`, { cause: this.valueº })
		return this.valueº
	}

	set(a, b) {
		const nextVal = this.setterFnº(a, b)
		if (!this.equalsº(this.valueº, nextVal)) {
			this.valueº = nextVal
			this.emit()
		}
	}

	reset() {
		if (!this.equalsº(this.valueº, this.defaultValueº)) {
			this.valueº = this.defaultValueº
			this.emit()
		}
	}

	toggle() { this.set(!this.valueº) }
	yes() { this.set(true) }
	no() { this.set(false) }

	setBit(bit) { this.set(this.valueº | bit) }
	clearBit(bit) { this.set(this.valueº & ~bit) }
	toggleBit(bit) { this.set(this.valueº ^ bit) }
}
