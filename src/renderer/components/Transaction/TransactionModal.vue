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
        @cancel="emitCancel"
      />
    </KeepAlive>

    <TransactionConfirm
      v-if="transaction"
      :transaction="transaction"
      :wallet="walletOverride"
      @back="onBack"
      @confirm="onConfirm"
    />

    <PortalTarget
      v-if="step === 0"
      slot="footer"
      name="transaction-footer"
    />

    <ModalLoader
      :allow-close="true"
      :close-warning-message="$t('TRANSACTION.INFO.BROADCASTING_SLOW')"
      :message="$t('TRANSACTION.INFO.BROADCASTING')"
      :visible="showBroadcastingTransactions"
      @close="emitClose"
    />
  </ModalWindow>
</template>

<script>
import { camelCase, includes, findKey, upperFirst } from 'lodash'
import { TRANSACTION_TYPES } from '@config'
import WalletService from '@/services/wallet'
import { ModalLoader, ModalWindow } from '@/components/Modal'
import TransactionForm from './TransactionForm'
import TransactionConfirm from './TransactionConfirm'

export default {
  name: 'TransactionModal',

  components: {
    ModalLoader,
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
    showBroadcastingTransactions: false,
    step: 0,
    transaction: null,
    walletOverride: null
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
      if (!this.walletOverride || !this.walletOverride.id) {
        return sessionNetwork
      }

      const profile = this.$store.getters['profile/byId'](this.walletOverride.profileId)

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
      this.walletOverride = wallet
    },

    onBack () {
      this.step = 0
      this.transaction = null
    },

    async onConfirm () {
      // Produce the messages before closing the modal to avoid `$t` scope errors
      const messages = {
        success: this.$t(`TRANSACTION.SUCCESS.${this.transactionKey}`),
        error: this.$t(`TRANSACTION.ERROR.${this.transactionKey}`),
        errorLowFee: this.$t('TRANSACTION.ERROR.FEE_TOO_LOW', {
          fee: this.formatter_networkCurrency(this.transaction.fee)
        }),
        warningBroadcast: this.$t('TRANSACTION.WARNING.BROADCAST'),
        nothingSent: this.$t('TRANSACTION.ERROR.NOTHING_SENT')
      }

      let responseArray
      let success = false
      try {
        let shouldBroadcast = false
        if (this.walletOverride) {
          const walletProfile = this.$store.getters['profile/byId'](this.walletOverride.profileId)
          shouldBroadcast = walletProfile.broadcastPeers
        } else {
          shouldBroadcast = this.$store.getters['session/broadcastPeers']
        }

        if (shouldBroadcast) {
          this.showBroadcastingTransactions = true
        }

        if (this.walletOverride && this.session_network.id !== this.walletNetwork.id) {
          const peer = await this.$store.dispatch('peer/findBest', {
            refresh: true,
            network: this.walletNetwork
          })
          const apiClient = await this.$store.dispatch('peer/clientServiceFromPeer', peer)
          responseArray = await apiClient.broadcastTransaction(this.transaction, shouldBroadcast)
        } else {
          responseArray = await this.$client.broadcastTransaction(this.transaction, shouldBroadcast)
        }

        if (responseArray.length > 0) {
          for (let i = 0; i < responseArray.length; i++) {
            const response = responseArray[i]

            if (this.isSuccessfulResponse(response)) {
              this.storeTransaction(this.transaction)
              const { data } = response.data

              if (data && data.accept.length === 0 && data.broadcast.length > 0) {
                this.$warn(messages.warningBroadcast)
              }

              success = true
              this.$success(messages.success)
              return
            }
          }

          // If we get here, it means that none of the responses was successful, so pick one and show the error
          const response = responseArray[0]
          const { errors } = response.data

          const anyLowFee = Object.keys(errors).some(transactionId => {
            return errors[transactionId].some(error => error.type === 'ERR_LOW_FEE')
          })

          // Be clear with the user about the error cause
          if (anyLowFee) {
            this.$error(messages.errorLowFee)
          } else {
            this.$error(messages.error)
          }
        } else {
          this.$error(messages.nothingSent)
        }
      } catch (error) {
        this.$logger.error(error)
        this.$error(messages.error)
      } finally {
        this.showBroadcastingTransactions = false
        this.emitSent(success, this.transaction)
      }

      this.emitClose()
    },

    emitSent (success, transaction = null) {
      this.$emit('sent', success, transaction)
    },

    emitCancel (reason) {
      this.$emit('cancel', reason)
    },

    emitClose () {
      this.$emit('close')
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
        return data && data.invalid.length === 0 && !errors
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
        profileId: this.walletOverride ? this.walletOverride.profileId : this.session_profile.id,
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
