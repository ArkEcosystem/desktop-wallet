<template>
  <div
    key="SecondaryActions"
    class="WalletHeading__SecondaryActions flex content-end"
  >
    <ButtonModal
      :class="buttonStyle"
      :label="$t('WALLET_HEADING.ACTIONS.WALLET_NAME')"
      icon="name"
    >
      <template slot-scope="{ toggle, isOpen }">
        <WalletRenameModal
          v-if="isOpen"
          :wallet="currentWallet"
          @cancel="toggle"
          @renamed="toggle"
        />
      </template>
    </ButtonModal>

    <ButtonModal
      v-show="!currentWallet.isContact && !currentWallet.isDelegate"
      :class="buttonStyle"
      :label="$t('WALLET_HEADING.ACTIONS.REGISTER_DELEGATE')"
      icon="register-delegate"
    >
      <template slot-scope="{ toggle, isOpen }">
        <TransactionModal
          v-if="isOpen"
          :type="2"
          @cancel="toggle"
          @sent="toggle"
        />
      </template>
    </ButtonModal>

    <ButtonModal
      v-show="!currentWallet.isContact && !currentWallet.isLedger && !currentWallet.secondPublicKey"
      :class="buttonStyle"
      :label="$t('WALLET_HEADING.ACTIONS.SECOND_PASSPHRASE')"
      icon="2nd-passphrase"
    >
      <template slot-scope="{ toggle, isOpen }">
        <TransactionModal
          v-if="isOpen"
          :type="1"
          @cancel="toggle"
          @sent="toggle"
        />
      </template>
    </ButtonModal>

    <ButtonModal
      v-show="!currentWallet.isLedger"
      :class="buttonStyle"
      :label="$t('WALLET_HEADING.ACTIONS.DELETE_WALLET')"
      icon="delete-wallet"
    >
      <template slot-scope="{ toggle, isOpen }">
        <WalletRemovalConfirmation
          v-if="isOpen"
          :wallet="currentWallet"
          @cancel="toggle"
          @removed="onRemoval"
        />
      </template>
    </ButtonModal>
  </div>
</template>

<script>
import { ButtonModal } from '@/components/Button'
import { WalletRenameModal, WalletRemovalConfirmation } from '@/components/Wallet'
import { TransactionModal } from '@/components/Transaction'

export default {
  name: 'WalletHeadingSecondaryActions',

  components: {
    ButtonModal,
    WalletRenameModal,
    WalletRemovalConfirmation,
    TransactionModal
  },

  computed: {
    buttonStyle () {
      return 'option-heading-button whitespace-no-wrap mr-2 px-3 py-2'
    },

    currentWallet () {
      return this.wallet_fromRoute
    }
  },

  methods: {
    async onRemoval () {
      this.$router.push({ name: 'wallets' })
    }
  }
}
</script>
