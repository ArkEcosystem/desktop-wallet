<template>
  <div
    key="SecondaryActions"
    class="WalletHeading__SecondaryActions"
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
    <button class="bg-theme-heading-button text-theme-heading-button-text p-2 rounded-lg">
      {{ $t('WALLET_HEADING.ACTIONS.DELETE_WALLET') }}
    </button>
  </div>
</template>

<script>
export default {}
</script>
