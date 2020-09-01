<template>
  <ModalWindow
    :title="title || typeName"
    :container-classes="`TransactionModal ${typeClass}`"
    :confirm-close="true"
    @close="emitCancel"
  >
    <KeepAlive>
      <TransactionForm
        v-if="!transaction"
        v-bind="$attrs"
        :group="group"
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
import { camelCase } from 'lodash'
import { upperFirst } from '@/utils'
import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config'
import MultiSignature from '@/services/client-multisig'
import { ModalLoader, ModalWindow } from '@/components/Modal'
import TransactionForm from './TransactionForm'
import TransactionConfirm from './TransactionConfirm'
import TransactionService from '@/services/transaction'
import WalletService from '@/services/wallet'

export default {
  name: 'TransactionModal',

  components: {
    ModalLoader,
    ModalWindow,
    TransactionForm,
    TransactionConfirm
  },

  props: {
    transactionOverride: {
      type: Object,
      required: false,
      default: null
    },

    group: {
      type: Number,
      required: false,
      default: 1,
      validator: value => {
        return Object.keys(TRANSACTION_TYPES).includes(`GROUP_${value}`)
      }
    },

    type: {
      type: Number,
      required: true,
      validator: value => {
        return value === TRANSACTION_TYPES.MULTI_SIGN || Object.values(TRANSACTION_TYPES.GROUP_1).includes(value)
      }
    },

    title: {
      type: String,
      required: false,
      default: null
    }
  },

  data: vm => ({
    showBroadcastingTransactions: false,
    step: 0,
    transaction: vm.transactionOverride,
    walletOverride: null
  }),

  computed: {
    transactionKey () {
      if (this.type === TRANSACTION_TYPES.MULTI_SIGN) {
        return 'MULTI_SIGN'
      }

      const transactionTypes = TRANSACTION_TYPES[`GROUP_${this.group}`]
      const key = Object.keys(transactionTypes).find(type => transactionTypes[type] === this.type)

      if (key === 'VOTE' && this.transaction.asset.votes.length) {
        if (this.transaction.asset.votes[0].substring(0, 1) === '-') {
          return 'UNVOTE'
        }
      }

      return key
    },
    typeClass () {
      if (this.type === TRANSACTION_TYPES.MULTI_SIGN) {
        return 'TransactionModalMultiSign'
      }

      const transactionTypes = TRANSACTION_TYPES[`GROUP_${this.group}`]
      const type = Object.keys(transactionTypes).find(type => transactionTypes[type] === this.type)

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

    async pushMultiSignature (sendToNetwork) {
      const peer = this.$store.getters['session/multiSignaturePeer']
      if (!peer) {
        return
      }

      const response = await MultiSignature.sendTransaction(peer, this.transaction)
      if (response && !sendToNetwork) {
        this.$success(this.$t(`TRANSACTION.SUCCESS.${this.transactionKey}`))
        this.emitSent(true, this.transaction)
      } else if (!response) {
        this.$error(this.$t(`TRANSACTION.ERROR.${this.transactionKey}`))
      }

      this.$eventBus.emit('wallet:reload:multi-signature')

      this.showBroadcastingTransactions = false
    },

    async onConfirm () {
      if (TransactionService.isMultiSignature(this.transaction)) {
        const isReady = TransactionService.isMultiSignatureReady(this.transaction)
        await this.pushMultiSignature(isReady)

        if (!isReady) {
          return
        }

        this.transaction.timestamp = undefined
      }

      // Produce the messages before closing the modal to avoid `$t` scope errors
      const messages = {
        success: this.$t(`TRANSACTION.SUCCESS.${this.transactionKey}`),
        error: this.$t(`TRANSACTION.ERROR.${this.transactionKey}`),
        errorLowFee: this.$t('TRANSACTION.ERROR.FEE_TOO_LOW', {
          fee: this.formatter_networkCurrency(this.transaction.fee)
        }),
        warningBroadcast: this.$t('TRANSACTION.WARNING.BROADCAST'),
        nothingSent: this.$t('TRANSACTION.ERROR.NOTHING_SENT'),
        wrongNonce: this.$t('TRANSACTION.ERROR.WRONG_NONCE')
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
              this.updateLastFeeByType({
                fee: this.transaction.fee.toString(),
                type: this.transaction.type,
                typeGroup: this.transaction.typeGroup || TRANSACTION_GROUPS.STANDARD
              })

              const { data } = response.body

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
          const { errors } = response.body

          const anyLowFee = Object.keys(errors).some(transactionId => {
            return errors[transactionId].some(error => error.type === 'ERR_LOW_FEE')
          })
          const anyNotDuplicate = Object.keys(errors).some(transactionId => {
            return errors[transactionId].some(error => !['ERR_DUPLICATE', 'ERR_FORGED', 'ERR_ALREADY_IN_POOL', 'ERR_LOW_FEE'].includes(error.type))
          })
          const wrongNonce = Object.keys(errors).some(transactionId => {
            return errors[transactionId].some(error => {
              return error.type === 'ERR_APPLY' && error.message.includes('Cannot apply a transaction with nonce')
            })
          })

          // Be clear with the user about the error cause
          if (anyLowFee) {
            this.$error(messages.errorLowFee)
          } else if (wrongNonce) {
            this.$error(messages.wrongNonce)
          } else if (anyNotDuplicate) {
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

      const { data, errors } = response.body
      return data && data.invalid.length === 0 && !errors
    },

    storeTransaction (transaction) {
      const { type, typeGroup, amount, fee, senderPublicKey, vendorField, asset } = transaction

      let id = transaction.id
      if (transaction.signatures) {
        id = TransactionService.getId(transaction)
      }

      let timestamp

      if (!transaction.timestamp || (transaction.timestamp <= Math.floor(Date.now() / 1000))) {
        timestamp = Date.now()
      } else {
        timestamp = transaction.timestamp
      }

      if (transaction.version === 1) {
        const epoch = new Date(this.walletNetwork.constants.epoch)
        timestamp = epoch.getTime() + (transaction.timestamp * 1000)
      }

      this.$store.dispatch('transaction/create', {
        id,
        type,
        typeGroup: typeGroup || 1,
        amount,
        fee,
        asset,
        sender: WalletService.getAddressFromPublicKey(senderPublicKey, this.walletNetwork.version),
        timestamp,
        vendorField,
        confirmations: 0,
        recipient: transaction.recipientId || transaction.sender,
        profileId: this.walletOverride ? this.walletOverride.profileId : this.session_profile.id,
        raw: transaction
      })
    },

    updateLastFeeByType ({ fee, type, typeGroup }) {
      this.$store.dispatch('session/setLastFeeByType', { fee, type, typeGroup })

      this.$store.dispatch('profile/update', {
        ...this.session_profile,
        lastFees: {
          ...this.session_profile.lastFees,
          [typeGroup]: {
            ...this.session_profile.lastFees[typeGroup],
            [type]: fee
          }
        }
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
  min-width: 38rem;
  max-height: 100%;
}

.TransactionModalIpfs,
.TransactionModalMultiSignature {
  min-width: 35rem;
  max-height: 80vh;
}
</style>
