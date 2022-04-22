import { throws, strictEqual } from 'assert'
import { proxyFields } from './proxyFields.js'


function test(prefix, a, b, isProduction) {
	const proxy = proxyFields(prefix, a, isProduction)
	for (const k in proxy)
		strictEqual(proxy[k], b[k])
}

function it(title, fn) { fn() }
function prodTest(a, b) { test('PrefixNotUsed', a, b, true) }
function devTest(prefix, a, b) { test(prefix, a, b, false) }

it('Dev prefixes', () =>
	devTest('PRE',
		{ x: null, y: null },
		{ x: 'PRE_x', y: 'PRE_y' }))

it('Dev prefixes ignoring pre-baked values', () =>
	devTest('PRE',
		{ x: 'val0', y: 1 },
		{ x: 'PRE_x', y: 'PRE_y' }))


it('Prod uses pre-baked values', () =>
	prodTest(
		{ x: 'val0', y: 1 },
		{ x: 'val0', y: 1 }))

it('Prod generates base52 values', () =>
	prodTest(
		{ x: null, y: null },
		{ x: 'a', y: 'b' }))


it('Repeated values throw', () =>
	throws(() => proxyFields('PRE', {
		x: 0,
		y: 0
	}), /value "0" is repeated/))


it('Mixing null and numeric values throws', () =>
	throws(() => proxyFields('PRE', {
		x: 0,
		y: null
	}), /Mixing null and numeric values in: "PRE"/))


it('Undefined key access throws', () => {
	const proxy = proxyFields('PRE', { x: 'a' })
	throws(() => proxy['missingKey'],
		/Accessing an undefined field: PRE_missingKey/)
})


