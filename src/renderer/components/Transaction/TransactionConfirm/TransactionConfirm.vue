<template>
  <section class="TransactionConfirm">
    <TransactionDetail
      :amount="formatter_networkCurrency(totalAmount)"
      :recipient-address="transaction.recipientId"
      :sender-address="address"
      :type="transaction.type"
      class="mb-3"
    />
    <component
      :is="activeComponent"
    />

    <footer class="mt-10">
      <button
        class="TransactionConfirm__back-button blue-button mr-2"
        @click="emitBack"
      >
        {{ $t('COMMON.BACK') }}
      </button>

      <button
        class="TransactionConfirm__send-button blue-button"
        @click="emitConfirm"
      >
        {{ $t('TRANSACTION.SEND') }}
        <span class="px-2 py-1 bg-theme-button-inner-box rounded">
          {{ formatter_networkCurrency(totalAmount) }}
        </span>
      </button>
    </footer>
  </section>
</template>

<script>
import TransactionConfirmDelegateRegistration from './TransactionConfirmDelegateRegistration'
import TransactionConfirmSecondSignature from './TransactionConfirmSecondSignature'
import TransactionConfirmTransfer from './TransactionConfirmTransfer'
import TransactionConfirmVote from './TransactionConfirmVote'
import { TransactionDetail } from '@/components/Transaction'
import { find } from 'lodash'

export default {
  name: 'TransactionConfirm',

  provide () {
    return {
      transaction: this.transaction
    }
  },

  components: {
    TransactionConfirmDelegateRegistration,
    TransactionConfirmSecondSignature,
    TransactionConfirmTransfer,
    TransactionConfirmVote,
    TransactionDetail
  },

  props: {
    transaction: {
      type: Object,
      required: true,
      default: () => {}
    }
  },

  data: () => ({
    activeComponent: null
  }),

  computed: {
    totalAmount () {
      return parseInt(this.transaction.amount) + this.transaction.fee
    },
    address () {
      return this.wallet_fromRoute.address
    }
  },

  mounted () {
    const component = find(this.$options.components, item => item.transactionType === this.transaction.type)

    if (!component) {
      throw new Error(`[TransactionConfirm] - Confirm for type ${this.type} not found.`)
    }

    this.activeComponent = component.name
  },

  methods: {
    emitBack () {
      this.$emit('back')
    },

    emitConfirm () {
      this.$emit('confirm')
    }
  }
}
</script>

<style scoped>
.TransactionConfirm__send-button:hover > span {
  @apply .bg-blue
}
.TransactionConfirm__send-button,
.TransactionConfirm__send-button > span {
  transition: background-color 0.5s;
}
</style>
