import { parentPort } from 'node:worker_threads'
import { brotliCompressSync } from 'node:zlib'
import { writeFileSync, readFileSync } from 'node:fs'


parentPort.on('message', f => {
	writeFileSync(f + '.br', brotliCompressSync(readFileSync(f, 'utf8')))
	parentPort.postMessage('ok')
})
