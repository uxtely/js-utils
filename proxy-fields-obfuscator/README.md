# JavaScript Object Keys Obfuscator

Obfuscates field names in production and generates friendly ones in dev.

### Option A: Creates sequential base52 keys
```javascript
const FF = proxyFieldNames('FF', { foo: null, bar: null })
// DEV:  FF.foo → FF_foo
// PROD: FF.foo → 'a'
```

### Option B: Pre-baked (non-null) values are honored in production
```javascript
const FF = proxyFieldNames('FF', { foo: 0, bar: 1 })
// DEV:  FF.foo → FF_foo
// PROD: FF.foo → 0
```

### Tip for autocomplete
In WebStorm, you can preserve autocomplete this way:
```javascript
let FF = { foo: null, bar: null }
FF = proxyFieldNames('FF', FF)
export { FF }
```

### Details
- Development names are: devPrefix_KeyName (`'FF'` above)
- Throws when accessing an undefined key.
- Throws when the dictionary has repeated pre-baked values.
