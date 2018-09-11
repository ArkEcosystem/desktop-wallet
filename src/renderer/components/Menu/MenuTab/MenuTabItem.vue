<template>
  <keep-alive>
    <transition
      name="MenuTabItem__transition">
      <div
        v-show="isActive"
        class="MenuTabItem">
        <slot/>
      </div>
    </transition>
  </keep-alive>
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
