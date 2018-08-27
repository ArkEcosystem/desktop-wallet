<template>
  <SelectMenu
    :items="items"
    :is-disabled="isDisabled"
    :value="inputValue"
    class="InputSelect"
    @select="onDropdownSelect"
  >
    <InputField
      slot="handler"
      slot-scope="scopeHandler"
      :name="name"
      :label="inputLabel"
      :value="inputValue"
      :is-dirty="isDirty"
      :is-disabled="isDisabled"
      :is-focused="isFocused"
      :is-invalid="isInvalid"
    >
      <SelectMenuHandler
        slot-scope="{ inputClass }"
        :value="scopeHandler.value"
        :placeholder="label"
        :class="inputClass"
        class="InputSelect__input"
        @click="onHandlerClick"
      />
    </InputField>
  </SelectMenu>
</template>

<script>
import InputField from '@/components/InputField'
import { SelectMenu, SelectMenuHandler } from '@/components/SelectMenu'

export default {
  name: 'InputSelect',

  components: {
    InputField,
    SelectMenu,
    SelectMenuHandler
  },

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    items: {
      type: Array,
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

  data: vm => ({
    // When value is empty the label/placeholder is shown by the MenuHandler
    inputLabel: vm.value ? vm.label : '',
    inputValue: vm.value,
    isFocused: false
  }),

  computed: {
    isDirty () {
      return !!this.inputValue
    }
  },

  watch: {
    value (val) {
      this.inputLabel = val ? this.label : ''
      this.inputValue = val
    }
  },

  methods: {
    onHandlerClick () {
      this.isFocused = true
    },

    onDropdownSelect (item) {
      this.isFocused = false
      this.inputValue = item
      this.emitInput()
    },

    emitInput () {
      this.$emit('input', this.inputValue)
    }
  }
}
</script>
