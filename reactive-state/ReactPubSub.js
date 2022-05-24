export class ReactPubSub {
	constructor() {
		this.allCallbacksº = new Set()
	}

	addListener(fn) {
		this.allCallbacksº.add(fn)
		return () => {
			this.allCallbacksº.delete(fn)
		}
	}

	emit() {
		for (const fn of this.allCallbacksº)
			fn()
	}

	on(reactComponent, fn) {
		const cdm = reactComponent.componentDidMount
		reactComponent.componentDidMount = () => {
			const removeListener = this.addListener(fn)

			const cwu = reactComponent.componentWillUnmount
			reactComponent.componentWillUnmount = () => {
				removeListener()
				if (cwu)
					cwu.call(reactComponent)
			}

			if (cdm)
				cdm.call(reactComponent)
		}
	}
}
