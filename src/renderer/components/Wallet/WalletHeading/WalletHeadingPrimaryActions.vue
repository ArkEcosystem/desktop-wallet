<template>
  <div
    key="PrimaryActions"
    class="WalletHeading__PrimaryActions flex items-center"
  >
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

    <ButtonDropdown
      v-show="!currentWallet.isContact"
      :items="sendOptions"
      dropdown-classes="option-heading-button px-3 py-2"
      class="mr-2"
    >
      <ButtonModal
        slot="primaryButton"
        class="option-heading-button px-3 py-2 h-full"
        :class="{
          'rounded-tr-none': hasSendOptions,
          'rounded-br-none': hasSendOptions
        }"
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

      <ButtonModal
        slot="button"
        slot-scope="{ item, triggerClose }"
        :label="item.label"
        class="option-heading-button whitespace-no-wrap w-full"
        @toggle="triggerClose"
      >
        <template slot-scope="{ toggle, isOpen }">
          <TransactionModal
            v-if="isOpen"
            :type="item.type"
            @cancel="closeTransactionModal(toggle, isOpen)"
            @sent="closeTransactionModal(toggle, isOpen)"
          />
        </template>
      </ButtonModal>
    </ButtonDropdown>
  </div>
</template>

<script>
import { ButtonDropdown, ButtonModal, ButtonReload } from '@/components/Button'
import { ModalQrCode } from '@/components/Modal'
import { TransactionModal } from '@/components/Transaction'
import { ContactRenameModal } from '@/components/Contact'

export default {
  name: 'WalletHeadingPrimaryActions',

  inject: ['switchToTab', 'walletVote'],

  components: {
    ButtonDropdown,
    ButtonModal,
    ButtonReload,
    ModalQrCode,
    TransactionModal,
    ContactRenameModal
  },

  data () {
    return {
      isRefreshing: false
    }
  },

  computed: {
    buttonStyle () {
      return 'option-heading-button mr-2 px-3 py-2'
    },

    currentWallet () {
      return this.wallet_fromRoute
    },

    currentNetwork () {
      return this.session_network
    },

    doesNotExist () {
      return !this.$store.getters['wallet/byAddress'](this.currentWallet.address)
    },

    hasAip11 () {
      return this.currentNetwork.constants ? !!this.currentNetwork.constants.aip11 : false
    },

    sendOptions () {
      const options = []

      if (!this.hasAip11) {
        return options
      }

      if (!this.currentWallet.isLedger) {
        options.push({
          label: this.$t('TRANSACTION.TYPE.MULTI_PAYMENT'),
          type: 6
        })
      }

      return options
    },

    hasSendOptions () {
      return !!this.sendOptions.length
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
