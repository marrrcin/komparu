import {api} from './api'

export const PRODUCTS_PAGE = 'PRODUCTS_PAGE'
export const PRODUCTS_GENERATE = 'PRODUCTS_GENERATE'

/**
 * Api action helper.
 */
export const apiAction = (fetchRequest, actionType) => dispatch => {
  dispatch({type: `${actionType}_LOADING`})
  return fetchRequest
    .then(data => dispatch({type: `${actionType}_FINISHED`, payload: data}))
    .catch(error => dispatch({type: `${actionType}_FAILED`, payload: error}))
}

/**
 * Loads a page of proucts.
 */
export const productsLoadPage = () =>
  apiAction(api('/'), PRODUCTS_PAGE)

/**
 * Generate a page of proucts.
 */
export const productsGeneratePage = () =>
  apiAction(api('/generate'), PRODUCTS_GENERATE)
