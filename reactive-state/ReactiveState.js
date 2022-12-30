import { ReactPubSub } from './ReactPubSub.js'


export class ReactiveState extends ReactPubSub {
	#defaultValue
	#value
	
	constructor(defaultValue) {
		super()
		this.#defaultValue = defaultValue
		this.#value = defaultValue
	}

	bindState(reactComponent, stateKey) {
		if (!reactComponent.state)
			reactComponent.state = {}
		reactComponent.state[stateKey] = this.#value
		this.on(reactComponent, () => {
			reactComponent.setState({ [stateKey]: this.#value })
		})
	}

	valueOf() {
		return this.#value
	}

	set(value) {
		if (this.#value !== value) {
			this.#value = value
			this.emit()
		}
	}

	reset() {
		if (this.#value !== this.#defaultValue) {
			this.#value = this.#defaultValue
			this.emit()
		}
	}
}
