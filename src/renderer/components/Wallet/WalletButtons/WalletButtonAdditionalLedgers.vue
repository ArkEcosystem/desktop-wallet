<template>
  <div
    v-show="isLedgerConnected"
    class="WalletButton__load-ledger-wallets"
  >
    <a
      class="text-center"
      @click="toggle"
    >
      <span class="rounded-full bg-theme-button h-8 w-8 mb-3 mx-auto flex items-center justify-center">
        <SvgIcon
          name="update"
          class="text-center"
          view-box="0 0 9 9"
        />
      </span>

      {{ $t('PAGES.WALLET_ALL.LEDGER.ADDITIONAL') }}
    </a>
    <ModalAdditionalLedgers
      v-if="showModal"
      @close="toggle"
    />
  </div>
</template>

<script>
import ModalAdditionalLedgers from '@/components/Modal/ModalAdditionalLedgers'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'WalletButtonAdditionalLedgers',

  components: {
    ModalAdditionalLedgers,
    SvgIcon
  },

  data () {
    return {
      showModal: false
    }
  },

  computed: {
    isLedgerConnected () {
      return this.$store.getters['ledger/isConnected']
    }
  },

  methods: {
    toggle () {
      this.showModal = !this.showModal
    }
  }
}
</script>

<style lang="postcss" scoped>
.WalletButton__load-ledger-wallets {
  @apply .appearance-none .font-semibold .flex .flex-col .items-center .border-r .border-theme-feature-item-alternative
}
.WalletButton__load-ledger-wallets > span {
  @apply .w-full .text-center
}
.WalletButton__load-ledger-wallets > a {
  @apply .cursor-pointer;
}
.WalletButton__load-ledger-wallets > a > .rounded-full {
  @apply .cursor-pointer .fill-current .text-theme-option-button-text;
  transition: opacity 0.4s;
}
.WalletButton__load-ledger-wallets > a:hover > .rounded-full {
  opacity: 0.5;
}

.WalletButton__load-ledger-wallets > span {
  border-right: 0.04rem solid var(--theme-feature-item-alternative);
  align-self: center;
}
.WalletButton__load-ledger-wallets:hover > span {
  border-right: 0px;
}
</style>
