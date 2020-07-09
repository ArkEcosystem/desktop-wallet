<template>
  <div class="InputFee relative inline-block w-full">
    <div class="w-full">
      <div class="InputFee__gradient absolute w-full" />
      <div
        :style="rangeTrackStyle"
        class="InputFee__range-track absolute w-full z-30"
      />
      <div
        :style="hiddenGradientStyle"
        class="InputFee__hidden-gradient absolute w-full z-10"
      />
    </div>

    <div class="InputFee__currency-input-container absolute z-20">
      <InputCurrency
        ref="input"
        :currency="currency"
        :label="$t('TRANSACTION.FEE')"
        :value="fee"
        :custom-error="insufficientFundsError"
        :not-valid-error="notValidError"
        :maximum-amount="feeChoiceMax"
        :maximum-error="maximumError"
        :minimum-amount="feeChoiceMin"
        :minimum-error="minimumError"
        :warning-text="warningText"
        :is-disabled="isDisabled"
        :wallet-network="walletNetwork"
        class="w-full InputField--dirty"
        @change="onChange"
        @raw="onRawInput"
      />
    </div>

    <input
      :value="fee"
      :max="feeChoiceMax"
      :min="feeChoiceMin"
      :step="step"
      :disabled="isDisabled"
      type="range"
      class="w-full m-0 py-2 z-10"
      name="fee"
      @input="onSlider($event.target.value)"
    >
    <p class="InputFee__choices absolute z-30">
      <button
        v-for="choice in Object.keys(feeChoices)"
        :key="choice"
        :class="{ 'InputFee__choice--active': choice === chosenFee }"
        :disabled="isDisabled"
        class="InputFee__choice cursor-pointer font-semibold text-xs"
        @click="onChoice(choice)"
      >
        {{ $t(`INPUT_FEE.${choice}`) }}
      </button>
    </p>

    <div
      v-if="!hideStaticFeeNotice && isStaticFee && !isAdvancedFee"
      class="mt-6 mb-4"
    >
      {{ $t(`INPUT_FEE.UNIQUE`, { fee: parseFloat(fee) }) }}
    </div>
  </div>
</template>

<script>
import { V1 } from '@config'
import InputCurrency from './InputCurrency'

/**
 * This component, like \`InputCurrency\`, uses a String value internally to
 * avoid several problems, such as showing the exponential notation, although
 * it emits a Number always
 */
export default {
  name: 'InputFee',

  components: {
    InputCurrency
  },

  props: {
    currency: {
      type: String,
      required: true
    },

    transactionType: {
      type: Number,
      required: true
    },

    transactionGroup: {
      type: Number,
      required: false,
      default: 1
    },

    showInsufficientFunds: {
      type: Boolean,
      required: false,
      default: true
    },

    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },

    wallet: {
      type: Object,
      required: false,
      default: null
    },

    walletNetwork: {
      type: Object,
      required: false,
      default: null
    },

    hideStaticFeeNotice: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => ({
    chosenFee: 'AVERAGE',
    step: 1e-8,
    fee: 0
  }),

  computed: {
    currentWallet () {
      return this.wallet || this.wallet_fromRoute
    },
    hiddenGradientStyle () {
      return {
        width: `${100 - this.rangePercentage}%`
      }
    },
    rangeTrackStyle () {
      return {
        width: `${this.rangePercentage}%`
      }
    },
    rangePercentage () {
      const percent = (this.currency_toBuilder(this.fee).subtract(this.feeChoiceMin)).value / (this.feeChoiceMax - this.feeChoiceMin) * 100
      return percent > 100 ? 100 : (percent < 0 ? 0 : percent)
    },
    notValidError () {
      return this.$t('INPUT_FEE.ERROR.NOT_VALID')
    },
    maxV1fee () {
      const defaultMaxV1Fee = V1.fees[`GROUP_${this.transactionGroup}`][this.transactionType]
      const staticFee = this.$store.getters['transaction/staticFee'](this.transactionType, this.transactionGroup)
      return staticFee || defaultMaxV1Fee
    },
    isStaticFee () {
      if (this.feeChoices.MAXIMUM.isEqualTo(this.feeChoices.AVERAGE)) {
        return this.feeChoices.AVERAGE.isEqualTo(this.fee)
      }
      return false
    },
    isAdvancedFee () {
      return this.chosenFee === 'ADVANCED'
    },
    feeNetwork () {
      return this.walletNetwork || this.session_network
    },
    feeStatistics () {
      if (!this.feeNetwork) {
        throw new Error('No active network to fetch fees')
      }

      const { feeStatistics } = this.feeNetwork
      if (feeStatistics) {
        let transactionStatistics
        if (feeStatistics[0]) {
          transactionStatistics = Object.values(feeStatistics).find(feeConfig => feeConfig.type === this.transactionType)
        } else if (feeStatistics[this.transactionGroup]) {
          transactionStatistics = Object.values(feeStatistics[this.transactionGroup]).find(feeConfig => feeConfig.type === this.transactionType)
        }

        if (transactionStatistics) {
          return transactionStatistics.fees
        }
      }

      return {
        avgFee: this.maxV1fee,
        maxFee: this.maxV1fee,
        minFee: 1
      }
    },
    lastFee () {
      return this.$store.getters['session/lastFeeByType'](this.transactionType, this.transactionGroup)
    },
    feeChoiceMin () {
      return this.currency_subToUnit(1)
    },
    feeChoiceMax () {
      return this.isAdvancedFee ? this.feeChoices.MAXIMUM.multipliedBy(10) : this.feeChoices.MAXIMUM
    },
    feeChoices () {
      const { avgFee, maxFee, minFee } = this.feeStatistics

      // If any of the fees are higher than the maximum V1 fee, than use the maximum.
      const average = this.currency_subToUnit(avgFee < this.maxV1fee ? avgFee : this.maxV1fee)
      const minimum = this.currency_subToUnit(minFee < this.maxV1fee ? minFee : this.maxV1fee)
      const maximum = this.currency_subToUnit(maxFee < this.maxV1fee ? maxFee : this.maxV1fee)

      const fees = {
        MINIMUM: minimum,
        AVERAGE: average,
        MAXIMUM: maximum,
        INPUT: average,
        ADVANCED: average
      }

      return this.lastFee ? Object.assign({}, { LAST: this.currency_subToUnit(this.lastFee) }, fees) : fees
    },
    minimumError () {
      const min = this.feeChoiceMin
      const fee = this.currency_format(min, { currency: this.currency, currencyDisplay: 'code' })
      return this.$t('INPUT_FEE.ERROR.LESS_THAN_MINIMUM', { fee })
    },
    maximumError () {
      if (!this.isAdvancedFee) {
        const max = this.feeChoices.MAXIMUM
        const fee = this.currency_format(max, { currency: this.currency, currencyDisplay: 'code' })
        return this.$t('INPUT_FEE.ERROR.MORE_THAN_MAXIMUM', { fee })
      }
      return null
    },
    insufficientFundsError () {
      if (!this.showInsufficientFunds) {
        return null
      }

      if (!this.currentWallet) {
        return null
      }

      const funds = this.currency_subToUnit(this.currentWallet.balance)
      if (funds.isLessThan(this.fee)) {
        const balance = this.formatter_networkCurrency(this.currentWallet.balance)
        return this.$t('TRANSACTION_FORM.ERROR.NOT_ENOUGH_BALANCE', { balance })
      }
      return null
    },
    warningText () {
      if (this.isAdvancedFee) {
        return this.$t('INPUT_FEE.ADVANCED_NOTICE')
      }
      if (this.feeChoices.AVERAGE.isGreaterThan(this.fee)) {
        return this.$t('INPUT_FEE.LOW_FEE_NOTICE')
      }
      return null
    }
  },

  watch: {
    transactionType () {
      this.triggerTypeUpdate()
    }
  },

  created () {
    // Fees should be synchronized only when this component is active
    this.$synchronizer.appendFocus('fees')

    this.triggerTypeUpdate()
  },

  beforeDestroy () {
    this.$synchronizer.removeFocus('fees')
  },

  methods: {
    triggerTypeUpdate () {
      if (this.lastFee && this.session_profile.defaultChosenFee === 'LAST') {
        this.onChoice(this.session_profile.defaultChosenFee)
      } else {
        this.emitFee(this.feeChoices.AVERAGE)
      }
    },
    focusInput () {
      this.$refs.input.focus()
    },
    onChoice (choice) {
      this.chosenFee = choice
      if (['INPUT', 'ADVANCED'].includes(this.chosenFee)) {
        this.focusInput()
      }

      const fee = this.feeChoices[choice]
      this.emitFee(fee)
    },

    /**
     * Emit the value after the user finishes changes. This prevents premature parsing the input.
     * @param {(String|Number)} fee
     */
    onChange (fee) {
      fee = fee.toString()
      this.emitFee(fee)
    },

    /**
     * Receives the `InputCurrency` value as String
     * @param {String} fee
     */
    onRawInput (fee) {
      if (!['INPUT', 'ADVANCED'].includes(this.chosenFee)) {
        this.chosenFee = 'INPUT'
      }

      fee = fee.toString()
      this.$set(this.feeChoices, this.chosenFee, fee)
    },
    /**
     * The native slider uses Strings
     * @param {String} fee
     */
    onSlider (fee) {
      if (!['INPUT', 'ADVANCED'].includes(this.chosenFee)) {
        this.chosenFee = 'INPUT'
      }

      this.$set(this.feeChoices, this.chosenFee, fee)
      this.emitFee(fee)
    },
    /**
     * Establishes the fee as String to avoid the exponential notation
     * @param {(String|Number)} fee
     */
    setFee (fee) {
      fee = this.currency_toBuilder(fee).value.toString()

      this.fee = fee
      this.$v.fee.$touch()
    },
    /**
     * Establishes the fee as String to avoid the exponential notation, although
     * it emits the value as a Number
     * @param {String} fee
     */
    emitFee (fee) {
      this.setFee(fee)
      this.$emit('input', this.fee)
    }
  },

  validations: {
    fee: {
      isValid () {
        if (this.$refs.input) {
          return !this.$refs.input.$v.$invalid && !this.insufficientFundsError
        }
        return false
      }
    }
  }
}
</script>

<style>
.InputFee .InputField__input {
  border-bottom-width: 0px !important
}
.InputFee .InputCurrency input {
  /* This width is necessary to display error messages in 1 line */
  width: 10rem;
  flex-grow: 0;
}
.InputFee .InputField__helper {
  margin-top: 1.2rem;
}
</style>

<style lang="postcss" scoped>
.InputFee {
  --margin-top: 2rem;
  --height: 3rem;
  --bg-colour: var(--theme-modal);
  --total-height: calc(var(--margin-top) + var(--height));
  --range-handler-height: 1.0rem;
  --range-handler-border: 0.35rem;
  --range-track-hidden-height: 0.6rem;
  --range-track-height: 0.4rem;
  --range-track-border: 0.25rem;
  --gradient-height: 3.6rem;
  --gradient-top: -50%;
  margin-top: var(--margin-top);
  margin-bottom: 0.9rem;
  height: var(--height);
}
/* The gradient and the layer that hides it have the same height */
.InputFee__gradient,
.InputFee__hidden-gradient {
  height: var(--gradient-height);
  top: var(--gradient-top);
}
.InputFee__gradient {
  left: 0;
  background: linear-gradient(115deg, var(--theme-fee-gradient-start) 5%, var(--theme-fee-gradient-end));
}
.InputFee__hidden-gradient {
  right: 0;
  background-color: var(--bg-colour);
}
.InputFee__range-track {
  height: var(--range-track-height);
  top: calc((var(--gradient-top) - var(--range-track-height)) * -1);
  left: 0;
  background-color: var(--theme-fee-range-track-active);
  z-index: 10;
  box-shadow: 0 2px 8px var(--theme-fee-range-shadow);
}

input[type=range] {
  /* Hides the slider so that custom slider can be made */
  -webkit-appearance: none;
  margin-top: calc(var(--range-handler-height));
  background: transparent;
  cursor: pointer;
}
input[type=range]::-webkit-slider-runnable-track {
  /* This height increases the area that can be clicked and dragged, although only the border is visible */
  height: var(--range-track-hidden-height);
  background-color: var(--bg-colour);
  margin-bottom: calc((var(--total-height) - var(--gradient-height)) * -1);
  border-top: var(--theme-fee-range-track) solid var(--range-track-border);
}
input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  margin-top: calc(var(--range-handler-height) / -2);
  bottom: 0px;
  height: var(--range-handler-height);
  width: var(--range-handler-height);
  border-radius: 30%;
  border: var(--range-handler-border) solid var(--theme-fee-handler-outside);
  background-color: var(--theme-fee-handler-inside);
  position: relative;
  z-index: 30;
  box-shadow: 0 2px 12px var(--theme-fee-range-shadow);
}

.InputFee__currency-input-container {
  left: 0;
  top: -50%;
}

.InputFee__choices {
  right: 0;
  top: 0;
}

.InputFee__choice {
  margin-left: 0.3rem;
  margin-right: 0.2rem;
  transition: opacity 0.3s;
  @apply .text-theme-page-text-light
}
.InputFee__choice:hover {
  opacity: 0.5;
}
.InputFee__choice--active {
  @apply .rounded .bg-theme-button-special-choice .text-white .p-1
}
</style>
