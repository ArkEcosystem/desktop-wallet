<template>
  <Identicon
    :value="value"
    :size="size"
    :shape="shape"
    :shape-count="shapeCount"
    :is-dark="isDark"
    :show-network-symbol="showNetworkSymbol"
  />
</template>

<script>
import Identicon from '@/components/utils/Identicon'

export default {
  name: 'WalletIdenticon',

  components: {
    Identicon
  },

  props: {
    value: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    },
    shape: {
      type: String,
      required: false,
      default: () => 'circle'
    },
    shapeCount: {
      type: Number,
      required: false,
      default: 3
    },
    isDark: {
      type: Boolean,
      required: false,
      default: false
    },
    showNetworkSymbol: {
      type: Boolean,
      required: false,
      default: true
    }
  }
}
</script>
