<template>
  <InputField
    :label="label"
    :helper-text="helperText || error"
    :is-dirty="$v.model.$dirty"
    :is-disabled="isDisabled"
    :is-focused="isFocused"
    :is-invalid="isInvalid"
    class="InputCurrency"
  >
    <div
      slot-scope="{ inputClass }"
      :class="inputClass"
      class="flex flex-row"
    >
      <input
        ref="input"
        :disabled="isDisabled"
        :name="name"
        v-model.trim="model"
        autocomplete="off"
        class="InputCurrency__input flex flex-grow"
        type="text"
        @blur="onBlur"
        @focus="onFocus"
      >
      <div
        v-if="isMarketEnabled && alternativeCurrency"
        :title="alternativeCurrency"
        class="InputCurrency__alternative-amount flex flex-no-shrink text-grey-dark ml-4"
      >
        {{ alternativeAmount }}
      </div>
    </div>
  </InputField>

</template>

<script>
import { includes, isNumber, isString } from 'lodash'
import { required } from 'vuelidate/lib/validators'
import { MARKET } from '@config'
import store from '@/store'
import InputField from './InputField'

/**
 * Checks if a currency is valid, either as a symbol (€) or code (EUR)
 * @param {String} currency
 * @return {Boolean}
 */
const currencyValidator = currency => {
  const currentNetwork = store.getters['session/network']
  const currencies = [
    currentNetwork.token,
    currentNetwork.symbol,
    ...Object.keys(MARKET.currencies),
    ...Object.values(MARKET.currencies).map(currency => currency.symbol)
  ]
  return includes(currencies, currency)
}

export default {
  name: 'InputCurrency',

  components: {
    InputField
  },

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    alternativeCurrency: {
      type: String,
      required: false,
      default: null,
      validator: currencyValidator
    },
    currency: {
      type: String,
      required: true,
      validator: currencyValidator
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
    label: {
      type: String,
      required: false,
      default () {
        return this.$t('INPUT_CURRENCY.LABEL')
      }
    },
    name: {
      type: String,
      required: false,
      default: 'amount'
    },
    maxAmount: {
      type: Number,
      required: false,
      default: Math.pow(10, 15)
    },
    minAmount: {
      type: Number,
      required: false,
      default: Math.pow(10, -8)
    },
    value: {
      type: [Number, String],
      required: true
    }
  },

  data: vm => ({
    inputValue: vm.value,
    isFocused: false
  }),

  computed: {
    alternativeAmount () {
      const amount = this.checkAmount(this.inputValue) ? parseFloat(this.inputValue) : 0

      return this.currency_format(amount * this.price, { currency: this.alternativeCurrency })
    },

    error () {
      let error = null

      if (this.$v.model.$dirty) {
        if (!this.$v.model.required) {
          error = this.$t('INPUT_CURRENCY.ERROR.REQUIRED')
        } else if (!this.$v.model.isNumber) {
          error = this.$t('INPUT_CURRENCY.ERROR.NOT_VALID')
        } else if (this.$v.model < this.minAmount) {
          error = this.$t('INPUT_CURRENCY.ERROR.LESS_THAN_MINIMUM', { amount: this.minAmount, unit: this.currency })
        } else if (this.$v.model > this.maxAmount) {
          error = this.$t('INPUT_CURRENCY.ERROR.NOT_ENOUGH_AMOUNT', { amount: this.maxAmount, unit: this.currency })
        }
      }

      return error
    },

    formattedValue () {
      return this.checkAmount(this.inputValue)
        ? this.currency_format(parseFloat(this.inputValue), { currency: this.currency })
        : this.inputValue
    },

    isInvalid () {
      return this.$v.model.$dirty && !!this.error
    },

    isMarketEnabled () {
      return this.session_network.market.enabled
    },

    model: {
      get () {
        return this.isFocused ? this.inputValue : this.formattedValue
      },
      set (value) {
        if (this.updateInputValue(value)) {
          this.emitInput(value)
        }
      }
    },

    price () {
      return this.$store.getters['market/lastPrice']
    }
  },

  watch: {
    value (value) {
      this.updateInputValue(value)
    }
  },

  methods: {
    /**
     * Checks that an amount, either a Number or String, is valid
     * @param {(Number|String)} amount
     * @return {Boolean}
     */
    checkAmount (amount) {
      return !!(isNumber(amount) || (isString(amount) && amount.match(/^[0-9]+\.?[0-9]*$/)))
    },
    emitInput (value) {
      this.$emit('input', value)
    },
    onBlur () {
      this.isFocused = false
      this.$emit('blur')
    },
    onFocus () {
      this.isFocused = true
      this.$v.model.$touch()
      this.$emit('focus')
    },
    updateInputValue (value) {
      if (this.checkAmount(value)) {
        // Inform Vuelidate that the value changed
        this.$v.model.$touch()
        this.inputValue = value
        return true
      }
      return false
    }
  },

  validations: {
    model: {
      required,
      isNumber (value) {
        return this.checkAmount(this.inputValue)
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.InputCurrency__input::placeholder {
  @apply .text-transparent
}

.InputCurrency__alternative-amount {
  min-width: 5rem;
  justify-content: flex-end;
}
.InputField--invalid .InputCurrency__alternative-amount {
  @apply .text-red-dark
}
</style>
