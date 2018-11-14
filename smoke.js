'use strict'

const fs = require('fs')
const path = require('path')
const raf = require('raf-loop')
const Particle = require('./particle')

const Image = global.Image

const png = fs.readFileSync(path.resolve(__dirname, 'smoke.png'), { encoding: 'base64' })
const src = 'data:image/png;base64,' + png

module.exports = Smoke

function Smoke (options) {
  if (!(this instanceof Smoke)) {
    return new Smoke(options)
  }

  this.element = options.element
  this.img = Object.assign(new Image(), { src: createImage(src, options.colors || [0, 0, 0]) })

  this.canvas = Object.assign(document.createElement('canvas'), {
    height: 50 * this.img.height,
    width: 20 * this.img.width
  })
  this.context = this.canvas.getContext('2d')

  this.particles = {
    active: [],
    pending: []
  }

  this.height = this.img.height
  this.width = this.img.width

  this.done = false

  this.element.appendChild(this.canvas)
}

Smoke.prototype.start = function start () {
  this.loop = raf((delta) => {
    if (!this.done) {
      this.add({ x: this.canvas.width / 2, y: this.canvas.height, lifetime: 4000 })
      this.add({ x: this.canvas.width / 2.1, y: this.canvas.height, lifetime: 4000 })
      this.add({ x: this.canvas.width / 1.9, y: this.canvas.height, lifetime: 4000 })
    }
    this.update(delta)
  })
    .start()
}

Smoke.prototype.stop = function stop () {
  this.done = true
}

Smoke.prototype.update = function update (delta) {
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

  this.particles.active = this.particles.active
    .concat(this.particles.pending)
    .reduce((acc, particle) => {
      particle.update(delta)
      if (particle.alive()) {
        this.draw(particle)
        acc.push(particle)
      }

      return acc
    }, [])

  this.particles.pending = []

  if (this.done && !this.particles.active.length) {
    this.loop.stop()
    this.loop = null
  }
}

Smoke.prototype.add = function add (data) {
  this.particles.pending.push(new Particle(data))
}

Smoke.prototype.draw = function draw (particle) {
  this.context.globalAlpha = (1 - Math.abs(1 - 2 * particle.age / particle.lifetime)) / 8

  const offset = particle.scale * this.width / 2
  const x1 = particle.x - offset
  const x2 = x1 + particle.scale * this.height
  const y1 = particle.y - offset
  const y2 = y1 + particle.scale * this.height

  this.context.drawImage(this.img, x1, y1, x2 - x1, y2 - y1)
}

function createImage (src, colors) {
  const img = new Image()
  img.src = src

  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.width = 20
  canvas.height = 20
  context.drawImage(img, 0, 0, 20, 20)

  const data = context.getImageData(0, 0, 20, 20)
  const d = data.data

  for (let i = 0; i < d.length; i += 4) {
    d[i] = colors[0]
    d[i + 1] = colors[1]
    d[i + 2] = colors[2]
  }

  context.putImageData(data, 0, 0)
  return canvas.toDataURL('img/png')
}
