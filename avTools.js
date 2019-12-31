/** @overview Generic tools for personal use.
 * @author Avoyt
 * @date 2019 December 31
 * @module AV
 */

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
 * @param {string} [type] - The exact type of variable to match.
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
  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
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
  for (var i = 0; i < arguments.length; i++) args.push(arguments[i]);
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
  constructor(x, y) {
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
