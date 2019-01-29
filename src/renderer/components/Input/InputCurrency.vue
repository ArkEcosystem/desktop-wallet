<template>
  <InputField
    :label="label"
    :helper-text="helperText || error"
    :is-dirty="$v.model.$dirty"
    :is-disabled="isDisabled"
    :is-focused="isFocused"
    :is-invalid="isInvalid"
    :warning-text="warningText"
    class="InputCurrency"
  >
    <div
      slot-scope="{ inputClass }"
      :class="inputClass"
      class="flex flex-row"
    >
      <input
        ref="input"
        v-model.trim="model"
        :disabled="isDisabled"
        :name="name"
        autocomplete="off"
        class="InputCurrency__input flex flex-grow bg-transparent text-theme-page-text"
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
 * This component uses a String value internally to avoid several problems, such
 * as showing the exponential notation, although it emits a Number always.
 * It also support a `raw` event, that can be used by other components to receive
 * the internal String value.
 */
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
      default: null
    },
    currency: {
      type: String,
      required: true
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
    maximumAmount: {
      type: Number,
      required: false,
      default: Math.pow(10, 7)
    },
    maximumError: {
      type: String,
      required: false,
      default: null
    },
    minimumAmount: {
      type: Number,
      required: false,
      default: 1e-8
    },
    minimumError: {
      type: String,
      required: false,
      default: null
    },
    customError: {
      type: String,
      required: false,
      default: null
    },
    warningText: {
      type: String,
      required: false,
      default: null
    },
    notValidError: {
      type: String,
      required: false,
      default: null
    },
    required: {
      type: Boolean,
      required: false,
      default: false
    },
    value: {
      type: [Number, String],
      required: true
    },
    walletNetwork: {
      type: Object,
      required: false,
      default: null
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
      if (!this.isDisabled && this.$v.model.$dirty) {
        if (!this.currencyValidator(this.currency)) {
          return 'INVALID CURRENCY'
        } else if (this.alternativeCurrency && !this.currencyValidator(this.alternativeCurrency)) {
          return 'INVALID CURRENCY'
        } else if (this.required && !this.$v.model.isRequired) {
          return this.$t('INPUT_CURRENCY.ERROR.REQUIRED')
        } else if (!this.$v.model.isNumber) {
          if (this.notValidError) {
            return this.notValidError
          } else {
            return this.$t('INPUT_CURRENCY.ERROR.NOT_VALID')
          }
        } else if (!this.$v.model.isLessThanMaximum) {
          if (this.maximumError) {
            return this.maximumError
          } else {
            const amount = this.currency_format(this.maximumAmount, { currency: this.currency })
            return this.$t('INPUT_CURRENCY.ERROR.NOT_ENOUGH_AMOUNT', { amount })
          }
        } else if (!this.$v.model.isMoreThanMinimum) {
          if (this.minimumError) {
            return this.minimumError
          } else {
            const amount = this.currency_format(this.minimumAmount, { currency: this.currency })
            return this.$t('INPUT_CURRENCY.ERROR.LESS_THAN_MINIMUM', { amount })
          }
        } else if (this.customError) {
          return this.customError
        }
      }

      return null
    },

    formattedValue () {
      return this.checkAmount(this.inputValue)
        ? this.currency_format(parseFloat(this.inputValue), { currency: this.currency })
        : this.inputValue
    },

    /**
     * When in doubt, the separator of the current locale may be used.
     * An example is "9,999": is it 9.999 or is it 9999?
     */
    decimalSeparator () {
      const example = this.currency_format(9.9, { currency: this.currency })
      return example.match(/9(.)9/)[1]
    },
    thousandSeparator () {
      return this.decimalSeparator === '.' ? ',' : '.'
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
    value: {
      handler (val) {
        this.updateInputValue(val)
      },
      immediate: true
    }
  },

  methods: {
    /**
     * Checks that an amount, either a Number or String, is valid or it could
     * be sanitized to a valid Number
     * @param {(Number|String)} amount
     * @return {Boolean}
     */
    checkAmount (amount) {
      return !!(isNumber(amount) || (isString(amount) && amount.match(/^\W*[0-9.,]+([,. _]+[0-9]+)*\W*$/)))
    },
    /**
     * Emits the raw input value (`raw`), as String, and the Number value (`input`)
     */
    emitInput (value) {
      this.$emit('raw', value)

      const numeric = value ? parseFloat(this.sanitizeNumeric(value)) : 0
      this.$emit('input', numeric || 0)
    },
    focus () {
      this.$refs.input.focus()
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
    /**
     * Parses a numeric value (Number o String) and returns it as a String, but
     * keeping the same format that a float would use (e.g: 12.12 instead of 12,12).
     * It is able to recognize that 9,999 is 9999, but 1,1 is 1.1.
     * @param {(Number|String)}
     * @return String
     */
    sanitizeNumeric (value) {
      let numeric = value.toString()
      let includesThousandSeparator = numeric.includes(this.thousandSeparator)

      // On tiny numbers with exponential notation (1e-8), use their exponent as the number of decimals
      if (numeric.includes('e-')) {
        return Number(numeric)
          .toFixed(numeric.toString()
            .split('-')[1])
      } else {
        if (numeric.startsWith('.')) {
          numeric = `0${numeric}`
        } else if (numeric.startsWith(',')) {
          numeric = `0.${numeric.slice(1)}`
          // The separator has been modified
          includesThousandSeparator = false
        }

        const dot = numeric.includes('.')
        const colon = numeric.includes(',')

        if (dot && colon) {
          numeric = numeric.replace(/,/g, '.')
        // If only includes 1 kind of ambiguous separator, convert it to '.'
        } if (dot || colon) {
          numeric = numeric.replace(/[.,]+/, '.')
        }

        // These characters are always thousand separators
        const nonAmbiguousSeparators = /[ _]/g
        let hasNonAmbiguosAndDecimalSeparators = false

        if (numeric.match(nonAmbiguousSeparators)) {
          numeric = numeric.replace(nonAmbiguousSeparators, '')
          // So, if there is other separator, it is for the decimals
          if (dot || colon) {
            hasNonAmbiguosAndDecimalSeparators = true
          }
        }

        const digits = numeric.split('.')

        if (digits.length === 1) {
          return digits[0]
        } else {
          const last = digits.slice(-1)[0]

          // Cases like "1 000,001" should be treated like 1000.001 independently of the locale
          if (last.length === 3 && includesThousandSeparator && !hasNonAmbiguosAndDecimalSeparators) {
            return `${digits.slice(0, -1).join('')}${last}`
          } else {
            return `${digits.slice(0, -1).join('')}.${last}`
          }
        }
      }
    },
    /*
     * Establishes the "internal" value (`inputValue`) of the component
     * @param {(String|Number)} value
     * @return Boolean
     */
    updateInputValue (value) {
      if (value === '') {
        this.inputValue = ''
        return true
      } else if (value && this.checkAmount(value)) {
        this.inputValue = this.sanitizeNumeric(value)

        // Inform Vuelidate that the value changed
        this.$v.model.$touch()
        return true
      }
      return false
    },
    /**
     * Checks if a currency is valid, either as a symbol (€) or code (EUR)
     * @param {String} currency
     * @return {Boolean}
     */
    currencyValidator (currency) {
      const currentNetwork = this.walletNetwork || store.getters['session/network']
      const currencies = [
        currentNetwork.token,
        currentNetwork.subunit,
        currentNetwork.symbol,
        ...Object.keys(MARKET.currencies),
        ...Object.values(MARKET.currencies).map(currency => currency.symbol)
      ]
      return includes(currencies, currency)
    }
  },

  validations: {
    model: {
      isNumber (value) {
        return this.inputValue && this.checkAmount(this.inputValue)
      },
      isMoreThanMinimum (value) {
        return parseFloat(this.inputValue) >= this.minimumAmount
      },
      isLessThanMaximum (value) {
        return parseFloat(this.inputValue) <= this.maximumAmount
      },
      isRequired (value) {
        if (this.required) {
          return required(value)
        }
        return true
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
