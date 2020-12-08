<template>
  <div>
    <div class="EntityFormDelegate__fieldset">
      <span class="font-semibold mr-4">{{ $t('ENTITY.DELEGATE_TYPE') }}</span>
      <InputSelect
        v-model="$v.delegate.type.$model"
        :items="delegateTypes"
        label=""
        name="delegate-type"
        class="EntityFormDelegate__delegate-type"
      />
    </div>

    <div class="EntityFormDelegate__fieldset mt-4">
      <span class="font-semibold mr-4">{{ $t('ENTITY.PAYOUT_COMISSION') }}</span>
      <InputText
        v-model="$v.delegate.payout.percentage.min.$model"
        :is-invalid="$v.delegate.payout.percentage.min.$dirty && $v.delegate.payout.percentage.min.$invalid"
        :label="$t('COMMON.FROM')"
        type="number"
        name="percentage-min"
        class="flex-1"
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

    <div class="EntityFormDelegate__fieldset mt-4">
      <span class="font-semibold mr-4 break-words">{{ $t('ENTITY.PAYOUT_FREQUENCY') }}</span>
      <InputSelect
        v-model="$v.delegate.payout.frequency.type.$model"
        :items="frequencyTypes"
        :label="$t('ENTITY.TYPE')"
        name="frequency-type"
        class="flex-1"
      />
      <InputText
        v-model="$v.delegate.payout.frequency.value.$model"
        :is-invalid="$v.delegate.payout.frequency.value.$dirty && $v.delegate.payout.frequency.value.$invalid"
        :label="$t('COMMON.VALUE')"
        type="number"
        name="frequency-value"
        class="flex-1"
      />
    </div>
  </div>
</template>

<script>
import { InputText, InputSelect } from '@/components/Input'
import { between, required } from 'vuelidate/lib/validators'
import { get } from '@arkecosystem/utils'

export default {
  components: {
    InputText,
    InputSelect
  },

  props: {
    ipfsContent: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },

  data: () => ({
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
        day: this.$t('MARKET.DAY'),
        week: this.$t('MARKET.WEEK'),
        month: this.$t('MARKET.MONTH'),
        quarter: this.$t('MARKET.QUARTER'),
        year: this.$t('MARKET.YEAR')
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
    }
  },

  mounted () {
    const delegate = get(this.ipfsContent, 'delegate')
    if (delegate) {
      this.delegate = delegate
    }
  },

  methods: {
    onTypeChange (value) {
      this.delegate.type = value ? 'private' : 'public'
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
