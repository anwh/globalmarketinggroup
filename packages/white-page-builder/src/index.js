import { Builder } from './classes/builder';
import { checkSelector } from './helpers';

export const PageBuilder = {
  editors: {},
  create: function (selector, options) {
    try {
      checkSelector(selector);
    } catch (e) {
      console.error(e.message);
      return false;
    }

    const builder = new Builder(selector, options);
    builder.init();

    this.editors[options.id] = builder;
  },
  getContent: function (id) {
    if (this.editors[id]) {
      return this.editors[id].getContent();
    } else {
      console.error(`Didn't find plugin with id '${id}'`);
    }
  },
  rebuild: function (id) {
    this.editors[id].rebuild();
  },
};

if (typeof window === 'undefined') {
  global.PageBuilder = PageBuilder;
} else {
  window.PageBuilder = PageBuilder;
}

if (!Element.prototype.matches) {
  Element.prototype.matches =
    Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function (s) {
    let el = this;

    do {
      if (el.matches(s)) {
        return el;
      }
      el = el.parentElement || el.parentNode;
    } while (el !== null && el.nodeType === 1);
    return null;
  };
}
