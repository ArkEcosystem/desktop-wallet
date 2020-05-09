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
import Cycled from 'cycled'
import { orderBy } from 'lodash'
import { isEmpty } from '@/utils'
import { ButtonModal } from '@/components/Button'
import ModalQrCodeScanner from '@/components/Modal/ModalQrCodeScanner'
import { MenuDropdown } from '@/components/Menu'
import InputField from './InputField'

export default {
  name: 'InputDelegate',

  components: {
    ButtonModal,
    InputField,
    ModalQrCodeScanner,
    MenuDropdown
  },

  props: {
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
      return Object.values(this.$store.getters['delegate/bySessionNetwork'] || {})
    },

    error () {
      if (this.$v.model.$dirty && (!this.hasSuggestions || !this.$refs.dropdown.isOpen)) {
        if (!this.$v.model.required) {
          return this.$t('INPUT_DELEGATE.ERROR.REQUIRED')
        } else if (!this.$v.model.isValid) {
          if (this.inputValue.length <= 20) {
            return this.$t('INPUT_DELEGATE.ERROR.USERNAME_NOT_FOUND', [this.inputValue])
          } else if (this.inputValue.length <= 34) {
            return this.$t('INPUT_DELEGATE.ERROR.ADDRESS_NOT_FOUND', [this.wallet_truncate(this.inputValue)])
          } else {
            return this.$t('INPUT_DELEGATE.ERROR.PUBLIC_KEY_NOT_FOUND', [this.wallet_truncate(this.inputValue)])
          }
        } else {
          this.$emit('valid', true)
        }
      } else {
        this.$emit('valid', false)
      }

      return null
    },

    hasSuggestions () {
      return !isEmpty(this.suggestions)
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
      if (!this.currentProfile) {
        return []
      }

      const delegates = this.delegates.map(object => {
        const delegate = {
          name: null,
          username: object.username,
          address: object.address,
          publicKey: object.publicKey
        }

        delegate.name = `${object.username} (${this.wallet_truncate(object.address)})`

        return delegate
      })

      const results = orderBy(delegates, (object) => {
        return object.name || object.address.toLowerCase()
      })

      return results.reduce((delegates, delegate) => {
        Object.values(delegate).forEach(prop => {
          if (prop.toLowerCase().includes(this.inputValue.toLowerCase())) {
            delegates[delegate.username] = delegate.name
          }
        })

        return delegates
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

    onBlur (event) {
      // Verifies that the element that generated the blur was a dropdown item
      if (event.relatedTarget) {
        const classList = event.relatedTarget.classList

        const isDropdownItem = classList && typeof classList.contains === 'function'
          ? classList.contains('MenuDropdownItem__button')
          : false

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
      if (!this.dropdownValue) {
        return
      }

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

      const delegate = this.$store.getters['delegate/byAddress'](address)
      this.model = delegate ? delegate.username : address

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
      if (!this.hasSuggestions) {
        return
      }

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
        return !!this.$store.getters['delegate/search'](value)
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
