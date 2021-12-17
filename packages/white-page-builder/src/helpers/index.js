export function forEachArr(arr, callback) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i], arr);
  }
}

export function on(elem, event, func) {
  if (elem.addEventListener) {
    elem.addEventListener(event, func);
  } else {
    elem.attachEvent("on" + event, func);
  }
}

export function forEachObj(obj, callback) {
  for (const prop in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      callback(prop, obj[prop]);
    }
  }
}