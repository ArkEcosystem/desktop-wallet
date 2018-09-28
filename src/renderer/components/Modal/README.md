# Modal window

## Functionality

This component lets the user to display a modal window with a optional header and footer.

## Usage

`<ModalWindow>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `title` | String *optional* | Window Title
| `message` | String *optional* | Message attached to the footer. HTML entities can be used.
| `close` | Function | Function called (without callbacks) when user clicks the close button.

And also supports some slots beyond the default:

| slot | description
| --- | ---
| `header` *optional* | When set, the `title` attribute is useless.
| default | Window content, attributes such as `width` and `height` should be defined here.
| `footer` *optional* | When set, the `message` attribute is useless.

## Demo

> With optional attributes

```html
<ModalWindow
  v-if="showModal"
  title="My Modal"
  message="This will be attached to the footer"
  @close="showModal = false">
  <p class="p-2">My awesome component.</p>
</ModalWindow>
```

> With slots

```html
<ModalWindow
  v-if="showModal"
  @close="showModal = false">
  <h1 slot="header">My Modal</h1>
  <p class="p-2">My awesome component.</p>
  <h3 slot="footer">This will be attached to the footer</h3>
</ModalWindow>
```

> Only with the default slot

```html
<ModalWindow
  v-if="showModal"
  @close="showModal = false">
  <p class="p-2">My awesome component.</p>
</ModalWindow>
```
