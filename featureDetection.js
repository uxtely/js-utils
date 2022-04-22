export const isSafari = typeof navigator !== 'undefined' 
	&& navigator.vendor === 'Apple Computer, Inc.';

export const isMac = (function () {
	if (typeof navigator === 'undefined')
		return false

	if (navigator.userAgentData && navigator.userAgentData.platform)
		return navigator.userAgentData.platform === 'macOS'

	return /Mac|iP/.test(navigator.platform)
}())

export const touchSupported = typeof document !== 'undefined'
	&& 'ontouchstart' in document.documentElement



export const isCommantrol = isMac
	? event => event.metaKey // Command
	: event => event.ctrlKey

export function isCommantrolOnly(event) {
	if (!isCommantrol(event))
		return false

	return isMac
		? event.keyCode === 91 // Meta
		: event.keyCode === 17 // Control
}
