# Page Builder
plugin for create pages structure using wysiwyg (TinyMCE). [Examples](https://koterion.github.io/pageBuilder/)

## install

```shell
npm install @koterion/page_builder
```

## use

Include [TinyMCE](https://www.tiny.cloud/docs/quick-start/#step1includethetinymcescript)

```html
<script src="https://cloud.tinymce.com/5/tinymce.min.js?apiKey=your_API_key"></script>
```

Include [Material Icons](https://material.io/resources/icons/?style=baseline)

```html
<link href="https://fonts.googleapis.com/icon?family=Material+Icons+Outlined" rel="stylesheet">
```

### css
```css
@import url('~@koterion/page_builder/dist/css/pageBuilder.css');
```

or (if use Postcss import)

```css
@import url('@koterion/page_builder');
```

### js
```js
import '@koterion/page_builder'

pageBuilder.create(selector, options)
```

### html
```html
<div class="YourUniqueClass" data-yourData="dataInfo">HTML</div>
```

or

```html
<textarea class="YourUniqueClass" name="YourUniqueName" data-yourData="dataInfo">HTML</textarea>
```

## Options

option | type | desc |
:--- | :---: | :--- |
[tinymceSettings](#tinymce) | object | TinyMCE settings |
height| string | Workplace height|
[rowClasses](#rowclasses) | string | Row class names. Can use from html data.|
[colClasses](#colClasses) | string | Col class names. Can use from html data.|
edit | boolean | Turn on/off editing blocks. Can use from html data.|
draggable | boolean | Turn on/off dragged cols & row

You can use option in dataset like:

```html
<div data-height="500px">HTML</div>
```

##Methods

method | desc |
:--- | :--- |
`pageBuilder.create(selector, options)` | Create workplace |
`pageBuilder.getContent(id)` | Get content of current by `id` field |
`pageBuilder.rebuild(id)` | Rebuild current by `id` field |

## Examples:

### use:

```js
import '@koterion/page_builder'

pageBuilder.create(document.querySelector('.textarea'))
```
### tinymce
Initialize TinyMCE. Use `className` for selector
```js
{
  tinymceSettings: (className) => {
    tinymce.init({selector: className})
  }
}
```

### rowClasses
Use in current format, separator ', '
```js
{
  rowClasses: 'first, second, third'
}
```

or

```html
<div data-rowClasses="first, second, third">HTML</div>
```

### colClasses
Use in current format, separator ', '
```js
{
  colClasses: 'full, text'
}
```

or

```html
<div data-colClasses="full, text">HTML</div>
```