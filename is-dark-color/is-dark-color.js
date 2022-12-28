const MID_GREY = 137
const firstHashRegex = /^#/


export function isDarkColor(color) {
	if (color.length !== 7)
		throw `Invalid color format length "${color}". It must have a "#" and 6 hex digits`
	const c = parseInt(color.replace(firstHashRegex, ''), 16)
	const r = 0.299 * ((c & 0xff0000) >> 16)
	const g = 0.587 * ((c & 0xff00) >> 8)
	const b = 0.114 * (c & 0xff)
	return MID_GREY > (r + g + b)
}
