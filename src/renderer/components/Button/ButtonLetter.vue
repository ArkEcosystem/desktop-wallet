<template>
  <Component
    :is="tag"
    v-bind="$attrs"
    :class="{
      [`ButtonLetter--${size}`]: size,
      'bg-theme-button text-theme-button-text': !hasCustomStyle
    }"
    class="ButtonLetter inline-block rounded-full"
    v-on="$listeners"
  >
    <span class="ButtonLetter__inner flex h-full w-full items-center justify-center uppercase font-bold">
      {{ letter }}
    </span>
    <slot />
  </Component>
</template>

<script>
export default {
  name: 'ButtonLetter',

  props: {
    tag: {
      type: String,
      required: false,
      default: 'button',
      validator: value => ['button', 'div'].includes(value)
    },
    size: {
      type: String,
      required: false,
      default: null,
      validator: value => value ? ['sm', 'base', 'lg', 'xl', '2xl', '3xl'].includes(value) : true
    },
    hasCustomStyle: {
      type: Boolean,
      required: false,
      default: false
    },
    value: {
      type: String,
      required: false,
      default: ''
    }
  },

  computed: {
    letter () {
      return (this.value || '').charAt(0)
    }
  }
}
</script>

<style lang="postcss" scoped>
.ButtonLetter--sm {
  @apply w-6 h-6 text-base
}
.ButtonLetter--base {
  @apply w-8 h-8 text-lg
}
.ButtonLetter--lg {
  @apply w-10 h-10 text-xl
}
.ButtonLetter--xl {
  @apply w-12 h-12 text-2xl
}
.ButtonLetter--2xl {
  @apply w-16 h-16 text-3xl
}
.ButtonLetter--3xl {
  @apply .w-20 .h-20 .text-4xl
}
</style>
