import { createHash } from 'node:crypto'
import { join, dirname, basename, extname } from 'node:path'
import { brotliCompressSync } from 'node:zlib'
import {
	rmSync,
	lstatSync,
	mkdirSync,
	existsSync,
	unlinkSync,
	readdirSync,
	readFileSync,
	copyFileSync,
	writeFileSync
} from 'node:fs'


export const reIsSourceCode = /^(?!.*\.test).*\.js$/ // *.js not ending in .test.js

export const read = f => readFileSync(f, 'utf8')
export const readIfExists = f => existsSync(f) ? read(f) : ''

export const exists = f => existsSync(f)
export const remove = f => unlinkSync(f)

export function copy(src, dest) { copyFileSync(src, dest) }

export function write(fname, data) {
	mkdirSync(dirname(fname), { recursive: true })
	writeFileSync(fname, data, 'utf8')
}

export function makeDir(dir) { mkdirSync(dir, { recursive: true }) }
export function removeDir(dir) { rmSync(dir, { recursive: true, force: true }) } // forcing allows removing non-existing directories

export const sizeOf = f => lstatSync(f).size
export const sha1 = f => createHash('sha1').update(readFileSync(f)).digest('base64url')


export const listFiles = (dir, regex) => readdirSync(dir)
	.filter(f => regex.test(f))
	.map(f => join(dir, f))

export const listFilesWithoutDirs = dir => readdirSync(dir)
	.filter(f => lstatSync(join(dir, f)).isFile())

export const forEachFileInDir = (dir, fn) => readdirSync(dir)
	.filter(f => lstatSync(join(dir, f)).isFile())
	.forEach(f => fn(join(dir, f)))

export function listFilesRecursively(dir, regex, res = []) {
	for (const f of readdirSync(dir)) {
		const fPath = join(dir, f)
		if (lstatSync(fPath).isDirectory())
			listFilesRecursively(fPath, regex, res)
		else if (regex.test(fPath))
			res.push(fPath)
	}
	return res
}

export const readAsJSON = (name) =>
	JSON.parse(readFileSync(name, 'utf8'))

export const saveAsJSON = (name, data) => {
	writeFileSync(name, JSON.stringify(data, null, '\t'), 'utf8')
}

export function copyDir(from, to) {
	mkdirSync(to, { recursive: true })
	for (const fname of readdirSync(from)) {
		const source = join(from, fname)
		const target = join(to, fname)
		if (lstatSync(source).isDirectory())
			copyDir(source, target)
		else
			copyFileSync(source, target)
	}
}


export function brotli(f) {
	writeFileSync(f + '.br', brotliCompressSync(readFileSync(f, 'utf8')))
}

export function removeExtension(file) {
	return basename(file, extname(file))
}