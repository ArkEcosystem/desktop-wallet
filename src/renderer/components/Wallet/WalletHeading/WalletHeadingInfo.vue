<template>
  <div class="flex">
    <img
      src="https://api.adorable.io/avatars/285/abott@adorable.png"
      alt="identicon"
      class="WalletHeading__identicon w-24 h-24 rounded-full">

    <div class="flex flex-col justify-center text-white antialiased pl-4 text-lg">
      <p class="WalletHeading__address tracking-wide mb-3">
        {{ wallet_formatAddress(address) }}
        <ButtonClipboard
          :value="address"
          class="text-inherit opacity-50"
        />
      </p>

      <p class="WalletHeading__balance font-semibold tracking-extrawide ">{{ balance }}</p>
    </div>
  </div>
</template>

<script>
import { ButtonClipboard } from '@/components/Button'

export default {
  name: 'WalletHeadingInfo',

  components: {
    ButtonClipboard
  },

  computed: {
    address () {
      const wallet = this.wallet_fromRoute
      return wallet ? wallet.address : ''
    },
    balance () {
      const wallet = this.wallet_fromRoute
      const balance = wallet ? wallet.balance : 0
      return this.currency_format(this.currency_subToUnit(balance), { currencyFrom: 'network' })
    }
  }
}
</script>
