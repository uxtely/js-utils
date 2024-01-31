import { join, parse } from 'node:path'
import { copy, sha1, makeDir, listFiles } from '../fs-utils.js'


/**
 * Copies a dir, without subdirectories, and adds their SHA-1 hash to the copied filename
 *   foo.png      -> foo-<sha1>.png
 *   foo.png.webp -> foo-<sha1>.png.webp
 *   foo.png.avif -> foo-<sha1>.png.avif
 *
 * Yes, all use the SHA-1 from the original PNG. That way
 * in nginx.conf we can conditionally serve the best format.
 *   https://blog.uirig.com/conditional-avif-for-video-posters
 *
 * We don't use JPGs (explained in ./media-optimizer.sh)
 */
export function copyDirWithHashedNames(src, dest) {
	makeDir(dest)
	const mediaHashes = new Map()

	for (const file of listFiles(src, /\.(png|mp4|svg)$/)) {
		const { name, base, ext } = parse(file)
		const newFileName = name + '-' + sha1(file) + ext
		const newFile = join(dest, newFileName)
		mediaHashes.set(base, newFileName)
		copy(file, newFile)

		if (file.endsWith('.png')) {
			copy(`${file}.webp`, `${newFile}.webp`)
			copy(`${file}.avif`, `${newFile}.avif`)
		}
	}

	return mediaHashes
}


/**
 * Edit the media source links in the HTML, so they have the new SHA-1 hashed
 * filenames. Assumes that all the files are in "media/" (not ../media, ./media)
 *
 * If you want to handle CSS files, edit the regex so
 * instead of checking `="` (e.g. src="img.png") also checks for `url(`
 **/
export function remapMediaInHTML(mediaHashes, html) {
	const reFindMedia = new RegExp('(="media/.*?)"', 'g')
	const reFindMediaKey = new RegExp('="media/')

	for (const [, url] of html.matchAll(reFindMedia)) {
		const hashedName = mediaHashes.get(url.replace(reFindMediaKey, ''))
		if (!hashedName)
			throw `ERROR: Missing ${url}\n`
		html = html.replace(url, `="media/${hashedName}`)
	}
	return html
}


