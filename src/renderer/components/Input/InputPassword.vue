<template>
  <InputField
    :label="label"
    :helper-text="helperText || error"
    :is-dirty="$v.model.$dirty"
    :is-disabled="isDisabled"
    :is-focused="isFocused"
    :is-invalid="isInvalid"
    class="InputPassword"
  >
    <div
      slot-scope="{ inputClass }"
      :class="inputClass"
      class="flex flex-row"
    >
      <input
        ref="input"
        v-model="model"
        :name="name"
        :disabled="isDisabled"
        :type="passwordIsVisible ? 'text' : 'password'"
        class="InputPassword__input flex flex-grow bg-transparent text-theme-page-text mr-2"
        @blur="onBlur"
        @focus="onFocus"
      >

      <button
        :title="$t(passwordIsVisible ? 'PASSWORD_INPUT.HIDE' : 'PASSWORD_INPUT.SHOW')"
        class="InputPassword__visibility-button flex flex-no-shrink text-grey-dark hover:text-blue focus:text-blue mr-2"
        type="button"
        @click="toggleVisible"
      >
        <SvgIcon
          :name="passwordIsVisible ? 'passphrase-hide' : 'passphrase-show'"
          view-box="0 0 20 20"
        />
      </button>
    </div>
  </InputField>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { InputField } from '@/components/Input'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'InputPassword',

  components: {
    InputField,
    SvgIcon
  },

  props: {
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
    isVisible: {
      type: Boolean,
      required: false,
      default: false
    },
    isRequired: {
      type: Boolean,
      required: false,
      default: true
    },
    isCreate: {
      type: Boolean,
      required: false,
      default: false
    },
    minLength: {
      type: Number,
      required: false,
      default: 0
    },
    name: {
      type: String,
      required: false,
      default: 'password'
    },
    value: {
      type: String,
      required: false,
      default: () => ''
    },
    label: {
      type: String,
      required: false,
      default () {
        return this.$t('PASSWORD_INPUT.LABEL')
      }
    },
    giveFeedback: {
      type: Boolean,
      required: false,
      default: true
    },
    confirm: {
      type: String,
      required: false,
      default: null
    }
  },

  data: vm => ({
    inputValue: vm.value,
    isFocused: false,
    passwordIsVisible: vm.isVisible
  }),

  computed: {
    error () {
      let error = null

      if (this.$v.model.$dirty) {
        if (!this.$v.model.required) {
          error = this.$t('VALIDATION.REQUIRED', [this.label])
        } else if (!this.$v.model.isValid) {
          error = this.passwordFeedback()
        } else if (!this.$v.model.isConfirmed) {
          error = this.$t('VALIDATION.PASSWORD.NO_MATCH')
        }
      }

      return error
    },
    isInvalid () {
      return this.$v.model.$dirty && !!this.error
    },
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
    }
  },

  watch: {
    value (value) {
      this.inputValue = value
    }
  },

  methods: {
    blur () {
      this.$refs.input.blur()
    },

    async focus () {
      await this.$nextTick()
      this.$refs.input.focus()
    },

    onBlur () {
      this.isFocused = false
    },

    onFocus () {
      this.isFocused = true
      this.$emit('focus')
    },

    reset () {
      this.$v.$reset()
    },

    touch () {
      this.$v.model.$touch()
    },

    async toggleVisible () {
      this.passwordIsVisible = !this.passwordIsVisible
      await this.focus()
    },

    passwordFeedback () {
      if (!this.giveFeedback || (!this.isRequired && !this.model.length)) {
        return ''
      }

      if (this.minLength && this.model.length < this.minLength) {
        return this.$t('VALIDATION.PASSWORD.TOO_SHORT', [this.minLength])
      }

      if (!this.model.match(/[a-z]/)) {
        return this.$t('VALIDATION.PASSWORD.LOWER_CASE')
      }

      if (!this.model.match(/[A-Z]/)) {
        return this.$t('VALIDATION.PASSWORD.UPPER_CASE')
      }

      if (!this.model.match(/[0-9]/)) {
        return this.$t('VALIDATION.PASSWORD.NUMBERS')
      }

      if (!this.model.match(/\W|_/)) {
        return this.$t('VALIDATION.PASSWORD.SPECIAL_CHARACTERS')
      }

      return ''
    }
  },

  validations: {
    model: {
      isConfirmed (value) {
        return !this.confirm || value === this.confirm
      },
      required (value) {
        if (this.isRequired) {
          return required(value)
        }

        return true
      },
      isValid (value) {
        if (!value) {
          return false
        }

        if (!this.isRequired && !value.length) {
          return true
        }

        if (!this.isCreate) {
          return true
        }

        if (this.minLength && value.length < this.minLength) {
          return false
        }

        const containsLowercase = /[a-z]/.test(value)
        const containsUppercase = /[A-Z]/.test(value)
        const containsNumbers = /[0-9]/.test(value)
        const containsSpecial = /\W|_/.test(value)

        return containsLowercase && containsUppercase && containsNumbers && containsSpecial
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.InputPassword__input::placeholder {
  @apply .text-transparent
}

.InputField--invalid .InputPassword__qr-button {
  @apply .text-red-dark
}
.InputField--invalid .InputPassword__visibility-button {
  @apply .text-red-dark
}
</style>
