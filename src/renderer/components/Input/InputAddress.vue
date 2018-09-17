<template>
  <InputField
    :label="label"
    :helper-text="helperText || error"
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
        :name="name"
        :disabled="isDisabled"
        v-model="model"
        type="text"
        class="InputAddress__input flex flex-grow"
        @blur="onBlur"
        @focus="onFocus"
      >
      <button
        class="InputAddress__qr-button flex flex-no-shrink text-grey-dark hover:text-blue"
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
import InputField from './InputField'
import SvgIcon from '@/components/SvgIcon'
import WalletService from '@/services/wallet'

export default {
  name: 'InputAddress',

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
    isFocused: false
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
        this.inputValue = value
        // Inform Vuelidate that the value changed
        this.$v.model.$touch()
        this.$emit('input', value)
      }
    }
  },

  watch: {
    value (val) {
      this.inputValue = val
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

    openQR () {
      // TODO when the QR reader is available
      console.error('QR reader is not available yet')
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
