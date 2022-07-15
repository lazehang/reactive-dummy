class Reactive {
  state = {};

  dom;

  domCopy;

  listeners = [];

  nativeListeners = ["click", "mouseover"]; // on-click

  functions = {};

  constructor({ el, data = {}, functions = {} }) {
    this.dom = document.querySelector(el);

    this.state = data;

    this.functions = functions;

    this.createDomCopy();

    this.render();

    this.addListeners();

    window.addEventListener("load", () => {
      this.emit("mount");
    });

    return this;
  }

  addListeners() {
    for (const event of this.nativeListeners) {
      this.dom.addEventListener(event, (e) => {
        if (e.target.hasAttribute(`on-${event}`)) {
          console.log("clicked");
          const func = e.target.getAttribute(`on-${event}`);
          if (func in this.functions) {
            this.functions[func]();
          }
        }
      });
    }
  }

  emit(event, payload = null) {
    for (const listener of this.listeners) {
      if (listener.event === event) {
        listener.callback && listener.callback(payload);
      }
    }
  }

  createDomCopy() {
    this.domCopy = this.dom.cloneNode("deep");
  }

  render() {
    this.dom.innerHTML = replaceHtml(this.domCopy.innerHTML, this.state);
  }

  setState(payload) {
    this.state = {
      ...this.state,
      ...payload,
    };
    setTimeout(() => this.render());
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
