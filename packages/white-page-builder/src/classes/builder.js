import { defaults } from '../configs';
import { forEachArr, forEachObj, on } from '../helpers';
import { createButton, createElement } from '../helpers/element';
import {
  bodyClassName,
  editorClassName,
  menuClassName,
  rootClassName,
  rowClassName,
  textareaEditorClassName,
} from '../constants';

export class Builder {
  constructor(selector, options) {
    this.selector = selector.length > 0 ? selector[0] : selector;

    const customOptions = options || {};
    this.options = { ...defaults, ...customOptions };
  }

  init() {
    this._changeSelector();
    this._createInterface();
    this._createBody();
    if (this.options.edit) {
      this._createMenu();
    }
    this._createEditor();
    this._createRow();
    this._clickDoc();
  }

  _changeSelector() {
    this.value =
      this.selector.value !== undefined
        ? this.selector.value
        : this.selector.innerHTML;

    this.selector.style.display = 'none';

    const trans = {
      rowclasses: 'rowClasses',
      colclasses: 'colClasses',
    };

    forEachObj(this.selector.dataset, (key, value) => {
      if (trans[key]) {
        this.options[trans[key]] = value;
      } else {
        this.options[key] = value;
      }
    });
  }

  _createInterface() {
    this.wrapBlock = createElement('div', {
      id: rootClassName + '_' + this.options.id,
      class: rootClassName,
    });

    this.selector.parentNode.insertBefore(this.wrapBlock, this.selector);
    this.wrapBlock.style.height = this.options.height;
  }

  _createMenu() {
    this.menu = createElement('div', {
      class: menuClassName,
    });

    this.menuItem = {
      add: createButton('add', 'menu-item-add', 'Add row', 'Add block'),
    };

    this.wrapBlock.appendChild(this.menu);

    forEachObj(this.menuItem, (key, value) => {
      this.menu.appendChild(value);
    });
  }

  _createBody() {
    this.body = createElement(
      'div',
      {
        class: bodyClassName,
      },
      this.value
    );

    this.wrapBlock.appendChild(this.body);
  }

  _createEditor() {
    const className = editorClassName;

    this.editor = createElement('div', {
      class: className,
    });

    const [block, footer, title, close, save, textarea] = [
      createElement('div', {
        class: className + '-block',
      }),
      createElement('div', {
        class: className + '-footer',
      }),
      createElement(
        'h3',
        {
          class: className + '-h3',
        },
        `Edit content`
      ),
      createButton(
        'close',
        '-editor-close',
        'Close',
        'Exit (without saving changes)'
      ),
      createButton('save', '-editor-save', 'Save', 'Save changes'),
      createElement('div', { class: textareaEditorClassName }),
    ];

    this.editor.appendChild(block);
    footer.appendChild(close);
    footer.appendChild(save);

    forEachArr([title, textarea, footer], (el) => {
      block.appendChild(el);
    });

    this.wrapBlock.appendChild(this.editor);

    this._initTiny('div.' + textareaEditorClassName);

    const closeEditor = () => {
      const content = this.wrapBlock.querySelector(
        'div.' + rootClassName + '__content.changing'
      );
      this.editor.classList.remove('show');
      content.classList.remove('changing');
      return content;
    };

    on(close, 'click', () => {
      closeEditor();
    });

    on(save, 'click', () => {
      const content = closeEditor();

      content.innerHTML = this.options.getTinymceContent(
        block.querySelector('div.' + textareaEditorClassName)
      );
    });
  }

  _createRowSettings(row) {
    const _this = this;
    const className = rootClassName + '-settings';
    const rowSettings = createElement('div', {
      class: className,
    });

    const [bgRow, column, footer, select, close, save, bgText, colText] = [
      createElement('div', {
        class: className + '-bgRow',
      }),
      createElement('div', {
        class: className + '-column',
      }),
      createElement('div', {
        class: className + '-footer',
      }),
      createElement('select', {
        class: className + '-bgCol',
      }),
      createButton(
        'close',
        '-settings-close',
        'Close',
        'Exit (without saving changes)'
      ),
      createButton('save', '-editor-save', 'Save', 'Save changes'),
      createElement(
        'h3',
        {
          class: className + '-h3',
        },
        `Row class`
      ),
      createElement(
        'h3',
        {
          class: className + '-h3',
        },
        `Number of columns in a row`
      ),
    ];

    bgRow.appendChild(bgText);
    bgRow.appendChild(select);
    column.appendChild(colText);
    footer.appendChild(close);
    footer.appendChild(save);

    forEachObj(this.options.rowClasses, (key, el) => {
      const option = createElement(
        'option',
        {
          value: el,
        },
        key
      );

      select.appendChild(option);
    });

    forEachArr([bgRow, column, footer], (el) => {
      rowSettings.appendChild(el);
    });

    for (let i = 1; i <= 6; i++) {
      const col = createElement(
        'div',
        {
          'data-col': i,
        },
        `<i class='svg'></i> <span>${i}</span>`
      );

      on(col, 'click', () => {
        removeActive(column.querySelector('.active'));

        col.classList.add('active');
      });

      column.appendChild(col);
    }

    row.appendChild(rowSettings);

    on(close, 'click', function () {
      const row = closeSettings();
      const bgItem = row.querySelector('div.' + className + '-bgCol.active');
      const colItem = row.querySelector('div[data-col].active');

      if (bgItem) {
        bgItem.classList.remove('active');
      }
      if (colItem) {
        colItem.classList.remove('active');
      }
    });

    on(save, 'click', function () {
      const row = closeSettings();
      const classes = select.value;
      const col = column.querySelector('.active');

      row.className = rowClassName;

      const classesList = classes.split(' ');

      classesList.forEach((el) => {
        row.classList.add(el);
      });

      row.dataset.classes = classes;

      if (col) {
        row.dataset.setCol = col.dataset.col;
      }
    });

    function closeSettings() {
      const row = _this.wrapBlock.querySelector(
        'div.' + rootClassName + '__row.changing'
      );

      row.classList.remove('changing');
      row.removeAttribute('data-action');
      _this.body.classList.remove('editing');

      return row;
    }

    function removeActive(selector) {
      if (selector) {
        selector.classList.remove('active');
      }
    }
  }

  _createRowMenu(row) {
    const className = rootClassName + '__row-menu';
    this.rowMenu = createElement('div', {
      class: className,
    });

    const settings = createButton(
      'setting',
      '__row-menu-settings',
      'Settings for row',
      'Settings',
      'settingRow'
    );

    const menu = {
      block: createElement('div', { class: className + '-block' }),
      buttons: {
        edit: createButton('edit', '', 'Edit row style', 'Edit', 'editRow'),
        column: createButton('add', '', 'Add column', 'Add column', 'addCol'),
        delete: createButton('add', '', 'Remove this row', 'Remove', 'delRow'),
      },
    };

    forEachObj(menu.buttons, (name, el) => {
      el.classList = className + '-' + name;
      menu.block.appendChild(el);
    });

    this.rowMenu.appendChild(menu.block);
    this.rowMenu.appendChild(settings);

    row.firstChild
      ? row.insertBefore(this.rowMenu, row.firstChild)
      : row.appendChild(this.rowMenu);
  }

  _createRow() {
    this.rows = this.body.querySelectorAll('div.' + rowClassName);
    let create = false;

    if (this.rows.length < 1) {
      create = true;
      this.body.innerHTML = '';
      const row = createElement('div', {
        class: rowClassName,
        'data-col': 0,
      });

      this._createCol(row, true, this.value);

      this.body.appendChild(row);
      this.rows = this.body.querySelectorAll('div.' + rowClassName);
    }

    forEachArr(this.rows, (el) => {
      if (this.options.edit) {
        this._createRowMenu(el);
        this._connectMenuFunc(el);
        this._createRowSettings(el);
      }

      if (this.options.draggable) {
        this._drag(
          el,
          '.' + rowClassName,
          'changing',
          '.' + rootClassName + '-col'
        );
      }

      const num = el.dataset.col;

      if (num < 1) {
        this._createCol(el, true);
      } else if (!create) {
        forEachArr(
          el.querySelectorAll('div.' + rootClassName + '-col'),
          (col) => {
            this._addColFunc(col);
          }
        );
      }
    });

    if (this.options.edit) {
      on(this.menuItem.add, 'click', () => {
        const row = createElement('div', {
          class: rowClassName,
          'data-col': 0,
        });

        this.body.appendChild(row);

        this._createRowMenu(row);
        this._createRowSettings(row);
        this._connectMenuFunc(row);

        if (this.options.draggable) {
          this._drag(
            row,
            '.' + rowClassName,
            'changing',
            '.' + rootClassName + '-col'
          );
        }

        this._createCol(row);
        this.rows = this.body.querySelectorAll('div.' + rowClassName);
      });
    }
  }

  _connectMenuFunc(row) {
    forEachArr(
      row.querySelectorAll('div.' + rootClassName + '__row-menu button'),
      (el) => {
        if (el.dataset.role === 'delRow') {
          this._removeRow(el, row);
        } else if (el.dataset.role === 'addCol') {
          this._addCol(el, row);
        } else if (el.dataset.role === 'editRow') {
          this._editRow(el, row);
        } else if (el.dataset.role === 'settingRow') {
          this._openSetting(el, row);
        }
      }
    );
  }

  _openSetting(el, row) {
    on(el, 'click', () => {
      this.body.classList.add('editing');
      forEachArr(this.rows, (el) => {
        el.classList.remove('changing');
      });

      row.classList.add('changing');
    });
  }

  _editRow(el, row) {
    on(el, 'click', () => {
      row.dataset.action = 'edit';
      const settings = row.querySelector('div.' + rootClassName + '-settings');
      const col = row.dataset.setCol ? row.dataset.setCol : row.dataset.col;
      const select = settings.querySelector(
        'select.' + rootClassName + '-settings-bgCol'
      );

      forEachArr(
        settings.querySelectorAll(
          'div.' + rootClassName + '-settings-bgCol, div[data-col]'
        ),
        (el) => {
          el.classList.remove('active');
        }
      );

      const variant = this.options.dataset.classes;

      select.value = Object.keys(this.options.rowClasses).find((key) => {
        return this.options.rowClasses[key] === variant;
      });

      settings
        .querySelector(`div[data-col = '` + col + `']`)
        .classList.add('active');
    });
  }

  _createCol(row, exists = false, inner = '') {
    const col = createElement('div', { class: rootClassName + '-col' });

    this._addColFunc(col);

    const content =
      exists && row.querySelector('div.' + rootClassName + '__content')
        ? row.querySelector('div.' + rootClassName + '__content')
        : createElement(
            'div',
            { class: rootClassName + '__content gui' },
            inner
          );

    col.appendChild(content);
    row.appendChild(col);
    this._updateColCount(row);
  }

  _updateColCount(row) {
    const num = row.querySelectorAll('.' + rootClassName + '-col').length;

    if (num > 0) {
      row.dataset.col = num < 7 ? num : 6;
    } else {
      row.parentNode.removeChild(row);
    }
  }

  _addColFunc(col) {
    const edit = createButton('edit', '-col-edit', 'Edit column');
    col.appendChild(edit);
    this._editContent(edit, col);

    if (this.options.edit) {
      const del = createButton('delete', '-col-del', 'Remove column');
      col.appendChild(del);
      this._removeCol(del, col);

      const setting = createButton('setting', '-col-settings', 'Settings');
      col.appendChild(setting);
      this._openColSetting(setting, col);
      this._createColSettings(col);

      if (this.options.draggable) {
        this._drag(col, '.' + rootClassName + '-col', 'changingCol');
      }
    }
  }

  _addCol(el, row) {
    on(el, 'click', () => {
      this._createCol(row);
    });
  }

  _removeRow(el, row) {
    on(el, 'click', () => {
      this.body.classList.remove('editing');
      row.parentElement.removeChild(row);
    });
  }

  _removeCol(el, column) {
    on(el, 'click', () => {
      const parent = column.parentElement;
      parent.removeChild(column);
      this._updateColCount(parent);
    });
  }

  _createColSettings(column) {
    const className = rootClassName + '-colSettings';
    const [setting, classes, footer, text, select, close, save] = [
      createElement('div', {
        class: className,
      }),
      createElement('div', {
        class: className + '-classes',
      }),
      createElement('div', {
        class: className + '-footer',
      }),
      createElement(
        'h3',
        {
          class: className + '-h3',
        },
        `Col class`
      ),
      createElement('select', {
        class: className + '-select',
      }),
      createButton('close', '-colSettings-close', 'Close', 'Exit'),
      createButton('save', '-colSettings-save', 'Save', 'Save changes'),
    ];

    forEachObj(this.options.colClasses, (key, el) => {
      const option = createElement(
        'option',
        {
          value: el,
        },
        key
      );

      select.appendChild(option);
    });

    classes.appendChild(text);
    classes.appendChild(select);
    footer.appendChild(close);
    footer.appendChild(save);
    setting.appendChild(classes);
    setting.appendChild(footer);

    column.appendChild(setting);

    on(close, 'click', function () {
      column.classList.remove('changingCol');
    });

    on(save, 'click', function () {
      const classes = select.value;

      // const oldClasses = column.dataset.classes;
      // if (oldClasses) {
      //   oldClasses.split(' ').forEach((el) => {
      //     column.classList.remove(el);
      //   });
      // }
      column.dataset.classes = classes;

      // if (val === 'def') {
      //   column.classList = rootClassName + '-col';
      // } else {
      column.classList = rootClassName + '-col ' + classes;
      // }

      // const classes = select.value;
      //
      // const classesList = classes.split(' ');
      //
      // column.classList.add(rootClassName + '-col');
      //
      // classesList.forEach((el) => {
      //   column.classList.add(el);
      // });
      //
      //
      //
      // const classesList = classes.split(' ');
      //
      // classesList.forEach((el) => {
      //   row.classList.add(el);
      // });
      //
      // row.dataset.classes = classes;
    });
  }

  _openColSetting(el, column) {
    on(el, 'click', () => {
      const cols = this.body.querySelectorAll('.changingCol');
      const select = column.querySelector(
        '.' + rootClassName + '-colSettings-select'
      );
      forEachArr(cols, (el) => {
        el.classList.remove('changingCol');
      });

      column.classList.add('changingCol');

      const variant = column.dataset.classes;

      const result = Object.keys(this.options.colClasses).find((key) => {
        console.log(key);

        return this.options.colClasses[key] === variant;
      });

      select.value = this.options.colClasses[result];

    });
  }

  _editContent(el, col) {
    on(el, 'click', () => {
      this.editor.classList.add('show');
      const content = col.querySelector('div.' + rootClassName + '__content');
      const editor = this.editor.querySelector(
        'div.' + textareaEditorClassName
      );
      editor.innerHTML = content.innerHTML;
      this.options.setTinymceContent(editor, content.innerHTML);
      content.classList.add('changing');
    });
  }

  _drag(
    selector,
    closest,
    disabledClass = undefined,
    disabledClosest = undefined
  ) {
    const _this = this;

    on(selector, 'mousedown', dragged);
    on(selector, 'touchstart', dragged);

    function dragged() {
      const clone = selector.cloneNode(true);
      const coords = getCoords(selector);
      const shiftX = event.clientX - coords.left;
      const shiftY = event.clientY - coords.top;
      const moveClass = rootClassName + '-move';
      const check =
        !event.target.closest(disabledClosest) &&
        !selector.classList.contains(disabledClass) &&
        !event.target.closest('button') &&
        !_this.body.classList.contains('editing');
      const closestClassName = closest.replace('.', '');
      const row = selector.closest('.' + rowClassName);
      let move = false;
      let touch = null;

      if (check) {
        clone.style.width = selector.scrollWidth + 'px';
        clone.style.height = selector.scrollHeight + 'px';
        clone.classList.add(rootClassName + '-clone');
        let sec = 0;

        touch = setInterval(() => {
          if (sec === 1) {
            on(document, 'mousemove', draggedStart);
            on(document, 'touchmove', draggedStart);
          }
          sec++;
        }, 25);

        on(selector, 'mouseup', draggedStop);
        on(selector, 'touchend', draggedStop);
      }

      function draggedStart() {
        event.preventDefault();
        clearTouch();
        moveAt(event);

        if (!move) {
          move = true;
          _this.body.appendChild(clone);
        }

        on(clone, 'mouseup', draggedStop);
        on(clone, 'touchend', draggedStop);
      }

      function draggedStop() {
        clearTouch();

        document.removeEventListener('mousemove', draggedStart);
        document.removeEventListener('touchmove', draggedStart);

        if (move) {
          const el = getElBehind(clone, event.clientX, event.clientY);
          const parent = el ? el.closest(closest) : null;
          const parentRow = parent ? parent.closest('.' + rowClassName) : null;

          if (
            selector.classList.contains(rootClassName + '-col') &&
            parentRow &&
            row &&
            parentRow !== row
          ) {
            _this._updateColCount(row);
            _this._updateColCount(parentRow);
          }
          _this.body.removeChild(clone);
        }

        move = false;
        clone.removeEventListener('mouseup', draggedStop);
        clone.removeEventListener('touchend', draggedStop);

        selector.removeEventListener('mouseup', draggedStop);
        selector.removeEventListener('touchend', draggedStop);
        selector.classList.remove(moveClass);
      }

      function moveAt(event) {
        clone.style.left = event.clientX - shiftX + 'px';
        clone.style.top = event.clientY - shiftY + 'px';
        selector.classList.add(moveClass);

        const el = getElBehind(clone, event.clientX, event.clientY);
        const parent = el ? el.closest(closest) : null;

        if (
          parent &&
          !parent.classList.contains(moveClass) &&
          !parent.classList.contains(rootClassName + '-clone')
        ) {
          const behindElCoords = getCoords(parent);
          const behindElHeight = parent.scrollHeight;
          const top = behindElCoords.top + behindElHeight / 2;

          if (event.clientY > top) {
            if (
              parent.nextElementSibling &&
              parent.nextElementSibling.classList.contains(closestClassName)
            ) {
              parent.parentNode.insertBefore(
                selector,
                parent.nextElementSibling
              );
            } else {
              parent.parentNode.appendChild(selector);
            }
          } else {
            if (
              !parent.previousElementSibling ||
              (parent.previousElementSibling &&
                !parent.previousElementSibling.classList.contains(moveClass))
            ) {
              parent.parentNode.insertBefore(selector, parent);
            }
          }
        }
      }

      function clearTouch() {
        if (touch) {
          clearInterval(touch);
          touch = null;
        }
      }
    }

    function getElBehind(point = {}, x, y) {
      const state = point.className;
      point.className += ` ${rootClassName}-hide`;
      const el = document.elementFromPoint(x, y);
      point.className = state;
      return el;
    }

    function getCoords(elem) {
      const box = elem.getBoundingClientRect();

      return {
        top: box.top,
        left: box.left,
      };
    }
  }

  _clickDoc() {
    on(document, 'mouseup', (event) => {
      const block = this.wrapBlock.querySelector('.editing');
      const col = this.body.querySelector('.changingCol');
      if (block) {
        const row = this.body.querySelector('.changing');

        if (row && !row.contains(event.target)) {
          row.classList.remove('changing');
          row.removeAttribute('data-action');
          block.classList.remove('editing');
        }
      }

      if (col && !col.contains(event.target)) {
        col.classList.remove('changingCol');
      }
    });
  }

  getContent() {
    const html = this.body.cloneNode(true);
    const rows = html.querySelectorAll('div.' + rowClassName);

    forEachArr(rows, (row) => {
      const menu = row.querySelector('div.' + rootClassName + '__row-menu');
      const settings = row.querySelector('div.' + rootClassName + '-settings');

      if (menu) {
        row.removeChild(menu);
      }
      if (settings) {
        row.removeChild(settings);
      }

      let cols = row.querySelectorAll('div.' + rootClassName + '-col');

      if (cols.length > 1) {
        forEachArr(cols, (col) => {
          const del = col.querySelector('.' + rootClassName + '-col-del');
          const edit = col.querySelector('.' + rootClassName + '-col-edit');
          const content = col.querySelector('.' + rootClassName + '__content');
          const settingsBtn = col.querySelector(
            '.' + rootClassName + '-col-settings'
          );
          const colSettings = col.querySelector(
            '.' + rootClassName + '-colSettings'
          );

          delAttr(content, ['id', 'style', 'aria-hidden']);

          if (del) {
            col.removeChild(del);
          }
          if (edit) {
            col.removeChild(edit);
          }
          if (settingsBtn) {
            col.removeChild(settingsBtn);
          }
          if (colSettings) {
            col.removeChild(colSettings);
          }
        });
      } else if (cols.length === 1) {
        cols = cols[0];
        const content = cols.querySelector(
          'div.' + rootClassName + '__content'
        );

        delAttr(content, ['id', 'style', 'aria-hidden']);

        cols.parentNode.dataset.col = 0;
        cols.parentNode.insertBefore(content, cols);
        cols.parentNode.removeChild(cols);
      } else {
        row.parentNode.removeChild(row);
      }
    });

    function delAttr(el, attr) {
      forEachArr(attr, (value) => {
        el.removeAttribute(value);
      });
    }

    return html.innerHTML;
  }

  _initTiny(className) {
    this.options.tinymceSettings(className);
  }

  rebuild() {
    if (this.wrapBlock.parentElement) {
      this.wrapBlock.parentElement.removeChild(this.wrapBlock);
      pageBuilder.create(this.selector, this.options);
    }
  }
}
