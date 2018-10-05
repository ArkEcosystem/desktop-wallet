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
      return this.wallet_fromRoute.address
    },
    balance () {
      const balance = this.wallet_fromRoute.balance
      return this.currency_format(this.currency_subToUnit(balance), { currencyFrom: 'network' })
    }
  }
}
</script>
