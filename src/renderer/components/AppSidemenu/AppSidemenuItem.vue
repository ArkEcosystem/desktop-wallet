<template>
  <div
    :class="{ 'AppSideMenuItem--active': isActive }"
    class="AppSidemenuItem h-18 w-18 cursor-pointer flex items-center justify-center text-theme-feature-item-text hover:bg-theme-feature-item-hover hover:text-theme-feature-item-hover-text"
    @click="emitClick"
  >
    <div class="h-4 w-18 flex items-center justify-center overflow-visible">
      <svg
        :viewBox="viewBox"
        class="fill-current h-6 w-6"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path :d="iconPathD"/>
      </svg>
      <div
        v-if="showBadge"
        class="AppSidemenuItem__badge rounded-full animated bounce"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppSidemenuItem',

  props: {

    name: {
      type: String,
      required: true
    },

    iconPathD: {
      type: String,
      required: true
    },

    isActive: {
      type: Boolean,
      required: false,
      default: false
    },

    showBadge: {
      type: Boolean,
      default: false
    },

    viewBox: {
      type: String,
      required: true
    }
  },

  methods: {
    emitClick () {
      this.$emit('click', this.name)
    }
  }
}
</script>

<style scoped>
.AppSidemenuItem {
  transition: background-color 0.5s;
}
.AppSidemenuItem > div {
  transition: height 0.5s, color 0.5s;
}
.AppSidemenuItem--active {
  background-color: var(--theme-feature-item-selected);
}
.AppSidemenuItem--active > div {
  color: var(--theme-feature-item-selected-text);
  height: 2.5rem;
  box-shadow: inset 0.15rem 0px 0px 0px var(--theme-feature-item-indicator);
}
.AppSidemenuItem:hover > div {
  height: 1rem;
  box-shadow: inset 0.15rem 0px 0px 0px var(--theme-feature-item-indicator);
}
.AppSidemenuItem__badge {
  position: absolute;
  float: right;
  right: 1.25rem;
  margin-top: -0.7rem;
  height: 0.25rem;
  width: 0.25rem;
  border-width: 0.25rem;
  border-color: var(--theme-feature-item-indicator);
  background-color: var(--theme-feature-item-indicator);
}
</style>
