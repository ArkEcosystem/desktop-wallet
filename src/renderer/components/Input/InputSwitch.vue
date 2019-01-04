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
      :class="isReverse ? 'flex-row-reverse' : 'flex-row'"
      class="w-full pt-4 pin-l transition text-theme-page-text h-10 flex items-center justify-flex-start"
    >
      <slot>
        <div
          :class="[
            isLarge ? 'text-lg' : 'text-base',
            isReverse ? 'ml-3' : 'mr-3'
          ]"
          class="mt-1"
        >
          {{ text }}
        </div>
      </slot>
      <ButtonSwitch
        v-model="model"
        :background-color="backgroundColor"
        :is-disabled="isDisabled"
        class="flex-none"
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

  data: vm => ({
    inputIsActive: vm.isActive
  }),

  computed: {
    model: {
      get () {
        return this.inputIsActive
      },
      set (value) {
        this.inputIsActive = value
        this.$emit('change', value)
      }
    }
  },

  watch: {
    isActive (isActive) {
      this.inputIsActive = isActive
    }
  }
}
</script>
