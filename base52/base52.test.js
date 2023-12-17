import test from 'node:test'
import { equal } from 'node:assert/strict'
import { toBase52, fromBase52 } from './base52.js'


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
		equal(toBase52(input), expected)))

tests.forEach(([expected, input]) =>
	test(`base52Decode(${input}) => ${expected}`, () =>
		equal(fromBase52(input), expected)))
