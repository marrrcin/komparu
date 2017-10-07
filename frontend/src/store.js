/**
 * Redux-like state store create function.
 * For convenience. We want to tame the state changes.
 */
export function createStore(reducer, middleware=undefined) {
  middleware = middleware || (next => (action, state, dispatch) => next(action, state, dispatch))
  return new function() {
    this.state = undefined
    this.getState = () => ({...this.state})
    this.reducer = (action, state) => this.state = {...reducer(action, state())}
    this.middleware = middleware(this.reducer)
    this.dispatch = action => this.middleware(action, this.getState, this.dispatch)
    this.dispatch({type: '@@INIT'})
  }
}

/**
 * Higher order function to combine reducers.
 */
export function combineReducers(reducers) {
  return (action, state={}) => {
    return Object.keys(reducers).reduce((newState, key) => {
      newState[key] = reducers[key](action, newState[key])
      return newState
    }, state)
  }
}

/**
 * Higher order function to chain middleware functions
 */
export function combineMiddleware() {
  const args = Array.from(arguments)
  const first = args.shift()
  return args.reduce((sum, val) => next => sum(val(next)), first)
}

/**
 * Thunk middleware, for action thunks.
 */
export const thunk = next => (action, state, dispatch) => {
  if (typeof action === 'function') {
    return action(dispatch)
  }
  else {
    return next(action, state, dispatch)
  }
}

/**
 * Simple, logging middleware.
 */
export const logger = next => (action, state, dispatch) => {
  const result = next(action, state, dispatch)
  console.log('store action:', action, 'state:', state())
  return result
}

/**
 * Higher order Middleware responsible for rendering interface to DOM.
 */
export const makeRenderer = render => next => (action, state, dispatch) => {
  const result = next(action, state, dispatch)
  render(state(), dispatch)
  return result
}

