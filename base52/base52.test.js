import { describe, test } from 'node:test'
import { equal } from 'node:assert/strict'
import { base52, base52Decode } from './base52.js'


describe('base52', () => {
	const tests = [
		[0, 'A'],
		[1, 'B'],
		[25, 'Z'],
		[26, 'a'],
		[51, 'z'],
		[52, 'BA'],
		[2 ** 30, 'CqsVtM']
	]

	tests.forEach(([input, expected]) =>
		test(`base52(${input}) => ${expected}`, () =>
			equal(base52(input), expected)))

	tests.forEach(([expected, input]) =>
		test(`base52Decode(${input}) => ${expected}`, () =>
			equal(base52Decode(input), expected)))
})
