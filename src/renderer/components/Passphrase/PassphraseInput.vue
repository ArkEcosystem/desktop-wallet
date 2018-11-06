<template>
  <InputField
    :label="label"
    :helper-text="helperText || error"
    :is-dirty="$v.model.$dirty"
    :is-disabled="isDisabled"
    :is-focused="isFocused"
    :is-invalid="isInvalid"
    :warning-text="warning"
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
        class="PassphraseInput__input flex flex-grow bg-transparent text-theme-page-text"
        @blur="onBlur"
        @focus="onFocus"
      >

      <button
        :title="$t(passphraseIsVisible ? 'PASSPHRASE_INPUT.HIDE' : 'PASSPHRASE_INPUT.SHOW')"
        class="PassphraseInput__visibility-button flex flex-no-shrink text-grey-dark hover:text-blue mr-2"
        type="button"
        @click="toggleVisible"
      >
        <SvgIcon
          :name="passphraseIsVisible ? 'passphrase-hide' : 'passphrase-show'"
          view-box="0 0 20 20"
        />
      </button>

      <ButtonModal
        ref="button-qr"
        :label="''"
        class="PassphraseInput__qr-button flex flex-no-shrink text-grey-dark hover:text-blue"
        icon="qr"
        view-box="0 0 20 20"
      >
        <template slot-scope="{ toggle, isOpen }">
          <ModalQrCodeScanner
            v-if="isOpen"
            :toggle="toggle"
            @close="toggle"
            @decoded="onDecode"
          />
        </template>
      </ButtonModal>
    </div>
  </InputField>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { ButtonModal } from '@/components/Button'
import { ModalQrCodeScanner } from '@/components/Modal'
import { InputField } from '@/components/Input'
import SvgIcon from '@/components/SvgIcon'
import WalletService from '@/services/wallet'

export default {
  name: 'PassphraseInput',

  components: {
    ButtonModal,
    InputField,
    ModalQrCodeScanner,
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
    notBip39Warning: {
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
      required: false,
      default: () => ''
    }
  },

  data: vm => ({
    inputValue: vm.value,
    isFocused: false,
    passphraseIsVisible: vm.isVisible
  }),

  computed: {
    error () {
      if (this.$v.model.$dirty) {
        if (!this.$v.model.required) {
          return this.$t('VALIDATION.REQUIRED', [this.label])
        } else if (!this.$v.model.isValid) {
          return this.$t('VALIDATION.NOT_VALID', [this.label])
        } else if (!this.$v.model.matchAddress) {
          return this.$t('VALIDATION.NOT_MATCH', [this.label, 'address'])
        }
      }

      return null
    },
    warning () {
      if (this.$v.model.$dirty) {
        if (this.notBip39Warning && !this.isBip39) {
          return this.$t('VALIDATION.WARNING_NOT_BIP39', [this.label])
        }
      }

      return null
    },
    isInvalid () {
      return this.$v.model.$dirty && !!this.error
    },
    isBip39 () {
      return this.notBip39Warning && WalletService.isBip39Passphrase(this.inputValue, this.session_profile.bip39Language)
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
    onDecode (value, toggle) {
      this.$v.model.$touch()
      this.inputValue = this.qr_getPassphrase(value)
      // Check if we were unable to retrieve a passphrase from the qr
      if ((this.inputValue === '' || this.inputValue === undefined) && this.inputValue !== value) {
        this.$error(this.$t('MODAL_QR_SCANNER.DECODE_FAILED', { data: value }))
      }
      toggle()
    },

    toggleVisible () {
      this.passphraseIsVisible = !this.passphraseIsVisible
    }
  },

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
