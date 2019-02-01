<template>
  <MenuDropdown
    ref="dropdown"
    :items="options"
    :is-disabled="isDisabled"
    class="InputLanguage"
    @select="onDropdownSelect"
  >
    <div
      slot="item"
      slot-scope="{ key, item }"
    >
      <img
        :src="flagImage(key)"
        class="InputLanguage__flag"
        title="TODO"
      />
      {{ item }}
    </div>

    <InputField
      slot="handler"
      slot-scope="{ value }"
      :name="name"
      :label="inputLabel"
      :value="optionText"
      :is-dirty="isDirty"
      :is-disabled="isDisabled"
      :is-focused="isFocused"
    >
      <MenuDropdownHandler
        slot-scope="{ inputClass }"
        :value="value"
        :placeholder="label"
        :class="inputClass"
        :on-blur="onBlur"
        class="InputSelect__input"
        @click="onHandlerClick"
      >
        <img
          :src="flagImage(value)"
          class="InputLanguage__flag"
          :title="optionText"
        />
        {{ value }}
      </MenuDropdownHandler>
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
    // TODO label="$t('COMMON.LANGUAGE')"
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

    // These are the options that are visible on the dropdown
    options () {
      return (this.languages || I18N.enabledLocales).reduce((all, locale) => {
        all[locale] = this.$t(`LANGUAGES.${locale}`)
        return all
      }, {})
    },

    // This is the text that is visible on the InputField
    optionText () {
      // Ensure that the value could be valid
      if (Object.keys(this.options).indexOf(this.optionValue) !== -1) {
        return this.optionValue
      }

      return 'NOP' + this.optionValue
    }
  },

  watch: {
    value (val) {
      this.optionValue = val
      this.emitInput()
    }
  },

  methods: {
    flagImage (language) {
      return this.assets_loadImage(`flags/${language}.svg`)
    },

    onHandlerClick () {
      this.isFocused = true
    },

    onDropdownSelect (selectedText) {
      this.isFocused = false

      // When the items are an Object, get the key associated to `selectedText``
      if (this.isKeyValue) {
        this.optionValue = Object.keys(this.items).find(item => {
          return this.items[item] === selectedText
        })
      } else {
        this.optionValue = selectedText
      }

      this.emitInput()
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
      this.$emit('input', this.optionValue)
    }
  }
}
</script>

<style scoped>
.InputLanguage__flag {
  width: 30px
}
</style>
