export const defaults = {
  height: "auto",
  rowClasses: "row",
  colClasses: "col-6, col-12",
  edit: true,
  draggable: true,
  tinymceSettings: (className) => {
    tinymce.init({
      menubar: false,
      selector: className,
      height: 400,
      plugins: "link table lists paste",
      toolbar: "formatselect | table",
      setup: function(editor) {
        editor.ui.registry.addContextToolbar("textselection", {
          predicate: function(node) {
            return !editor.selection.isCollapsed();
          },
          items: "bold italic underline | bullist numlist | alignleft aligncenter alignright",
          position: "selection",
          scope: "node"
        });
      }
    });
  },
  setTinymceContent: (editor, content) => {
    tinymce.get(editor.id).setContent(content);
  },
  getTinymceContent: (editor) => {
    return tinymce.get(editor.id).getContent();
  }
};

export const id = 0;