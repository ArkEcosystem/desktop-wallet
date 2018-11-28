<template>
  <div
    :class="[{ open: isOpen }, 'relative']"
  >
    <button
      v-if="!hasDefaultSlot"
      :disabled="isDisabled"
      class="appearance-none text-inherit w-full"
      @click="buttonClick"
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
          :prefix="prefix"
          :icon-disabled="isOnlySelectedItem"
        />
      </slot>
    </button>

    <div
      v-if="isOpen && (hasDefaultSlot || hasItems)"
      v-click-outside="close"
      :class="{
        'MenuDropdown--pin-above': pinAbove,
        'pin-x': pinToInputWidth
      }"
      class="MenuDropdown__container absolute min-w-full z-20"
    >
      <ul
        :style="{ transform: `translate(${position.join(',')})` }"
        class="MenuDropdown pointer-events-auto theme-light shadow list-reset flex flex-col bg-theme-feature rounded py-2 overflow-y-auto max-h-2xs"
      >
        <slot>
          <MenuDropdownItem
            v-for="(item, key) in entries"
            :key="key"
            :value="item.toString()"
            :is-active="key === activeKey"
            @click.self="select(key)"
          />
        </slot>
      </ul>
    </div>
  </div>
</template>

<script>
import { zipObject, isEmpty } from 'lodash'
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
    pinAbove: {
      type: Boolean,
      required: false,
      default: false
    },
    pinToInputWidth: {
      type: Boolean,
      required: false,
      default: false
    },
    prefix: {
      type: String,
      required: false,
      default: ''
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
    },
    hasItems () {
      return !isEmpty(this.items)
    },
    isOnlySelectedItem () {
      if (Object.keys(this.entries).length > 1) {
        return false
      }
      if (Object.keys(this.entries).length === 1 && this.entries[this.activeKey] !== Object.values(this.entries)[0]) {
        return false
      }

      return true
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

    buttonClick () {
      this.toggle()
      this.$emit('click')
    },

    toggle () {
      this.isOpen = !this.isOpen
    },

    open () {
      this.isOpen = true
    },

    close () {
      this.isOpen = false
    }
  }
}
</script>

<style lang="postcss">
.MenuDropdown .MenuDropdownItem:last-child .MenuDropdownItem__container {
  border: none;
}

.MenuDropdown--pin-above {
  @apply pin-b pb-10;
}
</style>
