<template>
  <InputSelect
    ref="dropdown"
    :items="options"
    :is-disabled="isDisabled"
    :label="inputLabel"
    :name="name"
    :value="value"
    class="InputLanguage"
    @input="select"
  >
    <div
      slot="input-item"
      slot-scope="itemScope"
      class="flex flex-row space-between"
    >
      <img
        :src="flagImage(itemScope.value)"
        :title="itemScope.item"
        class="InputLanguage__item__flag mr-2"
      >
      <span class="font-semibold">
        {{ itemScope.item }}
      </span>
    </div>

    <div
      slot="input-handler"
      slot-scope="handlerScope"
    >
      <img
        :src="flagImage(selected)"
        :title="handlerScope.value"
        class="InputLanguage__handler__flag mr-1"
      >
      {{ handlerScope.item }}
    </div>
  </InputSelect>
</template>

<script>
import { I18N } from '@config'
import InputSelect from './InputSelect'

export default {
  name: 'InputLanguage',

  components: {
    InputSelect
  },

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    languages: {
      type: Array,
      required: false,
      default: () => I18N.enabledLocales
    },
    label: {
      type: String,
      required: false,
      default: ''
    },
    name: {
      type: String,
      required: false,
      default: 'language'
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    value: {
      type: String,
      required: false,
      default: undefined
    }
  },

  data: vm => ({
    inputLabel: vm.label,
    isFocused: false,
    selected: vm.value
  }),

  computed: {
    // These are the options that are visible on the dropdown
    options () {
      return (this.languages || I18N.enabledLocales).reduce((all, locale) => {
        all[locale] = this.$t(`LANGUAGES.${locale}`)
        return all
      }, {})
    }
  },

  watch: {
    value (value) {
      this.selected = value
    }
  },

  mounted () {
    if (!this.inputLabel) {
      this.inputLabel = this.$t('COMMON.LANGUAGE')
    }
  },

  methods: {
    flagImage (language) {
      return this.assets_loadImage(`flags/${language}.svg`)
    },

    select (language) {
      this.selected = language
      this.emitInput()
    },

    emitInput () {
      this.$emit('input', this.selected)
    }
  }
}
</script>

<style scoped>
.InputLanguage__item__flag {
  height: 18px
}
.InputLanguage__handler__flag {
  height: 12px
}
</style>

<style>
.InputLanguage .MenuDropdownItem__container {
  @apply .mx-0 .px-2
}
</style>
