<template>
  <div
    key="SecondaryActions"
    class="WalletHeading__SecondaryActions flex"
  >
    <button class="bg-theme-heading-button text-theme-heading-button-text p-2 rounded-lg">
      {{ $t('WALLET_HEADING.ACTIONS.WALLET_NAME') }}
    </button>
    <ButtonModal
      :label="$t('WALLET_HEADING.ACTIONS.REGISTER_DELEGATE')"
      class="bg-theme-heading-button text-theme-heading-button-text"
    >
      <WalletRegisterDelegateModal
        slot-scope="{ toggle }"
        @cancel="toggle"
      />
    </ButtonModal>
    <button class="bg-theme-heading-button text-theme-heading-button-text p-2 rounded-lg">
      {{ $t('WALLET_HEADING.ACTIONS.SECOND_PASSPHRASE') }}
    </button>
    <ButtonModal
      :label="$t('WALLET_HEADING.ACTIONS.DELETE_WALLET')"
      class="bg-theme-heading-button text-theme-heading-button-text"
    >
      <ModalConfirmation
        slot-scope="{ toggle }"
        :wallet="currentWallet"
        @cancel="toggle"
        @continue="deleteWallet(toggle)"
      />
    </ButtonModal>
  </div>
</template>

<script>
import { ButtonModal } from '@/components/Button'
import { ModalConfirmation } from '@/components/Modal'
import { WalletRegisterDelegateModal } from '@/components/Wallet'

export default {
  name: 'WalletHeadingSecondaryActions',

  components: {
    ButtonModal,
    ModalConfirmation,
    WalletRegisterDelegateModal
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
