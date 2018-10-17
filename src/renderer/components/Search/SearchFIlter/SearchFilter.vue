<template>
  <MenuOptions
    v-click-outside="emitClose"
    class="SearchFilter absolute pin-r text-theme-settings-text"
  >
    <ul class="SearchFilter__list list-reset flex items-center py-3 px-5">
      <li>
        <span class="text-grey-dark text-sm display-block">{{ $t('SEARCH.SEARCH_BY') }}</span>
        <MenuDropdown
          :items="['Transaction', 'Delegate']"
          :placeholder="$t('SEARCH.SELECT_OPTION')"
        >
          <button
            slot="handler"
            slot-scope="handlerProps"
            class="flex items-center text-theme-settings-text mt-2"
          >
            <span class="rounded border border-theme-settings-border mr-2">
              <SvgIcon
                :class="{
                  'rotate-vertical': handlerProps.isOpen
                }"
                name="arrow-dropdown"
                view-box="0 0 18 18"
                class="transition align-middle"
              />
            </span>
            <span class="font-semibold">{{ handlerProps.value || handlerProps.placeholder }}</span>
          </button>
        </MenuDropdown>
      </li>
      <li>
        <span class="block py-2">
          <SvgIcon
            name="placeholder"
            view-box="0 0 111 25"
            class="text-theme-settings-button"
          />
        </span>
      </li>
    </ul>
  </MenuOptions>
</template>

<script>
import { MenuOptions, MenuDropdown } from '@/components/Menu'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'SearchFilter',

  components: {
    MenuOptions,
    MenuDropdown,
    SvgIcon
  },

  methods: {
    emitClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="postcss" scoped>
.rotate-vertical {
  transform: rotate(-180deg);
}

.SearchFilter__list > li {
  @apply .px-5 .border-l .border-theme-settings-border
}
.SearchFilter__list > li:first-child {
  @apply .border-none
}
</style>
