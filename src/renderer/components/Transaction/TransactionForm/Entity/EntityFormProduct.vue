<template>
  <ListDividedItem
    label=""
    class="EntityFormProduct -mt-8"
    item-value-class="w-full mb-4"
  >
    <InputText
      v-model="$v.product.developedBy.$model"
      :is-invalid="$v.product.developedBy.$dirty && $v.product.developedBy.$invalid"
      :label="`${$t('ENTITY.DEVELOPED_BY')} (${$t('COMMON.OPTIONAL')})`"
      name="product-developed-by"
    />

    <InputText
      v-model="$v.product.network.$model"
      :is-invalid="$v.product.network.$dirty && $v.product.network.$invalid"
      :label="`${$t('ENTITY.NETWORK')} (${$t('COMMON.OPTIONAL')})`"
      name="product-network"
      class="mt-4"
    />

    <InputText
      v-model="$v.product.platform.$model"
      :is-invalid="$v.product.platform.$dirty && $v.product.platform.$invalid"
      :label="`${$t('ENTITY.PLATFORM')} (${$t('COMMON.OPTIONAL')})`"
      name="product-platform"
      class="mt-4"
    />

    <InputText
      v-model="$v.product.releaseDate.$model"
      type="date"
      :is-dirty="true"
      :is-invalid="$v.product.releaseDate.$dirty && $v.product.releaseDate.$invalid"
      :label="`${$t('ENTITY.RELEASE_DATE')} (${$t('COMMON.OPTIONAL')})`"
      name="product-release-date"
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
    product: {
      developedBy: undefined,
      network: undefined,
      platform: undefined,
      releaseDate: undefined
    }
  }),

  computed: {
    isInvalid () {
      return this.$v.$invalid
    }
  },

  watch: {
    product: {
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
    const value = get(this.ipfsContent, 'product')
    if (value) {
      const data = cloneDeep(value)
      for (const key of Object.keys(this.product)) {
        if (key in data) {
          this.$set(this.product, key, data[key])
        }
      }
    }
  },

  validations: {
    product: {
      developedBy: {},
      network: {},
      releaseDate: {},
      platform: {}
    }
  }
}
</script>

<style lang="postcss" scoped>
.EntityFormProduct__date input::-webkit-calendar-picker-indicator {
  right: 0px;
  position: absolute;
  width: 18px;
  height: 25px;
  opacity: 0;
}
.EntityFormProduct__date input::-webkit-inner-spin-button {
  margin-right:2.25rem;
}
.EntityFormProduct__date input::-webkit-clear-button {
  margin-right:.5rem;
}
</style>
