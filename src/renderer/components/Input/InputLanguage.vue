<template>
  <MenuDropdown
    ref="dropdown"
    :items="languages"
    :is-disabled="isDisabled"
    :value="optionText"
    class="InputSelect"
    @select="emitInput"
  >
    <InputField
      slot="handler"
      slot-scope="scopeHandler"
      :name="name"
      :label="inputLabel"
      :value="optionText"
      :is-dirty="isDirty"
      :is-disabled="isDisabled"
      :is-focused="isFocused"
    >
      <MenuDropdownHandler
        slot-scope="{ inputClass }"
        :value="scopeHandler.value"
        :placeholder="label"
        :class="inputClass"
        :on-blur="onBlur"
        class="InputSelect__input"
        @click="onHandlerClick"
      />
    </InputField>
  </MenuDropdown>
</template>

<script>
import { I18N } from '@config'
import InputField from './InputField'
import { MenuDropdown, MenuDropdownHandler } from '@/components/Menu'

export default {
  name: 'InputLanguage',

  components: {
    InputField,
    MenuDropdown,
    MenuDropdownHandler
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
    // :label="$t('COMMON.LANGUAGE')"
    label: {
      type: String,
      required: false,
      default: null
    },
    name: {
      type: String,
      required: true
    },
    helperText: {
      type: String,
      required: false,
      default: null
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
    isFocused: false,
    optionValue: vm.value
  }),

  computed: {
    // When the text of the option is empty the label/placeholder is shown instead by the MenuHandler
    inputLabel () {
      return this.optionText ? this.label : ''
    },

    isDirty () {
      return !!this.optionValue
    },

    languageNames () {
      return this.languages.enabledLocales.reduce((all, locale) => {
        all[locale] = this.$t(`LANGUAGES.${locale}`)
        return all
      }, {})
    },

    // These are the options that are visible on the dropdown
    options () {
      return this.languages
    },

    // This is the text that is visible on the InputField
    optionText () {
      // Ensure that the value could be valid
      if (this.items.indexOf(this.optionValue) !== -1) {
        return this.optionValue
      }

      return ''
    }
  },

  watch: {
    value (val) {
      this.optionValue = val
      this.emitInput()
    }
  },

  methods: {
    onHandlerClick () {
      this.isFocused = true
    },

    onBlur (ev) {
      this.$nextTick(() => {
        if (Object.values(document.activeElement.classList).includes('MenuDropdownItem__button')) {
          ev.preventDefault()
        } else {
          this.$refs.dropdown.close()
        }
      })
    },

    emitInput () {
      this.$emit('input', this.selected)
    }
  }
}
</script>
