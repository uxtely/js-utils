import { cpus } from 'node:os'
import { Worker } from 'node:worker_threads'
import { EventEmitter } from 'node:events'
import { AsyncResource } from 'node:async_hooks'


const TASK = 'brotli-worker.js'
const kTaskInfo = Symbol('kTaskInfo')
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent')


class WorkerPoolTaskInfo extends AsyncResource {
	constructor(callback) {
		super('WorkerPoolTaskInfo')
		this.callback = callback
	}

	done(error) {
		this.runInAsyncScope(this.callback, null, error)
		this.emitDestroy() // `TaskInfo`s are used only once
	}
}


export class BrotliPool extends EventEmitter {
	constructor() {
		super()
		this.nThreads = cpus().length
		this.freeWorkers = []
		this.workers = []
		this.tasks = []

		for (let i = 0; i < this.nThreads; i++)
			this.addNewWorker()

		this.on(kWorkerFreedEvent, () => { // Dispatch the next enqueued task, if any.
			if (this.tasks.length > 0) {
				const { task, callback } = this.tasks.shift()
				this.compress(task, callback)
			}
		})
	}

	addNewWorker() {
		const worker = new Worker(new URL(TASK, import.meta.url))

		worker.on('message', () => {
			worker[kTaskInfo].done(null) // Calls `compress` callback
			worker[kTaskInfo] = null // Removes the `TaskInfo` associated with the Worker
			this.freeWorkers.push(worker)
			this.emit(kWorkerFreedEvent)
		})

		worker.on('error', error => {
			if (worker[kTaskInfo])
				worker[kTaskInfo].done(error, null) // Calls `compress` callback with error
			else
				this.emit('error', error)

			this.workers.splice(this.workers.indexOf(worker), 1) // Remove the worker from the list
			this.addNewWorker() // Start a new Worker to replace the current one
		})

		this.workers.push(worker)
		this.freeWorkers.push(worker)
		this.emit(kWorkerFreedEvent)
	}

	compress(task, callback) {
		if (this.freeWorkers.length === 0) { // Wait until a worker thread becomes free.
			this.tasks.push({ task, callback })
			return
		}

		const worker = this.freeWorkers.pop()
		worker[kTaskInfo] = new WorkerPoolTaskInfo(callback)
		worker.postMessage(task)
	}

	close() {
		for (const worker of this.workers)
			worker.terminate()
	}
}