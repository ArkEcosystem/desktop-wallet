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
        <span class="ml-5">
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
      return this.items.map(item => {
        const provider = entityProvider.findByDomain(item.value)
        if (provider) {
          return { label: provider.displayName, ...item }
        }
      })
    }
  }
}
</script>
