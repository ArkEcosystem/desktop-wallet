<template>
  <div class="flex">
    <WalletIdenticon
      :value="address"
      :size="100"
      class="WalletHeading__identicon"
    />
    <div class="flex flex-col justify-center text-white antialiased pl-4 text-lg">
      <p class="WalletHeading__address tracking-wide mb-3 flex items-center">
        <span v-tooltip="address">{{ wallet_formatAddress(address) }}</span>
        <SvgIcon
          v-tooltip="$t('WALLET_HEADING.SECOND_PASSPHRASE_ENABLED')"
          v-if="currentWallet.secondPublicKey"
          name="2nd-passphrase"
          view-box="0 0 16 16"
          class="ml-1"
        />
        <ButtonClipboard
          :value="address"
          class="text-inherit opacity-50 ml-1"
        />
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

  computed: {
    address () {
      return this.currentWallet ? this.currentWallet.address : ''
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
    }
  }
}
</script>
