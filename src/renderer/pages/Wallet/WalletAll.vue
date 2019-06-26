<template>
  <div class="WalletAll">
    <div class="WalletAll__heading px-8 py-6 mb-3">
      <div class="flex flex-row items-center">
        <div class="hidden sm:block">
          <ProfileAvatar
            :profile="session_profile"
            letter-size="2xl"
            class="relative"
          >
            <span
              :class="{
                'bg-theme-feature-item-selected text-theme-feature-item-selected-text ': session_profile.avatar,
                'bg-theme-button text-theme-button-text': !session_profile.avatar
              }"
              class="WalletAll__avatar__sign"
              name="point"
              view-box="0 0 14 14"
            >
              {{ currentSymbol }}
            </span>
          </ProfileAvatar>
        </div>
        <div class="flex-col">
          <div>
            <h2 class="mb-2">
              {{ session_profile.name | truncate(20) }}
            </h2>
            <span class="font-semibold text-theme-page-text-light">
              {{ $t('PAGES.WALLET_ALL.TOTAL_BALANCE') }}
            </span>
          </div>
          <div>
            <span class="transition text-xl sm:text-2xl font-bold whitespace-no-wrap">
              {{ formatter_networkCurrency(totalBalance) }}
            </span>
            <span
              v-if="isMarketEnabled"
              class="WalletAll__balance__alternative text-sm font-bold text-theme-page-text-light ml-1"
            >
              {{ alternativeTotalBalance }}
            </span>
          </div>
        </div>
      </div>

      <div class="flex flex-row items-center">
        <WalletButtonLedgerSettings class="pl-6 pr-6" />
        <WalletButtonCreate class="pl-6 pr-6" />
        <WalletButtonImport
          :class="{ 'pr-6': hasWallets }"
          class="pl-6"
        />
        <WalletButtonExport
          v-if="hasWallets"
          class="pl-6"
        />
      </div>
    </div>

    <div class="flex flex-1 bg-theme-feature rounded-lg p-10 overflow-y-auto">
      <div class="block w-full">
        <div class="WalletAll__header">
          <h3 class="flex items-center">
            {{ $t('PAGES.WALLET_ALL.HEADER') }}
            <span
              v-if="isLedgerLoading"
              v-tooltip="{
                content: $t('PAGES.WALLET_ALL.LOADING_LEDGER'),
                placement: 'right'
              }"
              class="inline-flex items-center self-stretch ml-3 pr-2"
            >
              <SvgIcon
                class="rotate-360"
                name="update"
                view-box="0 0 16 14"
              />
            </span>
          </h3>

          <ButtonLayout
            :grid-layout="hasWalletGridLayout"
            @click="toggleWalletLayout()"
          />
        </div>

        <div
          v-if="isLoading"
          class="h-full flex items-center"
        >
          <div class="m-auto">
            <Loader />
          </div>
        </div>

        <div
          v-if="hasWalletGridLayout && !isLoading"
          class="WalletAll__grid mt-10"
        >
          <button
            v-if="isLedgerLoading"
            :disabled="true"
            class="WalletAll__grid__wallet"
          >
            <Loader />
            <div class="text-center mt-4">
              {{ $t('PAGES.WALLET_ALL.LOADING_LEDGER') }}
            </div>
          </button>

          <button
            v-for="wallet in selectableWallets"
            :key="wallet.id"
            class="WalletAll__grid__wallet group"
            @click="showWallet(wallet.id)"
          >
            <div class="WalletAll__grid__wallet__wrapper">
              <div class="WalletAll__grid__wallet__wrapper__mask">
                <div class="flex items-center justify-between">
                  <div class="flex items-center">
                    <WalletIdenticon
                      :value="wallet.address"
                      :size="60"
                      class="identicon"
                    />

                    <div
                      class="flex flex-col justify-center overflow-hidden pl-4"
                    >
                      <div class="flex items-center">
                        <span
                          v-tooltip="{
                            content: !wallet.name && wallet_name(wallet.address) ? $t('COMMON.NETWORK_NAME') : '',
                            placement: 'right'
                          }"
                          class="WalletAll__grid__wallet__name font-semibold text-base truncate block pr-1"
                        >
                          {{ wallet.name || wallet_name(wallet.address) || wallet_truncate(wallet.address) }}
                        </span>
                        <span
                          v-if="wallet.isLedger"
                          class="ledger-badge"
                        >
                          {{ $t('COMMON.LEDGER') }}
                        </span>
                      </div>
                      <span
                        class="font-bold mt-2 text-lg text-theme-page-text text-left whitespace-no-wrap"
                      >
                        {{ formatter_networkCurrency(wallet.balance, 2) }}
                      </span>
                    </div>
                  </div>

                  <MenuDropdown
                    :items="getContextMenuOptions(wallet)"
                    :is-highlighting="false"
                    :position="['-100%', '-20%']"
                    :container-classes="'hidden group-hover:block'"
                    @select="onSelectDropdown(wallet, $event)"
                  >
                    <span
                      slot="handler"
                      class="WalletAll__grid__wallet__select p-2 text-theme-page-text-light hover:text-theme-page-text opacity-75"
                    >
                      <SvgIcon
                        name="more"
                        view-box="0 0 5 15"
                        class="text-inherit"
                      />
                    </span>

                    <template
                      slot="item"
                      slot-scope="itemScope"
                    >
                      <div class="flex items-center hidden">
                        <SvgIcon
                          :name="itemScope.item.icon"
                          view-box="0 0 16 16"
                          class="text-inherit flex-none mr-2"
                        />
                        <span class="font-semibold">
                          {{ itemScope.item.value }}
                        </span>
                      </div>
                    </template>
                  </MenuDropdown>
                </div>
              </div>
            </div>
          </button>
        </div>

        <div
          v-else-if="!hasWalletGridLayout && !isLoading"
          class="WalletAll__tabular mt-10"
        >
          <WalletTable
            :has-pagination="false"
            :is-loading="false"
            :rows="selectableWallets"
            :show-voted-delegates="showVotedDelegates"
            :total-rows="selectableWallets.length"
            :sort-query="sortParams"
            :no-data-message="$t('TABLE.NO_WALLETS')"
            @remove-row="onRemoveWallet"
            @rename-row="onRenameWallet"
            @on-sort-change="onSortChange"
          />
        </div>
      </div>
    </div>

    <WalletRemovalConfirmation
      v-if="walletToRemove"
      :wallet="walletToRemove"
      @cancel="hideRemovalConfirmation"
      @removed="removeWallet(walletToRemove)"
    />

    <WalletRenameModal
      v-if="walletToRename"
      :wallet="walletToRename"
      @cancel="hideRenameModal"
      @renamed="onWalletRenamed"
    />
  </div>
</template>

<script>
import { clone, some, uniqBy } from 'lodash'
import { ButtonLayout } from '@/components/Button'
import Loader from '@/components/utils/Loader'
import { ProfileAvatar } from '@/components/Profile'
import SvgIcon from '@/components/SvgIcon'
import { WalletButtonCreate, WalletButtonExport, WalletButtonImport, WalletButtonLedgerSettings } from '@/components/Wallet/WalletButtons'
import { WalletIdenticon, WalletRemovalConfirmation, WalletRenameModal } from '@/components/Wallet'
import WalletTable from '@/components/Wallet/WalletTable'
import { MenuDropdown } from '@/components/Menu'

export default {
  name: 'WalletAll',

  components: {
    ButtonLayout,
    Loader,
    ProfileAvatar,
    SvgIcon,
    WalletButtonCreate,
    WalletButtonExport,
    WalletButtonImport,
    WalletButtonLedgerSettings,
    WalletIdenticon,
    WalletRemovalConfirmation,
    WalletRenameModal,
    WalletTable,
    MenuDropdown
  },

  data: () => ({
    selectableWallets: [],
    walletToRemove: null,
    walletToRename: null,
    isLoading: false
  }),

  computed: {
    alternativeCurrency () {
      return this.$store.getters['session/currency']
    },

    alternativeTotalBalance () {
      const balance = this.currency_subToUnit(this.totalBalance)
      return this.currency_format(balance * this.price, { currency: this.alternativeCurrency })
    },

    isMarketEnabled () {
      return this.currentNetwork.market.enabled
    },

    currentSymbol () {
      return (this.currentNetwork.symbol || '').charAt(0)
    },

    currentNetwork () {
      return this.session_network
    },

    hideText () {
      return this.$store.getters['session/hideWalletButtonText']
    },

    totalBalance () {
      return this.$store.getters['profile/balanceWithLedger'](this.session_profile.id)
    },

    price () {
      return this.$store.getters['market/lastPrice']
    },

    wallets () {
      const wallets = this.$store.getters['wallet/byProfileId'](this.session_profile.id)
      return this.wallet_sortByName(wallets)
    },

    hasWallets () {
      return this.selectableWallets.length
    },

    isLedgerLoading () {
      return this.$store.getters['ledger/isLoading'] && !this.$store.getters['ledger/wallets'].length
    },

    isLedgerConnected () {
      return this.$store.getters['ledger/isConnected']
    },

    hasWalletGridLayout () {
      return this.$store.getters['session/hasWalletGridLayout']
    },

    walletLayout: {
      get () {
        return this.$store.getters['session/walletLayout']
      },
      set (layout) {
        this.$store.dispatch('session/setWalletLayout', layout)
        const profile = clone(this.session_profile)
        profile.walletLayout = layout
        this.$store.dispatch('profile/update', profile)
      }
    },

    sortParams: {
      get () {
        return this.$store.getters['session/walletSortParams']
      },
      set (params) {
        this.$store.dispatch('session/setWalletSortParams', params)
        const profile = clone(this.session_profile)
        profile.walletSortParams = params
        this.$store.dispatch('profile/update', profile)
      }
    },

    showVotedDelegates () {
      return some(this.selectableWallets, wallet => wallet.hasOwnProperty('vote'))
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$synchronizer.focus('wallets')
    })
  },

  created () {
    this.loadWallets()
    this.$eventBus.on('ledger:wallets-updated', this.includeLedgerWallets)
    this.$eventBus.on('ledger:disconnected', this.ledgerDisconnected)
  },

  beforeDestroy () {
    this.$eventBus.off('ledger:wallets-updated', this.includeLedgerWallets)
    this.$eventBus.off('ledger:disconnected', this.ledgerDisconnected)
  },

  /**
   * On `create` the event listeners are bound, but, every time this page is accessed
   * should include the Ledger wallets, if they are available, to the list of wallets
   */
  activated () {
    this.loadWallets()
  },

  methods: {
    loadWallets () {
      this.isLoading = true

      if (this.$store.getters['ledger/isConnected']) {
        this.includeLedgerWallets()
      } else {
        this.selectableWallets = this.wallets
      }

      this.isLoading = false
    },

    hideRemovalConfirmation () {
      this.walletToRemove = null
    },

    hideRenameModal () {
      this.walletToRename = null
    },

    async includeLedgerWallets () {
      const ledgerWallets = this.$store.getters['ledger/wallets']
      this.selectableWallets = this.wallet_sortByName(uniqBy([
        ...ledgerWallets,
        ...this.wallets
      ], 'address'))
    },

    ledgerDisconnected () {
      this.selectableWallets = this.wallets
    },

    openRemovalConfirmation (wallet) {
      this.walletToRemove = wallet
    },

    openRenameModal (wallet) {
      this.walletToRename = wallet
    },

    removeWallet (wallet) {
      this.hideRemovalConfirmation()
      this.selectableWallets = this.selectableWallets.filter(w => {
        return w.id !== wallet.id
      })
    },

    toggleWalletLayout () {
      this.walletLayout = this.walletLayout === 'grid' ? 'tabular' : 'grid'
    },

    onRemoveWallet (wallet) {
      this.openRemovalConfirmation(wallet)
    },

    onRenameWallet (wallet) {
      this.openRenameModal(wallet)
    },

    onWalletRenamed () {
      this.hideRenameModal()
      this.selectableWallets = this.wallets
    },

    onSortChange (sortParams) {
      this.sortParams = sortParams
    },

    showWallet (walletId) {
      this.$router.push({ name: 'wallet-show', params: { address: walletId } })
    },

    getContextMenuOptions (wallet) {
      const options = {
        rename: {
          value: this.$t('WALLET_TABLE.RENAME'),
          icon: 'edit'
        }
      }

      if (!wallet.isLedger) {
        options['delete'] = {
          value: this.$t('WALLET_TABLE.DELETE'),
          icon: 'delete-wallet'
        }
      }

      return options
    },

    onSelectDropdown (wallet, item) {
      if (item === 'delete') {
        this.openRemovalConfirmation(wallet)
      } else if (item === 'rename') {
        this.openRenameModal(wallet)
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.WalletAll {
  @apply .flex .flex-col .overflow-y-hidden .rounded-lg;
}
.WalletAll__avatar__sign {
  @apply rounded-full w-8 h-8 flex justify-center items-center text-base absolute pin-b pin-r mr-3 -mb-1 border-2 border-theme-feature font-semibold select-none whitespace-no-wrap
}
.WalletAll__heading {
  @apply .flex .justify-between .items-center .bg-theme-feature .rounded-lg;
}
.WalletAll__heading .ProfileAvatar {
  @apply .flex .flex-row .justify-around
}
.WalletAll__heading .ProfileAvatar__image {
  height: calc(var(--profile-avatar-xl) * 0.60);
  width: calc(var(--profile-avatar-xl) * 0.66);
  @apply mr-2;
}
.WalletAll__heading .ProfileAvatar__letter {
  @apply mr-4
}

.WalletAll__ledger__load-wallets,
.WalletAll__ledger__cache {
  @apply .border-r .border-theme-feature-item-alternative
}
.WalletAll__header {
  @apply .flex .items-center .justify-between .h-8;
}
.WalletAll__grid {
  display: grid;
  grid-template-rows: 1fr;
}
.WalletAll__grid__wallet {
  @apply py-3 relative cursor-pointer bg-theme-feature;
  transition-property: transform, border, box-shadow;
  transition-duration: .2s;
  transition-timing-function: ease;
}
.WalletAll__grid__wallet:hover {
  @apply rounded-lg z-10;
  transform: scale(1.02);
  box-shadow: var(--theme-wallet-grid-shadow);
}
.WalletAll__grid__wallet:not(:hover)::after {
  @apply block absolute pin-x pin-b mx-auto border-b border-theme-wallet-overview-border;
  content: " ";
  width: 95%;
}
.WalletAll__grid__wallet__wrapper {
  @apply px-5 py-2 border-l border-theme-wallet-overview-border;
}
.WalletAll__grid__wallet:hover .WalletAll__grid__wallet__wrapper {
  @apply border-transparent
}
.WalletAll__grid__wallet:hover .identicon {
  opacity: 1;
}
.WalletAll__grid__wallet__name {
  color: #037cff;
}
.WalletAll__grid__wallet .identicon {
  opacity: 0.5;
  transition: 0.5s;
}
@screen max-md {
  .WalletAll__grid__wallet__wrapper {
    @apply border-transparent
  }
}
@screen minmax-lg {
  .WalletAll__grid {
    grid-template-columns: 1fr 1fr;
  }
  .WalletAll__grid__wallet:nth-child(2n+1) > .WalletAll__grid__wallet__wrapper {
    @apply border-transparent
  }
}
@screen xl {
  .WalletAll__grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
  .WalletAll__grid__wallet:nth-child(3n+1) > .WalletAll__grid__wallet__wrapper {
    @apply border-transparent
  }
}
</style>
