import { InputGrid } from '@/components/Input'

export default {
  components: {
    InputGrid
  },

  props: {
    selected: {
      type: String,
      required: false,
      default: null
    },
    maxVisibleItems: {
      type: Number,
      required: false,
      default: 10
    }
  }
}
