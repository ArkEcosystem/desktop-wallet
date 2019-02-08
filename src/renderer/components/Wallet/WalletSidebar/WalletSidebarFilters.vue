<template>
  <div
    v-click-outside="emitClose"
    :class="isSidebarExpanded ? 'WalletSidebarFilters--expanded' : 'WalletSidebarFilters--collapsed'"
    class="WalletSidebarFilters absolute z-20"
  >
    <div
      class="bg-theme-settings mt-2 pt-1 px-10 rounded"
    >
      <WalletSidebarFiltersSearchInput
        v-model="filters_searchQuery"
        :placeholder="hasContacts
          ? $t('WALLET_SIDEBAR.SEARCH.PLACEHOLDER_CONTACT')
          : $t('WALLET_SIDEBAR.SEARCH.PLACEHOLDER_WALLETS')
        "
      />
    </div>

    <MenuOptions class="WalletSidebarFilters__sorting mt-2">
      <div class="mx-10 py-5 mb-2 text-theme-settings-heading select-none">
        {{ $t('WALLET_SIDEBAR.SORT.BY') }}
      </div>
      <MenuOptionsItem
        :title="$t('WALLET_SIDEBAR.SORT.NAME_ASC')"
        @click="setSort('name-asc')"
      />
      <MenuOptionsItem
        :title="$t('WALLET_SIDEBAR.SORT.NAME_DESC')"
        @click="setSort('name-desc')"
      />
      <MenuOptionsItem
        :title="$t('WALLET_SIDEBAR.SORT.BALANCE_ASC')"
        @click="setSort('balance-asc')"
      />
      <MenuOptionsItem
        :title="$t('WALLET_SIDEBAR.SORT.BALANCE_DESC')"
        @click="setSort('balance-desc')"
      />
    </MenuOptions>

    <MenuOptions class="WalletSidebarFilters__settings mt-2">
      <MenuOptionsItem
        :title="hasContacts
          ? $t('WALLET_SIDEBAR.FILTERS.HIDE_EMPTY_CONTACTS')
          : $t('WALLET_SIDEBAR.FILTERS.HIDE_EMPTY_WALLETS')
        "
        @click="toggleSelect('hide-empty')"
      >
        <div
          slot="controls"
          class="pointer-events-none"
        >
          <ButtonSwitch
            ref="hide-empty"
            :is-active="filters_hideEmpty"
            class="theme-dark"
            background-color="#414767"
            @change="setHideEmpty"
          />
        </div>
      </MenuOptionsItem>
      <MenuOptionsItem
        v-if="hasLedger && !hasContacts"
        :title="$t('WALLET_SIDEBAR.FILTERS.HIDE_LEDGER')"
        @click="toggleSelect('hide-ledger')"
      >
        <div
          slot="controls"
          class="pointer-events-none"
        >
          <ButtonSwitch
            ref="hide-ledger"
            :is-active="filters_hideLedger"
            class="theme-dark"
            background-color="#414767"
            @change="setHideLedger"
          />
        </div>
      </MenuOptionsItem>
    </MenuOptions>
  </div>
</template>

<script>
import { ButtonSwitch } from '@/components/Button'
import { MenuOptions, MenuOptionsItem } from '@/components/Menu'
import WalletSidebarFiltersSearchInput from './WalletSidebarFiltersSearchInput'

export default {
  name: 'WalletSidebarFilters',

  components: {
    ButtonSwitch,
    MenuOptions,
    MenuOptionsItem,
    WalletSidebarFiltersSearchInput
  },

  props: {
    hasContacts: {
      type: Boolean,
      required: false,
      default: false
    },
    hasLedger: {
      type: Boolean,
      required: false,
      default: false
    },
    isSidebarExpanded: {
      type: Boolean,
      required: false,
      default: false
    },
    // TODO
    outsideClick: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data () {
    return {
      // TODO persist the filters
      filters_hideEmpty: false,
      filters_hideLedger: false,
      filters_searchQuery: '',
      filters_sortOrder: 'name-asc'
    }
  },

  computed: {
  },

  methods: {
    onSearch (query) {
    },

    setHideEmpty (isHidden) {
      this.filters_hideEmpty = isHidden
    },

    setHideLedger (isHidden) {
      this.filters_hideLedger = isHidden
    },

    setSort (order) {
      this.filters_sortOrder = order
    },

    toggleSelect (name) {
      this.$refs[name].toggle()
    },

    emitClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="postcss" scoped>
.WalletSidebarFilters {
  width: 380px;
  left: 6.5rem;
}

.WalletSidebarFilters--expanded {
  transform: translateY(-10%);
  right: 4.5rem;
  top: 5.75rem;
}
</style>
