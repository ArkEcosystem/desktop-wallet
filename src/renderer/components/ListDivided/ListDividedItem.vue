<template>
  <li
    class="ListDividedItem flex flex-col py-4 w-full border-dashed border-theme-line-separator"
    :class="hideBorder ? 'border-b-0' : 'border-b'"
  >
    <div
      :class="isFloatingLabel ? 'flex-col items-start' : 'items-center'"
      class="flex justify-between"
    >
      <span
        :class="[
          { 'font-semibold text-xs mb-1': isFloatingLabel },
          itemLabelClass
        ]"
        class="ListDividedItem__label text-theme-page-text-light mr-5"
      >
        {{ label }}
      </span>

      <div
        :class="itemValueClass"
        class="ListDividedItem__value"
      >
        <slot>
          <span
            v-if="value"
            class="text-theme-page-text"
          >
            {{ value }}
          </span>
        </slot>
      </div>
    </div>
    <div
      v-if="$slots.content"
      class="mt-4"
    >
      <slot name="content" />
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
      type: [String, Number],
      required: false,
      default: null
    },
    itemLabelClass: {
      type: String,
      required: false,
      default: ''
    },
    itemValueClass: {
      type: String,
      required: false,
      default: ''
    },
    hideBorder: {
      type: Boolean,
      required: false,
      default: false
    }
  }
}
</script>
