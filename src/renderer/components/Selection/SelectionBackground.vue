<template>
  <InputGrid
    :items="images"
    :modal-header-text="$t('SELECTION_BACKGROUND.MODAL_HEADER')"
    :selected="selectedItem"
    :auto-select-first="true"
    container-classes="SelectionBackground"
    class="SelectionBackgroundGrid"
    item-key="imagePath"
    @input="select"
  />
</template>

<script>
import selectionMixin from './mixin-selection'
import selectionImageMixin from './mixin-selection-image'

export default {
  name: 'SelectionBackground',

  mixins: [selectionMixin, selectionImageMixin],

  props: {
    categories: {
      type: Array,
      required: false,
      default: () => ['wallpapers', 'textures']
    }
  }
}
</script>
