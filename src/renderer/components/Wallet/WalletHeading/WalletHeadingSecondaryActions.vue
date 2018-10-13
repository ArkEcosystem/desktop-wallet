<template>
  <div
    key="SecondaryActions"
    class="WalletHeading__SecondaryActions flex content-end"
  >
    <ButtonModal
      :label="$t('WALLET_HEADING.ACTIONS.WALLET_NAME')"
      icon="name"
      class="option-button whitespace-no-wrap"
    >
      <WalletRenameModal
        slot-scope="{ toggle }"
        :wallet="currentWallet"
        @cancel="toggle"
        @renamed="toggle"
      />
    </ButtonModal>
    <ButtonModal
      v-show="currentWallet.isSendingEnabled"
      :label="$t('WALLET_HEADING.ACTIONS.REGISTER_DELEGATE')"
      icon="register-delegate"
      class="option-button whitespace-no-wrap"
    >
      <TransactionModal
        slot-scope="{ toggle }"
        :type="2"
        @cancel="toggle"
        @sent="toggle"
      />
    </ButtonModal>
    <ButtonModal
      v-show="currentWallet.isSendingEnabled"
      :label="$t('WALLET_HEADING.ACTIONS.SECOND_PASSPHRASE')"
      icon="2nd-passphrase"
      class="option-button whitespace-no-wrap"
    >
      <TransactionModal
        slot-scope="{ toggle }"
        :type="1"
        @cancel="toggle"
        @sent="toggle"
      />
    </ButtonModal>
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
import { WalletRenameModal, WalletRemovalConfirmation } from '@/components/Wallet'
import SvgIcon from '@/components/SvgIcon'
import { TransactionModal } from '@/components/Transaction'

export default {
  name: 'WalletHeadingSecondaryActions',

  components: {
    ButtonModal,
    WalletRenameModal,
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
