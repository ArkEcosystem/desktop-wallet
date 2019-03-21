<template>
  <div
    v-show="isLedgerConnected"
    class="WalletButton__load-ledger-wallets"
  >
    <a
      class="text-center"
      @click="toggle"
    >
      <span
        v-tooltip="hideText ? $t('PAGES.WALLET_ALL.LEDGER.ADDITIONAL') : ''"
        :class="{ 'mb-3': !hideText }"
        class="rounded-full bg-theme-button h-8 w-8 mx-auto flex items-center justify-center"
      >
        <SvgIcon
          name="ledger"
          class="text-center"
          view-box="0 0 12 12"
        />
      </span>

      <span v-if="!hideText">
        {{ $t('PAGES.WALLET_ALL.LEDGER.ADDITIONAL') }}
      </span>
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
    },

    hideText () {
      return this.$store.getters['session/hideWalletButtonText']
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
