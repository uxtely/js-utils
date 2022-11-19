import { TK, trPrintf } from './relativeTimeStrings.js'


const millisecond = 1
const second = 1000 * millisecond
const minute = 60 * second
const hour = 60 * minute
const day = 24 * hour
const week = 7 * day
const month = 30 * day
const year = 365 * day

const agoThresholds = [
	[year, 1, TK.relative_time_years],
	[month, 1, TK.relative_time_months],
	[week, 1, TK.relative_time_weeks],
	[day, 1, TK.relative_time_days],
	[hour, 1, TK.relative_time_hours],
	[minute, 1, TK.relative_time_minutes],
	[second, 11, TK.relative_time_seconds],
	[millisecond, 0, TK.relative_time_just_now]
]

export function relativeTime(date, now = new Date()) {
	if (!date)
		return ''

	if (typeof date !== 'number') // Workaround for Safari
		date = date
			.replace(' +00:00', 'Z')
			.replace(' ', 'T')

	const delta_ms = now.getTime() - new Date(date).getTime()

	for (const [period, threshold, tk] of agoThresholds)
		if ((delta_ms / period | 0) >= threshold)
			return trPrintf(tk, delta_ms / period | 0)

	return '' // Future times are not supported
}
