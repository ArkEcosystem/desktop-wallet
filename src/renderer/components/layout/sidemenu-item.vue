<template>
  <div
    :class="[
      { active: isActive },
      'sidemenu-item h-18 w-18 cursor-pointer flex items-center justify-center text-theme-feature-item-text hover:bg-theme-feature-item-hover hover:text-theme-feature-item-hover-text']"
    @click="$emit('click', name)"
  >
    <div class="h-4 w-18 flex items-center justify-center overflow-visible">
      <svg
        :viewBox="viewBox"
        class="fill-current h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path :d="iconPathD"/>
      </svg>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidemenuItem',

  props: {
    isActive: {
      type: Boolean,
      required: false,
      default: false
    },

    name: {
      type: String,
      required: true
    },

    iconPathD: {
      type: String,
      required: true
    },

    viewBox: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.sidemenu-item {
  transition: background-color 0.5s;
}
.sidemenu-item > div {
  transition: height 0.5s, color 0.5s;
}
.sidemenu-item.active {
  background-color: var(--theme-feature-item-selected);
}
.sidemenu-item.active > div {
  color: var(--theme-feature-item-selected-text);
  height: 2.5rem;
  box-shadow: inset 0.15rem 0px 0px 0px var(--theme-feature-item-indicator);
}
.sidemenu-item:hover > div {
  height: 1rem;
  box-shadow: inset 0.15rem 0px 0px 0px var(--theme-feature-item-indicator);
}
</style>
