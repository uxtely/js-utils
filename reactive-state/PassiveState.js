// This is just a plain (non-reactive) object that matches the reactive-state API
export class PassiveState {
	constructor(defaultValue, setFn = a => a) {
		this.defaultValueº = defaultValue
		this.valueº = defaultValue
		this.setFnº = setFn
	}

	get get() { return this.valueº }
	is(a, b) { return this.setFnº(a, b) === this.valueº }
	
	get isTrue() {
		if (typeof this.valueº !== 'boolean')
			throw TypeError(`PassiveState value is not boolean`, { cause: this.valueº })
		return this.valueº
	}

	set(a, b) { this.valueº = this.setFnº(a, b) }
	reset() { this.valueº = this.defaultValueº }
	toggle() { this.valueº = !this.valueº }
	yes() { this.valueº = true }
	no() { this.valueº = false }
}
