<template>
  <ModalWindow
    :title="$t('TRANSACTION.TRANSACTION')"
    container-classes="TransactionShowMultiSignature"
    @close="emitClose"
  >
    <ListDivided>
      <ListDividedItem
        :label="$t('TRANSACTION.ID')"
        item-value-class="flex items-center"
      >
        <span
          v-tooltip="{
            content: transaction.id,
            trigger: 'hover',
            classes: 'text-xs'
          }"
          class="cursor-default"
        >
          {{ transaction.id | truncateMiddle(30) }}
        </span>
        <ButtonClipboard
          :value="transaction.id"
          :class="{ 'mr-2': transaction.confirmations }"
          class="text-theme-page-text-light ml-2"
        />
        <button
          v-if="transaction.confirmations"
          v-tooltip="{
            content: `${$t('TRANSACTION.OPEN_IN_EXPLORER')}`,
            trigger: 'hover'
          }"
          class="flex items-center"
          @click="openTransaction"
        >
          <SvgIcon
            name="open-external"
            view-box="0 0 12 12"
            class="text-theme-page-text-light"
          />
        </button>
      </ListDividedItem>

      <ListDividedItem
        v-if="transaction.blockId"
        :label="$t('TRANSACTION.BLOCK_ID')"
        item-value-class="flex items-center"
      >
        <span
          v-tooltip="{
            content: transaction.blockId,
            trigger: 'hover',
            classes: 'text-xs'
          }"
          class="cursor-default"
        >
          {{ transaction.blockId | truncateMiddle(30) }}
        </span>
        <ButtonClipboard
          :value="transaction.blockId"
          class="text-theme-page-text-light mx-2"
        />
        <button
          v-tooltip="{
            content: `${$t('TRANSACTION.OPEN_IN_EXPLORER')}`,
            trigger: 'hover'
          }"
          class="flex items-center"
          @click="openBlock"
        >
          <SvgIcon
            name="open-external"
            view-box="0 0 12 12"
            class="text-theme-page-text-light"
          />
        </button>
      </ListDividedItem>

      <ListDividedItem
        :label="$t('TRANSACTION.SENDER')"
        item-value-class="flex items-center"
      >
        <WalletAddress
          :address="getAddress(transaction)"
          @click="emitClose"
        />
        <ButtonClipboard
          :value="getAddress(transaction)"
          class="text-theme-page-text-light mx-2"
        />
        <button
          v-tooltip="{
            content: `${$t('TRANSACTION.OPEN_IN_EXPLORER')}`,
            trigger: 'hover'
          }"
          class="flex items-center"
          @click="openAddress(getAddress(transaction))"
        >
          <SvgIcon
            name="open-external"
            view-box="0 0 12 12"
            class="text-theme-page-text-light"
          />
        </button>
      </ListDividedItem>

      <ListDividedItem
        v-if="transaction.recipient"
        :label="$t('TRANSACTION.RECIPIENT')"
        item-value-class="flex items-center"
      >
        <WalletAddress
          :address="transaction.recipient"
          @click="emitClose"
        />
        <ButtonClipboard
          class="text-theme-page-text-light mx-2"
          :value="votedDelegate ? votedDelegate.address : transaction.recipient"
        />
        <button
          v-tooltip="{
            content: `${$t('TRANSACTION.OPEN_IN_EXPLORER')}`,
            trigger: 'hover'
          }"
          class="flex items-center"
          @click="openAddress(votedDelegate ? votedDelegate.address : transaction.recipient)"
        >
          <SvgIcon
            name="open-external"
            view-box="0 0 12 12"
            class="text-theme-page-text-light"
          />
        </button>
      </ListDividedItem>

      <ListDividedItem
        :label="$t('TRANSACTION.AMOUNT')"
        item-value-class="flex items-center"
      >
        <TransactionAmount :transaction="transaction" />
        <TransactionStatusIcon
          v-bind="transaction"
          :show-waiting-confirmations="false"
          class="ml-2"
        />
      </ListDividedItem>

      <ListDividedItem
        :label="$t('TRANSACTION.FEE')"
        :value="formatter_networkCurrency(transaction.fee)"
      />

      <ListDividedItem
        :label="$t('TRANSACTION.TIMESTAMP')"
        :value="formatter_date(transaction.timestamp)"
      />

      <ListDividedItem
        v-if="transaction.vendorField"
        :value="transaction.vendorField"
        :label="$t('TRANSACTION.VENDOR_FIELD')"
      />

      <ListDividedItem
        v-if="!!multiSignatureWalletAddress"
        :value="multiSignatureWalletAddress"
        :label="$t('TRANSACTION.MULTI_SIGNATURE.ADDRESS')"
      />

      <ListDividedItem
        :value="totalCount"
        :label="$t('TRANSACTION.MULTI_SIGNATURE.TOTAL_SIGNATURES')"
      />
    </ListDivided>

    <div
      v-if="canSign || canBeSent"
      class="text-left"
    >
      <ButtonModal
        v-if="canSign"
        slot="primaryButton"
        :label="$t('TRANSACTION.SIGN')"
        class="ButtonGeneric blue-button"
      >
        <template slot-scope="{ toggle, isOpen }">
          <TransactionModal
            v-if="isOpen"
            :type="-1"
            :transaction="transaction"
            @cancel="emitClose(toggle)"
            @close="emitClose(toggle)"
            @sent="emitClose(toggle)"
          />
        </template>
      </ButtonModal>

      <ButtonModal
        v-if="canBeSent"
        slot="primaryButton"
        :label="$t('TRANSACTION.SEND')"
        class="ButtonGeneric blue-button"
      >
        <template slot-scope="{ toggle, isOpen }">
          <TransactionModal
            v-if="isOpen"
            :type="transaction.type"
            :transaction-override="transaction"
            @cancel="emitClose(toggle)"
            @close="emitClose(toggle)"
            @sent="emitClose(toggle)"
          />
        </template>
      </ButtonModal>
    </div>
  </ModalWindow>
</template>

<script>
import { TRANSACTION_TYPES } from '@config'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalWindow } from '@/components/Modal'
import { ButtonClipboard, ButtonModal } from '@/components/Button'
import SvgIcon from '@/components/SvgIcon'
import { TransactionAmount, TransactionModal, TransactionStatusIcon } from '@/components/Transaction'
import TransactionService from '@/services/transaction'
import WalletAddress from '@/components/Wallet/WalletAddress'
import WalletService from '@/services/wallet'

// import { Crypto, Managers, Transactions } from '@arkecosystem/crypto'
// import { cloneDeep } from 'lodash'

export default {
  name: 'TransactionShowMultiSignature',

  components: {
    ListDivided,
    ListDividedItem,
    ModalWindow,
    ButtonClipboard,
    ButtonModal,
    SvgIcon,
    TransactionAmount,
    TransactionModal,
    TransactionStatusIcon,
    WalletAddress
  },

  props: {
    transaction: {
      type: Object,
      required: true
    }
  },

  data: () => ({
    votedDelegate: null
  }),

  computed: {
    totalCount () {
      return this.$t('COMMON.X_OF_Y', [
        (this.transaction.signatures || []).length,
        this.transaction.multiSignature.publicKeys.length
      ])
    },

    canSign () {
      return TransactionService.needsWalletSignature(this.transaction, WalletService.getPublicKeyFromWallet(this.wallet_fromRoute))

      // const isWalletMultiSignature = this.wallet_fromRoute.multiSignature
      // if (this.transaction.signature) {
      //   return false
      // } else if (!isWalletMultiSignature && (!this.transaction.signatures || !this.transaction.signatures.length)) {
      //   return true
      // } else if (!this.transaction.multiSignature) {
      //   return false
      // }

      // const publicKey = WalletService.getPublicKeyFromWallet(this.wallet_fromRoute)
      // const belowMin = this.transaction.signatures.length < this.transaction.multiSignature.min
      // if (!belowMin && this.transaction.senderPublicKey === publicKey && !isWalletMultiSignature) {
      //   return true
      // }

      // const keyIndex = this.transaction.multiSignature.publicKeys.indexOf(publicKey)
      // if (keyIndex === -1) {
      //   return false
      // }

      // return !this.transaction.signatures.some(signature => {
      //   return parseInt(signature.substring(0, 2), 16) === keyIndex
      // })
    },

    canBeSent () {
      return TransactionService.isMultiSignatureReady(this.transaction)
      // console.log('canBeSent', this.transaction.signatures.length, this.transaction.multiSignature.min)
      // if (!this.transaction.signature || !this.transaction.signatures.length || !this.transaction.multiSignature) {
      //   return false
      // }

      // return this.transaction.signatures.length >= this.transaction.multiSignature.min
    },

    votePublicKey () {
      if (this.transaction && this.transaction.asset && this.transaction.asset.votes) {
        const vote = this.transaction.asset.votes[0]
        return vote.substr(1)
      }
      return ''
    },

    multiSignatureWalletAddress () {
      if (this.transaction.type !== TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE || !this.transaction.multiSignature) {
        return null
      }

      return WalletService.getAddressFromMultiSignatureAsset(this.transaction.multiSignature)
    }
  },

  async mounted () {
    if (this.votePublicKey) {
      this.determineVote()
    }

    // try {
    //   Managers.configManager.setConfig(cloneDeep(this.session_network.crypto))
    //   Managers.configManager.setHeight(await this.$store.dispatch('peer/getAverageHeight', this.session_network))

    //   const tx = Transactions.TransactionFactory.fromData(this.transaction)
    //   console.log('tx', tx)

    //   const hashMain = Transactions.Utils.toHash(tx.data, {
    //     excludeSignature: true,
    //     excludeSecondSignature: true
    //   })

    //   if (Crypto.Hash.verifySchnorr(hashMain, tx.data.signature, tx.data.senderPublicKey)) {
    //     console.log('main signature is valid')
    //   }

    //   const hash = Transactions.Utils.toHash(tx.data, {
    //     excludeSignature: true,
    //     excludeSecondSignature: true,
    //     excludeMultiSignature: true
    //   })

    //   const publicKeyIndexes = []
    //   for (let i = 0; i < tx.data.signatures.length; i++) {
    //     const signature = tx.data.signatures[i]
    //     const publicKeyIndex = parseInt(signature.slice(0, 2), 16)

    //     if (!publicKeyIndexes[publicKeyIndex]) {
    //       publicKeyIndexes[publicKeyIndex] = true
    //     } else {
    //       console.log('CryptoErrors.DuplicateParticipantInMultiSignatureError')
    //     }

    //     const partialSignature = signature.slice(2, 130)
    //     const publicKey = tx.data.asset.multiSignature.publicKeys[publicKeyIndex]

    //     if (Crypto.Hash.verifySchnorr(hash, partialSignature, publicKey)) {
    //       console.log('signature ' + i + ' is valid')
    //     }
    //   }
    // } catch (error) {
    //   console.error('tx error', error)
    // }

    // console.log('canBeSent tx', this.transaction)
    // console.log('canBeSent bool', this.transaction.signatures ? this.transaction.signatures.length > this.transaction.asset.multiSignature.min : false)
    // this.canBeSent = this.transaction.signatures ? this.transaction.signatures.length >= this.transaction.asset.multiSignature.min : false
  },

  methods: {
    openTransaction () {
      this.network_openExplorer('transaction', this.transaction.id)
    },

    openAddress (address) {
      this.network_openExplorer('address', address)
    },

    openBlock (address) {
      this.network_openExplorer('block', this.transaction.blockId)
    },

    emitClose (modalToggle) {
      console.log('emitClose modalToggle', modalToggle)
      console.log('emitClose typeof modalToggle', typeof modalToggle)
      if (typeof modalToggle === 'function') {
        modalToggle()
      }

      this.$emit('close', 'navigateToTransactions')
    },

    openAddressInWallet (address) {
      this.$router.push({ name: 'wallet-show', params: { address } })
      this.emitClose()
    },

    determineVote () {
      this.votedDelegate = this.$store.getters['delegate/byPublicKey'](this.votePublicKey)
    },

    getAddress (transaction) {
      return transaction.sender || WalletService.getAddressFromPublicKey(transaction.senderPublicKey, this.session_network.version)
    }
  }
}
</script>

<style>
.TransactionShowMultiSignature {
  min-width: 35rem
}
</style>
