'use strict'

const smoke = require('./')

const img = document.createElement('img')
img.src = 'http://placehold.it/300x300'
img.style.marginLeft = '100px'
img.style.marginTop = '100px'

img.width = 300
img.height = 300

document.body.appendChild(img)

smoke({element: img})
