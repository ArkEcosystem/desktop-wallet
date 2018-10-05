<template>
  <InputField
    :label="label"
    :helper-text="helperText || error"
    :is-dirty="$v.model.$dirty"
    :is-disabled="isDisabled"
    :is-focused="isFocused"
    :is-invalid="isInvalid"
    class="PassphraseInput"
  >
    <div
      slot-scope="{ inputClass }"
      :class="inputClass"
      class="flex flex-row"
    >
      <input
        ref="input"
        :name="name"
        :disabled="isDisabled"
        v-model="model"
        :type="passphraseIsVisible ? 'text' : 'password'"
        class="PassphraseInput__input flex flex-grow bg-transparent"
        @blur="onBlur"
        @focus="onFocus"
      >

      <button
        :title="$t(passphraseIsVisible ? 'PASSPHRASE_INPUT.HIDE' : 'PASSPHRASE_INPUT.SHOW')"
        class="PassphraseInput__visibility-button flex flex-no-shrink text-grey-dark hover:text-blue mr-2"
        @click="toggleVisible"
      >
        <SvgIcon
          :name="passphraseIsVisible ? 'passphrase-hide' : 'passphrase-show'"
          view-box="0 0 20 20"
        />
      </button>

      <button
        :title="$t('PASSPHRASE_INPUT.QR')"
        class="PassphraseInput__qr-button flex flex-no-shrink text-grey-dark hover:text-blue"
        @click="openQR"
      >
        <SvgIcon
          name="qr"
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
import WalletService from '@/services/wallet'

export default {
  name: 'PassphraseInput',

  components: {
    InputField,
    SvgIcon
  },

  props: {
    address: {
      type: String,
      required: false,
      default: null
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
    isVisible: {
      type: Boolean,
      required: false,
      default: false
    },
    label: {
      type: String,
      required: false,
      default () {
        return this.$t('PASSPHRASE_INPUT.LABEL')
      }
    },
    name: {
      type: String,
      required: false,
      default: 'passphrase'
    },
    pubKeyHash: {
      type: Number,
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },

  data: vm => ({
    inputValue: vm.value,
    isFocused: false,
    passphraseIsVisible: vm.isVisible
  }),

  computed: {
    error () {
      let error = null

      if (this.$v.model.$dirty) {
        if (!this.$v.model.required) {
          error = this.$t('VALIDATION.REQUIRED', [this.label])
        } else if (!this.$v.model.isValid) {
          error = this.$t('VALIDATION.NOT_VALID', [this.label])
        } else if (!this.$v.model.matchAddress) {
          error = this.$t('VALIDATION.NOT_MATCH', [this.label, 'address'])
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
    openQR () {
      // TODO when the QR reader is available
      console.error('QR reader is not available yet')
    },

    toggleVisible () {
      this.passphraseIsVisible = !this.passphraseIsVisible
    }
  },

  // More improvements:
  // TODO (prop) check that the spaces are correct => warn about it
  // TODO (prop) check that the it looks like bip39 => warn about it
  validations: {
    model: {
      required,
      isValid (value) {
        return WalletService.validatePassphrase(value, this.pubKeyHash)
      },
      matchAddress (value) {
        if (this.address) {
          return WalletService.verifyPassphrase(this.address, value, this.pubKeyHash)
        }
        return true
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.PassphraseInput__input::placeholder {
  @apply .text-transparent
}

.InputField--invalid .PassphraseInput__qr-button {
  @apply .text-red-dark
}
.InputField--invalid .PassphraseInput__visibility-button {
  @apply .text-red-dark
}
</style>
