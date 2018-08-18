<template>
  <router-link
    :to="{ name: routeTo }"
    class="sidemenu-item h-18 w-18 flex items-center justify-center hover:bg-red-lightest">
    <div class="h-4 w-18 flex items-center justify-center text-blue-lighter hover:text-pink-lighter overflow-visible">
      <svg
        :viewBox="viewBox"
        class="fill-current h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path :d="iconPathD"/>
      </svg>
    </div>
  </router-link>
</template>

<script>
export default {
  props: {
    iconPathD: {
      type: String,
      required: true
    },
    routeTo: {
      type: String,
      required: true
    },
    viewBox: {
      type: String,
      required: true
    }
  },
  computed: {
    isCurrentRoute () {
      return this.$route.name === this.routeTo
    }
  }
}
</script>

<style scoped>
a.sidemenu-item {
  transition: background-color 0.5s;
}
a.sidemenu-item > div {
  transition: height 0.5s, color 0.5s;
}
a.sidemenu-item.router-link-exact-active {
}
a.sidemenu-item.router-link-exact-active > div {
  color: var(--theme-sidemenu-item-active-color);
  height: 2.5rem;
  box-shadow: inset 0.15rem 0px 0px 0px var(--theme-sidemenu-item-indicator-color);
}
a.sidemenu-item:hover > div {
  color: var(--theme-sidemenu-item-hover-color);
  height: 1rem;
  box-shadow: inset 0.15rem 0px 0px 0px var(--theme-sidemenu-item-indicator-color);
}
</style>
