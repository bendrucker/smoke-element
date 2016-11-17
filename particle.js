'use strict'

module.exports = Particle

function Particle (data) {
  if (!(this instanceof Particle)) {
    return new Particle(data)
  }

  const vy = -1 * (Math.random() * 30 + 10) / 100
  const scale = Math.random() * 0.5

  Object.assign(this, data, {
    age: 0,
    vx: (Math.random() * 8 - 4) / 100,
    vy: vy,
    lifetime: Math.random() * data.lifetime + data.lifetime / 2,
    initial: {vy},
    scale,
    final: {scale: 5 + scale + Math.random()}
  })
}

Particle.prototype.update = function update (delta) {
  this.x += this.vx * delta
  this.y += this.vy * delta

  const remaining = Math.pow(this.age / this.lifetime, 0.5)
  this.vy = (1 - remaining) * this.initial.vy
  this.age += delta
  this.scale = remaining * this.final.scale
}

Particle.prototype.alive = function alive () {
  return this.age < this.lifetime
}
