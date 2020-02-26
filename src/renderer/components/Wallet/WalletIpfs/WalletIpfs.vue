<template>
  <div class="WalletIpfs mx-4 overflow-hidden">
    <div class="flex flex-row pb-5 border-b border-dashed border-theme-line-separator">
      <div class="flex flex-col justify-center pl-4">
        <span class="font-bold">
          {{ $t('WALLET_IPFS.HEADER') }}
        </span>
        <span>{{ $t('WALLET_IPFS.DESCRIPTION') }}</span>
      </div>

      <div class="flex items-center ml-4">
        <ButtonModal
          :label="$t('WALLET_IPFS.BUTTON_STORE_HASH')"
          class="blue-button mr-2 py-2 px-4"
        >
          <template slot-scope="{ toggle, isOpen }">
            <TransactionModal
              v-if="isOpen"
              :type="5"
              @cancel="closeTransactionModal(toggle, isOpen)"
              @sent="closeTransactionModal(toggle, isOpen)"
            />
          </template>
        </ButtonModal>
      </div>
    </div>

    <WalletTransactions
      :transaction-type="5"
      class="mt-4"
    />
  </div>
</template>

<script>
import { ButtonModal } from '@/components/Button'
import { TransactionModal } from '@/components/Transaction'
import WalletTransactions from '@/components/Wallet/WalletTransactions'

export default {
  name: 'WalletIpfs',

  components: {
    ButtonModal,
    TransactionModal,
    WalletTransactions
  },

  methods: {
    closeTransactionModal (toggleMethod, isOpen) {
      if (isOpen && typeof toggleMethod === 'function') {
        toggleMethod()
      }
    }
  }
}
</script>

<style>
.WalletIpfs__message:hover {
  @apply bg-theme-table-row-hover
}
</style>
