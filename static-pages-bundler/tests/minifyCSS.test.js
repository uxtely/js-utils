import test from 'node:test'
import { strictEqual, deepStrictEqual } from 'node:assert'
import { minifyCSS, Testable } from '../minifyCSS.js'


test('Acceptance', () => {
	strictEqual(minifyCSS(`
:root {
	--navBG:		#000;
	--accentLightestMoreMore: #dbdcff;
	--shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.15);
  --foo: orange; /* @Comment */
  --bar: teal;
  --foobar: blue;
  --FooBar9: red
}
.a { color: green; }
.b { color: var(--foo); }
.c { color: var(--FooBar9); }
.d { color: rgb(255, 255,  0); }
.e { color: #111; }
.f { color: var(--foobar) }
`),
		`.a{color:green}.b{color:orange}.c{color:red}.d{color:rgb(255,255,0)}.e{color:#111}.f{color:blue}`)
})

test('Comments', () => {
	testRegexMatchesGetDeleted(Testable.reBlockComments, `
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
	testRegexMatchesGetDeleted(Testable.reLeadingAndTrailingWhitespace, `
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
	testRegexMatchesGetDeleted(Testable.rePropValueWhitespaceSeparator, `
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
	testRegexMatchesGetDeleted(Testable.reNewlines, `
.f {
	color: blue;
	height: 300px;
	width: 300px;
}
`,
		`.f {	color: blue;	height: 300px;	width: 300px;}`)
})


test('White spaces before braces', () => {
	testRegexMatchesGetDeleted(Testable.reWhitespaceBeforeBraces, `
.g { color: pink; width: 400px; } `,
		`
.g{ color: pink; width: 400px;} `)
})


test('White spaces after braces', () => {
	testRegexMatchesGetDeleted(Testable.reWhitespaceAfterBraces, `
.G { color: green; width: 410px; } `,
		`
.G {color: green; width: 410px; }`)
})

test('Final semicolon', () => {
	testRegexMatchesGetDeleted(Testable.reLastSemicolonInSet,
		'.h {color: cyan; width: 500px;}',
		'.h {color: cyan; width: 500px}'
	)
})

test('Comma + Space', () => {
	testRegexMatchesGetDeleted(Testable.reSpacesAfterComma,
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
		['--tom', '400px'],
	]
	deepStrictEqual(Testable.findVariablesDefinitions(inCSS), expected)
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
}
`
	const outCSS = `
:root {}
.a {
  width: 100px;
  height: 200px;
  left: 200px;
}
`
	strictEqual(Testable.inlineVars(inCSS), outCSS)
})


function testRegexMatchesGetDeleted(regex, input, expected) {
	strictEqual(input.replace(regex, ''), expected)
}
