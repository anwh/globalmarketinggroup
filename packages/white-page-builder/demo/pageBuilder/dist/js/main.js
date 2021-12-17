!function(){"use strict";var e={304:function(e,t,n){function i(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?i(Object(n),!0).forEach((function(t){s(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):i(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}var l=0,c={editors:{},create:function(e,t){try{!function(e){if("undefined"==typeof tinymce)throw Error("PageBuilder: Didn't find tinymce. Please connect tinymce.");if(void 0===e||0===e.length)throw Error("PageBuilder: Didn't find selector");if(e.length>1)throw Error("PageBuilder: Please use individual selector, not more.\n        You use "+e.length+" selectors")}(e)}catch(e){return console.error(e.message),!1}var n=new d(e,t);return n._init(),this.editors[n.className+"_"+l]=n,l+=l,n},getContent:function(e){if(this.editors[e])return this.editors[e]._getContent();console.error("Didn't find plugin with id '".concat(e,"'"))},rebuild:function(e){this.editors[e]._rebuild()}},r={height:"auto",rowClasses:"first, sec, third",colClasses:"full",edit:!0,draggable:!0,tinymceSettings:function(e){tinymce.init({menubar:!1,selector:e,height:400,plugins:"link table lists paste",toolbar:"formatselect | table",setup:function(e){e.ui.registry.addContextToolbar("textselection",{predicate:function(t){return!e.selection.isCollapsed()},items:"bold italic underline | bullist numlist | alignleft aligncenter alignright",position:"selection",scope:"node"})}})},setTinymceContent:function(e,t){tinymce.get(e.id).setContent(t)},getTinymceContent:function(e){return tinymce.get(e.id).getContent()}},d=function(){function e(t,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.selector=t.length>0?t[0]:t,this.className="pgBld",this.textareaEditor=this.className+"-editor-textarea";var i=n||{};this.options=o(o({},r),i)}var t,n,i;return t=e,n=[{key:"_init",value:function(){this._changeSelector(),this._createInterface(),this._createBody(),this.options.edit&&this._createMenu(),this._createEditor(),this._createRow(),this._clickDoc()}},{key:"_changeSelector",value:function(){var e=this;this.value=void 0!==this.selector.value?this.selector.value:this.selector.innerHTML,this.selector.style.display="none";var t={rowclasses:"rowClasses",colclasses:"colClasses"};u(this.selector.dataset,(function(n,i){t[n]?e.options[t[n]]=i:e.options[n]=i}))}},{key:"_createInterface",value:function(){this.wrapBlock=this._createEl("div",{id:this.className+"_"+l,class:this.className}),this.selector.parentNode.insertBefore(this.wrapBlock,this.selector),this.wrapBlock.style.height=this.options.height}},{key:"_createMenu",value:function(){var e=this;this.menu=this._createEl("div",{class:this.className+"-menu"}),this.menuItem={add:this._getBtn("add","-menu-item-add","Add row","Add block")},this.wrapBlock.appendChild(this.menu),u(this.menuItem,(function(t,n){e.menu.appendChild(n)}))}},{key:"_createBody",value:function(){this.body=this._createEl("div",{class:this.className+"-body"},this.value),this.wrapBlock.appendChild(this.body)}},{key:"_createEditor",value:function(){var e=this,t=e.className+"-editor";e.editor=e._createEl("div",{class:t});var n=[e._createEl("div",{class:t+"-block"}),e._createEl("div",{class:t+"-footer"}),e._createEl("h3",{class:t+"-h3"},"Edit content"),e._getBtn("close","-editor-close","Close","Exit (without saving changes)"),e._getBtn("save","-editor-save","Save","Save changes"),e._createEl("div",{class:e.textareaEditor})],i=n[0],o=n[1],s=n[2],a=n[3],l=n[4],c=n[5];function r(){var t=e.wrapBlock.querySelector("div."+e.className+"-content.changing");return e.editor.classList.remove("show"),t.classList.remove("changing"),t}e.editor.appendChild(i),o.appendChild(a),o.appendChild(l),h([s,c,o],(function(e){i.appendChild(e)})),e.wrapBlock.appendChild(e.editor),e._addTiny("div."+this.textareaEditor),v(a,"click",(function(){r()})),v(l,"click",(function(){r().innerHTML=e.options.getTinymceContent(i.querySelector("div."+e.textareaEditor))}))}},{key:"_createRowSettings",value:function(e){var t=this,n=this,i=n.className+"-settings",o=n._createEl("div",{class:i}),s=[n._createEl("div",{class:i+"-bgRow"}),n._createEl("div",{class:i+"-column"}),n._createEl("div",{class:i+"-footer"}),n._createEl("select",{class:i+"-bgCol"}),n._getBtn("close","-settings-close","Close","Exit (without saving changes)"),n._getBtn("save","-editor-save","Save","Save changes"),n._createEl("h3",{class:i+"-h3"},"Row class"),n._createEl("h3",{class:i+"-h3"},"Number of columns in a row")],a=s[0],l=s[1],c=s[2],r=s[3],d=s[4],u=s[5],p=s[6],m=s[7];a.appendChild(p),a.appendChild(r),l.appendChild(m),c.appendChild(d),c.appendChild(u),h(("def, "+n.options.rowClasses).split(", "),(function(e){var t=n._createEl("option",{value:e},e);"def"===e&&(t.innerText="none"),r.appendChild(t)})),h([a,l,c],(function(e){o.appendChild(e)}));for(var g=function(e){var n=t._createEl("div",{"data-col":e},'<i class="svg"></i> <span>'.concat(e,"</span>"));v(n,"click",(function(){var e;(e=l.querySelector(".active"))&&e.classList.remove("active"),n.classList.add("active")})),l.appendChild(n)},f=1;f<=6;f++)g(f);function y(){var e=n.wrapBlock.querySelector("div."+n.className+"-row.changing");return e.classList.remove("changing"),e.removeAttribute("data-action"),n.body.classList.remove("editing"),e}e.appendChild(o),v(d,"click",(function(){var e=y(),t=e.querySelector("div."+i+"-bgCol.active"),n=e.querySelector("div[data-col].active");t&&t.classList.remove("active"),n&&n.classList.remove("active")})),v(u,"click",(function(){var e=y(),t=r.value,i=l.querySelector(".active");e.className=n.className+"-row","def"!==t&&e.classList.add(t),i&&(e.dataset.setCol=i.dataset.col)}))}},{key:"_createRowMenu",value:function(e){var t=this.className+"-row-menu";this.rowMenu=this._createEl("div",{class:t});var n=this._getBtn("setting","-row-menu-settings","Settings for row","Settings","settingRow"),i={block:this._createEl("div",{class:t+"-block"}),buttons:{edit:this._getBtn("edit","","Edit row style","Edit","editRow"),column:this._getBtn("add","","Add column","Add column","addCol"),delete:this._getBtn("add","","Remove this row","Remove","delRow")}};u(i.buttons,(function(e,n){n.classList=t+"-"+e,i.block.appendChild(n)})),this.rowMenu.appendChild(i.block),this.rowMenu.appendChild(n),e.firstChild?e.insertBefore(this.rowMenu,e.firstChild):e.appendChild(this.rowMenu)}},{key:"_createRow",value:function(){var e=this;this.rows=this.body.querySelectorAll("div."+this.className+"-row");var t=!1;if(this.rows.length<1){t=!0,this.body.innerHTML="";var n=this._createEl("div",{class:this.className+"-row","data-col":0});this._createCol(n,!0,this.value),this.body.appendChild(n),this.rows=this.body.querySelectorAll("div."+this.className+"-row")}h(this.rows,(function(n){e.options.edit&&(e._createRowMenu(n),e._connectMenuFunc(n),e._createRowSettings(n)),e.options.draggable&&e._drag(n,"."+e.className+"-row","changing","."+e.className+"-col"),n.dataset.col<1?e._createCol(n,!0):t||h(n.querySelectorAll("div."+e.className+"-col"),(function(t){e._addColFunc(t)}))})),this.options.edit&&v(this.menuItem.add,"click",(function(){var t=e._createEl("div",{class:e.className+"-row","data-col":0});e.body.appendChild(t),e._createRowMenu(t),e._createRowSettings(t),e._connectMenuFunc(t),e.options.draggable&&e._drag(t,"."+e.className+"-row","changing","."+e.className+"-col"),e._createCol(t),e.rows=e.body.querySelectorAll("div."+e.className+"-row")}))}},{key:"_connectMenuFunc",value:function(e){var t=this;h(e.querySelectorAll("div."+this.className+"-row-menu button"),(function(n){"delRow"===n.dataset.role?t._removeRow(n,e):"addCol"===n.dataset.role?t._addCol(n,e):"editRow"===n.dataset.role?t._editRow(n,e):"settingRow"===n.dataset.role&&t._openSetting(n,e)}))}},{key:"_openSetting",value:function(e,t){var n=this;v(e,"click",(function(){n.body.classList.add("editing"),h(n.rows,(function(e){e.classList.remove("changing")})),t.classList.add("changing")}))}},{key:"_editRow",value:function(e,t){var n=this;v(e,"click",(function(){t.dataset.action="edit";var e=t.querySelector("div."+n.className+"-settings"),i=t.dataset.setCol?t.dataset.setCol:t.dataset.col,o=e.querySelector("select."+n.className+"-settings-bgCol"),s=!1;h(e.querySelectorAll("div."+n.className+"-settings-bgCol, div[data-col]"),(function(e){e.classList.remove("active")})),h(t.classList,(function(e){n.options.rowClasses.includes(e)&&(o.value=e,s=!0)})),s||(o.value="def"),e.querySelector('div[data-col = "'+i+'"]').classList.add("active")}))}},{key:"_createCol",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",i=this._createEl("div",{class:this.className+"-col"});this._addColFunc(i);var o=t&&e.querySelector("div."+this.className+"-content")?e.querySelector("div."+this.className+"-content"):this._createEl("div",{class:this.className+"-content gui"},n);i.appendChild(o),e.appendChild(i),this._updateColCount(e)}},{key:"_updateColCount",value:function(e){var t=e.querySelectorAll("."+this.className+"-col").length;t>0?e.dataset.col=t<7?t:6:e.parentNode.removeChild(e)}},{key:"_addColFunc",value:function(e){var t=this._getBtn("edit","-col-edit","Edit column");if(e.appendChild(t),this._editContent(t,e),this.options.edit){var n=this._getBtn("delete","-col-del","Remove column");e.appendChild(n),this._removeCol(n,e);var i=this._getBtn("setting","-col-settings","Settings");e.appendChild(i),this._openColSetting(i,e),this._createColSettings(e),this.options.draggable&&this._drag(e,"."+this.className+"-col","changingCol")}}},{key:"_addCol",value:function(e,t){var n=this;v(e,"click",(function(){n._createCol(t)}))}},{key:"_removeRow",value:function(e,t){var n=this;v(e,"click",(function(){n.body.classList.remove("editing"),t.parentElement.removeChild(t)}))}},{key:"_removeCol",value:function(e,t){var n=this;v(e,"click",(function(){var e=t.parentElement;e.removeChild(t),n._updateColCount(e)}))}},{key:"_createColSettings",value:function(e){var t=this.className+"-colSettings",n=this,i=[n._createEl("div",{class:t}),n._createEl("div",{class:t+"-classes"}),n._createEl("div",{class:t+"-footer"}),n._createEl("h3",{class:t+"-h3"},"Col class"),n._createEl("select",{class:t+"-select"}),n._getBtn("close","-colSettings-close","Close","Exit"),n._getBtn("save","-colSettings-save","Save","Save changes")],o=i[0],s=i[1],a=i[2],l=i[3],c=i[4],r=i[5],d=i[6];h(("def, "+n.options.colClasses).split(", "),(function(e){var t=n._createEl("option",{value:e},e);"def"===e&&(t.innerText="none"),c.appendChild(t)})),s.appendChild(l),s.appendChild(c),a.appendChild(r),a.appendChild(d),o.appendChild(s),o.appendChild(a),e.appendChild(o),v(r,"click",(function(){e.classList.remove("changingCol")})),v(d,"click",(function(){var t=c.value;e.classList="def"===t?n.className+"-col":n.className+"-col "+t}))}},{key:"_openColSetting",value:function(e,t){var n=this;v(e,"click",(function(){var e=n.body.querySelectorAll(".changingCol"),i=t.querySelector("."+n.className+"-colSettings-select");h(e,(function(e){e.classList.remove("changingCol")})),t.classList.add("changingCol");var o=!1;h(t.classList,(function(e){n.options.colClasses.includes(e)&&(i.value=e,o=!0)})),o||(i.value="def")}))}},{key:"_editContent",value:function(e,t){var n=this;v(e,"click",(function(){n.editor.classList.add("show");var e=t.querySelector("div."+n.className+"-content"),i=n.editor.querySelector("div."+n.textareaEditor);i.innerHTML=e.innerHTML,n.options.setTinymceContent(i,e.innerHTML),e.classList.add("changing")}))}},{key:"_getBtn",value:function(e,t,n,i){var o=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"",s={add:"playlist_add",edit:"edit",delete:"delete_forever",setting:"settings_applications",save:"save",close:"close"},a=this._createEl("button",{class:t?this.className+t:"",title:n,type:"button"},'<i class="svg">'.concat(s[e],"</i>")+(i?"<span>".concat(i,"</span>"):""));return o&&(a.dataset.role=o),a}},{key:"_drag",value:function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0,i=arguments.length>3&&void 0!==arguments[3]?arguments[3]:void 0,o=this;function s(){var s=e.cloneNode(!0),c=l(e),r=event.clientX-c.left,d=event.clientY-c.top,u=o.className+"-move",h=!(event.target.closest(i)||e.classList.contains(n)||event.target.closest("button")||o.body.classList.contains("editing")),p=t.replace(".",""),m=e.closest("."+o.className+"-row"),g=!1,f=null;if(h){s.style.width=e.scrollWidth+"px",s.style.height=e.scrollHeight+"px",s.classList.add(o.className+"-clone");var y=0;f=setInterval((function(){1===y&&(v(document,"mousemove",C),v(document,"touchmove",C)),y++}),25),v(e,"mouseup",_),v(e,"touchend",_)}function C(){event.preventDefault(),w(),function(n){s.style.left=n.clientX-r+"px",s.style.top=n.clientY-d+"px",e.classList.add(u);var i=a(s,n.clientX,n.clientY),c=i?i.closest(t):null;if(c&&!c.classList.contains(u)&&!c.classList.contains(o.className+"-clone")){var h=l(c),v=c.scrollHeight,m=h.top+v/2;n.clientY>m?c.nextElementSibling&&c.nextElementSibling.classList.contains(p)?c.parentNode.insertBefore(e,c.nextElementSibling):c.parentNode.appendChild(e):(!c.previousElementSibling||c.previousElementSibling&&!c.previousElementSibling.classList.contains(u))&&c.parentNode.insertBefore(e,c)}}(event),g||(g=!0,o.body.appendChild(s)),v(s,"mouseup",_),v(s,"touchend",_)}function _(){if(w(),document.removeEventListener("mousemove",C),document.removeEventListener("touchmove",C),g){var n=a(s,event.clientX,event.clientY),i=n?n.closest(t):null,l=i?i.closest("."+o.className+"-row"):null;e.classList.contains(o.className+"-col")&&l&&m&&l!==m&&(o._updateColCount(m),o._updateColCount(l)),o.body.removeChild(s)}g=!1,s.removeEventListener("mouseup",_),s.removeEventListener("touchend",_),e.removeEventListener("mouseup",_),e.removeEventListener("touchend",_),e.classList.remove(u)}function w(){f&&(clearInterval(f),f=null)}}function a(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1?arguments[1]:void 0,n=arguments.length>2?arguments[2]:void 0,i=e.className;e.className+=" ".concat(o.className,"-hide");var s=document.elementFromPoint(t,n);return e.className=i,s}function l(e){var t=e.getBoundingClientRect();return{top:t.top,left:t.left}}v(e,"mousedown",s),v(e,"touchstart",s)}},{key:"_clickDoc",value:function(){var e=this;v(document,"mouseup",(function(t){var n=e.wrapBlock.querySelector(".editing"),i=e.body.querySelector(".changingCol");if(n){var o=e.body.querySelector(".changing");o&&!o.contains(t.target)&&(o.classList.remove("changing"),o.removeAttribute("data-action"),n.classList.remove("editing"))}i&&!i.contains(t.target)&&i.classList.remove("changingCol")}))}},{key:"_createEl",value:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",i=document.createElement(e);return u(t,(function(e,t){i.setAttribute(e,t)})),i.innerHTML=n,i}},{key:"_getContent",value:function(){var e=this,t=this.body.cloneNode(!0);function n(e,t){h(t,(function(t){e.removeAttribute(t)}))}return h(t.querySelectorAll("div."+this.className+"-row"),(function(t){var i=t.querySelector("div."+e.className+"-row-menu"),o=t.querySelector("div."+e.className+"-settings");i&&t.removeChild(i),o&&t.removeChild(o);var s=t.querySelectorAll("div."+e.className+"-col");if(s.length>1)h(s,(function(t){var i=t.querySelector("."+e.className+"-col-del"),o=t.querySelector("."+e.className+"-col-edit"),s=t.querySelector("."+e.className+"-content"),a=t.querySelector("."+e.className+"-col-settings"),l=t.querySelector("."+e.className+"-colSettings");n(s,["id","style","aria-hidden"]),i&&t.removeChild(i),o&&t.removeChild(o),a&&t.removeChild(a),l&&t.removeChild(l)}));else if(1===s.length){var a=(s=s[0]).querySelector("div."+e.className+"-content");n(a,["id","style","aria-hidden"]),s.parentNode.dataset.col=0,s.parentNode.insertBefore(a,s),s.parentNode.removeChild(s)}else t.parentNode.removeChild(t)})),t.innerHTML}},{key:"_addTiny",value:function(e){this.options.tinymceSettings(e)}},{key:"_rebuild",value:function(){this.wrapBlock.parentElement&&(this.wrapBlock.parentElement.removeChild(this.wrapBlock),c.create(this.selector,this.options))}}],n&&a(t.prototype,n),i&&a(t,i),Object.defineProperty(t,"prototype",{writable:!1}),e}();function u(e,t){for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&t(n,e[n])}function h(e,t){for(var n=0;n<e.length;n++)t(e[n],e)}function v(e,t,n){e.addEventListener?e.addEventListener(t,n):e.attachEvent("on"+t,n)}"undefined"==typeof window?n.g.pageBuilder=c:window.pageBuilder=c,Element.prototype.matches||(Element.prototype.matches=Element.prototype.msMatchesSelector||Element.prototype.webkitMatchesSelector),Element.prototype.closest||(Element.prototype.closest=function(e){var t=this;do{if(t.matches(e))return t;t=t.parentElement||t.parentNode}while(null!==t&&1===t.nodeType);return null})}},t={};function n(i){var o=t[i];if(void 0!==o)return o.exports;var s=t[i]={exports:{}};return e[i](s,s.exports,n),s.exports}n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,{a:t}),t},n.d=function(e,t){for(var i in t)n.o(t,i)&&!n.o(e,i)&&Object.defineProperty(e,i,{enumerable:!0,get:t[i]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},function(){n(304);pageBuilder.create(document.querySelector(".textarea"))}()}();