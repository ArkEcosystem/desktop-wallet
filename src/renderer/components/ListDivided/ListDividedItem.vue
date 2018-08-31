<template>
  <li
    :class="{
      'flex-col': isFloatingLabel,
    }"
    class="ListDividedItem flex justify-between py-4 w-full border-b border-dashed border-theme-line-separator"
  >
    <span
      :class="{
        'font-semibold text-xs mb-1': isFloatingLabel
      }"
      class="ListDividedItem__label text-theme-page-text-light"
    >
      {{ label }}
    </span>

    <div class="ListDividedItem__value">
      <span
        v-if="value"
        class="text-theme-page-text"
      >
        {{ value }}
      </span>

      <template v-else>
        <slot />
      </template>
    </div>
  </li>
</template>

<script>
export default {
  name: 'ListDividedItem',

  inject: {
    isFloatingLabel: {
      default: false
    }
  },

  props: {
    label: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: false,
      default: null
    }
  }
}
</script>
