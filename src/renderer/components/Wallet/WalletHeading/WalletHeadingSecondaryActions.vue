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
      <TransactionModal
        slot-scope="{ toggle }"
        :type="2"
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
      <WalletRemovalConfirmation
        slot-scope="{ toggle }"
        :wallet="currentWallet"
        @cancel="toggle"
        @removed="onRemoval"
      />
    </ButtonModal>
  </div>
</template>

<script>
import { ButtonModal } from '@/components/Button'
import { WalletRemovalConfirmation } from '@/components/Wallet'
import { TransactionModal } from '@/components/Transaction'

export default {
  name: 'WalletHeadingSecondaryActions',

  components: {
    ButtonModal,
    WalletRemovalConfirmation,
    TransactionModal
  },

  computed: {
    currentWallet () {
      return this.wallet_fromRoute
    }
  },

  methods: {
    async onRemoval (toggle) {
      this.$router.push({ name: 'wallets' })
      toggle()
    }
  }
}
</script>
