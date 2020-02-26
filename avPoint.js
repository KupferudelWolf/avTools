/**
 * Cartesian point.
 * @class AVPoint
 * @type {Object}
 * @property {number} x - X coordinate.
 * @property {number} y - Y coordinate.
 */
export class AVPoint {
  /**
   * @constructs AVPoint
   * @param {number} x - X coordinate.
   * @param {number} y - Y coordinate.
   */
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }
  /**
   * Moves the AVPoint by a distance in a certain direction.
   * @memberof AVPoint#
   * @param {number} ang - Direction to move the point (in radians).
   * @param {number} dist - Distance to move the point.
   */
  applyAngle(ang, dist) {
    this.x += dist * Math.cos(ang);
    this.y += dist * Math.sin(ang);
    return this;
  }
  /**
   * Returns the distance between this AVPoint and another Cartesian point.
   * @memberof AVPoint#
   * @param {number|AVPoint|Object} x - X coordinate, AVPoint object, or object
   * containing X and Y coordinates.
   * @param {number} [y] - Y coordinate. Ignored if x is not a number.
   * @returns {number}
   */
  distanceTo(x, y) {
    if (x instanceof AVPoint || (valid(x.x) && valid(x.y))) {
      y = x.y;
      x = x.x;
    }
    return Math.sqrt(Math.pow((y-this.y),2) + Math.pow((x-this.x),2));
  }
  /**
   * Returns the angle between this AVPoint and another Cartesian point.
   * @memberof AVPoint#
   * @param {number|AVPoint|Object} x - X coordinate, AVPoint object, or object
   * containing X and Y coordinates.
   * @param {number} [y] - Y coordinate. Ignored if x is not a number.
   * @returns {number} Angle (in radians).
   */
  angleTo(x, y) {
    if (x instanceof AVPoint || (valid(x.x) && valid(x.y))) {
      y = x.y;
      x = x.x;
    }
    return Math.atan2(y - this.y, x - this.x);
  }
}
