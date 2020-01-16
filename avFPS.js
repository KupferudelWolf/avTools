export default class AvFPS {
  constructor(target) {
    this.target = target;
    this.stream = [];
    this.streamLength = 50;
    this.streamMax = target || 0;
    this.width = 120;
    this.height = 100;
    this.subHeight = 30;

    this.css();

    this.start();
  }

  css() {
    let style;
    this.div = document.getElementById('av_fps');
    if (this.div === null) {
      this.div = document.createElement('DIV');
      this.textDisplay = document.createElement('DIV');
      this.canvas = document.createElement('CANVAS');
      this.div.id = 'av_fps';
      this.div.style['z-index'] = 999;
      this.textDisplay.id = 'av_fps_textDisplay';
      this.textDisplay.display = 'block';
      this.textDisplay.style.font = (this.subHeight * 3/4) + 'px monospace';
      this.textDisplay.style['text-align'] = 'right';
      this.canvas.id = 'av_fps_canvas';
      //this.canvas.hidden = 'true';
      this.canvas.width = this.width;
      this.canvas.height = this.height - this.subHeight;
      this.div.appendChild(this.canvas);
      this.div.appendChild(this.textDisplay);
      document.body.appendChild(this.div);
    } else {
      this.textDisplay = document.getElementById('av_fps_textDisplay');
      this.canvas = document.getElementById('av_fps_canvas');
    }
    this.ctx = this.canvas.getContext('2d');

    style = document.getElementById('av_fps_style');
    if (style === null) {
      let nativeIndent = '\
        ';
      style = document.createElement('STYLE');
      style.id = 'av_fps_style';
      style.innerHTML = (`/* av_Gui Stylesheet */
        #av_fps {
          position: absolute;
          font-size: small;
          width: ` + this.width + `px;
          height: ` + this.subHeight + `px;
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

  start() {
    this.time = Date.now();
  }

  loop() {
    if (!this.running) return;
    this.running = false;
    let delta = this.delta,
        framerate = this.fps;
    //if (framerate >= 1000) framerate = this.target || 0;
    this.streamMax = Math.max(this.streamMax, framerate);
    this.stream.push(framerate);
    while (this.stream.length > this.streamLength) {
      this.stream.shift();
    }
    //console.log(delta, Math.floor(framerate) + ' fps');
    this.draw();
    this.start();
    //this.time = Date.now();
  }

  draw() {
    let canvas = this.canvas,
        ctx = this.ctx,
        max = this.streamMax,
        incr = 10 * Math.floor(Math.log10(max)) || 1,
        w = canvas.width / this.streamLength,
        h = (canvas.height) / max,
        fps = this.fps;
    if (!ctx || !h || !this.div) return;
    ctx.lineJoin = 'bevel';
    ctx.fillStyle = '#3f3f3f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    this.ctx.lineWidth = 1;
    ctx.strokeStyle = '#7f7f7f';
    for (let y = 0; y <= max; y += incr) {
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - y * h);
      ctx.lineTo(canvas.width, canvas.height - y * h);
      ctx.stroke();
    }
    this.ctx.lineWidth = 2;
    if (this.target) {
      let y = canvas.height - h * this.target;
      ctx.strokeStyle = '#007f1f';
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    ctx.strokeStyle = '#ffffff';
    let offset = this.streamLength - this.stream.length,
        newMax = this.target || 0;
    ctx.beginPath();
    this.stream.forEach((value, index) => {
      let x = w * (index + offset),
          y = canvas.height - h * value;
      ctx.lineTo(x,y);
      newMax = Math.max(newMax, value);
    });
    ctx.stroke();
    if (newMax) this.streamMax = newMax;
    this.textDisplay.innerHTML = Math.floor(fps) + ' fps';
    if (this.target && fps < this.target) {
      this.textDisplay.style.color = '#bf003f';
    } else {
      this.textDisplay.style.color = '#ffffff';
    }
    ctx.lineJoin = 'miter';
  }

  get delta() {
    return Date.now() - this.time;
  }

  get fps() {
    let delta = this.delta;
    if (!delta) return this.target || 0;
    return 1000 / delta;
  }

  get time() {
    return this.lastTime;
  }
  set time(value) {
    this.running = true;
    this.lastTime = value;
  }
}
