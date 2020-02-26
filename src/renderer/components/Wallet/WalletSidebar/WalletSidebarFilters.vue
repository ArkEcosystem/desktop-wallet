<template>
  <div
    v-click-outside.capture="emitClose"
    :class="isSidebarExpanded ? 'WalletSidebarFilters--expanded' : 'WalletSidebarFilters--collapsed'"
    class="WalletSidebarFilters absolute z-20 rounded-lg"
  >
    <div
      class="bg-theme-settings p-10 rounded-lg shadow font-bold"
    >
      <WalletSidebarFiltersSearchInput
        v-model="filters.searchQuery"
        :placeholder="hasContacts
          ? $t('WALLET_SIDEBAR.SEARCH.PLACEHOLDER_CONTACTS')
          : $t('WALLET_SIDEBAR.SEARCH.PLACEHOLDER_WALLETS')
        "
        @input="setSearchQuery"
      />
    </div>

    <MenuOptions class="WalletSidebarFilters__sorting mt-2 rounded-lg shadow font-bold">
      <div class="mx-10 py-5 mb-2 text-theme-settings-heading select-none">
        {{ $t('WALLET_SIDEBAR.SORT.BY') }}
      </div>
      <MenuOptionsItem
        v-for="option in $options.sortOptions"
        :key="option"
        :title="`${$t('WALLET_SIDEBAR.SORT.' + option.toUpperCase().replace('-', '_'))}`"
        :class="stringifiedSortOrder === option ? 'WalletSidebarFilters__sorting__order--selected' : ''"
        @click="setSort(option)"
      />
    </MenuOptions>

    <MenuOptions class="WalletSidebarFilters__settings mt-2 rounded-lg shadow font-medium">
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
            :is-active="currentFilters.hideEmpty"
            background-color="var(--theme-settings-switch)"
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
            :is-active="currentFilters.hideLedger"
            background-color="var(--theme-settings-switch)"
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
import Vue from 'vue'

export default {
  name: 'WalletSidebarFilters',

  components: {
    ButtonSwitch,
    MenuOptions,
    MenuOptionsItem,
    WalletSidebarFiltersSearchInput
  },

  sortOptions: [
    'name-asc',
    'name-desc',
    'balance-asc',
    'balance-desc'
  ],

  props: {
    hasContacts: {
      type: Boolean,
      required: false,
      default: false
    },
    // Show the Ledger options or not
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
    outsideClick: {
      type: Boolean,
      required: false,
      default: false
    },
    filters: {
      type: Object,
      required: true
    },
    searchQuery: {
      type: String,
      required: false,
      default: ''
    },
    sortOrder: {
      type: Object,
      required: false,
      default: () => ({ field: 'name', type: 'asc' })
    }
  },

  data () {
    return {
      currentSearchQuery: this.searchQuery,
      currentFilters: this.filters,
      currentSortOrder: this.sortOrder
    }
  },

  computed: {
    stringifiedSortOrder () {
      return Object.values(this.currentSortOrder).join('-')
    }
  },

  watch: {
    filters (filters) {
      this.currentFilters = filters
    },

    searchQuery (query) {
      this.currentSearchQuery = query
    }
  },

  methods: {
    setSearchQuery (query) {
      this.currentSearchQuery = query
      this.emitSearch()
    },

    setHideEmpty (isHidden) {
      this.setFilter('hideEmpty', isHidden)
    },

    setHideLedger (isHidden) {
      this.setFilter('hideLedger', isHidden)
    },

    setFilter (filter, value) {
      Vue.set(this.currentFilters, filter, value)
      this.emitFilter()
    },

    setSort (value) {
      const [field, type] = value.split('-')
      this.currentSortOrder = { field, type }
      this.emitSort()
    },

    toggleSelect (name) {
      this.$refs[name].toggle()
    },

    emitFilter () {
      this.$emit('filter', this.currentFilters)
    },

    emitSearch () {
      this.$emit('search', this.currentSearchQuery)
    },

    emitSort () {
      this.$emit('sort', this.currentSortOrder)
    },

    emitClose (context) {
      this.$emit('close', context)
    }
  }
}
</script>

<style lang="postcss" scoped>
.WalletSidebarFilters {
  width: 380px;
  /* The collapsed sidebar uses `.w-1/8` */
  right: calc(12.5% - 0.5rem);
  top: 0.75rem;
  transition: right 0.4s;
}

.WalletSidebarFilters--expanded {
  /* The expanded sidebar uses `.w-1/3` */
  right: calc(33.33333% - 1.25rem);
}

.WalletSidebarFilters__sorting .MenuOptionsItem {
  transition: color 0.2s;
}
.WalletSidebarFilters__sorting__order--selected {
  color: var(--theme-settings-heading) !important;
}

.WalletSidebarFilters .MenuOptions {
  @apply .rounded-lg
}
/* To not render the bubble arrow */
.WalletSidebarFilters .MenuOptions:after {
  border-width: 0px
}
</style>
