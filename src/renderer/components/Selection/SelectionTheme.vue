<template>
  <div class="flex flex-no-grow items-center">
    <SvgIcon
      name="sun"
      view-box="0 0 20 20"
      class="transition text-yellow"
    />
    <div>
      <ButtonSwitch
        :is-active="status"
        class="mx-2"
        @change="emitInput"
      />
    </div>
    <SvgIcon
      name="moon"
      view-box="0 0 18 18"
      class="transition text-blue-dark"
    />
  </div>
</template>

<script>
import { ButtonSwitch } from '@/components/Button'
import { SvgIcon } from '@/components/SvgIcon'

export default {
  name: 'SelectionTheme',

  themes: {
    light: false,
    dark: true
  },

  components: {
    ButtonSwitch,
    SvgIcon
  },

  props: {
    value: {
      type: String,
      required: false,
      default: null
    }
  },

  computed: {
    status () {
      return this.$options.themes[this.value]
    }
  },

  methods: {
    emitInput (status) {
      const theme = Object.keys(this.$options.themes).find(theme => this.$options.themes[theme] === status)
      this.$emit('input', theme)
    }
  }
}
</script>
