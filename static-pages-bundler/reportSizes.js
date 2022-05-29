import { join } from 'node:path'
import { read, sizeOf, sha1, exists, saveAsJSON } from '../fs-utils.js'


export function reportSizes(reportFilename, baseDir, files) {
	const oldReport = JSON.parse(read(reportFilename))
	const newReport = {}

	for (const f of files) {
		const fPath = join(baseDir, f)
		const size = sizeOf(fPath)
		newReport[f] = {
			hash: sha1(fPath),
			delta: size - (oldReport[f] && oldReport[f].size),
			size: size
		}
		if (exists(fPath + '.br')) {
			const size = sizeOf(fPath + '.br')
			newReport[f].brotliedSize = size
			newReport[f].brotliedDelta = size - (oldReport[f] && oldReport[f].brotliedSize)
		}
	}

	console.table(newReport)
	saveAsJSON(reportFilename, newReport)
}
