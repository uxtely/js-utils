# IndexedDB

Promisifies and automates the ceremony of the browser’s `IndexedDB`. 

## Pros
- Battle tested in https://uidrafter.com
- Lightweight (40 LoC)

## Cons
- Only one database is supported.
- Only one object store per database is supported.

## How it works
- **Creates** `||` **Opens** an `IDBDatabase`, which is named after your own `dbName()`.
- **Creates** `||` **Uses** an existing `IDBObjectStore`.
- **Creates** `&&` **Closes** the `IDBTransaction`.


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
