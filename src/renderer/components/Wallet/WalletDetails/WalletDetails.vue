<template>
  <main class="WalletDetails flex flex-col">
    <WalletHeading class="sticky pin-t z-10" />

    <MenuTab
      v-model="currentTab"
      :class="{ 'rounded-bl-lg' : !isDelegatesTab }"
      class="flex-1 overflow-y-auto"
    >
      <MenuTabItem
        v-for="tab in tabs"
        :key="tab.component"
        :label="tab.text"
        :tab="tab.component"
      >
        <component
          :is="tab.component"
          slot-scope="{ isActive }"
          :is-active="isActive"
        />
      </MenuTabItem>
    </MenuTab>
    <div
      v-if="isDelegatesTab && votedDelegate"
      class="bg-theme-feature px-5 flex flex-row"
    >
      <div
        class="mt-4 mb-4 py-4 px-6 rounded-l text-theme-voting-banner-text bg-theme-voting-banner-background w-full flex"
      >
        <div class="flex flex-row">
          <i18n
            tag="span"
            class="font-semibold pr-6 border-r border-theme-line-separator"
            path="WALLET_DELEGATES.VOTED_FOR"
          >
            <strong place="delegate">{{ votedDelegate.username }}</strong>
          </i18n>
          <i18n
            tag="span"
            class="font-semibold pl-6"
            path="WALLET_DELEGATES.PRODUCTIVITY_BANNER"
          >
            <strong place="productivity">{{ getProductivity() }}</strong>
          </i18n>
        </div>
      </div>
      <div
        class="WalletDetails__unvote"
        @click="openUnvote"
      >
        {{ $t('WALLET_DELEGATES.UNVOTE') }}
      </div>

      <!-- Unvote modal -->
      <portal
        v-if="isSelected"
        to="modal"
      >
        <TransactionModal
          :title="$t('WALLET_DELEGATES.UNVOTE_DELEGATE', { delegate: votedDelegate.username })"
          :type="3"
          :delegate="votedDelegate"
          :is-voter="true"
          @cancel="onCancel"
          @sent="onSent"
        />
      </portal>
    </div>
  </main>
</template>

<script>
import { at } from 'lodash'
/* eslint-disable vue/no-unused-components */
import { ButtonGeneric } from '@/components/Button'
import { TransactionModal } from '@/components/Transaction'
import { WalletHeading, WalletTransactions, WalletDelegates, WalletStatistics } from '../'
import WalletSignVerify from '../WalletSignVerify'
import { MenuTab, MenuTabItem } from '@/components/Menu'

export default {
  components: {
    ButtonGeneric,
    TransactionModal,
    WalletHeading,
    WalletTransactions,
    WalletDelegates,
    WalletSignVerify,
    WalletStatistics,
    MenuTab,
    MenuTabItem
  },

  provide () {
    return {
      switchToTab: this.switchToTab,
      walletVote: this.walletVote
    }
  },

  data () {
    return {
      currentTab: '',
      walletVote: {
        publicKey: null
      },
      isSelected: false,
      votedDelegate: null
    }
  },

  computed: {
    tabs () {
      let tabs = [
        {
          component: 'WalletTransactions',
          text: this.$t('PAGES.WALLET.TRANSACTIONS')
        },
        {
          component: 'WalletDelegates',
          text: this.$t('PAGES.WALLET.DELEGATES')
        }
      ]

      if (this.currentWallet && !this.currentWallet.isContact) {
        tabs.push({
          component: 'WalletSignVerify',
          text: this.$t('PAGES.WALLET.SIGN_VERIFY')
        })
      }

      // TODO enable when there is something to show
      // if (this.session_network.market && this.session_network.market.enabled) {
      //   tabs.push({
      //     component: 'WalletStatistics',
      //     text: this.$t('PAGES.WALLET.STATISTICS')
      //   })
      // }

      return tabs
    },

    currentWallet () {
      return this.wallet_fromRoute
    },

    isDelegatesTab () {
      return this.currentTab === 'WalletDelegates'
    }
  },

  watch: {
    currentTab () {
      switch (this.currentTab) {
        case 'WalletTransactions':
          this.$synchronizer.focus('wallets', 'contacts')
          break
        case 'WalletDelegates':
          this.$synchronizer.focus('wallets', 'contacts', 'delegates')
          break
        case 'WalletSignVerify':
          // TODO
          break
      }
    }
  },

  async created () {
    await this.$synchronizer.call('wallets')
    await this.fetchWalletVote()
  },

  mounted () {
    this.currentTab = this.tabs[0].component
  },

  methods: {
    switchToTab (component) {
      this.currentTab = component
    },

    async fetchWalletVote () {
      if (!this.currentWallet) {
        return
      }

      try {
        const walletVote = await this.$client.fetchWalletVote(this.currentWallet.address)

        if (walletVote) {
          this.votedDelegate = await this.$client.fetchDelegate(walletVote)
          this.walletVote.publicKey = walletVote
        } else {
          this.votedDelegate = null
          this.walletVote.publicKey = null
        }
      } catch (error) {
        this.votedDelegate = null
        this.walletVote.publicKey = null

        const messages = at(error, 'response.data.message')
        if (messages[0] !== 'Wallet not found') {
          this.$logger.error(error)
          this.$error(this.$t('COMMON.FAILED_FETCH', {
            name: 'fetch vote',
            msg: error.message
          }))
        }
      }
    },

    getProductivity () {
      const productivity = this.votedDelegate.productivity || this.votedDelegate.production.productivity
      return this.formatter_percentage(productivity)
    },

    openUnvote () {
      this.isSelected = true
    },

    onCancel () {
      this.isSelected = false
    },

    onSent () {
      this.walletVote.publicKey = null
      this.isSelected = false
      this.votedDelegate = null
    }
  }
}
</script>

<style lang="postcss">
.WalletDetails .MenuTab > .MenuTab__nav {
  @apply .sticky .pin-t .z-10;
}
.WalletDetails__unvote {
  transition: 0.5s;
  cursor: pointer;
  @apply .text-theme-voting-banner-button-text .bg-theme-voting-banner-button .mt-4 .mb-4 .p-4 .rounded-r .font-semibold .w-22
}
.WalletDetails__unvote:hover {
  transition: 0.5s;
  @apply .text-theme-voting-banner-button-text-hover .bg-theme-voting-banner-button-hover
}
</style>
