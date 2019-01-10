<template>
  <InputGrid
    :items="images"
    :max-visible-items="maxVisibleItems"
    :modal-header-text="modalHeaderText"
    :selected="selectedItem"
    :auto-select-first="true"
    class="SelectionAvatar"
    modal-container-classes="SelectionAvatar"
    item-key="imagePath"
    @input="select"
  />
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
    enableModal: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  computed: {
    modalHeaderText () {
      return this.enableModal
        ? this.$t('SELECTION_AVATAR.MODAL_HEADER')
        : null
    }
  }
}
</script>

<style>
/* It should not be scoped to affect the default style of the items of InputGrid */
.SelectionAvatar .InputGridItem {
  background-repeat: no-repeat;
  background-size: contain;
}

 .SelectionAvatar .InputGridModal__container {
  width: calc((var(--profile-avatar-xl)) * 3 + 2 * 15px) !important;
}
.SelectionAvatar .InputGridModal .InputGrid__container__category__items {
  display: grid;
  grid-template-columns: repeat(auto-fill, var(--profile-avatar-xl));
  grid-gap: 10px;
}

.SelectionAvatar .InputGridModal .InputGrid__container__category__items .InputGridItem {
  height: var(--profile-avatar-xl);
  width: var(--profile-avatar-xl);
  background-size: contain;
}

.SelectionAvatar .InputGridModal .InputGrid__container__category__items .InputGridItem__check {
  right: 1.6rem;
}
</style>
