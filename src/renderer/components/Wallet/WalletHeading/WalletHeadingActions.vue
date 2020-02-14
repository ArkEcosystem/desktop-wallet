<template>
  <div class="flex items-center relative font-sans my-auto">
    <WalletHeadingPrimaryActions
      v-if="!secondaryButtonsVisible"
      class="-mr-2"
    />
    <WalletHeadingSecondaryActions
      v-else
      class="-mr-2"
    />
    <button
      v-if="!currentWallet.isWatchOnly"
      class="option-heading-button flex items-center self-stretch ml-2 p-2"
      @click="$store.dispatch('wallet/setSecondaryButtonsVisible', !secondaryButtonsVisible)"
    >
      <SvgIcon
        v-if="!secondaryButtonsVisible"
        class="rotate-90"
        name="point"
        view-box="0 0 14 14"
      />
      <SvgIcon
        v-else
        name="step-back"
        view-box="0 0 14 14"
      />
    </button>
  </div>
</template>

<script>
import WalletHeadingPrimaryActions from './WalletHeadingPrimaryActions'
import WalletHeadingSecondaryActions from './WalletHeadingSecondaryActions'
import SvgIcon from '@/components/SvgIcon'
import { mapGetters } from 'vuex'

export default {
  name: 'WalletHeadingActions',

  components: {
    WalletHeadingPrimaryActions,
    WalletHeadingSecondaryActions,
    SvgIcon
  },

  computed: {
    ...mapGetters('wallet', ['secondaryButtonsVisible']),

    currentWallet () {
      return this.wallet_fromRoute
    }
  }
}
</script>
