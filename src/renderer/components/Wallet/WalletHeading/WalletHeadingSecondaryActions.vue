<template>
  <div
    key="SecondaryActions"
    class="WalletHeading__SecondaryActions flex content-end"
  >
    <ButtonDropdown
      v-if="registrationTypes.length"
      :classes="buttonStyle"
      :items="registrationTypes"
      title="Registration"
    >
      <ButtonModal
        slot="button"
        slot-scope="{ item, triggerClose }"
        :label="item.label"
        class="option-heading-button whitespace-no-wrap w-full"
        @toggle="triggerClose"
      >
        <template slot-scope="{ toggle, isOpen }">
          <TransactionModal
            v-if="isOpen"
            :type="item.type"
            :group="item.group || 1"
            @cancel="closeTransactionModal(toggle, isOpen)"
            @sent="closeTransactionModal(toggle, isOpen)"
          />
        </template>
      </ButtonModal>
    </ButtonDropdown>

    <ButtonModal
      :class="buttonStyle"
      :label="currentWallet.isContact ? $t('WALLET_HEADING.ACTIONS.CONTACT_NAME') : $t('WALLET_HEADING.ACTIONS.WALLET_NAME')"
      icon="name"
    >
      <template slot-scope="{ toggle, isOpen }">
        <ContactRenameModal
          v-if="currentWallet.isContact && isOpen"
          :wallet="currentWallet"
          @cancel="toggle"
          @renamed="toggle"
        />

        <WalletRenameModal
          v-if="!currentWallet.isContact && isOpen"
          :wallet="currentWallet"
          @cancel="toggle"
          @renamed="toggle"
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
import { TRANSACTION_TYPES } from '@config'
import ButtonDropdown from '@/components/Button/ButtonDropdown'
import ButtonModal from '@/components/Button/ButtonModal'
import ContactRenameModal from '@/components/Contact/ContactRenameModal'
import WalletRenameModal from '@/components/Wallet/WalletRenameModal'
import WalletRemovalConfirmation from '@/components/Wallet/WalletRemovalConfirmation'
import TransactionModal from '@/components/Transaction/TransactionModal'
import WalletService from '@/services/wallet'

export default {
  name: 'WalletHeadingSecondaryActions',

  components: {
    ButtonDropdown,
    ButtonModal,
    ContactRenameModal,
    WalletRenameModal,
    WalletRemovalConfirmation,
    TransactionModal
  },

  computed: {
    buttonStyle () {
      return 'option-heading-button whitespace-no-wrap mr-2 px-3 py-2'
    },

    currentNetwork () {
      return this.$store.getters['session/network']
    },

    currentWallet () {
      return this.wallet_fromRoute
    },

    registrationTypes () {
      const types = []

      if (this.currentWallet.isContact) {
        return []
      }

      if (!this.currentWallet.multiSignature) {
        if (!this.currentWallet.isLedger && !this.currentWallet.secondPublicKey) {
          types.push({
            label: this.$t('WALLET_HEADING.ACTIONS.SECOND_PASSPHRASE'),
            type: TRANSACTION_TYPES.GROUP_1.SECOND_SIGNATURE
          })
        }

        if (!this.currentWallet.isDelegate) {
          types.push({
            label: this.$t('WALLET_HEADING.ACTIONS.REGISTER_DELEGATE'),
            type: TRANSACTION_TYPES.GROUP_1.DELEGATE_REGISTRATION
          })
        }
      }

      if (!this.currentNetwork.constants || !this.currentNetwork.constants.aip11) {
        return types
      }

      if (!this.currentWallet.multiSignature) {
        types.push({
          label: this.$t('WALLET_HEADING.ACTIONS.REGISTER_MULTISIGNATURE'),
          type: TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE
        })
      }

      if (this.currentWallet.isDelegate) {
        types.push({
          label: this.$t('WALLET_HEADING.ACTIONS.RESIGN_DELEGATE'),
          type: TRANSACTION_TYPES.GROUP_1.DELEGATE_RESIGNATION
        })
      }

      if (!WalletService.isBusiness(this.currentWallet)) {
        types.push({
          label: this.$t('WALLET_HEADING.ACTIONS.BUSINESS.REGISTER'),
          group: 2,
          type: TRANSACTION_TYPES.GROUP_2.BUSINESS_REGISTRATION
        })
      } else if (WalletService.isBusiness(this.currentWallet, false)) {
        types.push({
          label: this.$t('WALLET_HEADING.ACTIONS.BUSINESS.UPDATE'),
          group: 2,
          type: TRANSACTION_TYPES.GROUP_2.BUSINESS_UPDATE
        })
      }

      if (WalletService.canResignBusiness(this.currentWallet)) {
        types.push({
          label: this.$t('WALLET_HEADING.ACTIONS.BUSINESS.RESIGN'),
          group: 2,
          type: TRANSACTION_TYPES.GROUP_2.BUSINESS_RESIGNATION
        })
      }

      return types
    }
  },

  methods: {
    async onRemoval () {
      this.$router.push({ name: 'wallets' })
    },

    closeTransactionModal (toggleMethod, isOpen) {
      if (isOpen) {
        toggleMethod()
      }
    }
  }
}
</script>

<style scoped>
.ButtonDropdown__list {
  background-color: var(--theme-option-heading-button);
}
</style>
