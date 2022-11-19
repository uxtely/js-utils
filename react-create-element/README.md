# React.createElement like API


## Usage (Option A)
```js
const make = createElement

document.body.append(
  make('div', { className: 'foo' }, 
    make('h1', null, 'My title',
      make('div' { className: 'bar' }, 'Hello')))))
```

## Usage (Option B)
```js
const h1 = createElement.bind(null, 'h1')
const div = createElement.bind(null, 'div')

document.body.append(
  div({ className: 'foo' }, 
    h1(null, 'My title',
      div({ className: 'bar' }, 'Hello')))))
```

## More usage examples:

### [🔗 Demo 1](https://uxtely.github.io/js-utils/react-create-element/)
[createElement-usage.js](https://github.com/uxtely/js-utils/blob/main/react-create-element/createElement-usage.js)

### [🔗 Demo 2](https://ericfortis.github.io/web-projects/paint-calculator/) (Paint Calculator)
[script.js](https://github.com/ericfortis/web-projects/tree/main/paint-calculator/script.js)
