<template>
  <section
    :class="[{
      'TextField--disabled': isDisabled,
      'TextField--readonly': isReadonly,
      'TextField--invalid': isInvalid,
      'TextField--focused': isFocused,
      'TextField--dirty': isDirty
    }]"
    class="TextField"
  >
    <div
      class="TextField__wrapper relative appearance-none mb-1 inline-flex items-end h-12">
      <input
        ref="inputTarget"
        :disabled="isDisabled"
        :readonly="isReadonly"
        :name="name"
        :type="type"
        :value="value"
        v-model="model"
        class="TextField__input w-full pt-3 pin-l bg-transparent transition border-b border-theme-page-text-light text-theme-page-text hover:border-theme-page-text focus:border-blue h-10"
        @focus="onFocus"
        @blur="onBlur"
      >
      <label
        class="TextField__label absolute pointer-events-none text-theme-page-text-light">
        {{ label }}
      </label>
    </div>
    <p
      v-show="helperText"
      class="TextField__helper text-theme-page-text-light text-xs mt-1">
      <slot name="helper">
        {{ helperText }}
      </slot>
    </p>
  </section>
</template>

<script>
export default {
  name: 'TextField',

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    label: {
      type: String,
      required: true
    },

    name: {
      type: String,
      required: true
    },

    type: {
      type: String,
      required: false,
      default: 'text'
    },

    helperText: {
      type: String,
      required: false,
      default: null
    },

    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },

    isReadonly: {
      type: Boolean,
      required: false,
      default: false
    },

    isInvalid: {
      type: Boolean,
      required: false,
      default: false
    },

    value: {
      type: String,
      required: false,
      default: undefined
    }
  },

  data: vm => ({
    inputValue: vm.value,
    isFocused: false
  }),

  computed: {
    model: {
      get () {
        return this.inputValue
      },

      set (value) {
        this.inputValue = value
        this.$emit('input', value)
      }
    },

    isDirty () {
      return !!this.inputValue
    }
  },

  methods: {
    onFocus () {
      this.isFocused = true
    },

    onBlur () {
      this.isFocused = false
    },

    focus () {
      this.$refs.inputTarget.focus()
    },

    blur () {
      this.$refs.inputTarget.blur()
    },

    emitInput (e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>

<style lang="postcss" scoped>
.TextField--disabled,
.TextField--readonly {
  pointer-events: none;
}

.TextField__input::placeholder {
  @apply .text-transparent
}

.TextField__label {
  bottom: 0.5em;
  transform-origin: left top;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1), color 150ms cubic-bezier(0.4, 0, 0.2, 1)
}

.TextField--focused .TextField__label,
.TextField--dirty .TextField__label {
  @apply .font-semibold;
  bottom: 0.4em;
  transform: translate(0%, -100%) scale(0.75);
}

.TextField--focused .TextField__label {
  @apply .text-blue
}

.TextField--disabled .TextField__input {
  @apply .text-theme-page-text-light .border-dotted
}

.TextField--invalid .TextField__label,
.TextField--invalid .TextField__helper {
  @apply .text-red-dark
}
.TextField--invalid .TextField__input {
  @apply .border-red-dark
}
</style>
