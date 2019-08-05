<template>
  <KeepAlive>
    <Transition
      name="MenuTabItem__transition"
    >
      <div
        v-show="isActive"
        class="MenuTabItem"
      >
        <slot :is-active="isActive" />
      </div>
    </Transition>
  </KeepAlive>
</template>

<script>
export default {
  name: 'MenuTabItem',

  props: {
    // You can use the slot `header` to customize the label
    label: {
      type: String,
      required: true
    },
    tab: {
      type: [Number, String],
      default: null,
      required: false
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    onClick: {
      type: Function,
      default: null,
      required: false
    }
  },

  data: () => ({
    isActive: false
  }),

  methods: {
    toggle (isActive) {
      this.isActive = isActive
    }
  }
}
</script>
