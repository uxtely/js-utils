import { base52 } from './base52.js'


export function proxyFieldNames(devPrefix, dict, isProduction = process.env.NODE_ENV === 'production') {
	const names = new Set()

	let nNull = 0
	for (const [key, value] of Object.entries(dict)) {
		const field = value === null
			? base52(nNull++)
			: value

		if (names.has(field))
			throw `value "${field}" is repeated`
		names.add(field)

		dict[key] = isProduction
			? field
			: devPrefix + '_' + key
	}

	if (nNull > 0 && nNull !== Object.keys(dict).length)
		throw `Mixing null and numeric values in: "${devPrefix}"`

	return new Proxy(dict, {
		get(target, name) {
			if (name in target)
				return target[name]
			throw `Accessing an undefined field: ${devPrefix}_${name}`
		}
	})
}
