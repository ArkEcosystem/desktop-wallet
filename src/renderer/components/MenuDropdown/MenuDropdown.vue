<template>
  <div
    :class="[{ open: isOpen }, 'relative']">
    <button
      v-if="!hasDefaultSlot"
      :disabled="isDisabled"
      class="appearance-none text-inherit w-full"
      @click="toggle"
    >
      <slot
        :value="activeItem"
        name="handler">

        <MenuDropdownHandler
          :value="activeItem"
          :placeholder="placeholder"
        />

      </slot>
    </button>

    <div
      v-if="isOpen"
      class="absolute min-w-full z-20">
      <ul
        :style="{ transform: `translate(${position.join(',')})` }"
        class="MenuDropdown pointer-events-auto theme-light shadow list-reset flex flex-col bg-theme-feature rounded py-2 overflow-y-auto max-h-2xs"
      >
        <slot>
          <MenuDropdownItem
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
import MenuDropdownItem from './MenuDropdownItem'
import MenuDropdownHandler from './MenuDropdownHandler'

export default {
  name: 'MenuDropdown',

  components: {
    MenuDropdownItem,
    MenuDropdownHandler
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
    },

    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: vm => ({
    isOpen: true,
    activeItem: vm.value
  }),

  computed: {
    hasDefaultSlot () {
      return !!this.$slots.default
    }
  },

  watch: {
    value (val) {
      this.activeItem = val
    }
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
.MenuDropdown >>> .MenuDropdownItem:last-child .MenuDropdownItem__container {
  border: none;
}
</style>
