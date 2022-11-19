import { proxyFieldNames } from '../proxy-fields-obfuscator/proxyFieldNames.js'


let TK = {
	relative_time_just_now: null,
	relative_time_seconds: null,
	relative_time_minutes: null,
	relative_time_hours: null,
	relative_time_days: null,
	relative_time_months: null,
	relative_time_weeks: null,
	relative_time_years: null
}
TK = proxyFieldNames('TK', TK)
export { TK }

const Strings = {
	[TK.relative_time_just_now]: 'a few seconds ago',
	[TK.relative_time_seconds]: '%ss ago',
	[TK.relative_time_minutes]: '%smin ago',
	[TK.relative_time_hours]: '%sh ago',
	[TK.relative_time_days]: '%sd ago',
	[TK.relative_time_weeks]: '%sw ago',
	[TK.relative_time_months]: '%smo ago',
	[TK.relative_time_years]: '%sy ago'
}

export const tr = key =>
	Strings[key]

export const trPrintf = (key, arg) =>
	Strings[key].replace('%s', arg)

