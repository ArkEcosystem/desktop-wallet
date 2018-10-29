<template>
  <div class="flex">
    <Identicon
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
import { Identicon } from '@/components/Profile'

export default {
  name: 'WalletHeadingInfo',

  components: {
    ButtonClipboard,
    Identicon,
    SvgIcon
  },

  computed: {
    address () {
      const wallet = this.wallet_fromRoute
      return wallet ? wallet.address : ''
    },
    alternativeBalance () {
      const wallet = this.wallet_fromRoute
      const balance = wallet ? this.currency_subToUnit(wallet.balance) : 0
      return this.currency_format(balance * this.price, { currency: this.alternativeCurrency })
    },
    alternativeCurrency () {
      return this.$store.getters['session/currency']
    },
    balance () {
      const wallet = this.wallet_fromRoute
      const balance = wallet ? wallet.balance : 0
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
