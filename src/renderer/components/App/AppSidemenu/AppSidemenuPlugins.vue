<template>
  <div
    v-click-outside="emitClose"
    :class="{
      'AppSidemenuPlugins--horizontal': isHorizontal,
      'AppSidemenuPlugins': !isHorizontal,
      'AppSidemenuPlugins--single': pluginMenuItems.length === 1
    }"
    class="absolute z-20 theme-dark"
  >
    <MenuOptions
      :is-horizontal="isHorizontal"
      :is-settings="true"
      :single-column="false"
      class="whitespace-no-wrap"
    >
      <MenuOptionsItem
        v-for="(menuItem, menuId) in pluginMenuItems"
        :key="menuId"
        :title="menuItem.title"
        @click="navigateToRoute(menuItem.routeName)"
      />
    </MenuOptions>
  </div>
</template>

<script>
import { MenuOptions, MenuOptionsItem } from '@/components/Menu'

export default {
  name: 'AppSidemenuPlugins',

  components: {
    MenuOptions,
    MenuOptionsItem
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

  computed: {
    pluginMenuItems () {
      return this.$store.getters['plugin/menuItems']
    }
  },

  methods: {
    navigateToRoute (routeName) {
      this.$emit('close', true)
      this.$router.push({ name: routeName })
    },

    emitClose () {
      if (this.outsideClick) {
        this.$emit('close')
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.AppSidemenuPlugins {
  left: 6.5rem;
  top: 19rem;
  transform: translateY(-10%);
}
.AppSidemenuPlugins .MenuOptions {
  @apply .flex-col .max-h-xs .overflow-y-auto;
}

.AppSidemenuPlugins--single {
  top: 22.2rem;
}

.AppSidemenuPlugins--horizontal {
  width: 300px;
  right: 8.5rem;
  top: 5.75rem;
}
.AppSidemenuPlugins--horizontal .MenuOptions {
  @apply .flex-col .max-h-xs .overflow-y-auto;
}
</style>
