<template>
  <main class="WalletDetails flex flex-col">
    <WalletHeading class="sticky pin-t z-10" />

    <MenuTab
      ref="menutab"
      v-model="currentTab"
      :class="{ 'rounded-bl-lg' : !isDelegatesTab || !isOwned }"
      class="flex-1 overflow-y-auto"
    >
      <MenuTabItem
        v-for="tab in tabs"
        :key="tab.component"
        :label="tab.text"
        :tab="tab.component"
      >
        <Component
          :is="tab.component"
          slot-scope="{ isActive }"
          :is-active="isActive"
        />
      </MenuTabItem>
    </MenuTab>
    <div
      v-if="isDelegatesTab && isOwned"
      class="bg-theme-feature px-5 flex flex-row rounded-bl-lg"
    >
      <div
        class="mt-4 mb-4 py-4 px-6 rounded-l text-theme-voting-banner-text bg-theme-voting-banner-background w-full flex"
      >
        <div
          v-if="votedDelegate"
          class="flex"
        >
          <i18n
            tag="span"
            :class="{
              'border-r border-theme-line-separator' : votedDelegate.rank
            }"
            class="font-semibold pr-6"
            :path="isOwned ? 'WALLET_DELEGATES.VOTED_FOR' : 'WALLET_DELEGATES.WALLET_VOTED_FOR'"
          >
            <strong place="delegate">
              {{ votedDelegate.username }}
            </strong>
          </i18n>
          <template v-if="votedDelegate.rank">
            <i18n
              tag="span"
              class="font-semibold px-6 border-r border-theme-line-separator"
              path="WALLET_DELEGATES.RANK_BANNER"
            >
              <strong place="rank">
                {{ votedDelegate.rank }}
              </strong>
            </i18n>
            <i18n
              tag="span"
              class="font-semibold pl-6"
              path="WALLET_DELEGATES.PRODUCTIVITY_BANNER"
            >
              <strong place="productivity">
                {{ getProductivity() }}
              </strong>
            </i18n>
          </template>
        </div>
        <div
          v-else-if="!(isOwned && votedDelegate)"
          class="flex"
        >
          {{ $t('WALLET_DELEGATES.NO_VOTE') }}
        </div>
      </div>
      <div
        v-if="votedDelegate"
        class="WalletDetails__vote__button"
        @click="openUnvote"
      >
        {{ $t('WALLET_DELEGATES.UNVOTE') }}
      </div>
      <div
        v-else
        class="WalletDetails__vote__button"
        @click="openSelectDelegate"
      >
        {{ $t('WALLET_DELEGATES.SELECT_DELEGATE') }}
      </div>

      <!-- Vote/unvote modal -->
      <Portal
        v-if="isVoting || isUnvoting"
        to="modal"
      >
        <TransactionModal
          :title="isUnvoting ? (
            $t('WALLET_DELEGATES.UNVOTE_DELEGATE', { delegate: votedDelegate.username })
          ) : (
            $t('WALLET_DELEGATES.VOTE_DELEGATE', { delegate: selectedDelegate.username })
          )"
          :type="3"
          :delegate="votedDelegate || selectedDelegate"
          :is-voter="isUnvoting"
          @cancel="onCancel"
          @close="onCancel"
          @sent="onSent"
        />
      </Portal>

      <!-- Select delegate modal -->
      <Portal
        v-if="isSelecting"
        to="modal"
      >
        <WalletSelectDelegate
          @cancel="onCancelSelect"
          @close="onCancelSelect"
          @confirm="onConfirm"
        />
      </Portal>
    </div>
  </main>
</template>

<script>
import { at } from 'lodash'
/* eslint-disable vue/no-unused-components */
import { WalletSelectDelegate } from '@/components/Wallet'
import { ButtonGeneric } from '@/components/Button'
import { TransactionModal } from '@/components/Transaction'
import { WalletExchange, WalletHeading, WalletTransactions, WalletDelegates, WalletStatistics } from '../'
import WalletSignVerify from '../WalletSignVerify'
import { MenuTab, MenuTabItem } from '@/components/Menu'

export default {
  components: {
    ButtonGeneric,
    MenuTab,
    MenuTabItem,
    TransactionModal,
    WalletDelegates,
    WalletExchange,
    WalletHeading,
    WalletSelectDelegate,
    WalletSignVerify,
    WalletStatistics,
    WalletTransactions
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
      isVoting: false,
      isUnvoting: false,
      isSelecting: false,
      votedDelegate: null,
      selectedDelegate: null
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

      if (this.currentWallet && !this.currentWallet.isContact && !this.currentWallet.isLedger) {
        tabs.push({
          component: 'WalletSignVerify',
          text: this.$t('PAGES.WALLET.SIGN_VERIFY')
        })
      }

      if (this.currentNetwork && !this.currentWallet.isContact && this.currentNetwork.market && this.currentNetwork.market.enabled) {
        tabs.push({
          component: 'WalletExchange',
          text: this.$t('PAGES.WALLET.PURCHASE', { ticker: this.currentNetwork.market.ticker })
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

    currentNetwork () {
      return this.session_network
    },

    currentWallet () {
      return this.wallet_fromRoute
    },

    isDelegatesTab () {
      return this.currentTab === 'WalletDelegates'
    },

    isOwned () {
      const wallet = this.$store.getters['wallet/byAddress'](this.currentWallet.address)
      const wallets = this.$store.getters['wallet/byProfileId'](this.session_profile.id)

      return wallets.includes(wallet)
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
    },
    tabs () {
      this.$nextTick(() => {
        this.$refs.menutab.collectItems()
      })
    }
  },

  async created () {
    await this.$synchronizer.call('wallets')
    await this.fetchWalletVote()
    this.$eventBus.on('wallet:reload', this.fetchWalletVote)
  },

  beforeDestroy () {
    this.$eventBus.off('wallet:reload', this.fetchWalletVote)
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
          this.votedDelegate = this.$store.getters['delegate/byPublicKey'](walletVote)
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
      const productivity = this.votedDelegate.production.productivity
      return this.formatter_percentage(productivity)
    },

    openUnvote () {
      this.isUnvoting = true
    },

    openSelectDelegate () {
      this.isSelecting = true
    },

    onCancel () {
      this.isUnvoting = this.isVoting = false
      this.selectedDelegate = null
    },

    onCancelSelect () {
      this.isSelecting = false
    },

    onConfirm (value) {
      if (value.length <= 20) {
        this.selectedDelegate = this.$store.getters['delegate/byUsername'](value)
      } else if (value.length <= 34) {
        this.selectedDelegate = this.$store.getters['delegate/byAddress'](value)
      } else {
        this.selectedDelegate = this.$store.getters['delegate/byPublicKey'](value)
      }

      if (this.selectedDelegate) {
        this.isSelecting = false
        this.isVoting = true
      }
    },

    onSent (success) {
      console.log('success: ' + success)
      if (success) {
        console.log('isUnvoting ' + this.isUnvoting)
        console.log('isVoting ' + this.isVoting)
        if (this.isUnvoting) {
          this.walletVote.publicKey = null
          this.votedDelegate = null
        } else {
          this.walletVote.publicKey = this.selectedDelegate.publicKey
          this.selectedDelegate = null
        }
      }

      this.isUnvoting = this.isVoting = false
    }
  }
}
</script>

<style lang="postcss">
.WalletDetails .MenuTab > .MenuTab__nav {
  @apply .sticky .pin-t .z-10;
}
.WalletDetails__vote__button {
  transition: 0.5s;
  cursor: pointer;
  @apply .text-theme-voting-banner-button-text .bg-theme-voting-banner-button .whitespace-no-wrap .mt-4 .mb-4 .p-4 .rounded-r .font-semibold .w-auto .text-center
}
.WalletDetails__vote__button:hover {
  transition: 0.5s;
  @apply .text-theme-voting-banner-button-text-hover .bg-theme-voting-banner-button-hover
}
</style>
