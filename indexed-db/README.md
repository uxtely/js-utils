# IndexedDB

Promisifies and automates the ceremony of the
browser's `IndexedDB`. For example, it automatically:
- **Creates** || **Opens** an `IDBDatabase`
	- It's named after your own `dbName()` function.
  - Only one database is supported.
- **Creates** || **Uses** an existing `IDBObjectStore`
	- Only one per database is supported.
- **Creates** && **Closes** the `IDBTransaction`.


## Similar projects
- [idb](https://github.com/jakearchibald/idb)


## Usage
```js
const dbName = () => 'abc123' // e.g. user id

idbSaveFile({ id: 1, foo: 'bar' }).catch(console.error)

idbReadFile(1) // fileId = 1
  .then(data => { console.log(data) })
  .catch(console.error)
```

## API (all return a promise)
- `idbSaveFile(data)` must have an `id` field
- `idbReadFile(id)`
- `idbRemoveFile(id)`
- `idbWipeAllFiles()`
- `idbCountFiles()`
- `idbListFiles()`
