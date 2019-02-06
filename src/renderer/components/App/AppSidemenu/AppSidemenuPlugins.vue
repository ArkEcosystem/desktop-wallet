<template>
  <div
    v-click-outside="emitClose"
    :class="isHorizontal ? 'AppSidemenuPlugins--horizontal' : 'AppSidemenuPlugins'"
    class="absolute z-20"
  >
    <MenuOptions
      :is-horizontal="isHorizontal"
      :is-settings="true"
    >
      <MenuOptionsItem
        v-for="(menuItem, menuId) in pluginMenuItems"
        :key="menuId"
        :title="menuItem.title"
        class="text-grey-light"
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
      this.$emit('close')
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
  width: 360px;
  left: 6.5rem;
  top: 19rem;
  transform: translateY(-10%);
}

.AppSidemenuPlugins .MenuOptions--vertical:after {
  top: 2rem;
}

.AppSidemenuPlugins--horizontal {
  width: 300px;
  right: 8.5rem;
  top: 5.75rem;
}
</style>
