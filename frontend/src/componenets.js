import {element as _} from './render'
import {productsLoadPage, productsGeneratePage, productsDelete} from './actions'

/**
 * Main compontent.
 */
export const App = ({dispatch, products, generate, deletes}) => {
  const loading = products.loading || generate.loading || deletes.loading
  const errors = !!(products.error || generate.error || deletes.error)
  const messages = []
  if (loading) {
    messages.push(_('span', {class: 'spinner'}, 'Loading...'))
  }
  else if (errors) {
    console.log(products)
    if (products.error) {messages.push('Load error: ' + products.error.message)}
    if (generate.error) {messages.push('Generate error: ' + generate.error.message)}
    if (deletes.error) {messages.push('Delete error: ' + deletes.error.data)}
  }
  else if(products.data.count > 0 && products.data.items) {
    messages.push(`Displaying page ${products.data.page+1} of ${products.data.total} (${products.data.count} products)`)
  }
  else {
    messages.push('No products, try generating or loading')
  }
  return _('div', {id: 'app', class: 'myapp'}, [
    // Error message
    _(Messages, {}, messages),
    // Products
    _(Products, {dispatch, messages, products, generate, deletes})
  ])
}

/**
 * Component for displaying messages
 */
const Messages = ({children}) =>
  _('div', {class: 'messages'}, [
    children.map(message =>
      _('div', {class: 'message'}, message)
    )
  ])

/**
 * Component for ajax button
 */
const Button = ({action, disabled, children}) => 
  _('button', {disabled: !!disabled, onclick: action},
    disabled ? `${children} (loading)` : children
  )

/**
 * Products Page component.
 */
const Products = ({dispatch, products, generate, deletes, error, loading}) => {
  const refreshAction = () => dispatch(productsLoadPage())
  const generateAction = () => dispatch(productsGeneratePage()).then(refreshAction)
  const deleteAction = () => dispatch(productsDelete()).then(refreshAction)
  const nextAction = () => dispatch(productsLoadPage(products.data.page+1))
  const previousAction = () => dispatch(productsLoadPage(products.data.page-1))
  return _([
    // Interface
    _('nav', {class: 'interface'}, [
      // Refresh button
      _(Button, {action: refreshAction, disabled: products.loading}, 'Load products'),
      // Generate Button
      _(Button, {action: generateAction, disabled: generate.loading}, 'Generate products'),
      // Delete button
      _(Button, {action: deleteAction, disabled: deletes.loading}, 'Delete products'),
      // Previous button
      _(Button, {action: previousAction, disabled: products.loading}, 'Previous page'),
      // Next button
      _(Button, {action: nextAction, disabled: products.loading}, 'Next page'),
    ]),
    // Items
    _('section', {class: 'items'}, [
      _((!products.loading && products.data.items) && products.data.items.map(item => Product(item))),
    ])
  ])
}

/**
 * Single product component.
 */
const Product = ({name, description, price, picture}) =>
  _('article', {class: 'product'}, [
    _('summary', {}, [
      _('span', {class: 'name'}, name),
      _('span', {class: 'price'}, '€'+price),
    ]),
    _('img', {src: picture})
  ])



