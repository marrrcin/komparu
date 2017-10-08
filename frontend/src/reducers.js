import {combineReducers} from './store'
import {PRODUCTS_PAGE, PRODUCTS_GENERATE, PRODUCTS_DELETE}  from './actions'

/**
 * Higher order reducer for filtering action types.
 */
const filter = (actionType, reducer) => (action, state) => {
  if (action.type === '@@INIT' || action.type.startsWith(actionType)) {
    return reducer(action, state)
  }
  return state
}

/**
 * Slice reducer for api.
 */
const api = (action, state={
  loading: false,
  error: false,
  data: [],
}) => {
  if (action.type.endsWith('_LOADING')) {
    return {loading: true, error: false, data: []}
  }
  if (action.type.endsWith('_FINISHED')) {
    return {loading: false, error: false, data: action.payload}
  }
  if (action.type.endsWith('_FAILED')) {
    return {loading: false, error: action.payload, data: []}
  }
  return state
}

/**
 * Root reducer.
 */
export default combineReducers({
  products: filter(PRODUCTS_PAGE, api),
  generate: filter(PRODUCTS_GENERATE, api),
  deletes: filter(PRODUCTS_DELETE, api)
})
