<template>
  <!-- NOTE: `is-dirty` is set to true, so the label is positioned like any other input -->
  <InputField
    :label="label"
    :helper-text="helperText"
    :is-disabled="isDisabled"
    :is-dirty="true"
    class="InputSwitch"
  >
    <div
      slot-scope="{ inputClass }"
      class="w-full pt-4 pin-l transition text-theme-page-text h-10 flex flex-row justify-flex-start"
    >
      <div class="mr-3 mt-1 text-lg">{{ text }}</div>
      <ButtonSwitch
        :background-color="backgroundColor"
        :is-active="isActive"
        :is-disabled="isDisabled"
        @change="emitChange"
      />
    </div>
  </InputField>
</template>

<script>
import InputField from '@/components/InputField'
import { ButtonSwitch } from '@/components/Button'

export default {
  name: 'InputSwitch',

  components: {
    InputField,
    ButtonSwitch
  },

  model: {
    prop: 'isActive',
    event: 'change'
  },

  props: {
    backgroundColor: {
      type: String,
      required: false,
      default: null
    },
    helperText: {
      type: String,
      required: false,
      default: null
    },
    isActive: {
      type: Boolean,
      required: false,
      default: false
    },
    isDisabled: {
      type: Boolean,
      required: false,
      default: false
    },
    label: {
      type: String,
      required: false,
      default: null
    },
    text: {
      type: String,
      required: false,
      default: null
    }
  },

  methods: {
    emitChange (isActive) {
      this.$emit('change', isActive)
    }
  }
}
</script>
