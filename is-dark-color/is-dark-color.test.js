import test from 'node:test'
import { equal, throws } from 'node:assert/strict'
import { isDarkColor } from './is-dark-color.js'

const isTrue = color => equal(isDarkColor(color), true)
const isFalse = color => equal(isDarkColor(color), false)

test('Requires 6 hex digits', () =>
	throws(() => isDarkColor('#abc')))

test('is dark color', () => {
	isTrue('#000000')
	isTrue('#123456')
	isTrue('#555555')

	isFalse('#aaaaaa')
	isFalse('#abcdef')
	isFalse('#ffffff')
})
