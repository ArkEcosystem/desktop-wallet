<template>
  <div
    v-show="isLedgerConnected"
    class="WalletButton__ledger-settings"
  >
    <a
      class="text-center"
      @click="toggleShowLedgerSettings"
    >
      <span
        v-tooltip="showTooltip ? $t('PAGES.WALLET_ALL.LEDGER.OPTIONS') : ''"
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
        {{ $t('PAGES.WALLET_ALL.LEDGER.OPTIONS') }}
      </span>
    </a>

    <WalletHeadingMenuLedger
      v-if="isLedgerSettingsVisible"
      :outside-click="true"
      @close="closeShowLedgerSettings"
    />
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import WalletHeadingMenuLedger from '@/components/Wallet/WalletHeading/WalletHeadingMenuLedger'

export default {
  name: 'WalletButtonLedgerSettings',

  components: {
    SvgIcon,
    WalletHeadingMenuLedger
  },

  data () {
    return {
      isLedgerSettingsVisible: false
    }
  },

  computed: {
    isLedgerConnected () {
      return this.$store.getters['ledger/isConnected']
    },

    hideText () {
      return this.$store.getters['session/hideWalletButtonText']
    },

    showTooltip () {
      return this.hideText && !this.isLedgerSettingsVisible
    }
  },

  methods: {
    toggleShowLedgerSettings () {
      this.isLedgerSettingsVisible = !this.isLedgerSettingsVisible
    },

    closeShowLedgerSettings () {
      this.isLedgerSettingsVisible = false
    }
  }
}
</script>

<style lang="postcss" scoped>
.WalletButton__ledger-settings {
  @apply .relative .appearance-none .font-semibold .flex .flex-col .items-center .border-r .border-theme-feature-item-alternative
}
.WalletButton__ledger-settings > span {
  @apply .w-full .text-center
}
.WalletButton__ledger-settings > a {
  @apply .cursor-pointer;
}
.WalletButton__ledger-settings > a > .rounded-full {
  @apply .cursor-pointer .fill-current .text-theme-option-button-text;
  transition: opacity 0.4s;
}
.WalletButton__ledger-settings > a:hover > .rounded-full {
  opacity: 0.5;
}

.WalletButton__ledger-settings > span {
  border-right: 0.04rem solid var(--theme-feature-item-alternative);
  align-self: center;
}
.WalletButton__ledger-settings:hover > span {
  border-right: 0px;
}
</style>
