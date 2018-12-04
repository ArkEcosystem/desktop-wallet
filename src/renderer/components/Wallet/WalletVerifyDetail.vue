<template>
  <div
    :class="[isVerified ? 'WalletVerifyDetail__verified' : 'WalletVerifyDetail__notVerified']"
    class="flex flex-row justify-between rounded-lg px-5 py-6 bg-theme-heading-background"
  >
    <div class="flex flex-row">
      <WalletIdenticon
        :value="address"
        :size="75"
      />
      <div class="flex flex-col justify-center ml-4 w-80 font-semibold">
        <span class="text-theme-feature-item-text text-sm mb-1">
          {{ $t('SIGN_VERIFY.CONFIRMATION') }}
        </span>
        <span class="text-white text-lg">
          {{ isVerified ? $t('SIGN_VERIFY.VERIFIED') : $t('SIGN_VERIFY.NOT_VERIFIED') }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { WalletIdenticon } from './'

export default {
  name: 'WalletVerifyDetail',

  components: {
    WalletIdenticon
  },

  props: {
    address: {
      type: String,
      required: true
    },
    isVerified: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style>
.WalletVerifyDetail__verified {
  background-image: -webkit-linear-gradient(30deg, #394b54 20%, var(--theme-transaction-detail-gradient2) 20%);
}

.WalletVerifyDetail__notVerified {
  background-image: -webkit-linear-gradient(30deg, #493c56 20%, var(--theme-transaction-detail-gradient2) 20%);
}
</style>
