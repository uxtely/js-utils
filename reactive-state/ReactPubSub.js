export class ReactPubSub {
	#allCallbacks = new Set()

	addListener(fn) {
		this.#allCallbacks.add(fn)
		return () => {
			this.#allCallbacks.delete(fn)
		}
	}

	emit() {
		for (const fn of this.#allCallbacks)
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
