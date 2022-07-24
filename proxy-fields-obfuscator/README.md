# JavaScript Object Keys Obfuscator

Mangles field names in production and generates friendly ones in dev.

## Option A: Creates sequential base52 keys in production
```javascript
const FF = proxyFieldNames('FF', { foo: null, bar: null })
// DEV:  FF.foo → FF_foo
// PROD: FF.foo → 'a'
```

## Option B: Honors pre-baked (non-null) values in production
```javascript
const FF = proxyFieldNames('FF', { foo: 0, bar: 1 })
// DEV:  FF.foo → FF_foo
// PROD: FF.foo → 0
```

## Tip for autocomplete
In WebStorm, you can preserve autocomplete this way:
```javascript
let FF = { foo: null, bar: null }
FF = proxyFieldNames('FF', FF)
export { FF }
```

## Details
- Development names are: devPrefix_KeyName (`'FF'` above)
- Throws when accessing an undefined key.
- Throws when the dictionary has repeated pre-baked values.


## Why?
- For making it harder to reversers trying to steal the code.
- For reducing the bundle size.
- For optimizing the field lookups time. For instance, by baking-in numbers, we can
  take advantage of [V8’s fast properties](https://v8.dev/blog/fast-properties).
  In short, it's closer to an array lookup than a hash map one.


## Another Example
In UI Drafter, the Card data structure is like this:
```js
let CF = { 
  id: 0, 
  title: 1, 
  total: 2 
}
CF = proxyFieldNames('CF', CF)

function Card() {
  this[CF.id] = ''
  this[CF.title] = ''
  this[CF.total] = '' /* @ClientSideOnlyField */
}

const makeCard = props => 
  Object.assign(Object.seal(new Card()), props)
```

`Object.seal` helps for preventing unknown properties from being injected,
including `__proto__` (for mitigating prototype pollution attacks).
