# check

A plain-JS type checker with an API similar to:
- [Meteor `check`](https://github.com/meteor/meteor/tree/devel/packages/check)
- [React `prop-types`](https://github.com/facebook/prop-types)

## Usage
### Single type definition
```js
check('a', String)
check(100, Number)
check(new Int8Array([1, 2, 3]), Int8Array)
```

### Multiple type definitions
```js
function Person(p) {
  check(p, {
    name: String,
    age: Where(Number.isInteger),
    nick: Optional(String),
    zipcode: OptionalWhere(isValidZipCode),
    point: Shape({ 
      x: Number, 
      y: Number
    })
  })
  
  this.name = p.name
  this.age = p.age
  this.nick = p.nick || ''
  this.zipcode = p.zipcode || null
  this.point = p.point
}
```

```js
new Person({ name: 'John' }) 
// Throws `TypeError` because only `nick` and `zipcode` are optional.
```

```js
new Person({ unspecified: true }) 
// Throws `TypeError` because `unspecified` is not 
// type-defined and it's missing required fields.
```

## See also
https://blog.uidrafter.com/type-without-typescript
