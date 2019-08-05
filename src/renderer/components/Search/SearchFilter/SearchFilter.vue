<template>
  <MenuOptions
    v-click-outside="emitClose"
    class="SearchFilter absolute pin-r text-theme-settings-text"
  >
    <ul class="SearchFilter__list list-reset flex items-start py-3 px-5">
      <SearchFilterItem :label="$t('SEARCH.SEARCH_BY')">
        <MenuDropdown
          v-model="currentFilter"
          :items="filterComponents"
          :placeholder="$t('SEARCH.SELECT_OPTION')"
        >
          <template
            slot="handler"
            slot-scope="handlerProps"
          >
            <MenuDropdownAlternativeHandler
              v-bind="handlerProps"
              class="text-theme-settings-text"
            />
          </template>
        </MenuDropdown>
      </SearchFilterItem>

      <!-- Placeholder -->
      <SearchFilterItem v-if="!currentFilter">
        <span class="block py-2">
          <SvgIcon
            name="placeholder"
            view-box="0 0 111 25"
            class="text-theme-settings-button"
          />
        </span>
      </SearchFilterItem>

      <Component
        :is="currentFilter"
        v-else
      />
    </ul>
  </MenuOptions>
</template>

<script>
/* eslint-disable vue/no-unused-components */
import { MenuOptions, MenuDropdown, MenuDropdownAlternativeHandler } from '@/components/Menu'
import SearchFilterItem from './SearchFilterItem'
import SvgIcon from '@/components/SvgIcon'
import SearchFilterTransaction from './SearchFilterTransaction'
import SearchFilterDelegate from './SearchFilterDelegate'

export default {
  name: 'SearchFilter',

  components: {
    MenuOptions,
    MenuDropdown,
    MenuDropdownAlternativeHandler,
    SearchFilterItem,
    SearchFilterTransaction,
    SearchFilterDelegate,
    SvgIcon
  },

  props: {
    outsideClick: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => ({
    currentFilter: null
  }),

  computed: {
    filterComponents () {
      return {
        SearchFilterTransaction: this.$t('TRANSACTION.TRANSACTION'),
        SearchFilterDelegate: this.$t('SEARCH.DELEGATE')
      }
    }
  },

  methods: {
    emitClose () {
      if (this.outsideClick) {
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.SearchFilter__list > .SearchFilterItem:first-child {
  @apply .border-none
}
</style>
