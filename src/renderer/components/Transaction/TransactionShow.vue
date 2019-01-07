<template>
  <ModalWindow
    :title="$t('TRANSACTION.TRANSACTION')"
    container-classes="TransactionShow"
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
          {{ transaction.id | truncateMiddle }}
        </span>
        <ButtonClipboard
          :value="transaction.id"
          class="text-theme-page-text-light mx-2"
        />
        <button
          v-if="transaction.confirmations > 0"
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
        {{ transaction.blockId }}
        <button
          v-tooltip="{
            content: `${$t('TRANSACTION.OPEN_IN_EXPLORER')}`,
            trigger: 'hover'
          }"
          class="flex items-center ml-2"
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
        <a
          href="#"
          @click.stop="openAddressInWallet(transaction.sender)"
        >
          {{ wallet_formatAddress(transaction.sender, 10) }}
        </a>
        <ButtonClipboard
          :value="transaction.sender"
          class="text-theme-page-text-light mx-2"
        />
        <button
          v-tooltip="{
            content: `${$t('TRANSACTION.OPEN_IN_EXPLORER')}`,
            trigger: 'hover'
          }"
          class="flex items-center"
          @click="openAddress(transaction.sender)"
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
          :type="transaction.type"
          :asset="transaction.asset"
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

      <ListDividedItem :label="$t('TRANSACTION.AMOUNT')">
        <TransactionAmount :transaction="transaction" />
      </ListDividedItem>

      <ListDividedItem
        :label="$t('TRANSACTION.FEE')"
        :value="formatter_networkCurrency(transaction.fee)"
      />

      <ListDividedItem
        :label="$t('TRANSACTION.CONFIRMATIONS')"
        item-value-class="flex items-center"
      >
        <span v-if="transaction.isExpired">
          {{ $t('TRANSACTION.EXPIRED') }}
        </span>
        <span v-else-if="!isWellConfirmed">
          {{ transaction.confirmations }}
        </span>
        <span v-else>
          {{ $t('TRANSACTION.WELL_CONFIRMED') }}
        </span>

        <span
          v-show="!transaction.isExpired"
          v-tooltip="{
            content: $t('TRANSACTION.CONFIRMATION_COUNT', { confirmations: transaction.confirmations }),
            trigger: 'hover'
          }"
          class="flex items-center ml-2"
        >
          <SvgIcon
            name="time"
            view-box="0 0 12 13"
          />
        </span>
      </ListDividedItem>

      <ListDividedItem
        :label="$t('TRANSACTION.TIMESTAMP')"
        :value="formatter_date(transaction.timestamp)"
      />

      <ListDividedItem
        v-if="transaction.vendorField"
        :value="transaction.vendorField"
        :label="$t('TRANSACTION.VENDOR_FIELD')"
      />
    </ListDivided>

    <div v-show="transaction.isExpired">
      <ButtonGeneric
        :label="$t('TRANSACTION.RESEND')"
        @click="emitResend"
      />
      <ButtonGeneric
        :label="$t('TRANSACTION.DISCARD')"
        class="ml-4"
        @click="emitDiscard"
      />
    </div>
  </ModalWindow>
</template>

<script>
import { at } from 'lodash'
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { ModalWindow } from '@/components/Modal'
import { ButtonClipboard, ButtonGeneric } from '@/components/Button'
import SvgIcon from '@/components/SvgIcon'
import TransactionAmount from './TransactionAmount'
import WalletAddress from '@/components/Wallet/WalletAddress'
import truncateMiddle from '@/filters/truncate-middle'

export default {
  name: 'TransactionShow',

  components: {
    ButtonGeneric,
    ListDivided,
    ListDividedItem,
    ModalWindow,
    ButtonClipboard,
    SvgIcon,
    TransactionAmount,
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
    isWellConfirmed () {
      return this.transaction.confirmations >= (this.numberOfActiveDelegates || 51)
    },
    numberOfActiveDelegates () {
      return at(this, 'session_network.constants.activeDelegates') || 51
    },
    votePublicKey () {
      if (this.transaction && this.transaction.asset && this.transaction.asset.votes) {
        const vote = this.transaction.asset.votes[0]
        return vote.substr(1)
      }
      return ''
    }
  },

  mounted () {
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

    openBlock (address) {
      this.network_openExplorer('block', this.transaction.blockId)
    },

    emitClose () {
      this.$emit('close')
    },

    async emitResend () {
      await this.$client.broadcastTransaction(this.transaction.raw)

      this.$success(this.$t('TRANSACTION.RESENT_NOTICE', { transactionId: truncateMiddle(this.transaction.id) }))
      this.$emit('close')
    },

    emitDiscard () {
      this.$store.dispatch('transaction/delete', this.transaction)
      this.$emit('close')
      this.$eventBus.emit('wallet:reload')
    },

    openAddressInWallet (address) {
      this.$router.push({ name: 'wallet-show', params: { address } })
      this.emitClose()
    },

    determineVote () {
      this.votedDelegate = this.$store.getters['delegate/byPublicKey'](this.votePublicKey)
    }
  }
}
</script>

<style>
.TransactionShow {
  min-width: 35rem
}
</style>
