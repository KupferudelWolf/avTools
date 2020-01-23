/**
 * Simple GUI.
 * @module av_Gui
 * @author Avoyt Doukas
 */

/**
 * @class
 * @classdesc GUI.
 */
export default class Gui {
  constructor(prop) {
    prop = prop || {};
    this.parent = prop.parent;

    this.updateElements = [];

    for (let methodName of Object.getOwnPropertyNames(Gui.prototype)) {
      if (methodName !== "constructor") {
        this[methodName] = this[methodName].bind(this);
      }
    }

    this.update();

    this.div = document.getElementById('av_gui');
    if (this.div === null) {
      this.div = document.createElement('DIV');
      this.div.id = 'av_gui';
      $(document).ready(() => {
        document.body.appendChild(this.div);
      });
    }

    let style = document.getElementById('av_gui_style');
    if (style === null) {
      style = document.createElement('STYLE');
      style.id = 'av_gui_style';
      style.innerHTML = (`/* av_Gui Stylesheet */
        @import url('https://fonts.googleapis.com/css?family=Raleway&display=swap');
        #av_gui {
          position: absolute;
          font-family: 'Raleway', sans-serif;
          font-size: small;
          top: 12px;
          left: 12px;
          padding: 4px;
          border: 3px solid white;
          color: white;
          background-color: black;
          opacity: ` + (prop.opaque ? 1 : 0) + `;
          display: grid;
          width: 33%;
          grid-template-columns: 20% 80%;
          transition: opacity 0.5s;
        }
        #av_gui:hover {
          opacity: 1;
        }
        #av_gui.slider {
          -webkit-appearance: none;
          width: 100%;
          height: 12px;
          background: black;
          outline: none;
        }

        #av_gui.slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 12px;
          height: 12px;
          background: white;
          cursor: pointer;
        }`).replace(/        /g,'');
      document.head.appendChild(style);
    }
  }

  newSlider(name, prop) {
    prop = prop || {};
    let func = prop.onInput || function () {},
        funcIntern = function () {},
        min = prop.min,
        max = prop.max,
        val = prop.value,
        step = prop.step,
        unit = prop.unit,
        obj = prop.parent || this.parent,
        key = prop.key,
        showValue = typeof(prop.showValue)==='undefined' || prop.showValue,
        elementLabel = document.createElement('DIV'),
        elementSlider = document.createElement('INPUT'),
        pad = function (num, len, sym) {
          if (len <= 0) return (num+'').slice(0, (num+'.').indexOf('.'));
          sym = sym || '0';
          num += '';
          len += 1;
          if (!num.includes('.')) num += '.';
          while (num.length < num.indexOf('.') + len) num += sym + '';
          return num.slice(0, num.indexOf('.') + len).replace(/\.$/g,'');
        },
        getValText = function (v) {
          if (!showValue) return '';
          let len = (step+'.').split('.')[1].length;//Math.log(1/(step%1 || 1)) - 2;
          if (unit === '%') {
            v *= 100;
            len -= 2;
          }
          v = pad(v, len);
          if (unit) {
            if (unit === '$') {
              v = unit + v;
            } else {
              v += unit;
            }
          }
          return ': ' + v;
        };
    if (obj && key) {
      funcIntern = function (value) {
        obj[key] = value;
      };
      val = obj[key];
    }
    if (!step) {
      // Determine step by input values' decimal places.
      let arr = [1];
      if (val) arr.push(10 ** -(val.toString().split('.')[1] || '').length || 1);
      if (min) arr.push(10 ** -(min.toString().split('.')[1] || '').length || 1);
      if (max) arr.push(10 ** -(max.toString().split('.')[1] || '').length || 1);
      step = Math.min(...arr);
    }
    if (typeof(min)==='undefined') {min = 0;}
    if (typeof(max)==='undefined') {max = min + step * 10;}
    if (min > max) {
      let temp = min;
      min = max;
      max = temp;
    }
    if (typeof(val)==='undefined') {val = ((max-min)/2 + min);}
    elementSlider.type = 'range';
    elementSlider.name = name+'';
    elementSlider.step = step+'' || '1';
    elementSlider.min = min+'';
    elementSlider.max = max+'';
    elementSlider.value = val+'';
    elementSlider.className = 'slider';
    elementSlider.oninput = function () {
      elementLabel.innerHTML = name + getValText(this.value);
      funcIntern(this.value);
      func(this.value);
    };
    elementLabel.innerHTML = name + getValText(val);
    elementLabel.style['padding-right'] = '2px';
    elementLabel.style['text-align'] = 'right';
    this.div.appendChild(elementLabel);
    this.div.appendChild(elementSlider);

    elementSlider.label = elementLabel;

    this.updateElements.push(elementSlider);
    return elementSlider;
  }

  newDivider(a, b) {
    let txt = [a, b];
    for (let i=0; i<2; i++) {
      let spacer = document.createElement('DIV');
      spacer.style['margin-top'] = '2px';
      let align;
      switch (i) {
        case 0: align = 'right'; break;
        case 1: align = 'center'; break;
        default: align = 'left'; break;
      }
      spacer.style['text-align'] = align;
      spacer.innerHTML = txt[i] || '<br>';
      this.div.appendChild(spacer);
    }
  }

  update() {
    this.updateElements.forEach((element) => {
      if (element.update) {
        element.update();
      }
      if (element.value) {
        let l = element.oninput();
        if (typeof(l) === 'undefined') {
          l = element.value;
        } else {
          element.label.innerHTML = element.name + ' (' + l + ')';
        }
      }
    });

    setTimeout(this.update, 10);
  }
}
