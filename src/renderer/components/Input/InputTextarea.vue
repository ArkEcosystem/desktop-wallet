<template>
  <InputField
    :label="label"
    :helper-text="helperText"
    :is-dirty="isInputDirty"
    :is-disabled="isDisabled"
    :is-focused="isFocused"
    :is-invalid="isInvalid"
    :is-read-only="isReadOnly"
    class="InputTextarea"
  >
    <div
      slot-scope="{ inputClass }"
      :class="inputClass"
      class="flex items-baseline"
    >
      <textarea
        ref="textarea"
        v-model="model"
        :class="[{
          'InputTextarea__input--read-only': isReadOnly,
          'InputTextarea__input--large': isLarge
        }]"
        :name="name"
        :disabled="isDisabled || isReadOnly"
        :rows="rows"
        :placeholder="placeholder"
        class="InputTextarea__input flex-1"
        @focus="onFocus"
        @blur="onBlur"
      />
    </div>
  </InputField>
</template>

<script>
import InputField from './InputField'

export default {
  name: 'InputTextarea',

  components: {
    InputField
  },

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    rows: {
      type: Number,
      required: false,
      default: 5
    },
    label: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: false,
      default: ''
    },
    name: {
      type: String,
      required: true
    },
    helperText: {
      type: String,
      required: false,
      default: null
    },
    isLarge: {
      type: Boolean,
      required: false,
      default: false
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    isDirty: {
      type: Boolean,
      required: false,
      default: false
    },
    isInvalid: {
      type: Boolean,
      required: false,
      default: false
    },
    isReadOnly: {
      type: Boolean,
      required: false,
      default: false
    },
    value: {
      type: [String],
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
    isInputDirty () {
      return this.isDirty || !!this.inputValue
    }
  },

  watch: {
    value (val) {
      this.inputValue = val
    }
  },

  methods: {
    onFocus () {
      this.isFocused = true
      this.$emit('focus')
    },

    onBlur () {
      this.isFocused = false
    },

    focus () {
      this.$refs.input.focus()
    },

    blur () {
      this.$refs.input.blur()
    }
  }
}
</script>

<style lang="postcss" scoped>
.InputTextarea .InputField__wrapper {
  height: auto!important
}

.InputTextarea .InputField__input {
  height: auto!important
}

.InputTextarea .InputField__label {
  bottom: auto!important;
  top: .95rem;
}

.InputTextarea__input {
  @apply .bg-transparent .text-theme-page-text .h-full
}

.InputTextarea__input::placeholder {
  @apply .text-transparent;
  transition: color 0s;
}

.InputField--focused .InputTextarea__input::placeholder {
  @apply .text-theme-page-text-light;
  transition: color 0.1s;
}

.InputTextarea__input--large {
  @apply .text-xl
}

.InputTextarea__input--read-only {
  cursor: text;
}
</style>
