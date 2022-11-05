import { ReactPubSub } from './ReactPubSub.js'


export class ReactiveState extends ReactPubSub {
	constructor(defaultValue) {
		super()
		this.defaultValueº = defaultValue
		this.valueº = defaultValue
	}

	bindState(reactComponent, stateKey) {
		if (!reactComponent.state)
			reactComponent.state = {}
		reactComponent.state[stateKey] = this.valueº
		this.on(reactComponent, () => {
			reactComponent.setState({ [stateKey]: this.valueº })
		})
	}

	valueOf() {
		return this.valueº
	}

	set(value) {
		if (this.valueº !== value) {
			this.valueº = value
			this.emit()
		}
	}

	reset() {
		if (this.valueº !== this.defaultValueº) {
			this.valueº = this.defaultValueº
			this.emit()
		}
	}
}
