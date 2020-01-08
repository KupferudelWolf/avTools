/**
 * Simple particle system.
 * @module av_PartSys
 * @author Avoyt Doukas
 */

/**
 * @class
 * @classdesc Particle emitter.
 */
export default class Emitter {
  constructor(ctx, prop, particleObjectProp) {
    let defaultProp = {
      x: 0,
      y: 0,
      refresh: 10,
      emitRate: 0.1
    };

    if (typeof(prop) !== 'object') {
      prop = {};
    }

    for (let p in defaultProp) {
      if (defaultProp.hasOwnProperty(p)) {
        this[p] = prop[p] || defaultProp[p];
      }
    }

    this.ctx = ctx;
    this.particleObjectProp = particleObjectProp || {};
    this.particles = {};
    this.particleIdToDelete = [];
    this.overflow = 0;
    this.id = 0;
  }

  emitParticle() {
    this.particleObjectProp.id = 'id' + this.id;
    let newParticle = new Particle(this, this.particleObjectProp);
    this.particles[newParticle.id] = newParticle;
    this.id++;
  }

  draw() {
    for (let partId in this.particles) {
      if (this.particles.hasOwnProperty(partId)) {
        let particle = this.particles[partId];
        particle.update(particle.time);
        particle.draw(particle.time);
        particle.clean();
      }
    }
    this.particleIdToDelete.forEach((id) => {
      delete this.particles[id];
    });
    this.particleIdToDelete = [];
  }
}

/**
 * @class
 * @classdesc Individual particle; usually used internally.
 */
export class Particle {
  constructor(emitter, prop) {
    let defaultProp = {
      id: -1,

      col: function (t) {return '#FF0000';},
      dir: function (t) {return Math.PI/2;},
      spd: function (t) {return 2;},
      scl: function (t) {return 1;},

      update: function(t) {
        this.x += this.speed * Math.cos(this.direction);
        this.y += this.speed * Math.sin(this.direction);
      },

      draw: function (t) {
        this.scl = function (t) {
          return 10 * (Math.sin(t/200) + 2);
        };
        let s = this.scale / 2;
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(
          this.x - Math.floor(s),
          this.y - Math.floor(s),
          Math.ceil(s),
          Math.ceil(s)
        );
      },

      clean: function() {
        if ( this.x < -this.scale
          || this.x > this.ctx.canvas.width + this.scale
          || this.y < -this.scale
          || this.y > this.ctx.canvas.height + this.scale
        ) {
          this.delete();
        }
      }
    };

    if (typeof(prop) !== 'object') {
      prop = {};
    }

    for (let p in defaultProp) {
      if (defaultProp.hasOwnProperty(p)) {
        this[p] = prop[p] || defaultProp[p];
      }
    }

    this.emitter = emitter;
    this.x = this.emitter.x;
    this.y = this.emitter.y;
    this.ctx = this.emitter.ctx;

    this.creationTime = Date.now();
    this.seed = Math.random();
  }

  delete() {
    //console.log('Bye, ' + this.id + '!', Math.floor(Math.random()*10));
    this.update = function () {};
    this.draw = function () {};
    this.clean = function () {};
    delete this.emitter.particleIdToDelete.push(this.id);
  }

  get color() {
    return this.col(this.time);
  }
  get direction() {
    return this.dir(this.time);
  }
  get scale() {
    return this.scl(this.time);
  }
  get speed() {
    return this.spd(this.time);
  }
  get time() {
    return Date.now() - this.creationTime;
  }
}
