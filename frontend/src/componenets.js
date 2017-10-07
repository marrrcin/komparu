import {element as _} from './render'
import {productsLoadPage, productsGeneratePage} from './actions'

/**
 * Main compontent.
 */
export const App = props => {
  return _('div', {id: 'app', class: 'myapp'}, [
    _(Products, {
      dispatch: props.dispatch,
      error: props.products.error || props.generate.error || false,
      loading: props.products.loading || props.generate.loading || false,
      products: props.products,
      generate: props.generate,
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
const Products = ({dispatch, products, generate, error, loading}) => {
  const refreshAction = () => dispatch(productsLoadPage())
  const generateAction = () => dispatch(productsGeneratePage())
  return _([
    // Error message
    _(error && `Error while loading: ${error}`),
    // Refresh button
    _(Button, {action: refreshAction, loading: products.loading}, 'Load products'),
    // Generate Button
    _(Button, {action: generateAction, loading: generate.loading}, 'Generate products'),
    // Items
    _('div', {class: 'items'}, [
      _(products.loading && 'Loading products...'),
      _((products.data && !products.loading) && products.data.map(item => Product(item)))
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



