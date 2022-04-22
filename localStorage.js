/** 
 * By spec, getting a non-existing item returns null
 *   https://developer.mozilla.org/en-US/docs/Web/API/Storage/getItem
 */

export function readLocalStorageBoolean(key, failover) {
	try {
		const item = localStorage.getItem(key)
		return item === null
			? failover
			: !!+item
	}
	catch (_) {
		return failover
	}
}


export function readLocalStorageNumber(key, failover) {
	try {
		const item = localStorage.getItem(key)
		return item === null
			? failover
			: +item
	}
	catch (_) {
		return failover
	}
}


export function setLocalStorageItem(key, value) {
	try {
		localStorage.setItem(key, +value) // Ensures it's numeric
	}
	catch (_) {} // eslint-disable-line no-empty
}

