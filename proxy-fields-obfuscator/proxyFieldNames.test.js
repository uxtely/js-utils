import test from 'node:test'
import { throws, equal } from 'node:assert/strict'
import { proxyFieldNames } from './proxyFieldNames.js'


function prodTest(a, b) {
	_test('PrefixNotUsed', a, b, true)
}

function devTest(prefix, a, b) {
	_test(prefix, a, b, false)
}

function _test(prefix, a, b, isProduction) {
	const proxy = proxyFieldNames(prefix, a, isProduction)
	for (const k in proxy)
		equal(proxy[k], b[k])
}

console.log('proxyFields')

test('Dev prefixes', () =>
	devTest('PRE',
		{ x: null, y: null },
		{ x: 'PRE_x', y: 'PRE_y' }))

test('Dev prefixes ignoring pre-baked values', () =>
	devTest('PRE',
		{ x: 'val0', y: 1 },
		{ x: 'PRE_x', y: 'PRE_y' }))


test('Prod uses pre-baked values', () =>
	prodTest(
		{ x: 'val0', y: 1 },
		{ x: 'val0', y: 1 }))

test('Prod generates base52 values', () =>
	prodTest(
		{ x: null, y: null },
		{ x: 'A', y: 'B' }))


test('Repeated values throw', () =>
	throws(() => proxyFieldNames('PRE', {
		x: 0,
		y: 0
	}), /value "0" is repeated/))


test('Mixing null and numeric values throws', () =>
	throws(() => proxyFieldNames('PRE', {
		x: 0,
		y: null
	}), /Mixing null and numeric values in: "PRE"/))


test('Undefined key access throws', () => {
	const proxy = proxyFieldNames('PRE', { x: 'a' })
	throws(() => proxy['missingKey'],
		/Accessing an undefined field: PRE_missingKey/)
})


