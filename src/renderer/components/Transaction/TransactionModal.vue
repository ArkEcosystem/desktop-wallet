<template>
  <ModalWindow
    :title="title || typeName"
    :container-classes="`TransactionModal ${typeClass}`"
    @close="emitCancel"
  >
    <KeepAlive>
      <TransactionForm
        v-if="!transaction"
        v-bind="$attrs"
        :type="type"
        @built="onBuilt"
      />
    </KeepAlive>

    <TransactionConfirm
      v-if="transaction"
      :transaction="transaction"
      :wallet="alternativeWallet"
      @back="onBack"
      @confirm="onConfirm"
    />

    <PortalTarget
      v-if="step === 0"
      slot="footer"
      name="transaction-footer"
    />
  </ModalWindow>
</template>

<script>
import { camelCase, includes, findKey, upperFirst } from 'lodash'
import { TRANSACTION_TYPES } from '@config'
import WalletService from '@/services/wallet'
import { ModalWindow } from '@/components/Modal'
import TransactionForm from './TransactionForm'
import TransactionConfirm from './TransactionConfirm'

export default {
  name: 'TransactionModal',

  components: {
    ModalWindow,
    TransactionForm,
    TransactionConfirm
  },

  props: {
    type: {
      type: Number,
      required: true,
      validator: value => includes(TRANSACTION_TYPES, value)
    },
    title: {
      type: String,
      required: false,
      default: null
    }
  },

  data: () => ({
    step: 0,
    transaction: null,
    alternativeWallet: null
  }),

  computed: {
    transactionKey () {
      const key = findKey(TRANSACTION_TYPES, type => this.type === type)
      if (key === 'VOTE' && this.transaction.asset.votes.length) {
        if (this.transaction.asset.votes[0].substring(0, 1) === '-') {
          return 'UNVOTE'
        }
      }

      return key
    },
    typeClass () {
      const type = findKey(TRANSACTION_TYPES, type => this.type === type)
      return `TransactionModal${upperFirst(camelCase(type))}`
    },
    typeName () {
      return this.$t(`TRANSACTION.TYPE.${this.transactionKey}`)
    }
  },

  methods: {
    onBuilt ({ transaction, wallet }) {
      this.step = 1
      this.transaction = transaction
      this.alternativeWallet = wallet
    },

    onBack () {
      this.step = 0
      this.transaction = null
    },

    async onConfirm () {
      // Produce the messages before closing the modal to avoid `$t` scope errors
      const success = this.$t(`TRANSACTION.SUCCESS.${this.transactionKey}`)
      const error = this.$t(`TRANSACTION.ERROR.${this.transactionKey}`)

      this.emitSent()

      const response = await this.$client.broadcastTransaction(this.transaction)

      if (this.isSuccessfulResponse(response)) {
        this.storeTransaction(this.transaction)
        this.$success(success)
      } else {
        this.$error(error)
      }
    },

    emitSent () {
      this.$emit('sent')
    },

    emitCancel () {
      this.$emit('cancel')
    },

    /**
     * Checks if the response is successful: in case the transaction is rejected
     * due a low fee, it is broadcasted too, so it cannot be declared as invalid yet
     * @param {Object} response
     * @return {Boolean}
     */
    isSuccessfulResponse (response) {
      if (response.status !== 200) {
        this.$logger.error(response)
        return false
      }

      if (this.$client.version === 1) {
        return response.data.success
      } else {
        const { data, errors } = response.data
        if (data && data.invalid.length === 0) {
          return true
        } else {
          const keys = Object.keys(errors)
          return errors[keys[0]][0].type === 'ERR_LOW_FEE'
        }
      }
    },

    storeTransaction (transaction) {
      const { id, type, amount, fee, senderPublicKey, vendorField } = transaction

      const sender = WalletService.getAddressFromPublicKey(senderPublicKey, this.session_network.version)
      const epoch = new Date(this.session_network.constants.epoch)
      const timestamp = epoch.getTime() + transaction.timestamp * 1000

      this.$store.dispatch('transaction/create', {
        id,
        type,
        amount,
        fee,
        sender,
        timestamp,
        vendorField,
        confirmations: 0,
        recipient: transaction.recipientId,
        profileId: this.session_profile.id,
        raw: transaction
      })
    }
  }
}
</script>

<style>
.TransactionModal {
  max-width: 45rem
}
.TransactionModalTransfer {
  /* To allow more space on the fee slider */
  min-width: 35rem;
}
</style>
