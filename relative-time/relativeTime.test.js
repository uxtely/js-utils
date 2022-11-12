import test from 'node:test'
import { equal } from 'node:assert/strict'
import { relativeTime } from './relativeTime.js'
import { TK, tr, trPrintf } from './relativeTimeStrings.js'


const now = new Date('2000-06-15 12:00:00.000 +00:00')

function is(date, expected) {
	test(`${expected} when ${date}`, () =>
		equal(relativeTime(date + '.000 +00:00', now), expected))
}

console.log('relativeTime')

// Seconds
is('2000-06-15 12:00:00', tr(TK.relative_time_just_now))
is('2000-06-15 11:59:59', tr(TK.relative_time_just_now))
is('2000-06-15 11:59:50', tr(TK.relative_time_just_now))
is('2000-06-15 11:59:49', trPrintf(TK.relative_time_seconds, 11))
is('2000-06-15 11:59:01', trPrintf(TK.relative_time_seconds, 59))
is('2000-06-15 12:00:01', '') // future times are not supported

// Minutes
is('2000-06-15 11:00:01', trPrintf(TK.relative_time_minutes, 59))
is('2000-06-15 11:59:00', trPrintf(TK.relative_time_minutes, 1))
is('2000-06-15 12:01:00', '') // future

// Hours
is('2000-06-15 11:00:00', trPrintf(TK.relative_time_hours, 1))
is('2000-06-15 00:00:00', trPrintf(TK.relative_time_hours, 12))
is('2000-06-15 13:00:00', '') // future

// Days
is('2000-06-14 11:00:00', trPrintf(TK.relative_time_days, 1))
is('2000-06-13 11:00:00', trPrintf(TK.relative_time_days, 2))
is('2000-06-09 11:00:00', trPrintf(TK.relative_time_days, 6))
is('2000-06-16 00:00:00', '') // future

// Weeks
is('2000-06-08 00:00:00', trPrintf(TK.relative_time_weeks, 1))
is('2000-05-26 23:59:00', trPrintf(TK.relative_time_weeks, 2))
is('2000-06-16 00:00:00', '') // future

// Months
is('2000-05-01 00:00:00', trPrintf(TK.relative_time_months, 1))
is('2000-03-01 00:00:00', trPrintf(TK.relative_time_months, 3))
is('2000-08-15 00:00:00', '') // future

// Years
is('1999-05-15 12:00:00', trPrintf(TK.relative_time_years, 1))
is('1994-08-15 12:00:00', trPrintf(TK.relative_time_years, 5))
is('1994-04-15 12:00:00', trPrintf(TK.relative_time_years, 6))
is('2001-06-15 00:00:00', '') // future

// Safari date handling
const safariOneSecondAgo = '2000-06-15T11:59:59.000Z'
test('Reformats date', () =>
	equal(relativeTime(safariOneSecondAgo, now), tr(TK.relative_time_just_now)))

