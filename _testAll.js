#! /usr/bin/env node
import { resolve, join } from 'node:path'
import { readdirSync, lstatSync } from 'node:fs'


Promise.all(listFilesRecursively('.', /\.test\.js$/).map(f => import(resolve(f))))
	.then(() => { console.log('✓ All tests passed') })
	.catch(console.error)


function listFilesRecursively(dir, regex, res = []) {
	for (const f of readdirSync(dir)) {
		const fPath = join(dir, f)
		if (lstatSync(fPath).isDirectory())
			listFilesRecursively(fPath, regex, res)
		else if (regex.test(fPath))
			res.push(fPath)
	}
	return res
}
