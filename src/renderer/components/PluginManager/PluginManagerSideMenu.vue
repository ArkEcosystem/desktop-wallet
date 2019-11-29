<template>
  <div class="PluginManagerSideMenu">
    <PluginManagerButtonMenu
      class="mb-4"
      @click="emitToggle"
    />

    <ul class="PluginManagerSideMenu__categories">
      <li
        v-for="category in categories"
        :key="category"
        class="transition"
        :class="{ 'active': category === activeCategory }"
        @click="emitCategory(category)"
      >
        <span>
          {{ $t(`PAGES.PLUGIN_MANAGER.CATEGORIES.${category.toUpperCase()}`) }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import concat from 'lodash/concat'
import { PLUGINS } from '@config'
import { PluginManagerButtonMenu } from '@/components/PluginManager/PluginManagerButtons'

export default {
  name: 'PluginManagerSideMenu',

  components: {
    PluginManagerButtonMenu
  },

  props: {
    activeCategory: {
      type: String,
      required: false,
      default: 'all'
    }
  },

  computed: {
    categories () {
      return concat(['all'], PLUGINS.categories)
    }
  },

  methods: {
    emitToggle () {
      this.$emit('toggle')
    },

    emitCategory (category) {
      if (category !== this.activeCategory) {
        this.$emit('category-change', category)
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.PluginManagerSideMenu {
  @apply flex flex-col min-w-48 px-10 my-10 border-r border-theme-line-separator;
}
.PluginManagerSideMenu__categories {
  @apply list-reset w-full text-theme-page-text-light;
}
.PluginManagerSideMenu__categories li {
  @apply block font-semibold py-4 px-10 -mx-10 border-l-3 border-transparent cursor-pointer
}
.PluginManagerSideMenu__categories li:hover,
.PluginManagerSideMenu__categories li.active {
  @apply bg-theme-secondary-feature text-theme-page-text border-blue
}
</style>
