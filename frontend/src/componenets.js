import {element as _} from './render'
import {productsLoadPage, productsGeneratePage, productsDelete} from './actions'

/**
 * Main compontent.
 */
export const App = props => {
  return _('div', {id: 'app', class: 'myapp'}, [
    _(Products, {
      dispatch: props.dispatch,
      error: props.products.error || props.generate.error || props.delete.error || false,
      loading: props.products.loading || props.generate.loading || props.delete.loading || false,
      products: props.products,
      generate: props.generate,
      deletes: props.delete,
    })
  ])
}

const Button = ({action, loading, children='click'}) => 
  _('button', {disabled: !!loading, onclick: action},
    loading ? 'loading...' : children
  )

/**
 * Products Page component.
 */
const Products = ({dispatch, products, generate, deletes, error, loading}) => {
  const refreshAction = () => dispatch(productsLoadPage())
  const generateAction = () => dispatch(productsGeneratePage())
  const deleteAction = () => dispatch(productsDelete())
  return _([
    // Error message
    _(error && `Error while loading: ${error}`),
    // Refresh button
    _(Button, {action: refreshAction, loading: products.loading}, 'Load products'),
    // Generate Button
    _(Button, {action: generateAction, loading: generate.loading}, 'Generate products'),
    // Delete button
    _(Button, {action: deleteAction, loading: deletes.loading}, 'Delete products'),
    // Items
    _('div', {class: 'items'}, [
      _(products.loading && 'Loading products...'),
      _((!products.loading) && products.data.map(item => Product(item))),
      _((!products.data.length && !products.loading) && 'No products, try generting some, and then load')
    ])
  ])
}

/**
 * Single product component.
 */
const Product = ({name, description, price, picture}) =>
  _('div', {class: 'product'}, [
    _('div', {class: 'name'}, name),
    _('div', {class: 'desc'}, description),
    _('div', {class: 'price'}, price),
    _('img', {class: 'picture', src: picture})
  ])



