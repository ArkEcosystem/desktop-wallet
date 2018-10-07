<template>
  <div
    key="SecondaryActions"
    class="WalletHeading__SecondaryActions flex content-end"
  >
    <button class="option-button px-2 mr-2 rounded-md whitespace-no-wrap flex items-center justify-center">
      <SvgIcon
        class="mr-1"
        name="name"
        view-box="0 0 20 20" />
      {{ $t('WALLET_HEADING.ACTIONS.WALLET_NAME') }}
    </button>
    <ButtonModal
      :label="$t('WALLET_HEADING.ACTIONS.REGISTER_DELEGATE')"
      icon="register-delegate"
      class="option-button whitespace-no-wrap"
    >
      <TransactionModal
        slot-scope="{ toggle }"
        :type="2"
        @cancel="toggle"
      />
    </ButtonModal>
    <button class="option-button px-2 mr-2 rounded-md whitespace-no-wrap flex items-center justify-center">
      <SvgIcon
        class="mr-1"
        name="2nd-passphrase"
        view-box="0 0 20 20" />
      {{ $t('WALLET_HEADING.ACTIONS.SECOND_PASSPHRASE') }}
    </button>
    <ButtonModal
      :label="$t('WALLET_HEADING.ACTIONS.DELETE_WALLET')"
      icon="delete-wallet"
      class="option-button whitespace-no-wrap"
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
import SvgIcon from '@/components/SvgIcon'
import { TransactionModal } from '@/components/Transaction'

export default {
  name: 'WalletHeadingSecondaryActions',

  components: {
    ButtonModal,
    WalletRemovalConfirmation,
    SvgIcon,
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
