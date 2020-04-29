<template>
  <section
    :class="[{
      'InputField--dirty': isDirty,
      'InputField--disabled': isDisabled,
      'InputField--focused': isFocused,
      'InputField--invalid': isInvalid,
      'InputField--warning': !isInvalid && !!warningText
    }]"
    class="InputField"
  >
    <div
      class="InputField__wrapper relative appearance-none mb-1 inline-flex items-end w-full h-12"
    >
      <slot :inputClass="inputClass" />
      <label
        v-show="label"
        class="InputField__label absolute pointer-events-none text-theme-page-text-light truncate"
      >
        {{ label }}
      </label>
    </div>
    <p
      v-show="warningText || helperText"
      class="InputField__helper text-theme-page-text-light text-xs mt-1 break-words"
    >
      <slot name="helper">
        {{ warningText || helperText }}
      </slot>
    </p>
  </section>
</template>

<script>
export default {
  name: 'InputField',

  props: {
    label: {
      type: String,
      required: false,
      default: null
    },
    helperText: {
      type: String,
      required: false,
      default: null
    },
    isDirty: {
      type: Boolean,
      required: false,
      default: false
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    isFocused: {
      type: Boolean,
      required: false,
      default: false
    },
    isInvalid: {
      type: Boolean,
      required: false,
      default: false
    },
    warningText: {
      type: String,
      required: false,
      default: null
    }
  },

  computed: {
    inputClass () {
      return 'InputField__input w-full pt-3 pin-l bg-transparent transition border-b border-theme-input-field-border text-theme-page-text hover:border-theme-page-text focus:border-blue h-10'
    }
  }
}
</script>

<style lang="postcss" scoped>
.InputField--disabled {
  pointer-events: none;
}

.InputField__label {
  bottom: 0.5em;
  transform-origin: left top;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1)
}

.InputField--focused .InputField__label,
.InputField--dirty .InputField__label {
  @apply .font-semibold;
  bottom: 0.4em;
  transform: translate(0%, -100%) scale(0.75);
}

.InputField--focused .InputField__label {
  @apply .text-blue
}

.InputField--disabled .InputField__input {
  @apply .text-theme-page-text-light .border-dotted
}

.InputField--invalid .InputField__label,
.InputField--invalid .InputField__helper {
  @apply .text-red-dark
}
.InputField--invalid .InputField__input {
  @apply .border-red-dark
}

.InputField--warning .InputField__label,
.InputField--warning .InputField__helper {
  @apply .text-orange-dark
}
.InputField--warning .InputField__input {
  @apply .border-orange-dark
}
</style>
