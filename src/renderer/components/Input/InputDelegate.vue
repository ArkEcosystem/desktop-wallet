<template>
  <MenuDropdown
    ref="dropdown"
    :items="suggestions"
    :value="dropdownValue"
    :pin-to-input-width="true"
    class="InputDelegate__MenuDropdown"
    @select="onDropdownSelect"
    @click="focus"
  >
    <InputField
      slot="handler"
      :label="label"
      :helper-text="error || getHelperText()"
      :is-dirty="$v.model.$dirty"
      :is-disabled="isDisabled"
      :is-focused="isFocused"
      :is-invalid="invalid"
      class="InputDelegate text-left"
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
          class="InputDelegate__input flex flex-grow bg-transparent text-theme-page-text"
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
          class="InputDelegate__qr-button flex flex-no-shrink text-grey-dark hover:text-blue"
          icon="qr"
          view-box="0 0 20 20"
          @click.stop
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
import ModalQrCodeScanner from '@/components/Modal/ModalQrCodeScanner'
import { MenuDropdown } from '@/components/Menu'
import Cycled from 'cycled'
import InputField from './InputField'
import truncate from '@/filters/truncate'
import _ from 'lodash'

export default {
  name: 'InputDelegate',

  components: {
    ButtonModal,
    InputField,
    ModalQrCodeScanner,
    MenuDropdown
  },

  props: {
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    label: {
      type: String,
      required: false,
      default () {
        return this.$t('SEARCH.DELEGATE')
      }
    },
    name: {
      type: String,
      required: false,
      default: 'delegate'
    },
    helperText: {
      type: String,
      required: false,
      default: () => ''
    },
    value: {
      type: String,
      required: true,
      default: () => ''
    },
    isInvalid: {
      type: Boolean,
      required: false,
      default: false
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

    delegates () {
      return this.$store.getters['delegate/bySessionNetwork']
    },

    error () {
      let error = null

      if (this.$v.model.$dirty && (!this.hasSuggestions || !this.$refs.dropdown.isOpen)) {
        if (!this.$v.model.required) {
          error = this.$t('INPUT_DELEGATE.ERROR.REQUIRED')
        } else if (!this.$v.model.isValidUsername && !this.$v.model.isValidAddress && this.inputValue.length <= 20) {
          error = this.$t('INPUT_DELEGATE.ERROR.USERNAME_NOT_FOUND', [this.inputValue])
        } else if (!this.$v.model.isValidAddress && !this.$v.model.isValidUsername) {
          error = this.$t('INPUT_DELEGATE.ERROR.ADDRESS_NOT_FOUND', [this.wallet_truncate(this.inputValue)])
        }
      }

      return error
    },

    hasSuggestions () {
      return !_.isEmpty(this.suggestions)
    },

    invalid () {
      return this.$v.model.$dirty && (this.isInvalid || !!this.error)
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
      if (!this.currentProfile) return []

      const delegates = _.map(this.delegates, (object) => {
        const delegate = {
          name: null,
          username: object.username,
          address: object.address
        }

        delegate.name = `${truncate(object.username, 25)} (${this.wallet_truncate(object.address)})`

        return delegate
      })

      const results = _.orderBy(delegates, (object) => {
        return object.name || object.address.toLowerCase()
      })

      return results.reduce((map, delegate, index) => {
        const value = delegate.name || delegate.address
        const searchValue = value.toLowerCase()

        if (_.includes(searchValue, this.inputValue.toLowerCase())) {
          map[delegate.username] = value
        }

        return map
      }, {})
    },

    suggestionsKeys () {
      return new Cycled(Object.keys(this.suggestions))
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
    getHelperText () {
      return (!this.$refs.dropdown || !this.$refs.dropdown.isOpen) ? this.helperText : ''
    },

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
      const address = this.qr_getAddress(value)

      // Check if we were unable to retrieve an address from the qr
      if ((address === '' || address === undefined) && address !== value) {
        this.$error(this.$t('MODAL_QR_SCANNER.DECODE_FAILED', { data: value }))
      }

      this.model = this.$store.getters['delegate/byAddress'](address).username
      this.$nextTick(() => {
        this.closeDropdown()
        toggle()
      })
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
      isValidUsername (username) {
        return !!this.$store.getters['delegate/byUsername'](username)
      },
      isValidAddress (address) {
        return !!this.$store.getters['delegate/byAddress'](address)
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.InputDelegate__MenuDropdown .MenuDropdown__container {
  @apply .z-30
}
.InputDelegate__MenuDropdown .MenuDropdownItem__container {
  @apply .text-left
}
.InputDelegate__input::placeholder {
  @apply .text-transparent
}

.InputField--invalid .InputDelegate__qr-button {
  @apply .text-red-dark
}
</style>
