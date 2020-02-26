<template>
  <MenuDropdown
    ref="dropdown"
    :items="items"
    :is-disabled="isDisabled"
    :value="optionValue"
    class="InputSelect"
    @select="onDropdownSelect"
  >
    <template
      v-if="hasItemSlot"
      v-slot:item="itemScope"
    >
      <slot
        name="input-item"
        v-bind="itemScope"
      />
    </template>

    <template v-slot:handler="handlerScope">
      <InputField
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
          :value="handlerScope.value"
          :item="handlerScope.item"
          :class="inputClass"
          :placeholder="label"
          class="InputSelect__input"
          @blur="onBlur"
          @click="onHandlerClick"
        >
          <slot
            v-if="hasHandlerSlot"
            name="input-handler"
            v-bind="handlerScope"
          />
        </MenuDropdownHandler>
      </InputField>
    </template>
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
    isFocused: false,
    optionValue: vm.value
  }),

  computed: {
    // When the text of the option is empty the label/placeholder is shown instead by the MenuHandler
    inputLabel () {
      return this.optionText ? this.label : ''
    },

    hasHandlerSlot () {
      return !!this.$scopedSlots['input-handler']
    },

    hasItemSlot () {
      return !!this.$scopedSlots['input-item']
    },

    isDirty () {
      return !!this.optionValue
    },

    /**
     * This is the text that is visible on the InputField
     */
    optionText () {
      if (!Array.isArray(this.items)) {
        return this.items[this.optionValue]
      }

      // Ensure that the value could be valid
      if (this.items.indexOf(this.optionValue) !== -1) {
        return this.optionValue
      }

      return ''
    }
  },

  watch: {
    value (value) {
      this.optionValue = value
    }
  },

  methods: {
    emitInput () {
      this.$emit('input', this.optionValue)
    },

    onBlur (event) {
      // To ensure that the code is evaluated after other tasks
      setTimeout(() => {
        const classList = document.activeElement.classList

        const isDropdownItem = classList && typeof classList.contains === 'function'
          ? classList.contains('MenuDropdownItem__button')
          : false

        if (isDropdownItem) {
          event.preventDefault()
        } else {
          this.$refs.dropdown.close()
        }
      }, 0)
    },

    onHandlerClick () {
      this.isFocused = true
    },

    onDropdownSelect (selectedValue) {
      this.isFocused = false
      this.optionValue = selectedValue

      this.emitInput()
    }
  }
}
</script>
