<template>
  <ListDivided :is-floating-label="true">
    <ListDividedItem
      v-for="item of options"
      :key="item.value"
      :label="item.label"
      item-value-class="w-full"
    >
      <div class="flex items-center justify-between w-full">
        <a
          href="#"
          class="flex-1 font-semibold truncate"
          @click.stop="electron_openExternal(item.value)"
        >
          {{ item.value }}
        </a>

        <span
          v-if="item.type === 'logo'"
          v-tooltip="{
            content: $t('ENTITY.AVATAR'),
            placement: 'top'
          }"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            class="ml-5 w-5 h-5"
          >
            <circle
              cx="10"
              cy="10"
              r="10"
              fill="#41b263"
            />
            <path
              fill="#fff"
              d="M13.442 6.798l-4.171 4.153-1.947-1.939-1.39 1.386 3.337 3.323 5.562-5.536z"
            />
          </svg>
        </span>
        <span
          v-else
          class="ml-5"
        >
          <SvgIcon
            :name="item.type"
            view-box="0 0 25 25"
          />
        </span>
      </div>
    </ListDividedItem>
  </ListDivided>
</template>

<script>
import { ListDivided, ListDividedItem } from '@/components/ListDivided'
import { EntityProvider } from '@/services/entity-provider'
import SvgIcon from '@/components/SvgIcon'

const entityProvider = new EntityProvider()

export default {
  components: {
    ListDivided,
    ListDividedItem,
    SvgIcon
  },

  props: {
    items: {
      type: Array,
      required: true
    }
  },

  computed: {
    options () {
      const videos = this.items.filter(item => item.type === 'video')
      const images = this.items.filter(item => item.type === 'image')

      return this.items.map((item) => {
        const provider = entityProvider.findByDomain(item.value)
        let label = item.type

        if (provider) {
          label = provider.displayName
        }

        if (item.type === 'logo') {
          label = this.$t('ENTITY.AVATAR')
        } else if (item.type === 'image') {
          label = `${this.$t('ENTITY.IMAGE')} #${images.findIndex(({ value }) => value === item.value) + 1}`
        } else if (item.type === 'video') {
          label = `${this.$t('ENTITY.VIDEO')} #${videos.findIndex(({ value }) => value === item.value) + 1}`
        }

        return { label, ...item }
      })
    }
  }
}
</script>
