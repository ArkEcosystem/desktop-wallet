<template>
  <div class="SelectionAvatar">
    <InputGrid
      :items="images"
      :max-visible-items="maxVisibleItems"
      :popup-header-text="popupHeaderText"
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
  name: 'SelectionAvatar',

  mixins: [selectionMixin, selectionImageMixin],

  props: {
    categories: {
      type: Array,
      required: false,
      default: () => ['avatars']
    },
    enablePopup: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  computed: {
    popupHeaderText () {
      return this.enablePopup
        ? this.$t('SELECTION_AVATAR.POPUP_HEADER')
        : null
    }
  }
}
</script>

<style>
/* It should not be scoped to affect the default style of the items of InputGrid */
.SelectionAvatar .InputGridItem {
  background-repeat: no-repeat;
}

 .SelectionAvatar .InputGridPopup__container {
  width: calc((var(--profile-avatar-xl)) * 3 + 2 * 10px) !important;
}
.SelectionAvatar .InputGridPopup .InputGrid__container__category__items {
  display: grid;
  grid-template-columns: repeat(auto-fill, var(--profile-avatar-xl));
  grid-gap: 10px;
}

.SelectionAvatar .InputGridPopup .InputGrid__container__category__items .InputGridItem {
  height: var(--profile-avatar-xl);
  width: var(--profile-avatar-xl);
  background-size: contain;
}
</style>
