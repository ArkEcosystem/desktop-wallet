<template>
  <div class="EntityFormDelegate">
    <InputSelect
      v-model="$v.delegate.type.$model"
      :items="delegateTypes"
      :label="$t('ENTITY.DELEGATE_TYPE')"
      name="delegate-type"
      class="mb-4"
    />

    <ListDividedItem
      label=""
      item-value-class="w-full"
    >
      <div class="flex">
        <h3 class="flex-1">
          {{ $t('ENTITY.PAYOUT_COMISSION') }}
        </h3>
        <button
          class="blue-button rounded-full w-5 h-5 m-0 p-0 flex items-center justify-center"
          :class="{
            'bg-blue text-white': isComissionOpen
          }"
          @click="isComissionOpen = !isComissionOpen"
        >
          <SvgIcon
            name="chevron-down"
            view-box="0 0 8 8"
            :class="{
              'rotate-180': isComissionOpen
            }"
          />
        </button>
      </div>

      <Collapse :is-open="isComissionOpen">
        <div class="inline-flex items-center mb-3">
          <span
            class="font-semibold"
            :class="{ 'text-theme-page-text-light': isComissionVariable }"
          >
            {{ $t('ENTITY.STATIC') }}
          </span>
          <ButtonSwitch
            v-model="isComissionVariable"
            class="mx-2"
          />
          <span
            class="font-semibold"
            :class="{ 'text-theme-page-text-light': !isComissionVariable }"
          >
            {{ $t('ENTITY.VARIABLE') }}
          </span>
        </div>
        <div
          v-if="isComissionVariable"
          class="flex mb-2"
        >
          <InputText
            v-model="$v.delegate.payout.percentage.min.$model"
            :is-invalid="$v.delegate.payout.percentage.min.$dirty && $v.delegate.payout.percentage.min.$invalid"
            :label="$t('COMMON.FROM')"
            type="number"
            name="percentage-min"
            class="flex-1 mr-5"
          />
          <InputText
            v-model="$v.delegate.payout.percentage.max.$model"
            :is-invalid="$v.delegate.payout.percentage.max.$dirty && $v.delegate.payout.percentage.max.$invalid"
            :label="$t('COMMON.TO')"
            type="number"
            name="percentage-max"
            class="flex-1"
          />
        </div>
        <div
          v-else
          class="mb-2"
        >
          <InputText
            v-model="$v.delegate.payout.percentage.min.$model"
            :is-invalid="$v.delegate.payout.percentage.min.$dirty && $v.delegate.payout.percentage.min.$invalid"
            :label="$t('ENTITY.PERCENTAGE')"
            type="number"
            name="percentage-static"
            class="flex-1"
            @input="onComissionStaticInput"
          />
        </div>
      </Collapse>
    </ListDividedItem>

    <ListDividedItem
      label=""
      item-value-class="w-full"
    >
      <div class="flex">
        <h3 class="flex-1">
          {{ $t('ENTITY.PAYOUT_FREQUENCY') }}
        </h3>
        <button
          class="blue-button rounded-full w-5 h-5 m-0 p-0 flex items-center justify-center"
          :class="{
            'bg-blue text-white': isFrequencyOpen
          }"
          @click="isFrequencyOpen = !isFrequencyOpen"
        >
          <SvgIcon
            name="chevron-down"
            view-box="0 0 8 8"
            :class="{
              'rotate-180': isFrequencyOpen
            }"
          />
        </button>
      </div>

      <Collapse :is-open="isFrequencyOpen">
        <div class="flex mb-2">
          <InputText
            v-model="$v.delegate.payout.frequency.value.$model"
            :is-invalid="$v.delegate.payout.frequency.value.$dirty && $v.delegate.payout.frequency.value.$invalid"
            :label="$t('ENTITY.EVERY')"
            type="number"
            name="frequency-value"
            class="flex-1 mr-5"
          />

          <InputSelect
            v-model="$v.delegate.payout.frequency.type.$model"
            :items="frequencyTypes"
            :label="$t('ENTITY.TYPE')"
            name="frequency-type"
            class="w-1/3"
          />
        </div>
      </Collapse>
    </ListDividedItem>
  </div>
</template>

<script>
import { ButtonSwitch } from '@/components/Button'
import { InputText, InputSelect } from '@/components/Input'
import { ListDividedItem } from '@/components/ListDivided'
import { Collapse } from '@/components/Collapse'
import SvgIcon from '@/components/SvgIcon'
import { between, required } from 'vuelidate/lib/validators'
import { get, cloneDeep } from '@arkecosystem/utils'

export default {
  components: {
    Collapse,
    ButtonSwitch,
    InputSelect,
    InputText,
    ListDividedItem,
    SvgIcon
  },

  props: {
    ipfsContent: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },

  data: () => ({
    isComissionOpen: true,
    isFrequencyOpen: true,
    isComissionVariable: false,

    delegate: {
      type: 'public',
      payout: {
        frequency: {
          type: undefined,
          value: undefined
        },
        percentage: {
          min: undefined,
          max: undefined
        }
      }
    }
  }),

  computed: {
    delegateTypes () {
      return {
        public: this.$t('COMMON.PUBLIC'),
        private: this.$t('COMMON.PRIVATE')
      }
    },

    frequencyTypes () {
      return {
        day: this.$tc('MARKET.DAY', 1),
        week: this.$tc('MARKET.WEEK', 1),
        month: this.$tc('MARKET.MONTH', 1),
        quarter: this.$tc('MARKET.QUARTER', 1),
        year: this.$tc('MARKET.YEAR', 1)
      }
    },

    isInvalid () {
      return this.$v.$invalid
    }
  },

  watch: {
    delegate: {
      deep: true,
      handler (value) {
        this.$emit('change', value)
      }
    },
    isInvalid: {
      immediate: true,
      handler (value) {
        this.$emit('invalid', value)
      }
    },
    isComissionVariable () {
      this.onComissionStaticInput()
    }
  },

  mounted () {
    const delegate = get(this.ipfsContent, 'delegate')

    if (delegate) {
      const data = cloneDeep(delegate)

      for (const key of Object.keys(this.form)) {
        if (key in data) {
          this.$set(this.delegate, key, data[key])
        }
      }

      if (delegate.payout) {
        this.isComissionVariable = delegate.payout.min !== delegate.payout.max
      }
    }
  },

  methods: {
    onTypeChange (value) {
      this.delegate.type = value ? 'private' : 'public'
    },

    onComissionStaticInput () {
      this.delegate.payout.percentage.max = this.delegate.payout.percentage.min
    }
  },

  validations: {
    delegate: {
      type: {
        required
      },
      payout: {
        frequency: {
          type: {
            required
          },
          value: {
            required,
            between: between(1, 365)
          }
        },
        percentage: {
          min: {
            required,
            range: (value, ctx) => between(1, ctx.max || 100)(value)
          },
          max: {
            required,
            range: (value, ctx) => between(ctx.min || 1, 100)(value)
          }
        }
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.EntityFormDelegate__fieldset {
  display: grid;
  column-gap: 0.75rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  align-items: baseline;
}
.EntityFormDelegate__delegate-type {
  grid-column: span 2 / span 2;
}
</style>
