<template>
  <div class="flex">
    <img
      src="https://api.adorable.io/avatars/285/abott@adorable.png"
      alt="identicon"
      class="WalletHeading__identicon w-24 h-24 rounded-full">

    <div class="flex flex-col justify-center text-white antialiased pl-4 text-lg">
      <p class="WalletHeading__address tracking-wide mb-3">
        {{ wallet_fromRoute.address }}
        <ButtonClipboard
          :value="wallet_fromRoute.address"
          class="text-inherit opacity-50"
        />
      </p>

      <p class="WalletHeading__balance font-semibold tracking-extrawide">{{ wallet_fromRoute.balance.toLocaleString('en') }}</p>
    </div>
  </div>
</template>

<script>
import { ButtonClipboard } from '@/components/Button'

export default {
  name: 'WalletHeadingInfo',

  components: {
    ButtonClipboard
  }
}
</script>
