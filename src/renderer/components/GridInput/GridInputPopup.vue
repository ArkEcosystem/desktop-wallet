<template>
  <PopupModal
    :title="popupHeaderText"
    @close="emitClose"
  >
    <section class="GridInputPopup flex flex-col">
      <div class="GridInputPopup__container overflow-y-auto">
        <div
          v-for="(categoryItems, category) in items"
          :key="category"
          class="GridInputPopup__container__category"
        >
          <h4 class="w-full mt-5 mb-2">{{ category }}</h4>

          <div class="GridInput__container__category__items">
            <div
              v-for="item in categoryItems"
              :key="item[itemKey]"
              @click="click(item)"
            >

              <!--
                Here we could reuse the `item` scope of the `GridInput` component
                or provide a new slot, but currently is not necessary at all
              -->

              <GridInputItem
                :image-path="item.imagePath"
                :is-selected="clicked === item"
                :title="item.title"
              />
            </div>

          </div>
        </div>
      </div>

      <div class="mt-5">
        <button
          :disabled="!clicked"
          class="blue-button"
          @click="emitSelect"
        >
          {{ $t('common.done') }}
        </button>
      </div>
    </section>
  </PopupModal>
</template>

<script>
import PopupModal from '@/components/PopupModal'
import GridInputItem from './GridInputItem'

/**
 * This component only emits the `selected` event when the background has been
 * confirmed.
 */
export default {
  name: 'GridInputPopup',

  components: {
    GridInputItem,
    PopupModal
  },

  props: {
    items: {
      type: [Array, Object],
      required: true
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
      default () {
        return this.$i18n.t('GridInput.popupHeader')
      }
    }
  },

  data () {
    return {
      clicked: this.selected
    }
  },

  methods: {
    click (item) {
      this.clicked = item
    },

    emitClose () {
      this.$emit('close')
    },

    emitSelect () {
      this.$emit('select', this.clicked)
      this.emitClose()
    }
  }
}
</script>

<style scoped>
.GridInputPopup__container {
  width: 36rem; /* 5 * 6rem (columns) + 4 * 1rem (gaps) + 2rem (gap from scrollbar) */
  height: 50vh;
}
.GridInput__container__category__items {
  display: grid;
  /* Maximum 5 columns */
  grid-template-columns: repeat(5, 6rem);
  grid-gap: 1rem;
}
</style>
