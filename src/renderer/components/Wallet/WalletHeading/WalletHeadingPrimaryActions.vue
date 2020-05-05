<template>
  <div
    key="PrimaryActions"
    class="WalletHeading__PrimaryActions flex items-center"
  >
    <SvgIcon
      v-if="currentWallet.multiSignature"
      v-tooltip="$t('PAGES.WALLET.MULTI_SIGNATURE_WALLET')"
      class="w-5 h-5 text-theme-heading-text opacity-50"
      name="multi-signature"
      view-box="0 0 16 16"
    />

    <button
      v-tooltip="{
        content: isVoting ? $t('PAGES.WALLET_SHOW.VOTING_FOR', { delegate: walletVote.username }) : $t('PAGES.WALLET_SHOW.NO_VOTE'),
        trigger: 'hover'
      }"
      :class="isVoting ? 'bg-theme-button-special-choice' : 'bg-transparent'"
      class=" cursor-pointer border border-theme-button-special-choice rounded-full w-2 h-2 m-3 transition"
      @click="goToDelegates"
    />

    <ButtonReload
      :color-class="buttonStyle"
      :is-refreshing="isRefreshing"
      class="WalletNew__refresh-button mr-2"
      text-class="hover:text-white"
      @click="refreshWallet"
    />

    <ButtonModal
      :class="buttonStyle"
      icon="qr"
      label="QR"
      view-box="0 0 18 18"
    >
      <template slot-scope="{ toggle, isOpen }">
        <ModalQrCode
          v-if="isOpen"
          :value="currentWallet.address"
          @close="toggle"
        />
      </template>
    </ButtonModal>

    <ButtonModal
      v-show="!currentWallet.name && currentWallet.isContact && doesNotExist"
      :class="buttonStyle"
      :label="$t('PAGES.WALLET_SHOW.ADD_CONTACT')"
      icon="contact-add"
      view-box="0 0 16 16"
    >
      <template slot-scope="{ toggle, isOpen }">
        <ContactRenameModal
          v-if="isOpen"
          :wallet="currentWallet"
          :is-new-contact="true"
          @cancel="toggle"
          @created="toggle"
        />
      </template>
    </ButtonModal>

    <ButtonModal
      v-show="!currentWallet.isContact"
      :class="buttonStyle"
      :label="$t('TRANSACTION.SEND')"
      icon="send"
      view-box="0 0 12 12"
    >
      <template slot-scope="{ toggle, isOpen }">
        <TransactionModal
          v-if="isOpen"
          :type="0"
          @cancel="closeTransactionModal(toggle, isOpen)"
          @sent="closeTransactionModal(toggle, isOpen)"
        />
      </template>
    </ButtonModal>
  </div>
</template>

<script>
import { ButtonModal, ButtonReload } from '@/components/Button'
import { ModalQrCode } from '@/components/Modal'
import { TransactionModal } from '@/components/Transaction'
import { ContactRenameModal } from '@/components/Contact'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'WalletHeadingPrimaryActions',

  inject: ['switchToTab', 'walletVote'],

  components: {
    ButtonModal,
    ButtonReload,
    ModalQrCode,
    TransactionModal,
    ContactRenameModal,
    SvgIcon
  },

  data: () => ({
    isRefreshing: false
  }),

  computed: {
    buttonStyle () {
      return 'option-heading-button mr-2 px-3 py-2'
    },

    currentWallet () {
      return this.wallet_fromRoute
    },

    doesNotExist () {
      return !this.$store.getters['wallet/byAddress'](this.currentWallet.address)
    },

    isVoting () {
      return !!this.walletVote.username
    }
  },

  methods: {
    goToDelegates () {
      this.switchToTab('WalletDelegates')
    },

    async refreshWallet () {
      this.isRefreshing = true
      await this.$eventBus.emit('wallet:reload')
      this.isRefreshing = false
    },

    closeTransactionModal (toggleMethod, isOpen) {
      if (isOpen) {
        toggleMethod()
      }
    }
  }
}
</script>
