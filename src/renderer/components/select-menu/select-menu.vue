<template>
  <div
    :class="[{ open: isOpen }, 'relative']">
    <div
      v-if="!hasDefaultSlot"
      @click="toggle">
      <slot
        :value="activeItem"
        name="handler">
        <select-menu-handler
          :value="activeItem"
          :placeholder="placeholder" />
      </slot>
    </div>

    <div
      v-if="isOpen"
      class="absolute z-10">
      <ul
        :style="{ transform: `translate(${ position.join(',') })` }"
        class="select-menu pointer-events-auto theme-light shadow list-reset flex flex-col bg-theme-feature rounded py-2 overflow-y-auto max-h-48">
        <slot>
          <select-menu-item
            v-for="item in items"
            :key="item"
            :value="item"
            :is-active="item === activeItem"
            @click="select($event)"
          />
        </slot>
      </ul>
    </div>
  </div>
</template>

<script>
import SelectMenuItem from './select-menu-item'
import SelectMenuHandler from './select-menu-handler'

export default {
  name: 'SelectMenu',

  components: {
    SelectMenuItem,
    SelectMenuHandler
  },

  props: {
    placeholder: {
      type: String,
      required: false,
      default: null
    },

    items: {
      type: Array,
      required: false,
      default: () => []
    },

    value: {
      type: String,
      required: false,
      default: null
    },

    position: {
      type: Array,
      required: false,
      default: () => ['0%', '0%']
    }
  },

  data: () => ({
    isOpen: true,
    activeItem: null
  }),

  computed: {
    hasDefaultSlot () {
      return !!this.$slots.default
    }
  },

  created () {
    this.activeItem = this.value
  },

  mounted () {
    this.isOpen = this.hasDefaultSlot
  },

  methods: {
    select (item) {
      this.activeItem = item
      this.isOpen = false
      this.$emit('select', item)
    },

    toggle () {
      this.isOpen = !this.isOpen
    }
  }
}
</script>

<style scoped>
.select-menu >>> .select-menu-item:last-child .select-menu-item-container {
  border: none
}
</style>
