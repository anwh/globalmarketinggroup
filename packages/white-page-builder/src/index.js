import PageBuilder from "./classes/page-builder";

let id = 0;
const pageBuilder = {
  editors: {},
  create: function(selector, options) {
    try {
      checkSelector(selector);
    } catch (e) {
      console.error(e.message);
      return false;
    }

    const list = new PageBuilder(selector, options);
    list._init();
    this.editors[list.className + "_" + id] = list;
    id += id;
    return list;
  },
  getContent: function(id) {
    if (this.editors[id]) {
      return this.editors[id]._getContent();
    } else {
      console.error(`Didn't find plugin with id '${id}'`);
    }
  },
  rebuild: function(id) {
    this.editors[id]._rebuild();
  }
};

function checkSelector(selector) {
  if (typeof tinymce === "undefined") {
    throw Error(`PageBuilder: Didn't find tinymce. Please connect tinymce.`);
  }

  if (selector === undefined || selector.length === 0) {
    throw Error(`PageBuilder: Didn't find selector`);
  } else if (selector.length > 1) {
    throw Error(`PageBuilder: Please use individual selector, not more.
        You use ` + selector.length + ` selectors`);
  }
}


if (typeof window === "undefined") {
  global.pageBuilder = pageBuilder;
} else {
  window.pageBuilder = pageBuilder;
}

if (!Element.prototype.matches) {
  Element.prototype.matches = Element.prototype.msMatchesSelector ||
    Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
  Element.prototype.closest = function(s) {
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
