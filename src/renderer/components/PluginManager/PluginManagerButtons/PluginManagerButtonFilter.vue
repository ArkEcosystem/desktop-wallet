<template>
  <div v-click-outside="closeDropdown">
    <button
      class="PluginManagerButtonFilter"
      @click="toggleDropdown"
    >
      <span class="mr-2 md:whitespace-no-wrap">
        {{ strings_capitalizeFirst($t(`PAGES.PLUGIN_MANAGER.FILTERS.${activeFilter.toUpperCase()}`)) }}
      </span>

      <SvgIcon
        :class="{ 'rotate-180': isOpen }"
        name="arrow-dropdown"
        view-box="0 0 10 10"
      />
    </button>

    <div
      v-show="isOpen"
      class="PluginManagerButtonFilter__options"
    >
      <div
        v-for="filter of filters"
        :key="filter"
        :class="
          filter === activeFilter
            ? 'bg-theme-feature-item-hover text-theme-feature-item-selected-text'
            : 'text-grey-dark hover:bg-theme-feature-item-alternative'
        "
        class="PluginManagerButtonFilter__options__option transition"
        @click="emitFilterChange(filter)"
      >
        <div class="mx-8 py-4 px-5 text-center">
          {{ strings_capitalizeFirst($t(`PAGES.PLUGIN_MANAGER.FILTERS.${filter.toUpperCase()}`)) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'PluginManagerButtonFilter',

  components: {
    SvgIcon
  },

  props: {
    activeFilter: {
      type: String,
      required: true
    }
  },

  data: () => ({
    isOpen: false,
    filters: [
      'all',
      'installed',
      'official',
      'funded'
    ]
  }),

  methods: {
    closeDropdown () {
      this.isOpen = false
    },

    toggleDropdown () {
      this.isOpen = !this.isOpen
    },

    emitFilterChange (filter) {
      this.closeDropdown()
      this.$emit('filter-change', filter)
    }
  }
}
</script>

<style lang="postcss" scoped>
.PluginManagerButtonFilter {
  @apply flex items-center relative rounded bg-theme-button text-theme-page-text h-8 pl-4 pr-3
}

.PluginManagerButtonFilter__options {
  @apply absolute shadow list-reset flex flex-col bg-theme-feature rounded py-2 overflow-y-auto max-h-2xs z-20
}
.PluginManagerButtonFilter__options__option {
  @apply cursor-pointer;
  border-color: transparent;
}
.PluginManagerButtonFilter__options__option:not(:last-child) div {
   @apply border-b border-theme-line-separator
}
</style>
