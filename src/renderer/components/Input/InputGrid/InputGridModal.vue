<template>
  <ModalWindow
    :title="modalHeaderText"
    :container-classes="containerClasses"
    @close="emitClose"
  >
    <section class="InputGridModal flex flex-col">
      <div class="InputGridModal__container overflow-y-auto p-1">
        <div
          v-for="(categoryItems, category) in items"
          :key="category"
          class="InputGridModal__container__category"
        >
          <h4 class="w-full mt-5 mb-2">
            {{ category }}
          </h4>

          <div class="InputGrid__container__category__items">
            <button
              v-for="item in categoryItems"
              :key="item[itemKey]"
              @click="click(item)"
            >
              <!--
                Here we could reuse the `item` scope of the `InputGrid` component
                or provide a new slot, but currently is not necessary at all.
              -->

              <InputGridItem
                v-bind="item"
                :is-selected="isClicked(item)"
              />
            </button>
          </div>
        </div>
      </div>

      <div class="mt-5">
        <button
          :disabled="!clicked"
          class="blue-button"
          @click="emitSelect"
        >
          {{ $t('COMMON.DONE') }}
        </button>
      </div>
    </section>
  </ModalWindow>
</template>

<script>
import ModalWindow from '@/components/Modal/ModalWindow'
import InputGridItem from './InputGridItem'

/**
 * This component only emits the `selected` event when the background has been
 * confirmed.
 */
export default {
  name: 'InputGridModal',

  components: {
    InputGridItem,
    ModalWindow
  },

  props: {
    containerClasses: {
      type: String,
      required: false,
      default: 'InputGridModal'
    },
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
    modalHeaderText: {
      type: String,
      required: false,
      default () {
        return this.$t('INPUT_GRID_MODAL.TITLE')
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

    isClicked (item) {
      return this.clicked.pluginId ? this.clicked.name === item.name : this.clicked.title === item.title
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
.InputGridModal__container {
  width: 28.5rem; /* 5 * 4.5rem (columns) + 4 * 1rem (gaps) + 2rem (gap from scrollbar) */
  height: 50vh;
}
.InputGrid__container__category__items {
  display: grid;
  /* Maximum 5 columns */
  grid-template-columns: repeat(auto-fill, 4.5rem);
  grid-gap: 1rem;
}
</style>
