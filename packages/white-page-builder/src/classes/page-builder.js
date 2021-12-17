import { defaults, id } from "../configs";
import { forEachArr, forEachObj, on } from "../helpers";

class PageBuilder {
  constructor(selector, options) {
    this.selector = selector.length > 0 ? selector[0] : selector;
    this.className = "pg-bld";
    this.textareaEditor = this.className + "-editor-textarea";

    const customOptions = options || {};
    this.options = { ...defaults, ...customOptions };
  }

  _init() {
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
    this.value = this.selector.value !== undefined ? this.selector.value : this.selector.innerHTML;
    this.selector.style.display = "none";

    const trans = {
      rowclasses: "rowClasses",
      colclasses: "colClasses"
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
    this.wrapBlock = this._createEl("div", {
      id: this.className + "_" + id,
      class: this.className
    });
    this.selector.parentNode.insertBefore(this.wrapBlock, this.selector);
    this.wrapBlock.style.height = this.options.height;
  }

  _createMenu() {
    this.menu = this._createEl("div", {
      class: this.className + "-menu"
    });

    this.menuItem = {
      add: this._getBtn("add", "-menu-item-add", "Add row", "Add block")
    };

    this.wrapBlock.appendChild(this.menu);

    forEachObj(this.menuItem, (key, value) => {
      this.menu.appendChild(value);
    });
  }

  _createBody() {
    this.body = this._createEl("div", {
      class: this.className + "-body"
    }, this.value);

    this.wrapBlock.appendChild(this.body);
  }

  _createEditor() {
    const _this = this;
    const className = _this.className + "-editor";
    _this.editor = _this._createEl("div", {
      class: className
    });

    const [block, footer, title, close, save, textarea] = [
      _this._createEl("div", {
        class: className + "-block"
      }),
      _this._createEl("div", {
        class: className + "-footer"
      }),
      _this._createEl("h3", {
        class: className + "-h3"
      }, `Edit content`),
      _this._getBtn("close", "-editor-close", "Close", "Exit (without saving changes)"),
      _this._getBtn("save", "-editor-save", "Save", "Save changes"),
      _this._createEl("div", { class: _this.textareaEditor })
    ];

    _this.editor.appendChild(block);
    footer.appendChild(close);
    footer.appendChild(save);
    forEachArr([title, textarea, footer], (el) => {
      block.appendChild(el);
    });
    _this.wrapBlock.appendChild(_this.editor);

    _this._addTiny("div." + this.textareaEditor);

    on(close, "click", () => {
      closeEditor();
    });

    on(save, "click", () => {
      const content = closeEditor();

      content.innerHTML = _this.options.getTinymceContent(block.querySelector("div." + _this.textareaEditor));
    });

    function closeEditor() {
      const content = _this.wrapBlock.querySelector("div." + _this.className + "__content.changing");
      _this.editor.classList.remove("show");
      content.classList.remove("changing");
      return content;
    }
  }

  _createRowSettings(row) {
    const _this = this;
    const className = _this.className + "-settings";
    const rowSettings = _this._createEl("div", {
      class: className
    });

    const [bgRow, column, footer, select, close, save, bgText, colText] = [
      _this._createEl("div", {
        class: className + "-bgRow"
      }),
      _this._createEl("div", {
        class: className + "-column"
      }),
      _this._createEl("div", {
        class: className + "-footer"
      }),
      _this._createEl("select", {
        class: className + "-bgCol"
      }),
      _this._getBtn("close", "-settings-close", "Close", "Exit (without saving changes)"),
      _this._getBtn("save", "-editor-save", "Save", "Save changes"),
      _this._createEl("h3", {
        class: className + "-h3"
      }, `Row class`),
      _this._createEl("h3", {
        class: className + "-h3"
      }, `Number of columns in a row`)
    ];

    bgRow.appendChild(bgText);
    bgRow.appendChild(select);
    column.appendChild(colText);
    footer.appendChild(close);
    footer.appendChild(save);

    forEachArr(("def, " + _this.options.rowClasses).split(", "), (el) => {
      const option = _this._createEl("option", {
        value: el
      }, el);

      if (el === "def") {
        option.innerText = `none`;
      }

      select.appendChild(option);
    });

    forEachArr([bgRow, column, footer], (el) => {
      rowSettings.appendChild(el);
    });

    for (let i = 1; i <= 6; i++) {
      const col = this._createEl("div", {
        "data-col": i
      }, `<i class="svg"></i> <span>${i}</span>`);

      on(col, "click", () => {
        removeActive(column.querySelector(".active"));

        col.classList.add("active");
      });

      column.appendChild(col);
    }

    row.appendChild(rowSettings);

    on(close, "click", function() {
      const row = closeSettings();
      const bgItem = row.querySelector("div." + className + "-bgCol.active");
      const colItem = row.querySelector("div[data-col].active");

      if (bgItem) {
        bgItem.classList.remove("active");
      }
      if (colItem) {
        colItem.classList.remove("active");
      }
    });

    on(save, "click", function() {
      const row = closeSettings();
      const bg = select.value;
      const col = column.querySelector(".active");

      row.className = _this.className + "__row";

      if (bg !== "def") {
        row.classList.add(bg);
      }
      if (col) {
        row.dataset.setCol = col.dataset.col;
      }
    });

    function closeSettings() {
      const row = _this.wrapBlock.querySelector("div." + _this.className + "__row.changing");

      row.classList.remove("changing");
      row.removeAttribute("data-action");
      _this.body.classList.remove("editing");

      return row;
    }

    function removeActive(selector) {
      if (selector) {
        selector.classList.remove("active");
      }
    }
  }

  _createRowMenu(row) {
    const className = this.className + "__row-menu";
    this.rowMenu = this._createEl("div", {
      class: className
    });

    const settings = this._getBtn("setting", "__row-menu-settings", "Settings for row", "Settings", "settingRow");

    const menu = {
      block: this._createEl("div", { class: className + "-block" }),
      buttons: {
        edit: this._getBtn("edit", "", "Edit row style", "Edit", "editRow"),
        column: this._getBtn("add", "", "Add column", "Add column", "addCol"),
        delete: this._getBtn("add", "", "Remove this row", "Remove", "delRow")
      }
    };

    forEachObj(menu.buttons, (name, el) => {
      el.classList = className + "-" + name;
      menu.block.appendChild(el);
    });

    this.rowMenu.appendChild(menu.block);
    this.rowMenu.appendChild(settings);

    row.firstChild ? row.insertBefore(this.rowMenu, row.firstChild) : row.appendChild(this.rowMenu);
  }

  _createRow() {
    this.rows = this.body.querySelectorAll("div." + this.className + "__row");
    let create = false;

    if (this.rows.length < 1) {
      create = true;
      this.body.innerHTML = "";
      const row = this._createEl("div", {
        class: this.className + "__row",
        "data-col": 0
      });

      this._createCol(row, true, this.value);

      this.body.appendChild(row);
      this.rows = this.body.querySelectorAll("div." + this.className + "__row");
    }

    forEachArr(this.rows, (el) => {
      if (this.options.edit) {
        this._createRowMenu(el);
        this._connectMenuFunc(el);
        this._createRowSettings(el);
      }

      if (this.options.draggable) {
        this._drag(el, "." + this.className + "__row", "changing", "." + this.className + "-col");
      }

      const num = el.dataset.col;

      if (num < 1) {
        this._createCol(el, true);
      } else if (!create) {
        forEachArr(el.querySelectorAll("div." + this.className + "-col"), (col) => {
          this._addColFunc(col);
        });
      }
    });

    if (this.options.edit) {
      on(this.menuItem.add, "click", () => {
        const row = this._createEl("div", {
          class: this.className + "__row",
          "data-col": 0
        });

        this.body.appendChild(row);

        this._createRowMenu(row);
        this._createRowSettings(row);
        this._connectMenuFunc(row);

        if (this.options.draggable) {
          this._drag(row, "." + this.className + "__row", "changing", "." + this.className + "-col");
        }

        this._createCol(row);
        this.rows = this.body.querySelectorAll("div." + this.className + "__row");
      });
    }
  }

  _connectMenuFunc(row) {
    forEachArr(row.querySelectorAll("div." + this.className + "__row-menu button"), (el) => {
      if (el.dataset.role === "delRow") {
        this._removeRow(el, row);
      } else if (el.dataset.role === "addCol") {
        this._addCol(el, row);
      } else if (el.dataset.role === "editRow") {
        this._editRow(el, row);
      } else if (el.dataset.role === "settingRow") {
        this._openSetting(el, row);
      }
    });
  }

  _openSetting(el, row) {
    on(el, "click", () => {
      this.body.classList.add("editing");
      forEachArr(this.rows, (el) => {
        el.classList.remove("changing");
      });

      row.classList.add("changing");
    });
  }

  _editRow(el, row) {
    on(el, "click", () => {
      row.dataset.action = "edit";
      const settings = row.querySelector("div." + this.className + "-settings");
      const col = row.dataset.setCol ? row.dataset.setCol : row.dataset.col;
      const select = settings.querySelector("select." + this.className + "-settings-bgCol");
      let bgCol = false;

      forEachArr(settings.querySelectorAll("div." + this.className + "-settings-bgCol, div[data-col]"), (el) => {
        el.classList.remove("active");
      });

      forEachArr(row.classList, (el) => {
        if (this.options.rowClasses.includes(el)) {
          select.value = el;
          bgCol = true;
        }
      });

      if (!bgCol) {
        select.value = "def";
      }

      settings.querySelector("div[data-col = \"" + col + "\"]").classList.add("active");
    });
  }

  _createCol(row, exists = false, inner = "") {
    const col = this._createEl("div", { class: this.className + "-col" });

    this._addColFunc(col);

    const content = exists && row.querySelector("div." + this.className + "__content") ? row.querySelector("div." + this.className + "__content") : this._createEl("div", { class: this.className + "__content gui" }, inner);

    col.appendChild(content);
    row.appendChild(col);
    this._updateColCount(row);
  }

  _updateColCount(row) {
    const num = row.querySelectorAll("." + this.className + "-col").length;

    if (num > 0) {
      row.dataset.col = num < 7 ? num : 6;
    } else {
      row.parentNode.removeChild(row);
    }
  }

  _addColFunc(col) {
    const edit = this._getBtn("edit", "-col-edit", "Edit column");
    col.appendChild(edit);
    this._editContent(edit, col);

    if (this.options.edit) {
      const del = this._getBtn("delete", "-col-del", "Remove column");
      col.appendChild(del);
      this._removeCol(del, col);

      const setting = this._getBtn("setting", "-col-settings", "Settings");
      col.appendChild(setting);
      this._openColSetting(setting, col);
      this._createColSettings(col);

      if (this.options.draggable) {
        this._drag(col, "." + this.className + "-col", "changingCol");
      }
    }
  }

  _addCol(el, row) {
    on(el, "click", () => {
      this._createCol(row);
    });
  }

  _removeRow(el, row) {
    on(el, "click", () => {
      this.body.classList.remove("editing");
      row.parentElement.removeChild(row);
    });
  }

  _removeCol(el, column) {
    on(el, "click", () => {
      const parent = column.parentElement;
      parent.removeChild(column);
      this._updateColCount(parent);
    });
  }

  _createColSettings(column) {
    const className = this.className + "-colSettings";
    const _this = this;
    const [setting, classes, footer, text, select, close, save] = [
      _this._createEl("div", {
        class: className
      }),
      _this._createEl("div", {
        class: className + "-classes"
      }),
      _this._createEl("div", {
        class: className + "-footer"
      }),
      _this._createEl("h3", {
        class: className + "-h3"
      }, `Col class`),
      _this._createEl("select", {
        class: className + "-select"
      }),
      _this._getBtn("close", "-colSettings-close", "Close", "Exit"),
      _this._getBtn("save", "-colSettings-save", "Save", "Save changes")
    ];

    forEachArr(("def, " + _this.options.colClasses).split(", "), (el) => {
      const option = _this._createEl("option", {
        value: el
      }, el);

      if (el === "def") {
        option.innerText = `none`;
      }

      select.appendChild(option);
    });

    classes.appendChild(text);
    classes.appendChild(select);
    footer.appendChild(close);
    footer.appendChild(save);
    setting.appendChild(classes);
    setting.appendChild(footer);

    column.appendChild(setting);

    on(close, "click", function() {
      column.classList.remove("changingCol");
    });

    on(save, "click", function() {
      const val = select.value;
      if (val === "def") {
        column.classList = _this.className + "-col";
      } else {
        column.classList = _this.className + "-col " + val;
      }
    });
  }

  _openColSetting(el, column) {
    on(el, "click", () => {
      const cols = this.body.querySelectorAll(".changingCol");
      const select = column.querySelector("." + this.className + "-colSettings-select");
      forEachArr(cols, (el) => {
        el.classList.remove("changingCol");
      });

      column.classList.add("changingCol");

      let def = false;

      forEachArr(column.classList, (el) => {
        if (this.options.colClasses.includes(el)) {
          select.value = el;
          def = true;
        }
      });

      if (!def) {
        select.value = "def";
      }
    });
  }

  _editContent(el, col) {
    on(el, "click", () => {
      this.editor.classList.add("show");
      const content = col.querySelector("div." + this.className + "__content");
      const editor = this.editor.querySelector("div." + this.textareaEditor);
      editor.innerHTML = content.innerHTML;
      this.options.setTinymceContent(editor, content.innerHTML);
      content.classList.add("changing");
    });
  }

  _getBtn(name, className, title, text, role = "") {
    const icons = {
      add: "playlist_add",
      edit: "edit",
      delete: "delete_forever",
      setting: "settings_applications",
      save: "save",
      close: "close"
    };

    const button = this._createEl("button", {
      class: className ? this.className + className : "",
      title: title,
      type: "button"
    }, `<i class="svg">${icons[name]}</i>` + (text ? `<span>${text}</span>` : ""));

    if (role) {
      button.dataset.role = role;
    }

    return button;
  }

  _drag(selector, closest, disabledClass = undefined, disabledClosest = undefined) {
    const _this = this;

    on(selector, "mousedown", dragged);
    on(selector, "touchstart", dragged);

    function dragged() {
      const clone = selector.cloneNode(true);
      const coords = getCoords(selector);
      const shiftX = event.clientX - coords.left;
      const shiftY = event.clientY - coords.top;
      const moveClass = _this.className + "-move";
      const check = !event.target.closest(disabledClosest) && !selector.classList.contains(disabledClass) && !event.target.closest("button") && !_this.body.classList.contains("editing");
      const closestClassName = closest.replace(".", "");
      const row = selector.closest("." + _this.className + "__row");
      let move = false;
      let touch = null;

      if (check) {
        clone.style.width = selector.scrollWidth + "px";
        clone.style.height = selector.scrollHeight + "px";
        clone.classList.add(_this.className + "-clone");
        let sec = 0;

        touch = setInterval(() => {
          if (sec === 1) {
            on(document, "mousemove", draggedStart);
            on(document, "touchmove", draggedStart);
          }
          sec++;
        }, 25);

        on(selector, "mouseup", draggedStop);
        on(selector, "touchend", draggedStop);
      }

      function draggedStart() {
        event.preventDefault();
        clearTouch();
        moveAt(event);

        if (!move) {
          move = true;
          _this.body.appendChild(clone);
        }

        on(clone, "mouseup", draggedStop);
        on(clone, "touchend", draggedStop);
      }

      function draggedStop() {
        clearTouch();

        document.removeEventListener("mousemove", draggedStart);
        document.removeEventListener("touchmove", draggedStart);

        if (move) {
          const el = getElBehind(clone, event.clientX, event.clientY);
          const parent = el ? el.closest(closest) : null;
          const parentRow = parent ? parent.closest("." + _this.className + "__row") : null;

          if (selector.classList.contains(_this.className + "-col") && parentRow && row && parentRow !== row) {
            _this._updateColCount(row);
            _this._updateColCount(parentRow);
          }
          _this.body.removeChild(clone);
        }

        move = false;
        clone.removeEventListener("mouseup", draggedStop);
        clone.removeEventListener("touchend", draggedStop);

        selector.removeEventListener("mouseup", draggedStop);
        selector.removeEventListener("touchend", draggedStop);
        selector.classList.remove(moveClass);
      }

      function moveAt(event) {
        clone.style.left = event.clientX - shiftX + "px";
        clone.style.top = event.clientY - shiftY + "px";
        selector.classList.add(moveClass);

        const el = getElBehind(clone, event.clientX, event.clientY);
        const parent = el ? el.closest(closest) : null;

        if (parent && !parent.classList.contains(moveClass) && !parent.classList.contains(_this.className + "-clone")) {
          const behindElCoords = getCoords(parent);
          const behindElHeight = parent.scrollHeight;
          const top = behindElCoords.top + behindElHeight / 2;

          if (event.clientY > top) {
            if (parent.nextElementSibling && parent.nextElementSibling.classList.contains(closestClassName)) {
              parent.parentNode.insertBefore(selector, parent.nextElementSibling);
            } else {
              parent.parentNode.appendChild(selector);
            }
          } else {
            if (!parent.previousElementSibling || (parent.previousElementSibling && !parent.previousElementSibling.classList.contains(moveClass))) {
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
      point.className += ` ${_this.className}-hide`;
      const el = document.elementFromPoint(x, y);
      point.className = state;
      return el;
    }

    function getCoords(elem) {
      const box = elem.getBoundingClientRect();

      return {
        top: box.top,
        left: box.left
      };
    }
  }

  _clickDoc() {
    on(document, "mouseup", (event) => {
      const block = this.wrapBlock.querySelector(".editing");
      const col = this.body.querySelector(".changingCol");
      if (block) {
        const row = this.body.querySelector(".changing");

        if (row && !row.contains(event.target)) {
          row.classList.remove("changing");
          row.removeAttribute("data-action");
          block.classList.remove("editing");
        }
      }

      if (col && !col.contains(event.target)) {
        col.classList.remove("changingCol");
      }
    });
  }

  _createEl(el, options = {}, inner = "") {
    const elem = document.createElement(el);
    forEachObj(options, (key, value) => {
      elem.setAttribute(key, value);
    });

    elem.innerHTML = inner;

    return elem;
  }

  _getContent() {
    const html = this.body.cloneNode(true);
    const rows = html.querySelectorAll("div." + this.className + "__row");

    forEachArr(rows, (row) => {
      const menu = row.querySelector("div." + this.className + "__row-menu");
      const settings = row.querySelector("div." + this.className + "-settings");

      if (menu) {
        row.removeChild(menu);
      }
      if (settings) {
        row.removeChild(settings);
      }

      let cols = row.querySelectorAll("div." + this.className + "-col");

      if (cols.length > 1) {
        forEachArr(cols, (col) => {
          const del = col.querySelector("." + this.className + "-col-del");
          const edit = col.querySelector("." + this.className + "-col-edit");
          const content = col.querySelector("." + this.className + "__content");
          const settingsBtn = col.querySelector("." + this.className + "-col-settings");
          const colSettings = col.querySelector("." + this.className + "-colSettings");

          delAttr(content, ["id", "style", "aria-hidden"]);

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
        const content = cols.querySelector("div." + this.className + "__content");

        delAttr(content, ["id", "style", "aria-hidden"]);

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

  _addTiny(className) {
    this.options.tinymceSettings(className);
  }

  _rebuild() {
    if (this.wrapBlock.parentElement) {
      this.wrapBlock.parentElement.removeChild(this.wrapBlock);
      pageBuilder.create(this.selector, this.options);
    }
  }
}

export default PageBuilder;