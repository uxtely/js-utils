# check

A plain-JS type checker with an API similar to:
- [Meteor’s check](https://github.com/meteor/meteor/blob/devel/packages/check/match.js)
- [React’s prop-types](https://github.com/facebook/prop-types)
- [rho-contracts](https://github.com/rho-contracts/rho-contracts)

## TL;DR
```js
const t_num = n => check(n, Number)

function square(n) {
  t_num(n)
  return t_num(n * n)
}
```

## Single type definition
```js
check([], Array)
check('a', String)
check(100, Number)
check(new Int8Array([1, 2, 3]), Int8Array)
```

## Multiple type definitions
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

function isValidZipCode(zip) {
  return /^\d{5}$/.test(zip)
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
https://blog.uidrafter.com/types-without-typescript
