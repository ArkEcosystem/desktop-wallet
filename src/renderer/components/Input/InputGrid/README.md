# Grid Input

## Functionality

This component displays a list of items (images or text) to select 1 of them.
Optionally, it can display an item that, on click, opens a popup with all the items.

## Usage

`<InputGrid>` supports the following properties:

| attribute | type | description
| --- | --- | ---
| `items` | Array or Object | The list of images

Supports these slots:

| slot | description
| --- | ---
| default | Replaces the entire content of the component.
| `item` *optional* | Replaces the default rows of item.
| `more` *optional* | Replaces the default item that opens the popup with the rest of items.

## Demo

> Without popup

```html
<InputGrid
  :items="images"
  :max-visible-items="3"
  item-key="src"
  @input="select"
/>
```

> With popup

```html
<InputGrid
  :items="images"
  :max-visible-items="3"
  item-key="src"
  popup-header-text="Select image"
  @input="select"
/>
```

> With slots

```html
<InputGrid
  :items="images"
  :max-visible-items="3"
  item-key="src"
  popup-header-text="Select image"
  @input="select"
>
  <template slot="item" slot-scope="{ title, imagePath }">
    <img :title="title" :src="titlePath" />
  </template>

  <template slot="more">
    <a href="https://my-images.com/">More images</a>
  </template>
</InputGrid>
```
