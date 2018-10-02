<template>
  <div>
    <!-- TODO style / replace with input -->
    <h1 class="text-theme-page-text-light">{{ $t('TRANSACTION.FEE') }}: {{ fee }}</h1>
    <InputToggle
      v-model="feeChoice"
      :choices="feeChoices"
      @select="onChoiceSelect"
    />
    <InputFeeSlider
      v-if="showFeeSlider"
      :fee="fee"
      :avg="avg"
      :min="min"
      :max="max"
      @select="onFeeSelect"
    />
  </div>
</template>

<script>
import { InputToggle } from '../InputToggle'
import InputFeeSlider from './InputFeeSlider'

export default {
  name: 'InputFee',

  components: {
    InputToggle,
    InputFeeSlider
  },

  model: {
    prop: 'fee',
    event: 'input'
  },

  props: {
    transactionType: {
      type: Number,
      required: true
    },
    fee: {
      type: Number,
      required: true
    }
  },

  data () {
    return {
      min: 1,
      max: 100,
      avg: 50,
      feeChoices: [
        'Minimum',
        'Average',
        'Maximum',
        'Custom'
      ],
      feeChoice: 'Minimum',
      showFeeSlider: false
    }
  },

  created () {
    this.prepareFeeStatistics()
  },

  methods: {
    prepareFeeStatistics () {
      const transactionTypeFees = this.$store.getters['network/feeStatisticsByType'](this.transactionType)

      this.min = transactionTypeFees.minFee
      this.max = transactionTypeFees.maxFee
      this.avg = transactionTypeFees.avgFee
    },

    onChoiceSelect (choice) {
      this.feeChoice = choice

      if (choice === 'Custom') {
        this.showFeeSlider = true
        return
      }

      this.showFeeSlider = false

      const choiceFeeMap = {
        'Minimum': this.min,
        'Average': this.avg,
        'Maximum': this.max
      }

      if (Object.keys(choiceFeeMap).includes(choice)) {
        this.onFeeSelect(choiceFeeMap[choice])
      }
    },

    onFeeSelect (selectedFee) {
      this.$emit('input', parseInt(selectedFee))
    }
  }
}
</script>
