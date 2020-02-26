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

<script lang="ts">
import { Vue, Component, Prop, Model } from 'vue-property-decorator'
import { InputField } from '@/components/Input'
import { ButtonSwitch } from '@/components/Button'

@Component({
  name: 'InputSwitch',

  components: {
    InputField,
    ButtonSwitch
  }
})
export default class InputSwitch extends Vue {
  @Model('change', { default: false })
  readonly isActive!: boolean;

  @Prop({ type: String })
  readonly backgroundColor: string | undefined;

  @Prop({ type: String })
  readonly helperText: string | undefined;

  @Prop({ type: String })
  readonly label: string | undefined;

  @Prop({ type: String })
  readonly text: string | undefined;

  @Prop({ default: false })
  readonly isDisabled!: boolean;

  @Prop({ default: true })
  readonly isLarge!: boolean;

  @Prop({ default: false })
  readonly isReverse!: boolean;

  get model () {
    return this.isActive
  }

  set model (value) {
    this.$emit('change', value)
  }
}
</script>
