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
        class="TransactionShowMultiSignature__Sender"
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
        class="TransactionShowMultiSignature__Recipient"
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
        v-if="transaction.nonce"
        :label="$t('TRANSACTION.NONCE')"
        :value="transaction.nonce"
      />

      <ListDividedItem
        :label="$t('TRANSACTION.TIMESTAMP')"
        :value="formatter_date(transaction.timestamp)"
      />

      <ListDividedItem
        v-if="transaction.vendorField"
        :value="transaction.vendorField"
        :label="$t('TRANSACTION.VENDOR_FIELD')"
        item-label-class="mb-auto"
        item-value-class="max-w-xs break-words text-justify"
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
            :group="transaction.typeGroup"
            :transaction="transaction"
            @cancel="closeTransactionModal(toggle, isOpen)"
            @sent="closeTransactionModal(toggle, isOpen)"
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
            :group="transaction.typeGroup"
            :transaction-override="transaction"
            @cancel="closeTransactionModal(toggle, isOpen)"
            @sent="closeTransactionModal(toggle, isOpen)"
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
    },

    canBeSent () {
      return TransactionService.isMultiSignatureReady(this.transaction)
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
  },

  methods: {
    openTransaction () {
      this.network_openExplorer('transaction', this.transaction.id)
    },

    openAddress (address) {
      this.network_openExplorer('address', address)
    },

    openBlock () {
      this.network_openExplorer('block', this.transaction.blockId)
    },

    closeTransactionModal (toggleMethod, isOpen) {
      if (isOpen) {
        toggleMethod()
      }

      this.emitClose()
    },

    emitClose () {
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

.TransactionShowMultiSignature__Sender .ListDividedItem__value,
.TransactionShowMultiSignature__Recipient .ListDividedItem__value {
  @apply .max-w-xs;
}
.TransactionShowMultiSignature__Sender .ListDividedItem__value .WalletAddress,
.TransactionShowMultiSignature__Recipient .ListDividedItem__value .WalletAddress {
  @apply .truncate;
}
</style>
