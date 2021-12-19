export function on(elem, event, func) {
  if (elem.addEventListener) {
    elem.addEventListener(event, func);
  } else {
    elem.attachEvent('on' + event, func);
  }
}

export function forEachArr(arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], arr);
  }
}

export function forEachObj(obj, callback) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      callback(prop, obj[prop]);
    }
  }
}

export function checkSelector(selector) {
  if (typeof tinymce === 'undefined') {
    throw Error(`PageBuilder: Didn't find tinymce. Please connect tinymce.`);
  }

  if (selector === undefined || selector.length === 0) {
    throw Error(`PageBuilder: Didn't find selector`);
  } else if (selector.length > 1) {
    throw Error(
      `PageBuilder: Please use individual selector, not more.
        You use ` +
        selector.length +
        ` selectors`
    );
  }
}
