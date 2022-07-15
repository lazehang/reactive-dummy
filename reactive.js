class Reactive {
  state = {};

  dom;

  listeners = [];

  nativeListeners = ["click", "mouseover", "focus", "blur"]; // @click

  functions = {};

  constructor({ el, data = {}, functions = {} }) {
    this.dom = document.querySelector(el);

    this.state = observe(data, () => this.render());

    this.functions = functions;

    this.render();

    this.registerListeners();

    this.emit("mount");

    return this;
  }

  registerListeners() {
    walkDom(this.dom, (el) => {
      for (const event of this.nativeListeners) {
        if (!el.hasAttribute(`@${event}`)) continue;

        const func = el.getAttribute(`@${event}`);

        if (!this.functions.hasOwnProperty(func)) continue;

        el.addEventListener(event, this.functions[func]);
      }
    });
  }

  emit(event, payload = null) {
    for (const listener of this.listeners) {
      if (listener.event === event) {
        listener.callback && listener.callback(payload);
      }
    }
  }

  render() {
    walkDom(this.dom, (el) => {
      if (el.hasAttribute("r-text")) {
        const expression = el.getAttribute("r-text");
        if (!this.state[expression]) return;
        el.innerText = this.state[expression];
      }
    });
  }

  setState(payload) {
    for (const key in payload) {
      if (!this.state.hasOwnProperty(key)) {
        console.error(`${key} does not exist in state!`);
        continue;
      }
      this.state[key] = payload[key];
    }
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

  destroy() {
    this.emit("onDestroy");
  }
}

function walkDom(el, callback) {
  callback(el);

  el = el.firstElementChild;

  while (el) {
    walkDom(el, callback);
    el = el.nextElementSibling;
  }
}

function observe(data, callback = () => {}) {
  return new Proxy(data, {
    set(target, key, value) {
      target[key] = value;
      callback();
      return true;
    },
  });
}
