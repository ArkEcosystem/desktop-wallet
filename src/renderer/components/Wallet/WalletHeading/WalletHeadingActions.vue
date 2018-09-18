<template>
  <div class="flex items-center relative overflow-hidden font-sans">
    <transition
      name="action-slide"
      mode="out-in"
    >
      <div
        v-if="!showSecondaryActions"
        key="PrimaryActions"
        class="WalletHeading__PrimaryActions"
      >
        <button class="bg-theme-heading-button text-theme-heading-button-text mr-2 p-2 rounded-lg">
          QR
        </button>
        <button class="bg-theme-heading-button text-theme-heading-button-text p-2 rounded-lg">
          {{ $t('WALLET_HEADING.ACTIONS.SEND') }}
        </button>
      </div>
      <div
        v-else
        key="SecondaryActions"
        class="WalletHeading__SecondaryActions"
      >
        <button class="bg-theme-heading-button text-theme-heading-button-text p-2 rounded-lg">
          {{ $t('WALLET_HEADING.ACTIONS.WALLET_NAME') }}
        </button>
        <button class="bg-theme-heading-button text-theme-heading-button-text p-2 rounded-lg">
          {{ $t('WALLET_HEADING.ACTIONS.REGISTER_DELEGATE') }}
        </button>
        <button class="bg-theme-heading-button text-theme-heading-button-text p-2 rounded-lg">
          {{ $t('WALLET_HEADING.ACTIONS.SECOND_PASSPHRASE') }}
        </button>
        <button class="bg-theme-heading-button text-theme-heading-button-text p-2 rounded-lg">
          {{ $t('WALLET_HEADING.ACTIONS.DELETE_WALLET') }}
        </button>
      </div>
    </transition>
    <button
      class="bg-theme-heading-button text-theme-heading-button-text ml-2 p-2 rounded-lg"
      @click="showSecondaryActions = !showSecondaryActions"
    >
      &vellip;
    </button>
  </div>
</template>

<script>
export default {
  name: 'WalletHeadingActions',
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
