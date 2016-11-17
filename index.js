'use strict'

const Tether = require('tether')
const Smoke = require('./smoke')

module.exports = smoker

function smoker (options) {
  options = options || {}

  const container = document.createElement('div')
  const smoke = new Smoke({
    element: container,
    colors: options.colors || [0, 0, 0]
  })

  smoke.start()

  document.body.appendChild(container)

  const tether = new Tether({
    element: container,
    target: options.element,
    offset: (options.offset || -20) + 'px 0',
    attachment: 'bottom center',
    targetAttachment: 'top center'
  })

  tether.position()

  return smoke
}
