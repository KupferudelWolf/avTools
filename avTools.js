/**
 * @overview Generic tools for personal use.
 * @author Avoyt
 * @date 2020 January 3
 * @module AV
 */

///

export const GOLDEN_RATIO = 1.61803398875;

/**
 * Runs a function every set number of frames.
 * @param {function} draw - Function to run.
 * @param {number} [fpsTarget] - Frame rate (in fps).
 */
export function animate(draw, fpsTarget) {

  let delta, now,
      then = Date.now(),
      interval = 1000 / (fpsTarget || 1000),
      tick = function () {
        requestAnimationFrame(tick);
        if ((delta = (now = Date.now()) - then) >= interval) {
          then = now - (delta % interval);
          draw();
        }
      };

  tick();
};

///

/**
 * Converts straight quotes to curly quotes.
 * @param {String} txt - String to "quotify".
 */
export function quotify(txt) {
  return txt.replace(/ '/g, ' \u2018')
            .replace(/" /g, '\u201d ')
            .replace(/'/g, '\u2019')
            .replace(/"/g, '\u201c');
}
/**
 * Determines if a variable is defined.
 * @param {*} v - Variable to test.
 */
export function defined(v) {
  return typeof(v) !== 'undefined' && v !== null;
}
/**
 * Determines if a variable matches a certain type.
 * @param {*} v - Variable to test.
 * @param {String} [type] - The exact type of variable to match.
 */
export function valid(v, type) {
  if (typeof(type) === 'string') return typeof(v) === type;
  return defined(v);
}
/**
 * Returns a deep copy of an object.
 * @param {Object} obj - Object to clone.
 */
export function clone(obj) {
  if (typeof obj !== "object" || obj === null) return obj;

  let out = Array.isArray(obj) ? [] : {};

  for (let key in obj) {
    out[key] = deepCopyFunction(obj[key]);
  }

  return out;
}
/**
 * Swaps two indexes of an array or object.
 * @param {Object[]|Object} array - Array or object to swap.
 * @param {number|string} a - Array index or object key to swap.
 * @param {number|string} b - Array index or object key to swap.
 */
export function swap(array, a, b) {
  let temp = array[a];
  array[a] = array[b];
  array[b] = temp;
  return array;
}



/// Mathematical functions.

/**
 * Returns the average of all numbers passed into the function.
 * @param {...number}
 */
export function average() {
  let args = [];
  for (let i = 0; i < arguments.length; i++) args.push(arguments[i]);
  return args.reduce((acc, val) => acc + val) / args.length;
}
/**
 * Returns the median of all numbers passed into the function. If three numbers
 * are passed, then mid() can act as a limiting function.
 * @summary Returns the median of all numbers passed into the function.
 * @param {...number}
 */
export function mid() {
  let args = [], sum, l, ave, closest;
  for (let i = 0; i < arguments.length; i++) args.push(arguments[i]);
  l = args.length;
  ave = average(...args);
  closest = args[0];
  for (let i=1; i<l; i++) {
    let val = args[i],
        dist = Math.abs(ave - val);
    if (dist === 0) return val;
    if (dist < Math.abs(ave - closest)) closest = val;
  };
  return closest;
}
/**
 * Returns x rounded to the nearest y.
 * @summary Linearly maps a number from one scale to another.
 * @param {number} x - Number to round.
 * @param {number} [y] - Number to round to.
 * @param {number} [f] - Math function to use. Defaults to 'floor'.
 */
export function round(x, y, f) {
  y = y || 1;
  if (!f || !Math[f]) f = 'floor';
  return Math[f](x / y) * y;
}
/**
 * Returns a value linearly mapped from one line or scale to another.
 * For example, value of 0.5 on a scale of 0 - 1 (0, 0.25, 0.5, 0.75, 1) will
 * map to 3 on a scale of 1 to 5 (1, 2, 3, 4, 5).
 * @summary Linearly maps a number from one scale to another.
 * @param {number} num - A number to input scale.
 * @param {number} inMin - Start value of input scale.
 * @param {number} inMax - End value of input scale.
 * @param {number} outMin - Start value of output scale.
 * @param {number} outMax - End value of output scale.
 */
export function map(num, inMin, inMax, outMin, outMax) {
  if (!valid(outMax)) {
    console.error('avTools Error: Insufficient arguments for map().');
    return NaN;
  }
  if (inMax === inMin) return outMin;
  return (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}
/**
 * Returns a random value from the input array.
 * @param {Object[]} array
 */
export function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}



/// Color functions.


export class Color {
  constructor (r, g, b, a) {
    if (typeof(r) === 'string') {
      let mode, str = r.trim().replace(/,\s*/g,' '),
          regRGBorHSL = new RegExp('(rgba?|hs[blv]a?)\\(|\\)','g');

      if (r.match(/x|#/g)) {
        mode = 'hex';
      } else if (r.match(regRGBorHSL)) {
        mode = 'rgb()';
      }

      switch (mode) {
        case 'rgb()':
          let convert = str.match(/hs/g),
              comp = str.replace(regRGBorHSL,'').split(' ');
          console.log(comp);
          if (comp.length < 4) {
            comp.push('100%');
            while (comp.length < 4) {
              comp.unshift('0');
            }
          }
          if (convert) {
            let isHSV = !str.match(/hsl/g),
                h = comp[0]+'',
                s = parseFloat(comp[1]),
                l = parseFloat(comp[2]),
                c, x, m;

            if (h.match(/%/)) h = parseFloat(comp[0]) * 3.60;

            if (isHSV) {
              let v = l,
                  hue = (2-s)*v;
              s = s*v/(hue<1 ? hue : 2-hue);
              h *= 360;
              l = hue / 2;
            } else {
              s /= 100;
              l /= 100;
            }

            if (s === 0) {
              r = g = b = comp[2];
            } else {
              h += '';
              if (h.match(/rad/g)) {
                h = Math.round(parseInt(h) * (180 / Math.PI));
              } else if (h.match(/turn/g)) {
                h = Math.round(parseInt(h) * 360);
              } else {
                h = parseInt(h);
              }
              h %= 360;

              c = (1 - Math.abs(2 * l - 1)) * s;
              x = c * (1 - Math.abs((h / 60) % 2 - 1));
              m = l - c/2;
              /*
              if (0 <= h && h < 60) {
                r = c; g = x; b = 0;
              } else if (60 <= h && h < 120) {
                r = x; g = c; b = 0;
              } else if (120 <= h && h < 180) {
                r = 0; g = c; b = x;
              } else if (180 <= h && h < 240) {
                r = 0; g = x; b = c;
              } else if (240 <= h && h < 300) {
                r = x; g = 0; b = c;
              } else if (300 <= h && h < 360) {
                r = c; g = 0; b = x;
              }
              */
              switch (Math.floor(h / 60)) {
                case 0: r = c; g = x; b = 0; break;
                case 1: r = x; g = c; b = 0; break;
                case 2: r = 0; g = c; b = x; break;
                case 3: r = 0; g = x; b = c; break;
                case 4: r = x; g = 0; b = c; break;
                case 5: r = c; g = 0; b = x; break;
              }
              r = Math.round((r + m) * 255);
              g = Math.round((g + m) * 255);
              b = Math.round((b + m) * 255);
              a = 2.55 * parseInt(comp[3]);
            }
          } else {
            comp.forEach((value, index, array) => {
              if (value.match(/%/g)) array[index] = 2.55 * parseFloat(value);
            });
            r = Math.round(parseFloat(comp[0]));
            g = Math.round(parseFloat(comp[1]));
            b = Math.round(parseFloat(comp[2]));
            a = Math.round(parseFloat(comp[3]));
          }

          break;
        case 'hex':
          str = r.replace(/0x|#/g,'').toLowerCase();
          switch (str.length) {
            case 3:
              str = str[0] + str[0] + str[1] + str[1] + str[2] + str[2] + 'ff';
              break;
            case 4:
              str = str[0] + str[0] + str[1] + str[1] + str[2] + str[2] + str[3] + str[3];
              break;
            case 6:
              str += 'ff';
              break;
            default:
              while (str.length < 6) {
                str = '0' + str;
              }
              break;
          }
          r = parseInt(str.slice(0,2), 16);
          g = parseInt(str.slice(2,4), 16);
          b = parseInt(str.slice(4,6), 16);
          a = parseInt(str.slice(6,8), 16);
          break;
      }
    } else {
      /*
      if (r <= 1 && g <= 1 && b <= 1 && (typeof(a) === 'undefined' || a <= 1)) {
        r *= 255;
        g *= 255;
        b *= 255;
        if (typeof(a) !== 'undefined') a *= 255;
      }
      */
    }

    if (typeof(a) === 'undefined') a = 255;

    this.rgba = {
      r: r,
      g: g,
      b: b,
      a: a
    };
  }
  get red() {return this.rgba.r}
  get green() {return this.rgba.g}
  get blue() {return this.rgba.b}
  get alpha() {return this.rgba.a}

  get luma() {
    return (this.red * 0.299 + this.green * 0.587 + this.blue * 0.114) / 255;
  }
  get value() {
    return Math.floor((this.red << 16) + (this.green << 8) + (this.blue));
  }
  get hex() {
    return '#' + ('000000' + this.value.toString(16)).slice(-6);
  }
  get hexA() {
    return this.hex + ('00' + Math.floor(this.alpha).toString(16)).slice(-2);
  }
  get rgb() {
    return 'rgb(' + this.red + ' ' + this.green + ' ' + this.blue + ')';
  }
  get rgbPerc() {
    return 'rgb(' + (100*this.red/255) + '% '
                  + (100*this.green/255) + '% '
                  + (100*this.blue/255) + '%)';
  }

  math(mult, add) {
    if (typeof(mult) === 'undefined') mult = 1;
    if (typeof(add) === 'undefined') add = 0;
    for (let channel in this.rgba) {
      if (this.rgba.hasOwnProperty(channel)) {
        this.rgba[channel] = this.rgba[channel] * mult + add;
      }
    }
  }
  add(x) {
    this.math(1,x);
  }
  sub(x) {
    this.math(1,-x);
  }
  mult(x) {
    this.math(x);
  }
  div(x) {
    this.math(1/x);
  }

}

/*
function hexToRgb(hex) {
  let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}
*/



/// Cartesian functions.

/**
 * Cartesian point.
 * @class Point
 * @type {Object}
 * @property {number} x - X coordinate.
 * @property {number} y - Y coordinate.
 */
export class Point {
  /**
   * @constructs Point
   * @param {number} x - X coordinate.
   * @param {number} y - Y coordinate.
   */
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   * Moves the Point by a distance in a certain direction.
   * @memberof Point#
   * @param {number} ang - Direction to move the point (in radians).
   * @param {number} dist - Distance to move the point.
   */
  applyAngle(ang, dist) {
    this.x += dist * Math.cos(ang),
    this.y += dist * Math.sin(ang)
  }
  /**
   * Returns the distance between this Point and another Cartesian point.
   * @memberof Point#
   * @param {number|Point|Object} x - X coordinate, Point object, or object
   * containing X and Y coordinates.
   * @param {number} [y] - Y coordinate. Ignored if x is not a number.
   * @returns {number}
   */
  distanceTo(x, y) {
    if (x instanceof Point || (valid(x.x) && valid(x.y))) {
      y = x.y;
      x = x.x;
    }
    return Math.sqrt(Math.pow((y-this.y),2) + Math.pow((x-this.x),2));
  }
  /**
   * Returns the angle between this Point and another Cartesian point.
   * @memberof Point#
   * @param {number|Point|Object} x - X coordinate, Point object, or object
   * containing X and Y coordinates.
   * @param {number} [y] - Y coordinate. Ignored if x is not a number.
   * @returns {number} Angle (in radians).
   */
  angleTo(x, y) {
    if (x instanceof Point || (valid(x.x) && valid(x.y))) {
      y = x.y;
      x = x.x;
    }
    return Math.atan2(y - this.y, x - this.x);
  }
}

/**
 * Returns the distance between two Cartesian points.
 * @param {number} x1 - X value of the first coordinate.
 * @param {number} y1 - Y value of the first coordinate.
 * @param {number} x2 - X value of the second coordinate.
 * @param {number} y2 - Y value of the second coordinate.
 */
export function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((y2-y1),2) + Math.pow((x2-x1),2));
}
/**
 * Returns the angle between two Cartesian points.
 * @param {number} x1 - X value of the first coordinate.
 * @param {number} y1 - Y value of the first coordinate.
 * @param {number} x2 - X value of the second coordinate.
 * @param {number} y2 - Y value of the second coordinate.
 * @returns {number} Angle in radians.
 */
export function angle(x1, y1, x2, y2) {
  return Math.atan2(y2-y1, x2-x1);
}



/// Sorting functions.

/**
 * Quicksorts an array in place.
 * @param {Object[]} array - Array to sort.
 * @param {function} [compare] - Sorting rules.
 */
export function quicksort(array, compare) {
	if (array.length <= 1) return array;
  if (!defined(compare)) compare = function (a, b) {return a < b;};

	let left = [],
	    right = [],
      newArr = [],
	    pivot = array.pop(),
	    length = array.length;

  array.forEach((value) => {
    if (compare(value, pivot)) {
			left.push(value);
		} else {
			right.push(value);
		}
  });

  array.splice(0, length);
  array.push(...quicksort(left, compare), pivot, ...quicksort(right, compare));

	return array;
}


/// Extended properties. May deprecate.

/**
 * Converts straight quotes to curly quotes.
 * @deprecated
 */
Object.defineProperty(String.prototype, 'stylizeQuotes', {
  value: function () {
    console.warn('Function String.stylizeQuotes() has been deprecated. Use quotify(String) instead.');
    return quotify(this);
  },
  writable: false
});
/**
 * Swaps two indexes of an array.
 * @param {number} a - Array index to swap.
 * @param {number} b - Array index to swap.
 * @deprecated
 */
Object.defineProperty(Array.prototype, 'swap', {
  value: function (a, b) {
    console.warn('Function Array.swap() has been deprecated. Use swap(Object, a, b) instead.');
    let temp = this[a];
    this[a] = this[b];
    this[b] = temp;
  },
  writable: false
});
/**
 * Returns a random value from the array.
 * @deprecated
 */
Object.defineProperty(Array.prototype, 'random', {
  value: function () {
    console.warn('Function Array.random() has been deprecated. Use randomFromArray(Array) instead.');
    return randomFromArray(this);
  },
  writable: false
});
