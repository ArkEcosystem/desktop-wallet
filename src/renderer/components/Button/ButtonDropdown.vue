<template>
  <div
    ref="buttonDropdown"
    class="ButtonDropdown"
    :class="{ flex: hasPrimaryButton }"
  >
    <div
      v-if="hasPrimaryButton"
      class="ButtonDropdown__primary"
    >
      <slot name="primaryButton" />
    </div>

    <div
      v-if="items.length"
      v-click-outside.capture="triggerClose"
    >
      <button
        class="ButtonDropdown__button blue-button"
        :class="dropdownButtonClasses"
        @click="toggleDropdown"
      >
        <div class="whitespace-no-wrap">
          <span
            v-if="!hasPrimaryButton && title"
            class="mr-1"
          >
            {{ title }}
          </span>

          <SvgIcon
            name="arrow-dropdown"
            :view-box="arrowViewbox"
            class="ButtonDropdown__button__arrow"
            :class="{ 'ButtonDropdown__button__arrow--active': showDropdown }"
          />
        </div>
      </button>

      <Portal
        to="button-dropdown"
      >
        <div
          v-show="showDropdown"
          slot-scope="app"
          class="ButtonDropdown__list transition"
          :style="dropdownStyle"
          :class="{
            'blur': app.hasBlurFilter
          }"
        >
          <div
            v-for="(item, key) of items"
            :key="key"
            class="ButtonDropdown__list__item flex-1 whitespace-no-wrap"
          >
            <slot
              name="button"
              v-bind="{ item, triggerClose }"
            >
              <ButtonGeneric
                :label="item"
                @click="triggerClose"
              />
            </slot>
          </div>
        </div>
      </Portal>
    </div>
  </div>
</template>

<script>
import { ButtonGeneric } from '@/components/Button'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'ButtonDropdown',

  components: {
    ButtonGeneric,
    SvgIcon
  },

  props: {
    dropdownClasses: {
      type: String,
      required: false,
      default: ''
    },

    classes: {
      type: String,
      required: false,
      default: ''
    },

    items: {
      type: Array,
      required: true
    },

    title: {
      type: String,
      required: false,
      default: null
    }
  },

  data () {
    return {
      showDropdown: false
    }
  },

  computed: {
    hasPrimaryButton () {
      return !!this.$slots.primaryButton
    },

    dropdownButtonClasses () {
      return {
        ...this.dropdownClasses.split(' ').reduce((classes, className) => {
          classes[className] = true

          return classes
        }, {}),
        'ButtonDropdown__button--nolabel': this.hasPrimaryButton
      }
    },

    arrowViewbox () {
      if (this.showDropdown) {
        return '0 2 12 16'
      }

      return '0 -2 12 16'
    },

    dropdownStyle () {
      const buttonDropdown = this.$refs.buttonDropdown

      if (!buttonDropdown) {
        return ''
      }

      const height = buttonDropdown.clientHeight
      const position = buttonDropdown.getBoundingClientRect()

      return [
        `top: ${position.top + height}px`,
        `left: ${position.left}px`,
        'z-index: 10'
      ].join(';')
    }
  },

  methods: {
    toggleDropdown () {
      this.showDropdown = !this.showDropdown
    },

    triggerClose () {
      this.showDropdown = false
    }
  }
}
</script>

<style scoped>
.ButtonDropdown {
  @apply .relative;
}

.ButtonDropdown__button__arrow--active {
  transform: rotate(180deg);
}

.ButtonDropdown__list {
  @apply .absolute .pin-l .flex-col .mt-1 .rounded;
  top: 100%;
}
</style>

<style>
.ButtonDropdown__button--nolabel {
  @apply .border-l .rounded-tl-none .rounded-bl-none;
  border-left-color: var(--theme-header-text)
}
.ButtonDropdown__list__item button {
  @apply .rounded-none;
}
.ButtonDropdown__list__item:first-child button {
  @apply .rounded-t;
}
.ButtonDropdown__list__item:last-child button {
  @apply .rounded-b;
}
</style>
