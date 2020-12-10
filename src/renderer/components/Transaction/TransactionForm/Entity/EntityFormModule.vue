<template>
  <ListDividedItem
    label=""
    class="EntityFormModule -mt-8"
    item-value-class="w-full mb-4"
  >
    <InputText
      v-model="$v.module.developedBy.$model"
      :is-invalid="$v.module.developedBy.$dirty && $v.module.developedBy.$invalid"
      :label="`${$t('ENTITY.DEVELOPED_BY')}`"
      name="module-developed-by"
    />

    <InputText
      v-model="$v.module.network.$model"
      :is-invalid="$v.module.network.$dirty && $v.module.network.$invalid"
      :label="`${$t('ENTITY.NETWORK')}`"
      name="module-network"
      class="mt-4"
    />

    <InputText
      v-model="$v.module.platform.$model"
      :is-invalid="$v.module.platform.$dirty && $v.module.platform.$invalid"
      :label="`${$t('ENTITY.PLATFORM')}`"
      name="module-platform"
      class="mt-4"
    />

    <InputText
      v-model="$v.module.requirements.$model"
      :is-invalid="$v.module.requirements.$dirty && $v.module.requirements.$invalid"
      :label="`${$t('ENTITY.REQUIREMENTS')}`"
      name="module-requirements"
      class="mt-4"
    />

    <InputText
      v-model="$v.module.releaseDate.$model"
      type="date"
      :is-dirty="true"
      :is-invalid="$v.module.releaseDate.$dirty && $v.module.releaseDate.$invalid"
      :label="`${$t('ENTITY.RELEASE_DATE')}`"
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
import { required } from 'vuelidate/lib/validators'
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
    module: {
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
    module: {
      deep: true,
      handler (value) {
        const { requirements, ...data } = value
        this.$emit('change', {
          ...data,
          requirements: [requirements]
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

      this.module = data
    }
  },

  validations: {
    module: {
      developedBy: {
        required
      },
      network: {
        required
      },
      releaseDate: {
        required
      },
      platform: {
        required
      },
      requirements: {
        required
      }
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
