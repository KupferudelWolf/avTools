export default class Tau {
  constructor(rad) {
    const RADIAN = 2 * Math.PI;
    let app = this,
        func = {
          toDegrees() {
            return this.value * 360;
          }
          toDeg() {
            return this.toDegrees();
          }
          toRadians() {
            return this.value * RADIAN;
          }
          toRadians() {
            return this.toRadians();
          }
        };

    //

    this.value = rad / RADIAN;

    $.each(func, (index, value) => {
      Object.defineProperty(this, index, {
        value: value,
        writable: false
      });
    });
  }
}
