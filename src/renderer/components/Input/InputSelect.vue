<template>
  <MenuDropdown
    :items="options"
    :is-disabled="isDisabled"
    :value="optionText"
    class="InputSelect"
    @select="onDropdownSelect"
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
      :is-invalid="isInvalid"
    >
      <MenuDropdownHandler
        slot-scope="{ inputClass }"
        :value="scopeHandler.value"
        :placeholder="label"
        :class="inputClass"
        class="InputSelect__input"
        @click="onHandlerClick"
      />
    </InputField>
  </MenuDropdown>
</template>

<script>
import InputField from './InputField'
import { MenuDropdown, MenuDropdownHandler } from '@/components/Menu'

export default {
  name: 'InputSelect',

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
    items: {
      type: [Array, Object],
      required: true,
      default: () => []
    },
    label: {
      type: String,
      required: true
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
    isInvalid: {
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

  data () {
    return {
      isFocused: false,
      optionValue: this.value
    }
  },

  computed: {
    // When the text of the option is empty the label/placeholder is shown instead by the MenuHandler
    inputLabel () {
      return this.optionText ? this.label : ''
    },

    isDirty () {
      return !!this.optionValue
    },

    // The `items` are an Object or an Array
    isKeyValue () {
      return !Array.isArray(this.items)
    },

    // These are the options that are visible on the dropdown
    options () {
      return this.isKeyValue ? Object.values(this.items) : this.items
    },

    // This is the text that is visible on the InputField
    optionText () {
      if (this.isKeyValue) {
        return this.items[this.optionValue]
      }

      // Ensure that the value could be valid
      if (this.items.indexOf(this.optionValue) !== -1) {
        return this.optionValue
      }

      return ''
    }
  },

  methods: {
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

    emitInput () {
      this.$emit('input', this.optionValue)
    }
  }
}
</script>
