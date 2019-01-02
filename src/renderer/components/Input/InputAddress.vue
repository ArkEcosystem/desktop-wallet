<template>
  <MenuDropdown
    ref="dropdown"
    :items="suggestions"
    :value="dropdownValue"
    :pin-to-input-width="true"
    class="InputAddress__MenuDropdown"
    @select="onDropdownSelect"
    @click="focus"
  >
    <InputField
      slot="handler"
      :label="label"
      :helper-text="helperText || error || notice"
      :is-dirty="$v.model.$dirty"
      :is-disabled="isDisabled"
      :is-focused="isFocused"
      :is-invalid="isInvalid"
      class="InputAddress text-left"
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
          @click.self.stop
          @keyup.up="onKeyUp"
          @keyup.down="onKeyDown"
          @keyup.esc="onEsc"
          @keyup.enter="onEnter"
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
              @decoded="onDecodeQR"
            />
          </template>
        </ButtonModal>
      </div>
    </InputField>
  </MenuDropdown>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { ButtonModal } from '@/components/Button'
import { ModalQrCodeScanner } from '@/components/Modal'
import { MenuDropdown } from '@/components/Menu'
import Cycled from 'cycled'
import InputField from './InputField'
import WalletService from '@/services/wallet'
import truncate from '@/filters/truncate'
import _ from 'lodash'

export default {
  name: 'InputAddress',

  components: {
    ButtonModal,
    InputField,
    ModalQrCodeScanner,
    MenuDropdown
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
    showSuggestions: {
      type: Boolean,
      required: false,
      default: false
    },
    value: {
      type: String,
      required: true
    }
  },

  data: vm => ({
    inputValue: vm.value,
    dropdownValue: null,
    isFocused: false
  }),

  computed: {
    currentProfile () {
      return this.session_profile
    },

    error () {
      let error = null

      if (!this.isDisabled && this.$v.model.$dirty && !(this.hasSuggestions && this.isFocused)) {
        if (!this.$v.model.required) {
          error = this.$t('INPUT_ADDRESS.ERROR.REQUIRED')
        } else if (!this.$v.model.isValid) {
          error = this.$t('INPUT_ADDRESS.ERROR.NOT_VALID')
        } else if (!this.$v.model.isNotNeoAddress && !this.$v.model.$pending) {
          error = this.$t('INPUT_ADDRESS.ERROR.NEO_ADDRESS')
        }
      }

      return error
    },

    hasSuggestions () {
      return !_.isEmpty(this.suggestions)
    },

    isInvalid () {
      return this.$v.model.$dirty && !!this.error
    },

    model: {
      get () {
        return this.dropdownValue || this.inputValue
      },
      set (value) {
        this.updateInputValue(value)
        this.$emit('input', value)
      }
    },

    suggestions () {
      if (!this.currentProfile || !this.showSuggestions) return []

      const ledgerWallets = this.$store.getters['ledger/isConnected'] ? this.$store.getters['ledger/wallets'] : []
      const wallets = [
        ...this.$store.getters['wallet/byProfileId'](this.currentProfile.id),
        ...ledgerWallets
      ]
      const contacts = this.$store.getters['wallet/contactsByProfileId'](this.currentProfile.id)

      const source = _.unionBy(wallets, contacts, 'address')

      const addresses = _.map(source, (wallet) => {
        const address = {
          name: null,
          address: wallet.address
        }
        if (wallet.name && wallet.name !== wallet.address) {
          address.name = `${truncate(wallet.name, 25)} (${this.wallet_truncate(wallet.address)})`
        }

        return address
      })

      const results = _.orderBy(addresses, (object) => {
        return object.name || object.address.toLowerCase()
      })

      return results.reduce((map, wallet, index) => {
        const value = wallet.name || wallet.address
        const searchValue = value.toLowerCase()

        if (_.includes(searchValue, this.inputValue.toLowerCase())) {
          map[wallet.address] = value
        }

        return map
      }, {})
    },

    suggestionsKeys () {
      return new Cycled(Object.keys(this.suggestions))
    },

    notice () {
      const knownAddress = this.wallet_name(this.inputValue)
      if (knownAddress) {
        return this.$t('INPUT_ADDRESS.KNOWN_ADDRESS', { address: knownAddress })
      }
      return null
    }
  },

  watch: {
    value (val) {
      this.updateInputValue(val)
    },

    isFocused () {
      if (this.isFocused && this.hasSuggestions) {
        this.openDropdown()
      }
    },

    inputValue () {
      this.dropdownValue = null
      if (this.isFocused && this.hasSuggestions) {
        this.openDropdown()
      }
    }
  },

  mounted () {
    if (this.value) {
      this.updateInputValue(this.value)
    }
  },

  methods: {
    blur () {
      this.$refs.input.blur()
    },

    focus () {
      this.$refs.input.focus()
    },

    onBlur (evt) {
      // Verifies that the element that generated the blur was a dropdown item
      if (evt.relatedTarget) {
        const classList = evt.relatedTarget.classList || []
        const isDropdownItem = _.includes(classList, 'MenuDropdownItem__button')

        if (!isDropdownItem) {
          this.closeDropdown()
        }
      } else if (this.$refs.dropdown.isOpen) {
        this.closeDropdown()
      }

      this.isFocused = false

      // If the user selects a suggestion and leaves the input
      if (this.dropdownValue) {
        this.onEnter()
      }
    },

    onDropdownSelect (value) {
      this.model = value
      this.$nextTick(() => this.closeDropdown())
    },

    onFocus () {
      this.isFocused = true
      this.$emit('focus')
    },

    onEnter () {
      if (!this.dropdownValue) return
      this.model = this.dropdownValue

      this.$nextTick(() => {
        this.closeDropdown()
        this.$refs.input.setSelectionRange(this.inputValue.length, this.inputValue.length)
      })
    },

    onEsc () {
      this.dropdownValue = null
      this.closeDropdown()
    },

    onKeyUp () {
      const next = this.dropdownValue ? this.suggestionsKeys.previous() : this.suggestionsKeys.current()
      this.__setSuggestion(next)
    },

    onKeyDown () {
      const next = this.dropdownValue ? this.suggestionsKeys.next() : this.suggestionsKeys.current()
      this.__setSuggestion(next)
    },

    onDecodeQR (value, toggle) {
      this.model = this.qr_getAddress(value)

      // Check if we were unable to retrieve an address from the qr
      if ((this.inputValue === '' || this.inputValue === undefined) && this.inputValue !== value) {
        this.$error(this.$t('MODAL_QR_SCANNER.DECODE_FAILED', { data: value }))
      }
      toggle()
    },

    closeDropdown () {
      this.$refs.dropdown.close()
    },

    openDropdown () {
      this.$refs.dropdown.open()
    },

    async updateInputValue (value) {
      this.inputValue = value
      // Inform Vuelidate that the value changed
      this.$v.model.$touch()
    },

    __setSuggestion (value) {
      if (!this.hasSuggestions) return

      this.dropdownValue = value
      this.$nextTick(() => {
        this.$refs.input.setSelectionRange(this.inputValue.length, this.dropdownValue.length)
      })
    }
  },

  validations: {
    model: {
      required,
      isValid (value) {
        return WalletService.validateAddress(value, this.pubKeyHash)
      },
      async isNotNeoAddress (value) {
        const result = await WalletService.isNeoAddress(value)
        return !result
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.InputAddress__MenuDropdown .MenuDropdown__container {
  @apply .z-30
}
.InputAddress__MenuDropdown .MenuDropdownItem__container {
  @apply .text-left
}
.InputAddress__input::placeholder {
  @apply .text-transparent
}

.InputField--invalid .InputAddress__qr-button {
  @apply .text-red-dark
}
</style>
