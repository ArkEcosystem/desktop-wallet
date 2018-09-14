<template>
  <div class="SelectionBackground">
    <InputGrid
      :items="images"
      :max-visible-items="maxVisibleItems"
      :popup-header-text="$t('SELECTION_BACKGROUND.POPUP_HEADER')"
      :selected="selectedItem"
      item-key="imagePath"
      @input="select"
    />
  </div>
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
      default: () => ['textures', 'wallpapers']
    }
  }
}
</script>
