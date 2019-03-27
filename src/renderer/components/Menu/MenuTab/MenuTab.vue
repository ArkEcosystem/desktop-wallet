<template>
  <div class="MenuTab bg-theme-feature overflow-hidden">
    <nav
      class="MenuTab__nav bg-theme-feature-item-alternative text-theme-feature-item-alternative-text"
    >
      <div class="inline-flex justify-start items-center">
        <button
          v-for="item in items"
          :key="item.tab"
          :class="{
            'MenuTab__nav__item--active': item.isActive,
            'MenuTab__nav__item--disabled': item.isDisabled
          }"
          :disabled="item.isDisabled"
          class="MenuTab__nav__item text-inherit appearance-none cursor-pointer font-semibold px-5 py-4 flex justify-center items-center hover:bg-theme-feature-item-hover hover:text-theme-feature-item-selected-text"
          @click="switchToTab(item.tab)"
        >
          <template v-if="item.$slots.header">
            <VNodes :vnodes="item.$slots.header" />
          </template>

          <template v-else>
            {{ item.label }}
          </template>
        </button>
      </div>
    </nav>
    <section class="MenuTab__content p-5">
      <slot />
    </section>
  </div>
</template>

<script>
import VNodes from '@/components/utils/VNodes'

export default {
  name: 'MenuTab',

  components: {
    VNodes
  },

  model: {
    prop: 'tab',
    event: 'input'
  },

  props: {
    tab: {
      type: [String, Number],
      required: false,
      default: null
    }
  },

  data: vm => ({
    activeTab: vm.tab,
    items: []
  }),

  watch: {
    tab () {
      this.switchToTab(this.tab)
    }
  },

  mounted () {
    this.collectItems()
    this.switchToTab(this.activeTab)
  },

  methods: {
    collectItems () {
      this.items = this.$children.filter(child => {
        return child.$options.name === 'MenuTabItem'
      })
    },

    switchToTab (newTab) {
      this.resetScroll()
      this.items.forEach(item => item.toggle(item.tab === newTab))
      this.activeTab = newTab
      this.$emit('input', this.activeTab)
    },

    resetScroll () {
      if (this.$el.scrollTop > 0) {
        this.$el.scrollTo(0, 0)
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.MenuTab__nav__item--active {
  @apply .bg-theme-feature .text-theme-page-text;
}

.MenuTab__nav__item--disabled {
  @apply .text-theme-feature-item-alternative-text .opacity-50;
}

.MenuTab__nav__item--disabled:hover {
  @apply .bg-transparent;
}
</style>
