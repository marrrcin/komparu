/**
 * Utility function for simpler creating of element objects that our renderer
 * understands.
 */
export function element(tagName, props=[], children=[]) {
  if (Array.isArray(tagName)) {
    return tagName
  }
  else if (typeof tagName === Object) {
    return tagName
  }
  else if (typeof tagName === 'function') {
    return tagName({...props, children})
  }
  else if (arguments.length === 1 && !tagName) {
    return null
  }
  else if (arguments.length === 1 && typeof tagName === 'string') {
    return tagName
  }
  return {tagName, ...props, children}
}

/**
 * Renders tree of elements to a target dom node.
 * TODO: implement dom traversing and smart updates, don't replace everything.
 */
export function renderTo(target, tree) {
  if (target.children.length) {
    target.replaceChild(render(tree), target.children[0])
  }
  else {
    target.appendChild(render(tree))
  }
}

/**
 * Render function renders a given element and returns a dom node.
 */
export function render(element) {
  if (typeof element === 'object' && Array.isArray(element)) {
    return renderArray(element)
  }
  else if (typeof element === 'string' || typeof element == 'number') {
    return renderString(element)
  }
  else if (typeof element === 'object') {
    return renderObject(element)
  }
}

/**
 * Renders string element and returnes dom text node.
 */
function renderString(element) {
  return document.createTextNode(element)
}

/**
 * Renders array of elements and returnes dom node or dom document fragment node.
 */
function renderArray(elements) {
  if (elements.length === 1) {
    return render(elements[0])
  }
  const fragment = document.createDocumentFragment();
  elements
    .filter(element => !!element)
    .map(element => render(element))
    .map(node => {
      if (node) {
        fragment.appendChild(node)
      }
    })
  return fragment
}

/**
 * Renders object and returns dom node.
 */
function renderObject(element) {
  // Create new node of type tagName.
  const node = document.createElement(element.tagName)
  // Get app info except tagName and children, tagName is used to create the
  // dom element, children is a special propery in dom api that holds all
  // children elements of this node.
  const props = Object.entries(element)
    .filter(prop => !Array('tagName', 'children').includes(prop[0]))
    .filter(prop => !!prop[1])
  // Special case for events, we don't want to render events to html so we
  // catch them here and create event listeners.
  const events = props
    .filter(prop => prop[0].startsWith('on'))
    .map(prop => {
      const event = prop[0].slice(2)
      const listener = prop[1]
      node.addEventListener(event, listener)
    })
  // All not-events become node attributes.
  const attribs  = props
    .filter(prop => !prop[0].startsWith('on'))
    .map(prop => {
      node.setAttribute(prop[0], prop[1])
    })
  // If any children were defined go deeper and render them too.
  if (element.children) {
    const childNode = render(element.children)
    node.appendChild(render(element.children))
  }
  return node
}

