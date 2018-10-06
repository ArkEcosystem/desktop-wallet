<template>
  <div class="flex items-center relative overflow-hidden font-sans">
    <transition
      name="action-slide"
      mode="out-in"
    >
      <WalletHeadingPrimaryActions v-if="!showSecondaryActions" />
      <WalletHeadingSecondaryActions v-else />
    </transition>
    <button
      class="option-button ml-2 p-2 rounded-md items-center"
      @click="showSecondaryActions = !showSecondaryActions"
    >
      <SvgIcon
        v-if="!showSecondaryActions"
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

export default {
  name: 'WalletHeadingActions',

  components: {
    WalletHeadingPrimaryActions,
    WalletHeadingSecondaryActions,
    SvgIcon
  },

  data () {
    return {
      showSecondaryActions: false
    }
  },

  computed: {
    slideDuration () {
      const primaryToSecondaryDurations = {
        leave: 300,
        enter: 600
      }

      const secondaryToPrimaryDurations = {
        leave: 600,
        enter: 300
      }

      return this.showSecondaryActions ? primaryToSecondaryDurations : secondaryToPrimaryDurations
    }
  }
}
</script>

<style scoped>
.action-slide-enter-active, .action-slide-leave-active {
  transition: all .5s linear;
}

.action-slide-enter, .action-slide-leave-to {
  transform: translateX(100%);
  opacity: 0%;
}
</style>
