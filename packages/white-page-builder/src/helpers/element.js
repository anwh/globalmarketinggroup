import { forEachObj } from './index';
import { rootClassName } from '../constants';

export const createElement = (el, attributes = {}, innerHTML = '') => {
  const elem = document.createElement(el);

  forEachObj(attributes, (key, value) => {
    elem.setAttribute(key, value);
  });

  elem.innerHTML = innerHTML;

  return elem;
};

export const createButton = (name, className, title, text, role = '') => {
  const icons = {
    add: 'playlist_add',
    edit: 'edit',
    delete: 'delete_forever',
    setting: 'settings_applications',
    save: 'save',
    close: 'close',
  };

  const button = createElement(
    'button',
    {
      class: className ? `${rootClassName}__${className}` : '',
      title: title,
      type: 'button',
    },
    `<i class='svg'>${icons[name]}</i>` + (text ? `<span>${text}</span>` : '')
  );

  if (role) {
    button.dataset.role = role;
  }

  return button;
};
