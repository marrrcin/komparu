import {
  createStore, combineMiddleware, combineReducers, thunk, logger, makeRenderer
} from './src/store'
import {renderTo} from './src/render'

import  './src/style.less'
import reducer from './src/reducers'
import {App} from './src/componenets'

/**
 * Root html element to render to
 */
const rootElement = document.createElement('div')
document.body.appendChild(rootElement)

/**
 * Middleware responsible for rendering interface to DOM.
 */
const renderer = makeRenderer((state, dispatch) => {
  renderTo(rootElement, App({...state, dispatch}))
})

/**
 * Main state store object + all middlewares + all root reducers.
 */
const store = createStore(reducer, combineMiddleware(
  thunk, logger, renderer
))
