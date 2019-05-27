<template>
  <InputGrid
    :items="availableAvatars"
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
    },
    letterValue: {
      type: String,
      required: false,
      default: ''
    },
    profile: {
      type: Object,
      required: false,
      default: () => null
    }
  },

  computed: {
    modalHeaderText () {
      return this.enableModal
        ? this.$t('SELECTION_AVATAR.MODAL_HEADER')
        : null
    },

    availableAvatars () {
      const images = { ...this.images }
      const key = Object.keys(images)[0]
      images[key] = [this.letterAvatar, ...images[key]]
      if (this.pluginAvatars && this.pluginAvatars.length) {
        images[this.$t('SELECTION_AVATAR.ADDITIONAL_AVATARS')] = this.pluginAvatars
      }

      return images
    },

    letterAvatar () {
      return {
        title: this.$t('SELECTION_AVATAR.NO_AVATAR'),
        textContent: this.letterValue,
        onlyLetter: true
      }
    },

    additional () {
      return this.pluginAvatars
    },

    pluginAvatars () {
      if (!this.profile || !this.profile.id) {
        return []
      }

      return this.$store.getters['plugin/avatars'](this.profile.id)
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
