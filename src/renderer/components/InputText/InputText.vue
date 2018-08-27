<template>
  <InputField
    :label="label"
    :helper-text="helperText"
    :is-dirty="isDirty"
    :is-disabled="isDisabled"
    :is-invalid="isInvalid"
    :is-focused="isFocused"
    class="InputText"
  >
    <input
      ref="input"
      slot-scope="{ inputClass }"
      :class="inputClass"
      :name="name"
      :disabled="isDisabled"
      :type="type"
      :value="value"
      v-model="model"
      class="InputText__input"
      @focus="onFocus"
      @blur="onBlur"
    >
  </InputField>
</template>

<script>
import InputField from '@/components/InputField'

export default {
  name: 'InputText',

  components: {
    InputField
  },

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    label: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: false,
      default: 'text'
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
    inputValue: vm.value,
    isFocused: false
  }),

  computed: {
    model: {
      get () {
        return this.inputValue
      },
      set (value) {
        this.inputValue = value
        this.$emit('input', value)
      }
    },
    isDirty () {
      return !!this.inputValue
    }
  },

  watch: {
    value (val) {
      this.inputValue = val
    }
  },

  methods: {
    onFocus () {
      this.isFocused = true
    },

    onBlur () {
      this.isFocused = false
    },

    focus () {
      this.$refs.input.focus()
    },

    blur () {
      this.$refs.input.blur()
    },

    emitInput (e) {
      this.$emit('input', e.target.value)
    }
  }
}
</script>

<style lang="postcss" scoped>
.InputText__input::placeholder {
  @apply .text-transparent
}
</style>
