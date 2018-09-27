<template>
  <div
    key="SecondaryActions"
    class="WalletHeading__SecondaryActions flex"
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
    <ButtonPopup
      :label="$t('WALLET_HEADING.ACTIONS.DELETE_WALLET')"
      class="bg-theme-heading-button text-theme-heading-button-text"
    >
      <WalletRemovePopup
        slot-scope="{ toggle }"
        :wallet="currentWallet"
        @cancel="toggle"
        @continue="deleteWallet(toggle)"
      />
    </ButtonPopup>
  </div>
</template>

<script>
import { ButtonPopup } from '@/components/Button'
import { WalletRemovePopup } from '@/components/Wallet'

export default {
  name: 'WalletHeadingSecondaryActions',

  components: {
    ButtonPopup,
    WalletRemovePopup
  },

  computed: {
    currentWallet () {
      return this.wallet_fromRoute
    }
  },

  methods: {
    async deleteWallet (toggle) {
      await this.$store.dispatch('wallet/delete', this.currentWallet)
      this.$router.push({ name: 'wallets' })
      toggle()
    }
  }
}
</script>
