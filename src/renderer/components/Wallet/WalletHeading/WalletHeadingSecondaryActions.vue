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
      v-show="currentWallet.isSendingEnabled"
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
      v-show="currentWallet.isSendingEnabled"
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
    buttonStyle () {
      return 'option-button whitespace-no-wrap mr-2 p-2 rounded-md'
    },

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
