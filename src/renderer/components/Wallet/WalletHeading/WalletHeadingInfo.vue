<template>
  <div class="flex">
    <WalletIdenticon
      :value="address"
      :size="100"
      class="WalletHeading__identicon"
    />
    <div class="flex flex-col justify-center text-white antialiased pl-4 text-lg">
      <p class="WalletHeading__address tracking-wide mb-3 flex items-center">
        <span v-tooltip="label">{{ wallet_formatAddress(label) }}</span>
        <SvgIcon
          v-tooltip="$t('WALLET_HEADING.SECOND_PASSPHRASE_ENABLED')"
          v-if="currentWallet.secondPublicKey"
          name="2nd-passphrase"
          view-box="0 0 18 18"
          class="ml-1"
        />

        <ButtonClipboard
          :value="showPublicKey ? publicKey : address"
          view-box="0 0 15 18"
          class="text-inherit opacity-50 mx-2"
        />

        <button
          v-tooltip="{
            content: labelTooltip,
            trigger:'hover'
          }"
          v-if="currentWallet.publicKey"
          class="text-inherit opacity-50"
          @click="togglePublicKey"
        >
          <SvgIcon
            :name="showPublicKey ? 'world' : 'key'"
            view-box="0 0 18 18"
          />
        </button>
      </p>

      <p class="WalletHeading__balance font-semibold tracking-extrawide">
        {{ balance }}
        <span
          v-if="isMarketEnabled"
          class="WalletHeading__balance__alternative text-xs text-theme-feature-item-text"
        >
          {{ alternativeBalance }}
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { ButtonClipboard } from '@/components/Button'
import SvgIcon from '@/components/SvgIcon'
import { WalletIdenticon } from '../'

export default {
  name: 'WalletHeadingInfo',

  components: {
    ButtonClipboard,
    WalletIdenticon,
    SvgIcon
  },

  data: () => ({
    showPublicKey: false
  }),

  computed: {
    address () {
      return this.currentWallet ? this.currentWallet.address : ''
    },
    publicKey () {
      return this.currentWallet ? this.currentWallet.publicKey : ''
    },
    alternativeBalance () {
      const balance = this.currentWallet ? this.currency_subToUnit(this.currentWallet.balance) : 0
      return this.currency_format(balance * this.price, { currency: this.alternativeCurrency })
    },
    alternativeCurrency () {
      return this.$store.getters['session/currency']
    },
    balance () {
      const balance = this.currentWallet ? this.currentWallet.balance : 0
      return this.formatter_networkCurrency(balance)
    },
    currentWallet () {
      return this.wallet_fromRoute
    },
    isMarketEnabled () {
      return this.session_network.market.enabled
    },
    price () {
      return this.$store.getters['market/lastPrice']
    },
    label () {
      return this.showPublicKey ? this.publicKey : this.address
    },
    labelTooltip () {
      return this.showPublicKey ? this.$t('WALLET_HEADING.ACTIONS.SHOW_ADDRESS') : this.$t('WALLET_HEADING.ACTIONS.SHOW_PUBLIC_KEY')
    }
  },

  methods: {
    togglePublicKey () {
      this.showPublicKey = !this.showPublicKey
    }
  }
}
</script>
