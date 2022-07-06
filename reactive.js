class Reactive {
  state = {};

  dom;

  vDom;

  listeners = [];

  nativeListeners = ["click", "mouseover"];

  functions = {};

  constructor({ el, data = {}, functions = {} }) {
    this.dom = document.querySelector(el);

    this.state = data;

    this.functions = functions;

    this.createVDom();

    this.render();

    window.addEventListener("load", () => {
      this.emit("mount");
    });

    return this;
  }

  addListeners() {
    for (const event of this.nativeListeners) {
      const nodes = this.dom.querySelectorAll(`[on-${event}]`);
      [...nodes].forEach((el) => {
        const func = el.attributes[`on-${event}`].nodeValue;
        if (func in this.functions) {
          el.addEventListener(event, this.functions[func]);
        }
      });
    }
  }

  emit(event) {
    for (const listener of this.listeners) {
      if (listener.event === event) {
        listener.callback && listener.callback(this);
      }
    }
  }

  createVDom() {
    this.vDom = this.dom.cloneNode("deep");
  }

  render() {
    this.dom.innerHTML = replaceHtml(this.vDom.innerHTML, this.state);
    this.addListeners();
  }

  setState(payload) {
    this.state = {
      ...this.state,
      ...payload,
    };
    this.render();
  }

  on(event, callback) {
    this.listeners = [
      ...this.listeners,
      {
        event,
        callback,
      },
    ];
  }
}

function replaceHtml(template, data) {
  const pattern = /{\s*(\w+?)\s*}/g; // {property}
  return template.replace(pattern, (_, token) => data[token] || "");
}
