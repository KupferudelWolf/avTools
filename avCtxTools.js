export default class CtxTools {
  constructor (ctx) {
    let poly = function (ctx, vectors) {
          ctx.beginPath();
          let xK = '0', yK = '1';
          if (typeof(vectors[0].x) !== 'undefined') {
            xK = 'x';
            yK = 'y';
          }
          $.each(vectors, (index, value) => {
            ctx.lineTo(value[xK], value[yK]);
          });
          ctx.closePath();
        },
        funcTextWrap = function (ctx, str, x, y, width, prop, func) {
          let thisLine, firstLine = true;
          if (typeof(width) === 'undefined') {
            ctx[func](str, x, y);
            return;
          }
          width = Math.abs(width);

          prop = prop || {};
          if (typeof(prop.leading) === 'undefined') {
            prop.leading = parseInt(ctx.font);
          }
          if (typeof(prop.para_after) === 'undefined') {
            prop.para_after = prop.leading;
          }
          if (typeof(prop.para_indent) === 'undefined') {
            prop.para_indent = 0;
          }

          str.replace(/[\n\r]/g,' \r ').split(' ').forEach((word) => {
            let xOff = 0;
            if (firstLine) xOff = prop.para_indent;
            if (word !== '\r' && ctx.measureText(thisLine + ' ' + word).width < width - xOff) {
              // This word fits on the line.
              if (thisLine) {
                thisLine += ' ' + word;
              } else {
                thisLine = word;
              }
            } else {
              // This word does not fit on the line.
              if (thisLine) {
                ctx[func](thisLine, x + xOff, y);
                if (word === '\r') {
                  y += prop.para_after;
                  firstLine = true;
                } else {
                  y += prop.leading;
                  firstLine = false;
                }
              }
              thisLine = word;
              if (word === '\r') thisLine = null;
            }
          });
          if (thisLine) {
            ctx[func](thisLine, x, y);
            y += prop.leading;
          }
          return y;
        };

    this.func = {
      isExtended: true,
      clear: function (c) {
        let dim = [0, 0, this.canvas.width, this.canvas.height];
        this.clearRect(...dim);
        if (c) {
          this.fillStyle = c;
          this.fillRect(...dim);
        }
      },
      fillPixel: function (x, y, color) {
        if (typeof(c) === 'string') {
          this.fillStyle = color;
        }
        this.fillRect(x, y, 1, 1);
      },
      strokeLine: function (x1, y1, x2, y2) {
        this.beginPath();
        this.moveTo(x1, y1);
        this.lineTo(x2, y2);
        this.closePath();
        this.stroke();
      },
      pathCirc: function (x, y, radius) {
        this.beginPath();
        this.arc(x, y, radius, 0, 2 * Math.PI);
        this.closePath();
      },
      fillCirc: function (x, y, radius) {
        this.pathCirc(x, y, radius);
        this.fill();
      },
      strokeCirc: function (x, y, radius) {
        this.pathCirc(x, y, radius);
        this.stroke();
      },
      fillRegPoly: function (x, y, radius, sides, rotation) {
        if (typeof(rotation) === 'undefined') rotation = 0;
        this.beginPath();
        for (let i=0; i<2; i+=2/sides) {
          let angle = Math.PI * i + rotation,
              xx = x + radius * Math.sin(angle),
              yy = y - radius * Math.cos(angle);
          this.lineTo(xx, yy);
        }
        this.closePath();
        this.fill();
      },
      strokePoly: function (vectors) {
        poly(this, vectors);
        this.stroke();
      },
      fillPoly: function (vectors) {
        poly(this, vectors);
        this.fill();
      },
      graph: function (x, y, length, func) {
        if (typeof(func) !== 'function') {
          console.error('Graph function is invalid.');
          return;
        }
        let fy = func(0);
        this.moveTo(x, y+fy);
        for (let fx = 1; fx < length; fx++) {
          fy = func(fx);
          this.lineTo(x+fx, y+fy);
        }
      },

      fillTextWrap: function (str, x, y, width, prop) {
        return funcTextWrap(this, str, x, y, width, prop, 'fillText');
      },
      strokeTextWrap: function (str, x, y, width, prop) {
        return funcTextWrap(this, str, x, y, width, prop, 'strokeText');
      },

      clipRect: function (x, y, w, h) {
        if (typeof(x) === 'undefined') x = 0;
        if (typeof(y) === 'undefined') y = 0;
        if (typeof(w) === 'undefined') w = this.canvas.width - x;
        if (typeof(h) === 'undefined') h = this.canvas.height - y;
        this.beginPath();
        this.rect(x, y, w, h);
        this.closePath();
        this.clip();
      }
      //
    };

    if (arguments.length <= 0) return;
    return this.extend(ctx);
  }

  parse(ctx) {
    if (typeof(ctx) === 'string') ctx = document.getElementById(ctx);
    if (!ctx) return console.error('CtxTools: Canvas or context not found.');

    if (ctx.constructor === HTMLCanvasElement) {
      return ctx = canvas.getContext('2d');
    } else if (ctx.constructor === WebGLRenderingContext) {
      return console.error('CtxTools: Could not get 2D context. Input context is WebGL.');
    } else if (ctx.constructor !== CanvasRenderingContext2D) {
      return console.error('CtxTools: Could not get 2D context.');
    }
    return ctx;
  }

  extend(ctx) {
    ctx = this.parse(ctx);
    if (!ctx) return;
    $.each(this.func, (index, value) => {
      Object.getPrototypeOf(ctx)[index] = value;
    });
    return ctx;
  }
}
