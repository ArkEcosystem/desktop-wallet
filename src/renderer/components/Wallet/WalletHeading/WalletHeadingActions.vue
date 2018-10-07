<template>
  <div class="flex items-center relative overflow-hidden font-sans">
    <WalletHeadingPrimaryActions v-if="!secondaryButtonsVisible" />
    <WalletHeadingSecondaryActions v-else />
    <button
      class="option-button ml-2 p-2 rounded-lg"
      @click="$store.dispatch('wallet/setSecondaryButtonsVisible', !secondaryButtonsVisible)"
    >
      <SvgIcon
        v-if="!secondaryButtonsVisible"
        class="rotate-90"
        name="point"
        view-box="0 0 16 16" />
      <SvgIcon
        v-else
        name="step-back"
        view-box="0 0 16 16" />
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
    ...mapGetters('wallet', ['secondaryButtonsVisible'])
  }
}
</script>
