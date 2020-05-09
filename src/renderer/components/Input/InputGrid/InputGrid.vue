<template>
  <div class="InputGrid">
    <slot>
      <div class="InputGrid__container">
        <button
          v-if="selectedItem"
          class="mr-3"
        >
          <InputGridItem
            v-bind="activeItem"
            :is-selected="!isModalOpen"
            :is-for-modal="false"
          />
        </button>

        <slot name="more">
          <button
            v-if="modalHeaderText"
            @click="openModal"
          >
            <InputGridItem
              :title="$t('INPUT_GRID.MORE')"
              :is-selected="false"
              class="text-4xl text-center p-1 align-middle border-2 border-theme-line-separator text-theme-option-button-text hover:text-theme-button-text"
              text-content="..."
            />
          </button>

          <InputGridModal
            v-if="isModalOpen"
            :container-classes="modalContainerClasses"
            :items="items"
            :item-key="itemKey"
            :selected="selectedItem"
            :modal-header-text="modalHeaderText"
            @close="closeModal"
            @select="select"
          />
        </slot>
      </div>
    </slot>
  </div>
</template>

<script>
import { flatten } from '@/utils'
import InputGridItem from './InputGridItem'
import InputGridModal from './InputGridModal'

/**
 * The InputGrid displays a grid of items. One of those items could be selected
 * by clicking on it.
 */
export default {
  name: 'InputGrid',

  components: {
    InputGridItem,
    InputGridModal
  },

  props: {
    items: {
      type: [Array, Object],
      required: true
    },
    // Attributes that would be yielded when using the `item` slot
    itemAttrs: {
      type: Array,
      required: false,
      default: () => ['title', 'imagePath']
    },
    itemKey: {
      type: String,
      required: true
    },
    selected: {
      type: Object,
      required: false,
      default: null
    },
    modalContainerClasses: {
      type: String,
      required: false,
      default: null
    },
    modalHeaderText: {
      type: String,
      required: false,
      default: null
    },
    autoSelectFirst: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      isModalOpen: null,
      selectedItem: this.selected
    }
  },

  computed: {
    allItems () {
      return flatten(Object.values(this.items))
    },

    activeItem () {
      return this.allItems.find(item => {
        if (!this.selectedItem || this.selectedItem.onlyLetter) {
          return item.onlyLetter
        }

        return this.selectedItem.pluginId ? item.name === this.selectedItem.name : item.title === this.selectedItem.title
      })
    }
  },

  mounted () {
    if (this.autoSelectFirst && !this.selected) {
      this.select(this.allItems[0])
    }
  },

  methods: {
    /**
     * Returns an Object with `{ attributeName: attributeValue }` for each item.
     * This could be used later on the `item` slot.
     * @return {Object}
     */
    itemSlotAttrs (item) {
      return this.itemAttrs.reduce((itemAttrs, attr) => {
        itemAttrs[attr] = item[attr]
        return itemAttrs
      }, {})
    },

    openModal () {
      this.isModalOpen = true
    },
    closeModal () {
      this.isModalOpen = false
    },

    select (item) {
      this.selectedItem = item
      this.$emit('input', this.activeItem)
    }
  }
}
</script>

<style lang="postcss" scoped>
.InputGrid__container {
  @apply flex items-center
}
</style>
