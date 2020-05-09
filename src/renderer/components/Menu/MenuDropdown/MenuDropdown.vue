<template>
  <div
    :class="[{ open: isOpen }, 'relative']"
  >
    <button
      v-if="!hasDefaultSlot"
      :disabled="isDisabled"
      class="appearance-none text-inherit w-full"
      @click.stop="handlerWrapperClick"
    >
      <slot
        :active-value="activeValue"
        :value="activeValue"
        :item="entries[activeValue]"
        :is-open="isOpen"
        :placeholder="placeholder"
        :prefix="prefix"
        :icon-disabled="isOnlySelectedItem"
        name="handler"
      >
        <MenuDropdownHandler
          :value="activeValue"
          :item="entries[activeValue]"
          :placeholder="placeholder"
          :prefix="prefix"
          :icon-disabled="isOnlySelectedItem"
        />
      </slot>
    </button>

    <div
      v-if="isOpen && (hasDefaultSlot || hasItems)"
      v-click-outside.stop="close"
      :class="[{
        'pin-b pb-10': pinAbove,
        'pin-x': pinToInputWidth
      }, containerClasses]"
      :style="{ right: adjustedPosition.x, top: pinAbove ? null : adjustedPosition.y }"
      class="MenuDropdown__container absolute min-w-full z-20"
    >
      <ul
        class="MenuDropdown pointer-events-auto shadow list-reset flex flex-col bg-theme-feature rounded py-2 overflow-y-auto max-h-2xs"
      >
        <slot>
          <MenuDropdownItem
            v-for="(item, entryValue) in entries"
            :key="entryValue"
            :value="entryValue"
            :item="item.toString()"
            :is-active="isHighlighting ? entryValue === activeValue : false"
            @click="select"
          >
            <slot
              name="item"
              v-bind="{ item, value: entryValue, activeValue }"
            />
          </MenuDropdownItem>
        </slot>
      </ul>
    </div>
  </div>
</template>

<script>
import { zipObject } from 'lodash'
import { isEmpty } from '@/utils'
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
    containerClasses: {
      type: String,
      required: false,
      default: ''
    },
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
      type: Object,
      required: false,
      default: () => {}
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
    },
    isHighlighting: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data: vm => ({
    isOpen: true,
    activeValue: vm.value
  }),

  computed: {
    adjustedPosition () {
      return {
        x: '0',
        y: '120%',
        ...this.position
      }
    },
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
      if (Object.keys(this.entries).length === 1 && this.entries[this.activeValue] !== Object.values(this.entries)[0]) {
        return false
      }

      return true
    }
  },

  watch: {
    value (value) {
      this.activeValue = value
    }
  },

  mounted () {
    this.isOpen = this.hasDefaultSlot
  },

  methods: {
    select (item) {
      this.activeValue = item
      this.isOpen = false

      this.$emit('select', item)
    },

    handlerWrapperClick () {
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
</style>
