<template>
  <div class="WalletButton__export">
    <a
      class="font-bold text-center"
      @click="toggle"
    >
      <span
        v-tooltip="hideText ? $t('PAGES.WALLET_ALL.EXPORT_WALLETS') : ''"
        :class="{ 'mb-3': !hideText }"
        class="rounded-full bg-theme-button h-8 w-8 mx-auto flex items-center justify-center"
      >
        <SvgIcon
          name="arrow-export"
          class="text-center"
          view-box="0 0 7 10"
        />
      </span>

      <span v-if="!hideText">
        {{ $t('PAGES.WALLET_ALL.EXPORT_WALLETS') }}
      </span>
    </a>
    <ModalExportWallets
      v-if="showModal"
      @close="toggle"
    />
  </div>
</template>

<script>
import ModalExportWallets from '@/components/Modal/ModalExportWallets'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'WalletButtonExport',

  components: {
    ModalExportWallets,
    SvgIcon
  },

  data () {
    return {
      showModal: false
    }
  },

  computed: {
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
.WalletButton__export {
  @apply .appearance-none .font-semibold .flex .flex-col .items-center .border-l .border-theme-feature-item-alternative
}
.WalletButton__export > span {
  @apply .w-full .text-center
}
.WalletButton__export > a > .rounded-full {
  @apply .cursor-pointer .fill-current .text-theme-option-button-text;
  transition: opacity 0.4s;
}
.WalletButton__export > a:hover > .rounded-full {
  opacity: 0.5;
}

.WalletButton__export > a {
  @apply .cursor-pointer;
}
.WalletButton__export > a > span {
  border-left: 0.04rem solid var(--theme-feature-item-alternative);
  align-self: center;
}
</style>
