function dbName() { return '0' } // e.g. the used id

const STORE_NAME = 0
const VERSION = 1

export const idbSaveFile = data => IDB('put', 'readwrite', data)
export const idbRemoveFile = id => IDB('delete', 'readwrite', id)
export const idbWipeAllFiles = () => IDB('clear', 'readwrite')

export const idbReadFile = id => IDB('get', 'readonly', id)
export const idbCountFiles = () => IDB('count', 'readonly', null)
export const idbListFiles = () => {
	const records = []
	return IDB('openCursor', 'readonly', null, (resolve, cursor) => {
		if (cursor) {
			records.push(cursor.value)
			cursor.continue() // emits 'openCursor' again
		}
		else
			resolve(records)
	})
}


function IDB(method, mode, payload, callback) {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(dbName(), VERSION)

		req.onupgradeneeded = event => {
			event.target.result.createObjectStore(STORE_NAME, { keyPath: 'id' })
		}

		req.onsuccess = event => {
			const db = event.target.result
			const tx = db.transaction(STORE_NAME, mode)
			tx.oncomplete = () => { db.close() }
			tx.objectStore(STORE_NAME)[method](payload).onsuccess = event => {
				if (callback)
					callback(resolve, event.target.result)
				else
					resolve(event.target.result)
			}
		}

		// Errors bubble up to this handler. e.g. Quota Exceeded,
		// or the on-disk version is greater than VERSION
		req.onerror = reject
	})
}
