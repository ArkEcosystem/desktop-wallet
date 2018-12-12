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
      :class="isReverse ? 'flex-row-reverse -mr-3' : 'flex-row -ml-3'"
      class="w-full pt-4 pin-l transition text-theme-page-text h-10 flex items-center justify-flex-start"
    >
      <slot>
        <div
          :class="isLarge ? 'text-lg' : 'text-base'"
          class="mx-3 mt-1"
        >
          {{ text }}
        </div>
      </slot>
      <ButtonSwitch
        :background-color="backgroundColor"
        :is-active="isActive"
        :is-disabled="isDisabled"
        class="flex-none"
        @change="emitChange"
      />
    </div>
  </InputField>
</template>

<script>
import InputField from './InputField'
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
    },
    isLarge: {
      type: Boolean,
      required: false,
      default: true
    },
    isReverse: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  methods: {
    emitChange (isActive) {
      this.$emit('change', isActive)
    }
  }
}
</script>
