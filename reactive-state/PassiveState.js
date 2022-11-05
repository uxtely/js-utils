// This is just a plain (non-reactive) object that matches the reactive-state API
export class PassiveState {
	constructor(defaultValue) {
		this.defaultValueº = defaultValue
		this.valueº = defaultValue
	}

	set(value) { this.valueº = value }
	reset() { this.valueº = this.defaultValueº }
	valueOf() { return this.valueº }
}
