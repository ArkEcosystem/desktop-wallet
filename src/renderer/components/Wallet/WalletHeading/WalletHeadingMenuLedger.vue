<template>
  <div
    v-click-outside.capture="emitClose"
    :class="hideText ? 'WalletHeadingMenuLedger__text-hidden' : 'WalletHeadingMenuLedger'"
    class="absolute z-20 theme-dark"
  >
    <MenuOptions
      :is-horizontal="true"
      :is-settings="true"
    >
      <MenuOptionsItem
        :tooltip="{
          content: $t('PAGES.WALLET_ALL.LEDGER.CACHE_INFO'),
          placement: 'bottom'
        }"
        :title="$t('PAGES.WALLET_ALL.LEDGER.CACHE')"
        @click="toggleSelect('cache-ledgers')"
      >
        <div
          slot="controls"
          class="pointer-events-none"
        >
          <ButtonSwitch
            ref="cache-ledgers"
            :is-active="sessionLedgerCache"
            class="theme-dark"
            background-color="var(--theme-settings-switch)"
            @change="setLedgerCache"
          />
        </div>
      </MenuOptionsItem>

      <MenuOptionsItem
        :title="$t('PAGES.WALLET_ALL.LEDGER.ADDITIONAL')"
        class="text-grey-light"
        @click="toggleAdditionalLedgersModal"
      />
    </MenuOptions>

    <ModalAdditionalLedgers
      v-if="isAdditionalLedgersModalOpen"
      @close="toggleAdditionalLedgersModal"
    />
  </div>
</template>

<script>
import ModalAdditionalLedgers from '@/components/Modal/ModalAdditionalLedgers'
import { MenuOptions, MenuOptionsItem } from '@/components/Menu'
import { ButtonSwitch } from '@/components/Button'

export default {
  name: 'AppSidemenuOptionsSettings',

  components: {
    MenuOptions,
    MenuOptionsItem,
    ModalAdditionalLedgers,
    ButtonSwitch
  },

  props: {
    outsideClick: {
      type: Boolean,
      required: false,
      default: false
    },
    isHorizontal: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      isAdditionalLedgersModalOpen: false
    }
  },

  computed: {
    hideText () {
      return this.$store.getters['session/hideWalletButtonText']
    },

    sessionLedgerCache: {
      get () {
        return this.$store.getters['session/ledgerCache']
      },
      set (enabled) {
        this.$store.dispatch('session/setLedgerCache', enabled)

        this.$store.dispatch('profile/update', {
          ...this.session_profile,
          ledgerCache: enabled
        })

        if (enabled) {
          this.$store.dispatch('ledger/cacheWallets')
        } else {
          this.$store.dispatch('ledger/clearWalletCache')
        }
      }
    }
  },

  methods: {
    setLedgerCache (enabled) {
      this.sessionLedgerCache = enabled
    },

    toggleSelect (name) {
      this.$refs[name].toggle()
    },

    toggleAdditionalLedgersModal (closeMenu) {
      this.isAdditionalLedgersModalOpen = !this.isAdditionalLedgersModalOpen

      if (closeMenu) {
        this.$emit('close')
      }
    },

    emitClose () {
      if (this.outsideClick && !this.isAdditionalLedgersModalOpen) {
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.WalletHeadingMenuLedger,
.WalletHeadingMenuLedger__text-hidden {
  width: 360px;
  top: 75px;
  left: calc(50% - 330px);
}

.WalletHeadingMenuLedger__text-hidden {
  top: 50px;
}
</style>
