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
        v-tooltip="item.tooltip"
        :label="item.label"
        :disabled="item.disabled"
        class="ButtonDropdown__ButtonModal option-heading-button whitespace-no-wrap w-full"
        :class="{
          'ButtonDropdown__ButtonModal__disabled': item.disabled
        }"
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
      :label="currentWallet.isContact ? $t('WALLET_HEADING.ACTIONS.DELETE_CONTACT') : $t('WALLET_HEADING.ACTIONS.DELETE_WALLET')"
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
import { ButtonDropdown, ButtonModal } from '@/components/Button'
import { ContactRenameModal } from '@/components/Contact'
import { WalletRenameModal, WalletRemovalConfirmation } from '@/components/Wallet'
import { TransactionModal } from '@/components/Transaction'
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

  data: () => ({
    registrationTypes: [],
    isContact: false
  }),

  computed: {
    buttonStyle () {
      return 'option-heading-button whitespace-no-wrap mr-2 px-3 py-2'
    },

    currentNetwork () {
      return this.$store.getters['session/network']
    },

    currentWallet () {
      return this.wallet_fromRoute
    }
  },

  watch: {
    currentWallet (wallet) {
      this.isContact = wallet.isContact
    }
  },

  async mounted () {
    this.registrationTypes = await this.getRegistrationTypes()
    this.isContact = this.currentWallet.isContact
  },

  methods: {
    async onRemoval () {
      if (this.isContact) {
        this.$router.push({ name: 'contacts' })
      } else {
        this.$router.push({ name: 'wallets' })
      }
    },

    closeTransactionModal (toggleMethod, isOpen) {
      if (isOpen) {
        toggleMethod()
      }
    },

    async getRegistrationTypes () {
      const types = []

      if (this.currentWallet.isContact) {
        return []
      }

      if (!this.currentWallet.isLedger && !this.currentWallet.multiSignature) {
        if (!this.currentWallet.secondPublicKey) {
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

      // TODO: Remove ledger check when ledger app supports multisig, business & bridgechain transactions
      if (this.currentWallet.isLedger || !this.currentNetwork.constants || !this.currentNetwork.constants.aip11) {
        return types
      }

      if (!this.currentWallet.multiSignature) {
        types.push({
          label: this.$t('WALLET_HEADING.ACTIONS.REGISTER_MULTISIGNATURE'),
          type: TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE
        })
      }

      if (!this.currentWallet.isLedger && WalletService.canResignDelegate(this.currentWallet)) {
        types.push({
          label: this.$t('WALLET_HEADING.ACTIONS.RESIGN_DELEGATE'),
          type: TRANSACTION_TYPES.GROUP_1.DELEGATE_RESIGNATION
        })
      }

      return types
    }
  }
}
</script>

<style scoped>
.ButtonDropdown__list {
  background-color: var(--theme-option-heading-button);
}

.ButtonDropdown__ButtonModal__disabled {
  background-color: var(--theme-option-heading-button-disabled);
  color: var(--theme-option-heading-button-text-disabled);
  @apply .cursor-not-allowed;
}
.ButtonDropdown__ButtonModal__disabled:hover {
  background-color: var(--theme-option-heading-button-disabled-hover);
  color: var(--theme-option-heading-button-text-disabled-hover);
}
</style>
