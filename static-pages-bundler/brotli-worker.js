import { parentPort } from 'node:worker_threads'
import { brotliCompressSync } from 'node:zlib'
import { writeFileSync, readFileSync } from 'node:fs'


/**
 * For speed, we compress in `node:worker_threads` (one per CPU).
 * Otherwise, the compression takes ~60% of the build time.
 */

parentPort.on('message', f => {
	writeFileSync(f + '.br', brotliCompressSync(readFileSync(f, 'utf8')))
	parentPort.postMessage('ok')
})
