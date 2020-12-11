<template>
  <ListDividedItem
    label=""
    class="EntityFormModule -mt-8"
    item-value-class="w-full mb-4"
  >
    <InputText
      v-model="$v.form.developedBy.$model"
      :is-invalid="$v.form.developedBy.$dirty && $v.form.developedBy.$invalid"
      :label="`${$t('ENTITY.DEVELOPED_BY')} (${$t('COMMON.OPTIONAL')})`"
      name="module-developed-by"
    />

    <InputText
      v-model="$v.form.network.$model"
      :is-invalid="$v.form.network.$dirty && $v.form.network.$invalid"
      :label="`${$t('ENTITY.NETWORK')} (${$t('COMMON.OPTIONAL')})`"
      name="module-network"
      class="mt-4"
    />

    <InputText
      v-model="$v.form.platform.$model"
      :is-invalid="$v.form.platform.$dirty && $v.form.platform.$invalid"
      :label="`${$t('ENTITY.PLATFORM')} (${$t('COMMON.OPTIONAL')})`"
      name="module-platform"
      class="mt-4"
    />

    <InputText
      v-model="$v.form.requirements.$model"
      :is-invalid="$v.form.requirements.$dirty && $v.form.requirements.$invalid"
      :label="`${$t('ENTITY.REQUIREMENTS')} (${$t('COMMON.OPTIONAL')})`"
      name="module-requirements"
      class="mt-4"
    />

    <InputText
      v-model="$v.form.releaseDate.$model"
      type="date"
      :is-dirty="true"
      :is-invalid="$v.form.releaseDate.$dirty && $v.form.releaseDate.$invalid"
      :label="`${$t('ENTITY.RELEASE_DATE')} (${$t('COMMON.OPTIONAL')})`"
      name="module-release-date"
      class="EntityFormProduct__date mt-4"
    >
      <template #right>
        <button
          class="absolute pin-r px-2 py-1 cursor-pointer pointer-events-none"
        >
          <SvgIcon
            name="calendar"
            view-box="0 0 18 18"
          />
        </button>
      </template>
    </InputText>
  </ListDividedItem>
</template>

<script>
import { InputText } from '@/components/Input'
import { ListDividedItem } from '@/components/ListDivided'
import SvgIcon from '@/components/SvgIcon'
import { get, cloneDeep } from '@arkecosystem/utils'

export default {
  components: {
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
    form: {
      developedBy: undefined,
      network: undefined,
      platform: undefined,
      releaseDate: undefined,
      requirements: undefined
    }
  }),

  computed: {
    isInvalid () {
      return this.$v.$invalid
    }
  },

  watch: {
    form: {
      deep: true,
      handler (value) {
        const { requirements, ...data } = value
        this.$emit('change', {
          ...data,
          requirements: requirements ? [requirements] : undefined
        })
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
    const value = get(this.ipfsContent, 'module')
    if (value) {
      const { requirements, ...data } = cloneDeep(value)

      if (Array.isArray(requirements)) {
        data.requirements = requirements[0]
      }

      for (const key of Object.keys(this.form)) {
        if (key in data) {
          this.$set(this.form, key, data[key])
        }
      }
    }
  },

  validations: {
    form: {
      developedBy: {},
      network: {},
      releaseDate: {},
      platform: {},
      requirements: {}
    }
  }
}
</script>

<style lang="postcss" scoped>
.EntityFormModule__date input::-webkit-calendar-picker-indicator {
  right: 0px;
  position: absolute;
  width: 18px;
  height: 25px;
  opacity: 0;
}
.EntityFormModule__date input::-webkit-inner-spin-button {
  margin-right:2.25rem;
}
.EntityFormModule__date input::-webkit-clear-button {
  margin-right:.5rem;
 }
</style>
