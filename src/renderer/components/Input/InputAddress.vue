<template>
  <InputField
    :label="label"
    :helper-text="helperText || neoAddressText || error"
    :is-dirty="$v.model.$dirty"
    :is-disabled="isDisabled"
    :is-focused="isFocused"
    :is-invalid="isInvalid"
    class="InputAddress"
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
        type="text"
        class="InputAddress__input flex flex-grow bg-transparent text-theme-page-text"
        @blur="onBlur"
        @focus="onFocus"
      >
      <ButtonModal
        ref="button-qr"
        :label="''"
        class="InputAddress__qr-button flex flex-no-shrink text-grey-dark hover:text-blue"
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
import InputField from './InputField'
import WalletService from '@/services/wallet'
import axios from 'axios'

export default {
  name: 'InputAddress',

  components: {
    ButtonModal,
    InputField,
    ModalQrCodeScanner
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
    label: {
      type: String,
      required: false,
      default () {
        return this.$t('INPUT_ADDRESS.LABEL')
      }
    },
    name: {
      type: String,
      required: false,
      default: 'address'
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
    neoAddressText: null
  }),

  computed: {
    error () {
      let error = null

      if (this.$v.model.$dirty) {
        if (!this.$v.model.required) {
          error = this.$t('INPUT_ADDRESS.ERROR.REQUIRED')
        } else if (!this.$v.model.isValid) {
          error = this.$t('INPUT_ADDRESS.ERROR.NOT_VALID')
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
        this.updateInputValue(value)
        this.$emit('input', value)
      }
    }
  },

  watch: {
    value (value) {
      this.updateInputValue(value)
    }
  },

  methods: {
    blur () {
      this.$refs.input.blur()
    },
    focus () {
      this.$refs.input.focus()
    },
    onBlur () {
      this.isFocused = false
    },
    onFocus () {
      this.isFocused = true
      this.$emit('focus')
    },
    onDecode (value, toggle) {
      this.$v.model.$touch()
      this.inputValue = this.qr_getAddress(value)
      // Check if we were unable to retrieve an address from the qr
      if ((this.inputValue === '' || this.inputValue === undefined) && this.inputValue !== value) {
        this.$error(this.$t('MODAL_QR_SCANNER.DECODE_FAILED', { data: value }))
      }
      toggle()
    },

    async updateInputValue (value) {
      // Inform Vuelidate that the value changed
      this.$v.model.$touch()
      this.inputValue = value

      if (await this.isNeoAddress(this.inputValue)) {
        this.neoAddressText = this.$t('INPUT_ADDRESS.ERROR.NEO_ADDRESS')
      } else {
        this.neoAddressText = null
      }
    },

    async isNeoAddress (address) {
      // First check if it could be a valid neo address (use 0x17 for mainnet)
      if (WalletService.validateAddress(address, 0x17)) {
        // Then make a call to see if there are any transactions for the given address
        const neoUrl = 'https://neoscan.io/api/main_net/v1/get_last_transactions_by_address/'
        const response = await axios.get(neoUrl + address)
        return response.status === 200 && response.data && response.data.length > 0
      }
      return false
    }
  },

  validations: {
    model: {
      required,
      isValid (value) {
        return WalletService.validateAddress(value, this.pubKeyHash)
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.InputAddress__input::placeholder {
  @apply .text-transparent
}

.InputField--invalid .InputAddress__qr-button {
  @apply .text-red-dark
}
</style>
