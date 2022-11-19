import { cpus } from 'node:os'
import { Worker } from 'node:worker_threads'
import { EventEmitter } from 'node:events'
import { AsyncResource } from 'node:async_hooks'

// Based on: https://nodejs.org/api/async_context.html#using-asyncresource-for-a-worker-thread-pool

const kTaskInfo = Symbol('kTaskInfo')
const kWorkerFreedEvent = Symbol('kWorkerFreedEvent')


class WorkerPoolTaskInfo extends AsyncResource {
	constructor(callback) {
		super('WorkerPoolTaskInfo')
		this.callback = callback
	}

	done(error, areAllTasksCompleted) {
		this.runInAsyncScope(this.callback, null, error, areAllTasksCompleted)
		this.emitDestroy() // `TaskInfo`s are used only once
	}
}


export class Pool extends EventEmitter {
	constructor(taskFile, nTotalTasks) {
		super()
		this.taskFile = taskFile
		this.nTotalTasks = nTotalTasks
		this.nDoneTasks = 0
		this.nThreads = cpus().length
		this.freeWorkers = []
		this.workers = []
		this.tasks = []

		for (let i = 0; i < this.nThreads; i++)
			this.addNewWorker()

		this.on(kWorkerFreedEvent, () => { // Dispatch the next enqueued task, if any.
			if (this.tasks.length) {
				const { taskArg, callback } = this.tasks.shift()
				this.runTask(taskArg, callback)
			}
		})
	}

	addNewWorker() {
		const worker = new Worker(new URL(this.taskFile, import.meta.url))

		worker.on('message', () => {
			this.nDoneTasks++
			const areAllTasksCompleted = this.nDoneTasks === this.nTotalTasks
			worker[kTaskInfo].done(null, areAllTasksCompleted)
			worker[kTaskInfo] = null // Removes the `TaskInfo` associated with the Worker
			this.freeWorkers.push(worker)
			this.emit(kWorkerFreedEvent)
			if (areAllTasksCompleted)
				this.close()
		})

		worker.on('error', error => {
			if (worker[kTaskInfo])
				worker[kTaskInfo].done(error, null) // Calls `runTask` callback with error
			else
				this.emit('error', error)

			this.workers.splice(this.workers.indexOf(worker), 1) // Remove the worker from the list
			this.addNewWorker() // Start a new Worker to replace the current one
		})

		this.workers.push(worker)
		this.freeWorkers.push(worker)
		this.emit(kWorkerFreedEvent)
	}

	runTask(taskArg, callback) { // Main Task
		if (this.freeWorkers.length) {
			const worker = this.freeWorkers.pop()
			worker[kTaskInfo] = new WorkerPoolTaskInfo(callback)
			worker.postMessage(taskArg)
		}
		else // Wait until a worker thread becomes free
			this.tasks.push({ taskArg, callback })
	}

	close() {
		for (const worker of this.workers)
			worker.terminate()
	}
}
