<template>
  <div class="InputGrid">
    <slot>

      <div class="InputGrid__container">

        <div
          v-for="item in visibleItems"
          :key="item[itemKey]"
        >
          <div @click="select(item)">

            <slot
              v-bind="itemSlotAttrs(item)"
              name="item"
            >

              <InputGridItem
                :image-path="item.imagePath"
                :is-selected="selectedItem === item && !isPopupOpen"
                :text-content="item.textContent"
                :title="item.title"
              />

            </slot>
          </div>
        </div>

        <slot name="more">

          <div
            v-if="popupHeaderText"
            @click="openPopup"
          >
            <InputGridItem
              :image-path="isSelectedFromPopup ? selectedItem.imagePath : false"
              :is-selected="isSelectedFromPopup"
              :title="isSelectedFromPopup ? selectedItem.title : $t('InputGrid.more')"
              class="text-4xl text-center p-1 align-middle bg-theme-button text-theme-option-button-text hover:text-theme-button-text"
              text-content="..."
            />
          </div>

          <InputGridPopup
            v-if="isPopupOpen"
            :items="items"
            :item-key="itemKey"
            :selected="selectedItem"
            :popup-header-text="popupHeaderText"
            @close="closePopup"
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
import InputGridPopup from './InputGridPopup'

/**
 * The InputGrid displays a grid of items. One of those items could be selected
 * by clicking on it.
 */
export default {
  name: 'InputGrid',

  components: {
    InputGridItem,
    InputGridPopup
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
    popupHeaderText: {
      type: String,
      required: false,
      default: null
    },
    maxVisibleItems: {
      type: Number,
      required: false,
      default: 10
    }
  },

  data () {
    return {
      isPopupOpen: null,
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
    isSelectedFromPopup () {
      return !!this.selectedItem && this.visibleItems.indexOf(this.selectedItem) === -1
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

    openPopup () {
      this.isPopupOpen = true
    },
    closePopup () {
      this.isPopupOpen = false
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
