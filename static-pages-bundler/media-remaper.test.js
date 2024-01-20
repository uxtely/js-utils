import { describe, test } from 'node:test'
import { equal, throws } from 'node:assert/strict'
import { remapMediaInHTML } from './media-remaper.js'


describe('Media Remapper', () => {
	const mHashes = new Map([
		['alpha.png', '0xFA.png'],
		['beta.png', '0xFB.png'],
		['chi.png', '0xFC.png']
	])

	test('Throws when the file does not exist', () =>
		throws(() => remapMediaInHTML(mHashes, `<video src="media/missing.mp4">`)))

	test('Acceptance', () =>
		equal(remapMediaInHTML(mHashes, `
<img src="media/alpha.png">
<img src="media/alpha.png">
<img src="media/beta.png">
<video poster="media/chi.png">`),
			`
<img src="media/0xFA.png">
<img src="media/0xFA.png">
<img src="media/0xFB.png">
<video poster="media/0xFC.png">`))


})