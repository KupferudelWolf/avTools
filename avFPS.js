export default (function () {
  let PROP = {
        boxplot: false,
        top: 0,
        width: 120,
        height: 100,
        graphHeight: 75,
        textHeight: 25,
        step: 500,
        streamLength: 50
      },

      CANVAS, CTX, DIV, TEXT_DISPLAY,

      drawHorzLine = function (ax, bx, y) {
        CTX.beginPath();
        CTX.moveTo(ax, y);
        CTX.lineTo(bx, y);
        CTX.stroke();
      },
      getAverage = function (arr) {
        return arr.reduce((a, b) => a + b, 0) / arr.length;
      },
      setCSS = function () {
        let style = document.getElementById('av_fps_style');
        if (style === null) {
          let nativeIndent = '\
            ';
          style = document.createElement('STYLE');
          style.id = 'av_fps_style';
          style.innerHTML = (`/* av_Gui Stylesheet */
            #av_fps {
              position: absolute;
              top: ` + PROP.top + `;
              width: ` + PROP.width + `px;
              height: ` + PROP.textHeight + `px;
              font-size: small;
              margin: 20px;
              padding-top: ` + (PROP.height - PROP.textHeight) + `px;
              border: 2px solid white;
              color: white;
              background-color: black;
              opacity: 1;
              transition: opacity 0.5s;
            }`).replace(new RegExp(nativeIndent,'g'),'');
          document.head.appendChild(style);
        }

        DIV = document.getElementById('av_fps');
        if (DIV === null) {
          DIV = document.createElement('DIV');
          TEXT_DISPLAY = document.createElement('DIV');
          CANVAS = document.createElement('CANVAS');
          DIV.id = 'av_fps';
          DIV.style['z-index'] = 999;
          TEXT_DISPLAY.id = 'av_fps_textDisplay';
          TEXT_DISPLAY.display = 'block';
          TEXT_DISPLAY.style.font = (PROP.textHeight * 3/4) + 'px monospace';
          TEXT_DISPLAY.style['text-align'] = 'right';
          CANVAS.id = 'av_fps_canvas';
          //CANVAS.hidden = 'true';
          CANVAS.width = PROP.width;
          CANVAS.height = PROP.height - PROP.textHeight;
          DIV.appendChild(CANVAS);
          DIV.appendChild(TEXT_DISPLAY);
          document.body.appendChild(DIV);
        } else {
          TEXT_DISPLAY = document.getElementById('av_fps_textDisplay');
          CANVAS = document.getElementById('av_fps_canvas');
        }
        CTX = CANVAS.getContext('2d');
      };

<<<<<<< HEAD
    style = document.getElementById('av_fps_style');
    if (style === null) {
      let nativeIndent = '\
        ';
      style = document.createElement('STYLE');
      style.id = 'av_fps_style';
      style.innerHTML = (`/* av_Gui Stylesheet */
        #av_fps {
          position: absolute;
          top: 0%;
          width: ` + this.width + `px;
          height: ` + this.subHeight + `px;
          font-size: small;
          margin: 20px;
          padding-top: ` + (this.height - this.subHeight) + `px;
          border: 2px solid white;
          color: white;
          background-color: black;
          opacity: 1;
          transition: opacity 0.5s;
        }`).replace(new RegExp(nativeIndent,'g'),'');
      document.head.appendChild(style);
    }
  }
=======
>>>>>>> 2cb49a718a3ed06348f8f2959bf75dd9b7d40197

  return class AvFPS {
    constructor(target, prop) {
      this.averageFramerate = [];
      this.stream = [];
      this.streamMax = (target + 10) || 1;
      this.target = target;
      this.timeStart = Date.now();

      if (typeof(prop) === 'object') {
        let ratio = PROP.textHeight / PROP.graphHeight,
            defs = [
              typeof(prop.height) !== 'undefined',
              typeof(prop.graphHeight) !== 'undefined',
              typeof(prop.textHeight) !== 'undefined'
            ];
        $.each(PROP, function (key) {
          let value = prop[key];
          if (typeof(value) !== 'undefined') PROP[key] = value;
        });
        if (defs.reduce((a, b) => a + b, 0) > 0) {
          if (defs[0] && !defs[1] && !defs[2]) {
            PROP.textHeight = Math.round(PROP.height * ratio);
            PROP.graphHeight = PROP.height - PROP.textHeight;
          } else if (defs[1] && defs[2]) {
            PROP.height = prop.graphHeight + prop.textHeight;
          } else {
            if (!defs[1]) PROP.graphHeight = prop.height - prop.textHeight;
            if (!defs[2]) PROP.textHeight = prop.height - prop.graphHeight;
          }
        }
      }
      if (!isNaN(PROP.top * 1)) PROP.top += 'px';
      if (PROP.streamLength * 2 > PROP.width) PROP.boxplot = false;

      setCSS();
      this.start();
    }

    get interval() {
      return Math.floor((Date.now() - this.timeStart) / PROP.step);
    }
    get delta() {
      return Date.now() - this.time;
    }
    get fps() {
      let delta = this.delta;
      if (!delta) return this.target || 0;
      return 1000 / (delta || 0.001);
    }
    get time() {
      return this.lastTime;
    }
    set time(value) {
      this.running = true;
      this.lastTime = value;
    }

    start() {
      this.time = Date.now();
      this.lastInterval = this.interval;
    }

    loop() {
      if (!this.running) return;
      this.running = false;
      let delta = this.delta,
          framerate = this.fps,
          index = Math.max(this.stream.length - 1, 0);
      if (this.interval > this.lastInterval) {
        /*let ave = getAverage(this.averageFramerate);
        if (ave) {
          this.stream[index] = {
            ave: ave,
            min: this.minVal,
            max: this.maxVal
          }
        }*/
        //if (ave > this.streamMax) {
          //this.streamMax = ave;
          //this.updateGradient();
        //}
        this.stream.push({
          ave: framerate,
          min: framerate,
          max: framerate
        });
        this.lastInterval = this.interval;
        this.averageFramerate = [];
      } else {
        if (!this.stream[index]) this.stream[index] = {};
        this.averageFramerate.push(framerate);
        this.stream[index].ave = getAverage(this.averageFramerate);
        this.stream[index].min = Math.min(this.stream[index].min, framerate);
        this.stream[index].max = Math.max(this.stream[index].max, framerate);
      }
      while (this.stream.length > PROP.streamLength + 1) {
        this.stream.shift();
      }
      this.draw();
      this.start();
    }

    updateGradient() {
      //
    }

    draw() {
      let max = this.streamMax,
          incr = 10 * Math.floor(Math.log10(max)) || 1,
          w = CANVAS.width / PROP.streamLength,
          h = CANVAS.height / max,
          fps = 0,//this.fps,
          highest = 1,
          offset;
      if (!CTX || !h || !DIV) return;
      CTX.lineJoin = 'bevel';
      CTX.fillStyle = '#3f3f3f';
      CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);
      CTX.lineWidth = 1;
      CTX.strokeStyle = '#7f7f7f';
      for (let y = 0; y <= max; y += incr) {
        drawHorzLine(0, CANVAS.width, CANVAS.height - y * h);
      }
      CTX.lineWidth = 2;
      if (this.target) {
        CTX.strokeStyle = '#007f1f';
        drawHorzLine(0, CANVAS.width, CANVAS.height - h * this.target);
      }
      CTX.strokeStyle = '#ffffff';
      CTX.fillStyle = '#7f7f7f';
      offset = 1 + PROP.streamLength - this.stream.length;
      CTX.beginPath();
      this.stream.forEach((value, index, array) => {
        if (index < array.length - 1) {
          fps = value.ave;
          highest = Math.max(fps, highest);
        }
        let x = w * (index + offset),
            y = CANVAS.height - h * value.ave;
        CTX.lineTo(x, y);
        if (PROP.boxplot) {
          highest = Math.max(value.max, highest);
          CTX.fillRect(
            x, CANVAS.height - h * value.min,
            2, value.min - value.max);
        }
      });
      CTX.stroke();
      this.streamMax = Math.max(this.target + 10, highest);
      TEXT_DISPLAY.innerHTML = Math.floor(fps) + ' fps';
      if (this.target && fps < this.target) {
        TEXT_DISPLAY.style.color = '#bf003f';
      } else {
        TEXT_DISPLAY.style.color = '#ffffff';
      }
      CTX.lineJoin = 'miter';
    }
  }
})();
