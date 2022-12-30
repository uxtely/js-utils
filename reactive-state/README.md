# ReactiveState

## Similar Projects
- [Recoil](https://recoiljs.org/)
- [zustand](https://github.com/pmndrs/zustand)
- [jotai](https://github.com/pmndrs/jotai)

## Description
It’s a standalone plain JS object that’s bindable to the state of many React
class components without needing higher-order components (HOC).

As it's standalone and importable, it can be used in two leaf components,
for either updating the state or for re-rendering. For example, in [UI Drafter](https://uidrafter.com)
hitting **User** → **Delete all Files** needs to refresh **&lt;HomeFileList/>**.
So with this `ReactiveState`, there’s no need to write code in a parent
component to handle this coupling, as it can be imported where it’s needed.

In addition to reducing wiring overhead, it simplifies testing as it doesn’t
require a DOM. For example, to test the router function, we assert the value of the
`activeWorkspace` reactive state, which is plain JS. Therefore, it reduces, or in
some cases eliminates, the need for DOM based testing, which are slow and brittle.

## Why?
As UI Drafter started out as a Meteor project, it used its
[ReactiveVar](https://docs.meteor.com/api/reactive-var.html) extensively. Therefore,
this `ReactiveState` is a re-implementation for React class components of ReactiveVar.

## Usage
### Optional Helper
```js
React.Component.prototype.subscribeState = function (reactiveStates) {
  for (const [key, rs] of Object.entries(reactiveStates))
    rs.bindState(this, key)
}
```

### Initialize
```js
const defaultValue = false
export const menuIsOpen = new ReactiveState(defaultValue)
```

### Binding Option A
```js
import { menuIsOpen } from './menuIsOpen.js'

class Foo extends React.Component {
  constructor() {
    super()

    // If the component needs other, non-reactive, states:
    this.state = {
      anotherState: 'needs to be initialized before `subscribeState`'
    }

    this.subscribeState({ menuIsOpen })
  }

  render() {
    return <div>{this.state.menuIsOpen}</div>
  }
}
```


### Binding Option B
```js
import { menuIsOpen } from './menuIsOpen.js'

class Foo extends React.Component {
  constructor() {
    super()
    menuIsOpen.on(this, this.callback)
  }

  callback() {
    console.log(menuIsOpen.valueOf())
  }
}
```


## Details
- Only emits when its value changes.
- `subscribeState` calls many `bindState(reactComponentInstance, stateKey)` to:
    - Set the initial state
    - Add a listener on `componentDidMount` that does `setState({ [stateKey]: myReactiveState.valueOf() })`
    - Remove the listener on `componentWillUnmount`
- `on(reactComponentInstance, callback)`
    - Adds a listener callback on `componentDidMount`
    - Removes the listener on `componentWillUnmount`
- `set(value)`
- `valueOf()`, `reset()`


## How it works?
`ReactPubSub` has an `on(reactComponentInstance, callback)` method that binds to the
React component on `componentDidMount` and unbinds it on `componentWillUnmount`.


## Caveats
When using non-primitive values, the getter returns a reference, so you have to make
sure not to mutate it directly. Alternatively, extend the class and override `valueOf()`.


## Customizing Example
```js
export class ReactiveStateBitfield extends ReactiveState {
  constructor(defaultValue) { super(defaultValue) }
  mask(m) { return this.valueOf() & m }
  setBit(bit) { this.set(this.valueOf() | bit) }
  clearBit(bit) { this.set(this.valueOf() & ~bit) }
  toggleBit(bit) { this.set(this.valueOf() ^ bit) }
}
```


## License
This program is [ISC licensed](../LICENSE).
