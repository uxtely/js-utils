import { describe, test } from 'node:test'
import { equal } from 'node:assert/strict'
import { minifyHTML } from './minifyHTML.js'


describe('minifyHTML', () => {
	test('Acceptance', () => {
		equal(minifyHTML(`
<!DOCTYPE html>
<html   
  lang="en">
  <!-- Comment -->
<head>
  <!-- Mulitline 
            Comment -->
	<!--		&lt;!&ndash;	deleteme '  '	.&ndash;&gt;-->
	<title>Foo Bar</title>
</head>
<body>
	<div>
		<h1>Title</h1>
  </div>
  <p>Single Quotes? Keep'em a'll</p>
  <pre data-custom-attr="keeps   everything here <h1>   <h1>">
   aaa   bbbb
   ccc   dddd
  
  </pre>
  <dd>
  <kbd>A</kbd>
  <kbd class="foo">B</kbd>
  <kbd>Ctrl</kbd>Click
  </dd>
  <a>LinkA</a>
  <a>LinkB</a>
  <p>
		Removes leading tabs.
  </p>
</body>
</html>
`),

			`<!DOCTYPE html>
<html lang="en">
<head>
<title>Foo Bar</title>
</head>
<body>
<div>
<h1>Title</h1>
</div>
<p>Single Quotes? Keep'em a'll</p>
<pre data-custom-attr="keeps   everything here <h1>   <h1>">
   aaa   bbbb
   ccc   dddd
  
  </pre>
<dd>
<kbd>A</kbd>
<kbd class="foo">B</kbd>
<kbd>Ctrl</kbd>Click
</dd>
<a>LinkA</a>
<a>LinkB</a>
<p>
Removes leading tabs.
</p>
</body>
</html>`
		)
	})
})
