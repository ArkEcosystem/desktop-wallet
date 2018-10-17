<template>
  <ModalConfirmation
    :question="$t('WALLET_REMOVAL_CONFIRMATION.QUESTION')"
    :note="$t('WALLET_REMOVAL_CONFIRMATION.NOTE')"
    class="WalletRemovalConfirmation"
    @cancel="emitCancel"
    @continue="removeWallet"
  >
    <div class="flex flex-row justify-center">
      <img
        :title="wallet.name"
        :src="assets_loadImage('arrows/arrow-confirmation.svg')"
        class="WalletRemovalConfirmation__container__arrow"
      >
      <Identicon
        :value="wallet.address"
        :size="150"
        class="WalletHeading__identicon"
      />
      <img
        :title="wallet.name"
        :src="assets_loadImage('arrows/arrow-confirmation.svg')"
        class="WalletRemovalConfirmation__container__arrow WalletRemovalConfirmation__container__arrow--reverse"
      >
    </div>
  </ModalConfirmation>
</template>

<script>
import { ModalConfirmation } from '@/components/Modal'
import { Identicon } from '@/components/Profile'

export default {
  name: 'WalletRemovalConfirmation',

  components: {
    Identicon,
    ModalConfirmation
  },

  props: {
    wallet: {
      type: Object,
      required: true
    }
  },

  methods: {
    removeWallet () {
      this.$store.dispatch('wallet/delete', this.wallet)
      this.emitRemoved()
    },

    emitCancel () {
      this.$emit('cancel')
    },

    emitRemoved () {
      this.$emit('removed')
    }
  }
}
</script>

<style scoped>
.WalletRemovalConfirmation >>> .ModalConfirmation__container {
  min-width: calc(var(--wallet-identicon-xl) + 74px * 2);
  max-width: calc(var(--wallet-identicon-xl) + 74px * 2 + 50px)
}
.WalletRemovalConfirmation__container__arrow {
  width: 74px;
  height: 75px;
  margin-top: calc(var(--wallet-identicon-xl) - 75px + 2rem)
}
.WalletRemovalConfirmation__container__arrow--reverse {
  transform: scaleX(-1)
}
</style>
