/**
 * @overview Generic tools for personal use.
 * @author Avoyt
 * @date 2020 February 26
 * @module AV
 */

/// Constants

export const RADIAN = Math.PI * 2;
export const GOLDEN_RATIO = 1.61803398875;

///

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
}

/**
 * @callback arrayCallback
 * @param {*} value - Value of array at index.
 * @param {number} index
 * @param {Object[]} array
 */
/**
 * Asynchronous forEach function.
 * @param {Object[]} array - Array to enumerate.
 * @param {arrayCallback} callback - Callback for enumerated array.
 * @param {function} complete - Callback after the loop is complete.
 */
export async function asyncForEach(array, callback, complete) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
  if (complete) complete();
}

/**
 * @callback jsonCallback
 * @param {string} responseText - JSON value.
 */
/**
 * Loads a JSON file through XMLHttpRequest.
 * @param {string} url - Path to JSON file.
 * @param {jsonCallback} callback - Callback the JSON is loaded.
 */
export function loadJSON(url, callback) {
  let json = new XMLHttpRequest();
  json.overrideMimeType("application/json");
  json.open('GET', url, true);
  json.onreadystatechange = function () {
    if (json.readyState == 4 && json.status == "200") {
      callback(json.responseText);
      json.abort();
    }
  };
  json.send(null);
}

///

/**
 * Adds trailing zeros.
 * @param {number|string} num - Number to add zeros to.
 * @param {number} len - Digits after the decimal point.
 * @param {string} [sym] - Symbol to append; defaults to '0'.
 * @returns {string}
 */
export function pad(num, len, sym) {
  if (!sym || sym === '0') {
    console.warn('Deprecated function: pad(number, length). Use number.toFixed(length) instead.')
  }
  if (len <= 0) return (num+'').slice(0, (num+'.').indexOf('.'));
  sym = sym || '0';
  num += '';
  len += 1;
  if (!num.includes('.')) num += '.';
  while (num.length < num.indexOf('.') + len) num += sym + '';
  return num.slice(0, num.indexOf('.') + len).replace(/\.$/g,'');
}
/**
 * Converts straight quotes to curly quotes.
 * @param {string} txt - String to "quotify".
 * @returns {string}
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
 * @returns {boolean}
 */
export function isDefined(v) {
  if(typeof(v) === 'undefined') return false;
  if (v === null) return false;
  if (typeof(v) === 'number' && isNaN(v)) return false;
  return true;
}
/**
 * Determines if a variable matches a certain type.
 * @param {*} v - Variable to test.
 * @param {string} [type] - The exact type of variable to match.
 * @returns {boolean}
 */
export function valid(v, type) {
  if (typeof(type) === 'string') return typeof(v) === type;
  return isDefined(v);
}
/**
 * Returns a deep copy of an object.
 * @param {Object} obj - Object to clone.
 * @returns {Object}
 */
export function clone(obj) {
  if (typeof obj !== "object" || obj === null) return obj;
  let out = Array.isArray(obj) ? [] : {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      out[key] = clone(obj[key]);
    }
  }
  return out;
}
/**
 * Swaps two indexes of an array or object.
 * @param {Object[]|Object} array - Array or object to swap.
 * @param {number|string} a - Array index or object key to swap.
 * @param {number|string} b - Array index or object key to swap.
 * @returns {Object[]|Object}
 */
export function swap(array, a, b) {
  let temp = array[a];
  array[a] = array[b];
  array[b] = temp;
  return array;
}



/// Mathematical functions.

/**
 * Returns a boolean value: either "true" or "false".
 * @returns {boolean}
 */
export function randomBoolean() {
  return Math.random() < 0.5;
}
/**
 * Returns the average of all numbers passed into the function.
 * @param {...number}
 * @returns {number}
 */
export function average() {
  let args = [];
  for (let i = 0; i < arguments.length; i++) args.push(arguments[i]);
  return args.reduce((acc, val) => acc + val) / args.length;
}
/**
 * Linear interpolation function.
 * @param {number} a - Starting value.
 * @param {number} b - Ending value.
 * @param {number} t - Interpolation value, from 0 (a) to 1 (b).
 * @returns {number}
 */
export function lerp(a, b, t) {
  return a * (1 - t) + b * t;
}
/**
 * Returns the median of all numbers passed into the function. If three numbers
 * are passed, then mid() can act as a limiting function.
 * @summary Returns the median of all numbers passed into the function.
 * @param {...number}
 * @returns {number}
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
  }
  return closest;
}
/**
 * Returns x rounded to the nearest y.
 * @summary Linearly maps a number from one scale to another.
 * @param {number} x - Number to round.
 * @param {number} [y] - Number to round to.
 * @param {number} [f] - Math function to use. Defaults to 'floor'.
 * @returns {number}
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
 * @param {boolean} isClamped - If true, value will clamp between outMin and outMax.
 * @returns {number}
 */
export function map(num, inMin, inMax, outMin, outMax, isClamped) {
  if (!valid(outMax)) {
    console.error('avTools Error: Insufficient arguments for map().');
    return NaN;
  }
  if (inMax === inMin) return outMin;
  let out = (num - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
  if (isClamped) out = mid(out, outMin, outMax);
  return out;
}
/**
 * Returns a random value from the input array.
 * @param {Object[]} array
 * @returns {number}
 */
export function randomFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}



/// Cartesian functions.

/**
 * Returns the distance between two Cartesian points.
 * @param {number} x1 - X value of the first coordinate.
 * @param {number} y1 - Y value of the first coordinate.
 * @param {number} x2 - X value of the second coordinate.
 * @param {number} y2 - Y value of the second coordinate.
 * @returns {number}
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
 * @returns {Object[]}
 */
export function quicksort(array, compare) {
	if (array.length <= 1) return array;
  if (!isDefined(compare)) compare = function (a, b) {return a < b;};

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
