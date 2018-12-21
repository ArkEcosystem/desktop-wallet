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
    },
    walletNetwork () {
      const sessionNetwork = this.session_network
      if (!this.alternativeWallet || !this.alternativeWallet.id) {
        return sessionNetwork
      }

      const profile = this.$store.getters['profile/byId'](this.alternativeWallet.profileId)

      if (!profile.id) {
        return sessionNetwork
      }

      return this.$store.getters['network/byId'](profile.networkId) || sessionNetwork
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
      const errorLowFee = this.$t('TRANSACTION.ERROR.FEE_TOO_LOW', {
        fee: this.formatter_networkCurrency(this.transaction.fee)
      })
      const warningBroadcast = this.$t('TRANSACTION.WARNING.BROADCAST')

      this.emitSent()

      let response
      if (this.alternativeWallet) {
        const peer = await this.$store.dispatch('peer/findBest', {
          refresh: true,
          network: this.walletNetwork
        })
        const apiClient = await this.$store.dispatch('peer/clientServiceFromPeer', peer)
        response = await apiClient.broadcastTransaction(this.transaction)
      } else {
        response = await this.$client.broadcastTransaction(this.transaction)
      }

      const { data, errors } = response.data

      if (this.isSuccessfulResponse(response)) {
        this.storeTransaction(this.transaction)

        if (data && data.accept.length === 0 && data.broadcast.length > 0) {
          this.$warn(warningBroadcast)
        } else {
          this.$success(success)
        }
      } else {
        const anyLowFee = Object.keys(errors).some(transactionId => {
          return errors[transactionId].some(error => error.type === 'ERR_LOW_FEE')
        })

        // Be clear with the user about the error cause
        if (anyLowFee) {
          this.$error(errorLowFee)
        } else {
          this.$error(error)
        }
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
     * due a low fee, but it is broadcasted too, it cannot be declared as invalid yet
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
        return data && data.invalid.length === 0 && errors === null
      }
    },

    storeTransaction (transaction) {
      const { id, type, amount, fee, senderPublicKey, vendorField } = transaction

      const sender = WalletService.getAddressFromPublicKey(senderPublicKey, this.walletNetwork.version)
      const epoch = new Date(this.walletNetwork.constants.epoch)
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
        recipient: transaction.recipientId || transaction.sender,
        profileId: this.alternativeWallet ? this.alternativeWallet.profileId : this.session_profile.id,
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
