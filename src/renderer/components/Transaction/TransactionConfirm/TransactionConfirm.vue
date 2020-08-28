<template>
  <section class="TransactionConfirm">
    <TransactionDetail
      :amount="formatter_networkCurrency(totalAmount)"
      :recipient-address="transaction.recipientId"
      :sender-address="address"
      :type="transaction.type"
      class="mb-3"
    />
    <Component
      :is="activeComponent"
      v-if="activeComponent"
    />

    <footer class="mt-10 flex justify-between items-center">
      <div>
        <button
          class="TransactionConfirm__back-button blue-button mr-2 px-5"
          @click="emitBack"
        >
          {{ $t('COMMON.BACK') }}
        </button>

        <button
          class="TransactionConfirm__send-button blue-button px-2"
          :disabled="wasClicked"
          @click="emitConfirm"
        >
          {{ $t('TRANSACTION.SEND') }}
          <span class="px-2 py-1 bg-theme-button-inner-box rounded">
            {{ formatter_networkCurrency(totalAmount) }}
          </span>
        </button>
      </div>

      <div v-if="showSave">
        <button
          v-tooltip="{ content: $t('TRANSACTION.SAVE_OFFLINE'), toggle: 'hover' }"
          class="TransactionConfirm__save-tx action-button pull-right flex items-center"
          @click="saveTransaction"
        >
          <SvgIcon
            name="save"
            view-box="0 0 15 15"
            class="mr-1"
          />
          {{ $t('COMMON.SAVE') }}
        </button>
      </div>
    </footer>
  </section>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import { TRANSACTION_GROUPS } from '@config'
import TransactionConfirmDelegateRegistration from './TransactionConfirmDelegateRegistration'
import TransactionConfirmDelegateResignation from './TransactionConfirmDelegateResignation'
import TransactionConfirmIpfs from './TransactionConfirmIpfs'
import TransactionConfirmMultiPayment from './TransactionConfirmMultiPayment'
import TransactionConfirmMultiSignature from './TransactionConfirmMultiSignature'
import TransactionConfirmSecondSignature from './TransactionConfirmSecondSignature'
import TransactionConfirmTransfer from './TransactionConfirmTransfer'
import TransactionConfirmVote from './TransactionConfirmVote'
import TransactionDetail from '../TransactionDetail'
import SvgIcon from '@/components/SvgIcon'
import TransactionService from '@/services/transaction'

export default {
  name: 'TransactionConfirm',

  provide () {
    return {
      currentWallet: this.currentWallet,
      transaction: this.transaction
    }
  },

  components: {
    TransactionConfirmDelegateRegistration,
    TransactionConfirmDelegateResignation,
    TransactionConfirmIpfs,
    TransactionConfirmMultiPayment,
    TransactionConfirmMultiSignature,
    TransactionConfirmSecondSignature,
    TransactionConfirmTransfer,
    TransactionConfirmVote,
    TransactionDetail,
    SvgIcon
  },

  props: {
    transaction: {
      type: Object,
      required: true
    },
    wallet: {
      type: Object,
      required: false,
      default: null
    }
  },

  data: () => ({
    activeComponent: null,
    wasClicked: false
  }),

  computed: {
    totalAmount () {
      const amount = this.currency_toBuilder(this.transaction.fee)

      if (this.transaction.asset && this.transaction.asset.payments) {
        for (const payment of this.transaction.asset.payments) {
          amount.add(payment.amount)
        }
      } else if (this.transaction.amount) {
        amount.add(this.transaction.amount)
      }

      return amount.value
    },

    currentWallet () {
      return this.wallet || this.wallet_fromRoute
    },
    address () {
      return this.currentWallet.address
    },
    showSave () {
      return !TransactionService.isMultiSignature(this.transaction)
    }
  },

  mounted () {
    const transactionGroup = this.transaction.typeGroup || TRANSACTION_GROUPS.STANDARD
    const component = Object.values(this.$options.components).find(component => {
      const group = component.transactionGroup || TRANSACTION_GROUPS.STANDARD

      return group !== transactionGroup ? false : component.transactionType === this.transaction.type
    })

    if (!component) {
      throw new Error(`[TransactionConfirm] - Confirm for type ${this.transaction.type} (group ${transactionGroup}) not found.`)
    }

    this.activeComponent = component.name
  },

  methods: {
    emitBack () {
      this.$emit('back')
    },

    emitConfirm () {
      if (!this.wasClicked) {
        this.wasClicked = true

        this.$emit('confirm')
      }
    },

    async saveTransaction () {
      const raw = JSON.stringify(this.transaction)
      const defaultPath = `${this.transaction.id}.json`

      try {
        const path = await this.electron_writeFile(raw, defaultPath)

        if (path) {
          this.$success(this.$t('TRANSACTION.SUCCESS.SAVE_OFFLINE', { path }))
        } else {
          return
        }
      } catch (error) {
        this.$error(this.$t('TRANSACTION.ERROR.SAVE_OFFLINE', { error: error.message }))
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.TransactionConfirm__send-button:hover > span {
  @apply .bg-blue;
}
.TransactionConfirm__send-button,
.TransactionConfirm__send-button > span {
  transition: background-color 0.5s;
}
</style>
