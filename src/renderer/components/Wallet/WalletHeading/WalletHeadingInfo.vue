<template>
  <div class="flex">
    <img
      :src="identicon"
      alt="identicon"
      class="WalletHeading__identicon w-24 h-24 rounded-full">
    <div class="flex flex-col justify-center text-white antialiased pl-4 text-lg">
      <p class="WalletHeading__address font-sans font-semibold tracking-extrawide  pb-3">{{ address }}</p>
      <p class="WalletHeading__arkBalance font-sans font-semibold tracking-extrawide ">{{ arkBalance.toLocaleString('en') }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'WalletHeadingInfo',
  props: {
    identicon: {
      type: String,
      required: true // default identicon could be supplied here
    },
    address: {
      type: String,
      required: true
    },
    arkBalance: {
      type: Number,
      default: 0
    }
  }
}
</script>
