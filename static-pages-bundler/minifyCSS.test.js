import { describe, test } from 'node:test'
import { equal, deepEqual, throws } from 'node:assert/strict'
import { minifyCSS, Testable } from './minifyCSS.js'


describe('minifyCSS', () => {
	test('Acceptance', () => {
		equal(minifyCSS(`
:root {
	--navBG:		#000;
	--accentLightestMoreMore: #dbdcff;
	--shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);
  --foo: orange; /* @Comment */
  --foobar: blue;
  --doubly_N: var(--late);
  --late: var(--BARRA);
  --bar: teal;
  --BARRA: yellow;
  --non-late: var(--bar);
  --FooBar9: red
}
.a { color: green; }
.b { color: var(--foo); }
.c { color: var(--FooBar9); }
.d { color: rgb(255, 255,  0); }
.e { color: #111; }
.f { color: var(--foobar) }
.g { color: var(--non-late) }
.h { color: var(--late) }
.i { color: var(--doubly_N) }
`),
			`.a{color:green}.b{color:orange}.c{color:red}.d{color:rgb(255,255,0)}.e{color:#111}.f{color:blue}.g{color:teal}.h{color:yellow}.i{color:yellow}`)
	})

	test('Comments', () => {
		testRegexMatchesGetDeleted(Testable.BlockComments, `
/* Foo */
/* Multiline line 1 
Line 2 */
.a { color: red; } /* Bar */
/*/*/
`,
			`


.a { color: red; } 

`)
	})


	test('Trimming', () => {
		testRegexMatchesGetDeleted(Testable.LeadingAndTrailingWhitespace, `
 .b .c {
	color: orange;
  width: 20px;
}
.d {
		height: 30px;
		}
`,
			`.b .c {
color: orange;
width: 20px;
}
.d {
height: 30px;
}`)
	})


	test('Inner Prop Value space', () => {
		testRegexMatchesGetDeleted(Testable.PropValueWhitespaceSeparator, `
.e {
	color: #f00;
	height:   100px;
	width:	100px;
	content:  'a';
}
`,
			`
.e {
	color:#f00;
	height:100px;
	width:100px;
	content:'a';
}
`)
	})


	test('Newlines', () => {
		testRegexMatchesGetDeleted(Testable.Newlines, `
.f {
	color: blue;
	height: 300px;
	width: 300px;
}
`,
			`.f {	color: blue;	height: 300px;	width: 300px;}`)
	})


	test('White spaces before braces', () => {
		testRegexMatchesGetDeleted(Testable.WhitespaceBeforeBraces, `
.g { color: pink; width: 400px; } `,
			`
.g{ color: pink; width: 400px;} `)
	})


	test('White spaces after braces', () => {
		testRegexMatchesGetDeleted(Testable.WhitespaceAfterBraces, `
.G { color: green; width: 410px; } `,
			`
.G {color: green; width: 410px; }`)
	})

	test('Final semicolon', () => {
		testRegexMatchesGetDeleted(Testable.LastSemicolonInSet,
			'.h {color: cyan; width: 500px;}',
			'.h {color: cyan; width: 500px}'
		)
	})

	test('Comma + Space', () => {
		testRegexMatchesGetDeleted(Testable.SpacesAfterComma,
			'.H { color: rgb(255, 255, 0); }',
			'.H { color: rgb(255,255,0); }'
		)
	})


	test('Finds variables definitions', () => {
		const inCSS = `
:root {
    --foo:   100px; /* @Comment */
  --fooBar: red;--inline: coral;
  --hashed: #000;
}
section {
  --bar: 300px;
  --tom:   400px
}`
		const expected = [
			['--foo', '100px'],
			['--fooBar', 'red'],
			['--inline', 'coral'],
			['--hashed', '#000'],
			['--bar', '300px'],
			['--tom', '400px']
		]
		deepEqual(Array.from(Testable.findVariablesDefinitions(inCSS)), expected)
	})


	test('Inline Vars', () => {
		const inCSS = `
:root {
  --foo: 100px;
  --fooBar: 200px;
}
.a {
  width: var(--foo);
  height: var(--fooBar);
  left: var( --fooBar  );
}`
		const outCSS = `
:root {}
.a {
  width: 100px;
  height: 200px;
  left: 200px;
}`
		equal(Testable.inlineVars(inCSS), outCSS)
	})


	test('Circular defintions throw', () => throws(() =>
		Testable.inlineVars(`
:root {
  --circleA: var(--circleB);
  --circleB: var(--circleA);
}`)))


	test('Undefined variable throws', () => throws(() =>
		Testable.inlineVars(`
.a { color: var(--undefB) }`), /^Missing CSS variable --undefB$/))


	function testRegexMatchesGetDeleted(regex, input, expected) {
		equal(input.replace(regex, ''), expected)
	}
})
