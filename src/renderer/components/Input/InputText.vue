<template>
  <InputField
    :label="label"
    :helper-text="helperText"
    :is-dirty="isDirty"
    :is-disabled="isDisabled"
    :is-focused="isFocused"
    :is-invalid="isInvalid"
    :warning-text="warning"
    :is-read-only="isReadOnly"
    class="InputText"
  >
    <div
      slot-scope="{ inputClass }"
      :class="inputClass"
      class="flex items-baseline"
    >
      <slot name="left" />
      <input
        ref="input"
        v-model="model"
        :class="[{
          'InputText__input--read-only': isReadOnly,
          'InputText__input--large': isLarge
        }]"
        :name="name"
        :disabled="isDisabled || isReadOnly"
        :type="type"
        :value="value"
        :placeholder="placeholder"
        class="InputText__input flex-1"
        @focus="onFocus"
        @blur="onBlur"
      >
      <slot name="right" />
    </div>
  </InputField>
</template>

<script>
import InputField from './InputField'
import WalletService from '@/services/wallet'

export default {
  name: 'InputText',

  components: {
    InputField
  },

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
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
    bip39Warning: {
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
        // Inform Vuelidate that the value changed
        this.$v.model.$touch()
        this.$emit('input', value)
      }
    },
    isDirty () {
      return !!this.inputValue
    },
    isWarning () {
      return !!this.isDirty && !!this.warning
    },
    warning () {
      if (this.$v.model.$dirty) {
        if (this.$v.model.isBip39) {
          return this.$t('VALIDATION.WARNING_BIP39', [this.label])
        }
      }

      return null
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
  },

  validations: {
    model: {
      isBip39 (value) {
        if (!this.bip39Warning) {
          return false
        }

        return WalletService.isBip39Passphrase(value, this.session_profile.bip39Language)
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.InputText__input {
  @apply bg-transparent text-theme-page-text
}

.InputText__input::placeholder {
  @apply .text-transparent;
  transition: color 0s;
}

.InputField--focused .InputText__input::placeholder {
  @apply .text-theme-page-text-light;
  transition: color 0.1s;
}

.InputText__input--large {
  @apply .text-xl
}

.InputText__input--read-only {
  cursor: text;
}
</style>
