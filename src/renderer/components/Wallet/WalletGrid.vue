<template>
  <div class="WalletGrid mt-10">
    <button
      v-if="isLedgerLoading"
      :disabled="true"
      class="WalletGrid__wallet"
    >
      <Loader />
      <div class="text-center mt-4">
        {{ $t('WALLET_GRID.LOADING_LEDGER') }}
      </div>
    </button>

    <button
      v-for="wallet in wallets"
      :key="wallet.id"
      class="WalletGrid__wallet group"
      @click="emitShow(wallet)"
      @contextmenu.prevent="toggleDropdown(`dropdown-${wallet.id}`)"
    >
      <div class="WalletGrid__wallet__wrapper">
        <div class="WalletGrid__wallet__wrapper__mask">
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
                    class="WalletGrid__wallet__name font-semibold text-base truncate block pr-1"
                  >
                    <template v-if="wallet.name">
                      {{ wallet.name | truncate(20) }}
                    </template>
                    <template v-else>
                      {{ wallet_name(wallet.address) || wallet_truncate(wallet.address) }}
                    </template>
                  </span>
                  <span
                    v-if="wallet.isLedger"
                    class="ledger-badge"
                  >
                    {{ $t('COMMON.LEDGER') }}
                  </span>
                </div>
                <div class="text-left">
                  <span
                    class="font-bold mt-2 text-lg text-theme-page-text text-left whitespace-no-wrap"
                  >
                    {{ formatter_networkCurrency(wallet.balance, 2) }}
                  </span>
                  <span
                    v-if="isMarketEnabled"
                    class="text-xs font-bold text-theme-page-text-light ml-1"
                  >
                    {{ getAlternativeBalance(wallet.balance) }}
                  </span>
                </div>
              </div>
            </div>

            <div class="flex items-center">
              <SvgIcon
                v-if="wallet.multiSignature"
                v-tooltip="$t('PAGES.WALLET.MULTI_SIGNATURE_WALLET')"
                class="w-5 h-5 text-theme-heading-text mr-2"
                name="multi-signature"
                view-box="0 0 16 16"
              />

              <MenuDropdown
                :ref="`dropdown-${wallet.id}`"
                :items="contextMenuOptions(wallet)"
                :is-highlighting="false"
                :position="{ x: '100%', y: '-0.5rem' }"
                :container-classes="'hidden group-hover:block'"
                @select="onSelectDropdown(wallet, $event)"
              >
                <span
                  slot="handler"
                  class="WalletGrid__wallet__select p-2 text-theme-page-text-light hover:text-theme-page-text opacity-75"
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
      </div>
    </button>
  </div>
</template>

<script>
import Loader from '@/components/utils/Loader'
import { MenuDropdown } from '@/components/Menu'
import WalletIdenticon from './WalletIdenticon'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'WalletGrid',

  components: {
    Loader,
    MenuDropdown,
    SvgIcon,
    WalletIdenticon
  },

  props: {
    isLedgerLoading: {
      type: Boolean,
      required: false,
      default: false
    },
    wallets: {
      type: Array,
      required: true,
      default: () => []
    }
  },

  computed: {
    isMarketEnabled () {
      return this.session_network.market.enabled
    },

    alternativeCurrency () {
      return this.$store.getters['session/currency']
    },

    price () {
      return this.$store.getters['market/lastPrice']
    }
  },

  methods: {
    getAlternativeBalance (balance) {
      const unitBalance = this.currency_subToUnit(balance)
      const price = this.price || 0
      return this.currency_format(unitBalance * price, { currency: this.alternativeCurrency })
    },

    contextMenuOptions (wallet) {
      const options = {
        rename: {
          value: this.$t('WALLET_TABLE.RENAME'),
          icon: 'edit'
        }
      }

      if (!wallet.isLedger) {
        options.delete = {
          value: this.$t('WALLET_TABLE.DELETE'),
          icon: 'delete-wallet'
        }
      }

      return options
    },

    toggleDropdown (dropdownId) {
      this.$refs[dropdownId][0].toggle()
    },

    emitShow (wallet) {
      this.$emit('show', wallet.id)
    },

    emitRename (wallet) {
      this.$emit('rename', wallet)
    },

    emitRemove (wallet) {
      this.$emit('remove', wallet)
    },

    onSelectDropdown (wallet, item) {
      if (item === 'delete') {
        this.emitRemove(wallet)
      } else if (item === 'rename') {
        this.emitRename(wallet)
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.WalletGrid {
  display: grid;
  grid-template-rows: 1fr;
}
.WalletGrid__wallet {
  @apply py-3 relative cursor-pointer bg-theme-feature;
  transition-property: transform, border, box-shadow;
  transition-duration: .2s;
  transition-timing-function: ease;
}
.WalletGrid__wallet:hover {
  @apply rounded-lg z-10;
  transform: scale(1.02);
  box-shadow: var(--theme-wallet-grid-shadow);
}
.WalletGrid__wallet:not(:hover)::after {
  @apply block absolute pin-x pin-b mx-auto border-b border-theme-wallet-overview-border;
  content: " ";
  width: 95%;
}
.WalletGrid__wallet:hover .WalletGrid__wallet__wrapper {
  @apply border-transparent
}
.WalletGrid__wallet:hover .identicon {
  opacity: 1;
}
.WalletGrid__wallet__wrapper {
  @apply px-5 py-2 border-l border-theme-wallet-overview-border;
}
.WalletGrid__wallet__name {
  color: #037cff;
}
.WalletGrid__wallet .identicon {
  opacity: 0.5;
  transition: 0.5s;
}
@screen max-md {
  .WalletGrid__wallet__wrapper {
    @apply border-transparent
  }
}
@screen minmax-lg {
  .WalletGrid {
    grid-template-columns: 1fr 1fr;
  }
  .WalletGrid__wallet:nth-child(2n+1) > .WalletGrid__wallet__wrapper {
    @apply border-transparent
  }
}
@screen xl {
  .WalletGrid {
    grid-template-columns: 1fr 1fr 1fr;
  }
  .WalletGrid__wallet:nth-child(3n+1) > .WalletGrid__wallet__wrapper {
    @apply border-transparent
  }
}
</style>
