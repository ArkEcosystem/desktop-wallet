<template>
  <div class="Collapse">
    <button
      :disabled="isDisabled"
      class="Collapse__handler"
      @click="clickHandler"
    >
      <slot
        :isOpen="inputIsOpen"
        :isDisabled="isDisabled"
        name="handler"
      />
    </button>

    <KeepAlive>
      <Transition
        :duration="animationDuration"
        name="Collapse__transition"
        mode="out-in"
        @enter="enter"
        @afterEnter="afterEnter"
        @leave="leave"
      >
        <div
          v-show="inputIsOpen"
          :style="{ height }"
          class="Collapse__content"
        >
          <slot />
        </div>
      </Transition>
    </KeepAlive>
  </div>
</template>

<script>
export default {
  name: 'Collapse',

  inject: {
    collapseClick: {
      default: null // avoid throw when using this component alone
    }
  },

  props: {
    isOpen: {
      type: Boolean,
      required: false,
      default: false
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    // Only required in the accordion
    id: {
      type: [String, Number],
      required: false,
      default: null
    },
    animationDuration: {
      type: Object,
      required: false,
      default: () => ({ enter: 100, leave: 200 })
    }
  },

  data: () => ({
    height: 0,
    inputIsOpen: null
  }),

  watch: {
    isOpen (val) {
      this.inputIsOpen = val
    },

    inputIsOpen () {
      this.$emit(this.inputIsOpen ? 'open' : 'close')
    }
  },

  mounted () {
    this.inputIsOpen = this.isOpen
  },

  methods: {
    // Verify that the `collapseClick` method was injected by the parent
    clickHandler () {
      if (this.collapseClick) {
        this.collapseClick(this.id)
      } else {
        this.toggle()
      }
    },

    // This method is called by the parent
    collapse (id) {
      if (!id || !this.id) return

      if (this.id === id && !this.isDisabled) {
        this.inputIsOpen = !this.inputIsOpen
        return this.inputIsOpen // Return this to the parent identify the active item
      } else {
        this.inputIsOpen = false
      }
    },

    toggle () {
      if (this.isDisabled) return

      this.inputIsOpen = !this.inputIsOpen
    },

    // Animate content by moving from height 0 to real size
    enter (el) {
      const scrollHeight = `${el.scrollHeight}px`
      this.height = 0
      setTimeout(() => (this.height = scrollHeight || 'auto'))
    },

    afterEnter () {
      setTimeout(() => (this.height = 'auto'), 5)
    },

    leave (el) {
      this.height = getComputedStyle(el).height
      setTimeout(() => (this.height = 0))
    }
  }
}
</script>

<style scoped>
.Collapse__content,
.Collapse__handler > * {
  transition-property: height, color, font-size;
  transition-duration: .3s;
  transition-timing-function: cubic-bezier(0.25, 0.8, 0.5, 1);
}

.Collapse__transition-enter-active,
.Collapse__transition-leave-active {
  overflow: hidden;
}

.Collapse__transition-enter,
.Collapse__transition-leave-to {
  height: 0;
}
</style>
