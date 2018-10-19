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
        :value="entries[activeKey]"
        :is-open="isOpen"
        :placeholder="placeholder"
        name="handler"
      >
        <MenuDropdownHandler
          :value="entries[activeKey]"
          :placeholder="placeholder"
        />
      </slot>
    </button>

    <div
      v-click-outside="close"
      v-if="isOpen"
      class="absolute min-w-full z-20">
      <ul
        :style="{ transform: `translate(${position.join(',')})` }"
        class="MenuDropdown pointer-events-auto theme-light shadow list-reset flex flex-col bg-theme-feature rounded py-2 overflow-y-auto max-h-2xs"
      >
        <slot>
          <MenuDropdownItem
            v-for="(value, key) in entries"
            :key="key"
            :value="value"
            :is-active="key === activeKey"
            @click="select(key)"
          />
        </slot>
      </ul>
    </div>
  </div>
</template>

<script>
import { zipObject } from 'lodash'
import MenuDropdownItem from './MenuDropdownItem'
import MenuDropdownHandler from './MenuDropdownHandler'

export default {
  name: 'MenuDropdown',

  components: {
    MenuDropdownItem,
    MenuDropdownHandler
  },

  model: {
    prop: 'value',
    event: 'select'
  },

  props: {
    placeholder: {
      type: String,
      required: false,
      default: null
    },
    items: {
      type: [Array, Object],
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
    activeKey: vm.value
  }),

  computed: {
    entries () {
      return Array.isArray(this.items) ? zipObject(this.items, this.items) : this.items
    },
    hasDefaultSlot () {
      return !!this.$slots.default
    }
  },

  watch: {
    value (val) {
      this.activeKey = val
    }
  },

  mounted () {
    this.isOpen = this.hasDefaultSlot
  },

  methods: {
    select (item) {
      this.activeKey = item
      this.isOpen = false

      this.$emit('select', item)
    },

    toggle () {
      this.isOpen = !this.isOpen
    },

    close () {
      this.isOpen = false
    }
  }
}
</script>

<style scoped>
.MenuDropdown >>> .MenuDropdownItem:last-child .MenuDropdownItem__container {
  border: none;
}
</style>
