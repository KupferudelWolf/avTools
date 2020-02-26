export default class AVColor {
  constructor (r, g, b, a) {
    if (r instanceof AVColor) {
      let obj = r;
      r = obj.red;
      g = obj.green;
      b = obj.blue;
      if (obj.alpha) a = obj.alpha;
    } else if (typeof(r) === 'object') {
      let obj = r;
      if (valid(obj.r)) {
        r = obj.r;
        g = obj.g;
        b = obj.b;
        if (obj.a) a = obj.a;
      }
    }
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
      if (r+g+b > 0 && r <= 1 && g <= 1 && b <= 1 && (typeof(a) === 'undefined' || a <= 1)) {
        r *= 255;
        g *= 255;
        b *= 255;
        if (typeof(a) !== 'undefined') a *= 255;
      }
    }

    if (typeof(a) === 'undefined') a = 255;

    this.rgba = {
      r: r,
      g: g,
      b: b,
      a: a
    };
  }
  get red() {return this.rgba.r;}
  get green() {return this.rgba.g;}
  get blue() {return this.rgba.b;}
  get alpha() {return this.rgba.a;}

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
      if (this.rgba.hasOwnProperty(channel) && channel !== 'a') {
        this.rgba[channel] = this.rgba[channel] * mult + add;
      }
    }
    return this;
  }
  add(x) {
    return this.math(1,x);
  }
  sub(x) {
    return this.math(1,-x);
  }
  mult(x) {
    return this.math(x);
  }
  div(x) {
    return this.math(1/x);
  }

}
