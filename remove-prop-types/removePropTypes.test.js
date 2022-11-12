import test from 'node:test'
import { equal } from 'node:assert/strict'
import { removePropTypes } from './removePropTypes.js'


test('propTypes remover', () => {
	const input = `
import a from 'b'
const propTypes = 3;
Foo.propTypes= {
  foo: PropTypes.any
}
const between = 2;
Bar.propTypes ={
	bar: PropTypes.shape({
		a: PropTypes.shape({ aa: PropTypes.any }),
		b: PropTypes.any
	})
};
const keepMe = 2;
const finalLine = 4;
`
	const expected = `
import a from 'b'
const propTypes = 3;

const between = 2;
;
const keepMe = 2;
const finalLine = 4;
`
	equal(removePropTypes(input), expected)
})
