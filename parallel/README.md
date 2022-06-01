# Runs tasks in parallel

For a usage example see [builders.js](../static-pages-bundler/builders.js)

1. Create a worker for the actual task
```js
// worker-for-brotli.js
parentPort.on('message', f => {
	writeFileSync(f + '.br', brotliCompressSync(readFileSync(f, 'utf8')))
	parentPort.postMessage('ok')
})
```

2. Instantiate a pool with the worker file path and the number of tasks to perform.
   Use the callback of `runTask` if you need to know when all tasks have finished.
```js
// builders.js
const files = ['a.html', 'b.html']
const pool = new Pool('worker-for-brotli.js', files.length)
for (const f of files)
	pool.runTask(f, (error, allFilesAreDone) => {
		if (allFilesAreDone)
			console.log('Finished all')
})
```
