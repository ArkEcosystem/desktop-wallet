# Popup modal

## Functionality

This component lets the user to display a popup modal with a optional header and footer.

## Usage

`<popup-modal>` supports the following custom component attributes:

| attribute | type | description
| --- | --- | ---
| `title` | String *optional* | Popup Title
| `message` | String *optional* | Message attached to the footer. HTML entities can be used.
| `close` | Function | Function called (without callbacks) when user clicks the close button.

And also supports some slots beyond the default:

| slot | description
| --- | ---
| `header` *optional* | When set, the `title` attribute is useless.
| default | Popup content, attributes such as `width` and `height` should be defined here.
| `footer` *optional* | When set, the `message` attribute is useless.

## Demo

> With optional attributes

```html
<popup-modal
  v-if="showPopup"
  title="My Popup"
  message="This will be attached to the footer"
  @close="showPopup = false">
  <p class="p-2">My awesome component.</p>
</popup-modal>
```

> With slots

```html
<popup-modal
  v-if="showPopup"
  @close="showPopup = false">
  <h1 slot="header">My Popup</h1>
  <p class="p-2">My awesome component.</p>
  <h3 slot="footer">This will be attached to the footer</h3>
</popup-modal>
```

> Only with the default slot

```html
<popup-modal
  v-if="showPopup"
  @close="showPopup = false">
  <p class="p-2">My awesome component.</p>
</popup-modal>
```
