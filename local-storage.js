// window.localStorage:
//   - Non-existing items return `null`
//   - `localStorage` throws when cookies are disabled
//   - https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem

export function readLocalStorageBoolean(key, defaultValue) {
	try {
		const item = localStorage.getItem(key)
		return item === null
			? defaultValue
			: Boolean(Number(item))
	}
	catch (_) {
		return defaultValue
	}
}

export function readLocalStorageNumber(key, defaultValue) {
	try {
		const item = localStorage.getItem(key)
		return item === null
			? defaultValue
			: Number(item)
	}
	catch (_) {
		return defaultValue
	}
}

export function setLocalStorageItem(key, value) {
	try { localStorage.setItem(key, Number(value)) }
	catch {}
}

