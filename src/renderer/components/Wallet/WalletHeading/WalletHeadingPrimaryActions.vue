<template>
  <div
    key="PrimaryActions"
    class="WalletHeading__PrimaryActions flex"
  >
    <div
      v-tooltip="{ content: $t('PAGES.WALLET_SHOW.NO_VOTE'), trigger:'hover' }"
      v-if="!walletVote.publicKey"
      class="bg-orange rounded-full w-2 h-2 m-3"
    />
    <ButtonModal
      :class="buttonStyle"
      icon="qr"
      label="QR"
      view-box="0 0 18 18"
    >
      <ModalQrCode
        slot-scope="{ toggle }"
        :value="currentWallet.address"
        @close="toggle"
      />
    </ButtonModal>

    <ButtonReload
      :color-class="buttonStyle"
      :is-refreshing="isRefreshing"
      class="WalletNew__refresh-button mr-2"
      text-class="hover:text-white"
      @click="refreshWallet"
    />

    <ButtonModal
      v-show="currentWallet.isSendingEnabled"
      :class="buttonStyle"
      :label="$t('TRANSACTION.SEND')"
      icon="send"
      view-box="0 0 12 12"
    >
      <TransactionModal
        slot-scope="{ toggle }"
        :type="0"
        @cancel="toggle"
        @sent="toggle"
      />
    </ButtonModal>
  </div>
</template>

<script>
import { ButtonModal, ButtonReload } from '@/components/Button'
import { ModalQrCode } from '@/components/Modal'
import { TransactionModal } from '@/components/Transaction'

export default {
  name: 'WalletHeadingPrimaryActions',

  inject: ['walletVote'],

  components: {
    ButtonModal,
    ButtonReload,
    ModalQrCode,
    TransactionModal
  },

  data () {
    return {
      isRefreshing: false
    }
  },

  computed: {
    buttonStyle () {
      return 'option-button'
    },

    currentWallet () {
      return this.wallet_fromRoute
    }
  },

  methods: {
    async refreshWallet () {
      this.isRefreshing = true
      await this.$eventBus.emit('wallet:fetchTransactions')
      this.isRefreshing = false
    }
  }
}
</script>
