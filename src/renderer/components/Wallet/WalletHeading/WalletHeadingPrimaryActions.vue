<template>
  <div
    key="PrimaryActions"
    class="WalletHeading__PrimaryActions flex items-center"
  >
    <button
      v-if="showNotVoting"
      v-tooltip="{ content: $t('PAGES.WALLET_SHOW.NO_VOTE'), trigger:'hover' }"
      class="bg-theme-button-special-choice cursor-pointer rounded-full w-2 h-2 m-3"
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
      :classes="buttonStyle"
      :items="sendOptions"
    >
      <ButtonModal
        slot="primaryButton"
        class="option-heading-button px-3 py-2"
        :class="{
          'rounded-tr-none': hasAip11,
          'rounded-br-none': hasAip11,
          'mr-2': !hasAip11
        }"
        :label="$t('TRANSACTION.SEND')"
        icon="send"
        view-box="0 0 12 12"
      >
        <template slot-scope="{ toggle, isOpen }">
          <TransactionModal
            v-if="isOpen"
            :type="0"
            @cancel="toggle"
            @close="toggle"
            @sent="toggle"
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
            @cancel="toggle"
            @sent="toggle"
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
      isRefreshing: false,
      showNotVoting: false
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
      return this.currentNetwork.milestone ? !!this.currentNetwork.milestone.aip11 : false
    },

    sendOptions () {
      const options = []

      if (!this.hasAip11) {
        return options
      }

      options.push({
        label: this.$t('TRANSACTION.TYPE.MULTI_PAYMENT'),
        type: 6
      })

      return options
    }
  },

  watch: {
    // Never show the not-voting icon until knowing if the wallet is voting or not
    'currentWallet.address' () {
      this.showNotVoting = false
    },
    // To react to changes on the injected `walletVote` and changed not-voting icon immediately
    'walletVote.publicKey' () {
      this.showNotVoting = !this.walletVote.publicKey
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
    }
  }
}
</script>
