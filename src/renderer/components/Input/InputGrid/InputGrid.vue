<template>
  <div class="InputGrid">
    <slot>
      <div class="InputGrid__container">
        <div
          v-for="item in visibleItems"
          :key="item[itemKey]"
        >
          <button @click="select(item)">
            <slot
              v-bind="itemSlotAttrs(item)"
              name="item"
            >
              <InputGridItem
                :image-path="item.imagePath"
                :is-selected="selectedItem === item && !isModalOpen"
                :text-content="item.textContent"
                :title="item.title"
              />
            </slot>
          </button>
        </div>

        <slot name="more">
          <button
            v-if="modalHeaderText"
            @click="openModal"
          >
            <InputGridItem
              :image-path="isSelectedFromModal ? selectedItem.imagePath : false"
              :is-selected="isSelectedFromModal"
              :title="isSelectedFromModal ? selectedItem.title : $t('INPUT_GRID.MORE')"
              class="text-4xl text-center p-1 align-middle bg-theme-button text-theme-option-button-text hover:text-theme-button-text"
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
import { flatten } from 'lodash'
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
    maxVisibleItems: {
      type: Number,
      required: false,
      default: 10
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
    firstVisible () {
      return this.visibleItems[0]
    },
    lastVisible () {
      return this.visibleItems[this.visibleItems.length - 1]
    },
    visibleItems () {
      return this.allItems.slice(0, this.maxVisibleItems)
    },
    isSelectedFromModal () {
      return !!this.selectedItem && this.visibleItems.indexOf(this.selectedItem) === -1
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
      this.$emit('input', this.selectedItem)
    }
  }
}
</script>

<style scoped>
.InputGrid__container {
  display: grid;
  /* Maximum 3 columns */
  grid-template-columns: repeat(3, 4.5rem);
  grid-gap: 1rem;
}
</style>
