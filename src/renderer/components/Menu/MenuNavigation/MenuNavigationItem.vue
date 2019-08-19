<template>
  <button
    :class="{
      'MenuNavigationItem--active': isActive,
      'w-full' : !isHorizontal
    }"
    :disabled="isDisabled"
    class="MenuNavigationItem relative cursor-pointer flex items-center justify-center text-theme-feature-item-text hover:bg-theme-feature-item-hover hover:text-theme-feature-item-hover-text"
    @click.capture.stop="onClick"
  >
    <div
      v-if="!isHorizontal"
      class="MenuNavigationItem__border absolute w-full"
    />
    <slot
      :is-active="isActive"
    >
      <div
        v-if="icon"
        :class="{ 'w-full' : !isHorizontal }"
        class="flex items-center justify-center"
      >
        <SvgIcon
          :name="icon"
          :view-box="viewBox"
        />
        <div
          v-if="showBadge"
          class="MenuNavigationItem__badge rounded-full animated bounce"
        />
      </div>
    </slot>
    <div
      v-if="isHorizontal"
      class="MenuNavigationItemHorizontal__border absolute h-full"
    />
  </button>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'MenuNavigationItem',

  inject: ['switchToItem'],

  components: {
    SvgIcon
  },

  props: {
    id: {
      type: [String, Number],
      required: true
    },
    icon: {
      type: String,
      required: false,
      default: null
    },
    showBadge: {
      type: Boolean,
      required: false,
      default: false
    },
    viewBox: {
      type: String,
      required: false,
      default: '0 0 23 23'
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    isHorizontal: {
      type: Boolean,
      required: false,
      default: false
    },
    canActivate: {
      type: Boolean,
      required: false,
      default: true
    }
  },

  data: () => ({
    isActive: false
  }),

  methods: {
    onClick () {
      if (this.canActivate) {
        this.switchToItem(this.id)
      }

      this.$emit('click', this.id)
    },

    toggle (isActive) {
      this.isActive = isActive
    }
  }
}
</script>

<style scoped>
.MenuNavigationItem {
  transition: background-color 0.5s;
}
.MenuNavigationItem:hover {
  background-color: var(--theme-feature-item-selected);
}
/* Vertical sidebar */
.MenuNavigationItem > .MenuNavigationItem__border {
  height: 40%;
  transition: height 0.5s, color 0.5s;
}
.MenuNavigationItem:hover > .MenuNavigationItem__border {
  height: 60%;
  box-shadow: inset 0.15rem 0px 0px 0px var(--theme-feature-item-indicator);
}
.MenuNavigationItem--active > .MenuNavigationItem__border {
  height: 80%;
  box-shadow: inset 0.15rem 0px 0px 0px var(--theme-feature-item-indicator);
  color: var(--theme-feature-item-selected-text);
}
/* Horizontal toolbar */
.MenuNavigationItem > .MenuNavigationItemHorizontal__border {
  width: 40%;
  transition: width 0.5s, color 0.5s;
}
.MenuNavigationItem:hover > .MenuNavigationItemHorizontal__border {
  width: 60%;
  box-shadow: inset 0px -0.15rem 0px 0px var(--theme-feature-item-indicator);
}
.MenuNavigationItem--active > .MenuNavigationItemHorizontal__border {
  width: 80%;
  box-shadow: inset 0px -0.15rem 0px 0px var(--theme-feature-item-indicator);
  color: var(--theme-feature-item-selected-text);
}
.MenuNavigationItem__badge {
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
