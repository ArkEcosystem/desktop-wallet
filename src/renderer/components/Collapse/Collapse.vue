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

    <transition
      :duration="{ enter: 100, leave: 200 }"
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
        <slot/>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Collapse',

  inject: {
    toggleCollapse: {
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
    }
  },

  data: vm => ({
    height: 0,
    inputIsOpen: vm.isOpen
  }),

  watch: {
    isOpen (val) {
      this.inputIsOpen = val
    }
  },

  methods: {
    // Verify that the `toggleAll` method was injected by the parent
    clickHandler () {
      if (this.toggleCollapse) {
        this.toggleCollapse(this.id)
      } else {
        this.toggle()
      }
    },

    // This method is called by the parent
    collapse (id) {
      if (!id || !this.id || this.isDisabled) return

      if (this.id === id) {
        this.inputIsOpen = !this.inputIsOpen
        return this.inputIsOpen // Return this to the parent identify the active item
      } else {
        this.inputIsOpen = false
      }
    },

    toggle () {
      if (this.isDisabled) return

      this.inputIsOpen = !this.inputIsOpen
      this.$emit(this.inputIsOpen ? 'open' : 'close')
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
.Collapse__handler {
  transition: height .3s cubic-bezier(0.25, 0.8, 0.5, 1);
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
