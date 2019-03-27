<template>
  <KeepAlive>
    <Transition name="MenuTabItem__transition">
      <div v-show="isActive" class="MenuTabItem">
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
      required: true
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
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
