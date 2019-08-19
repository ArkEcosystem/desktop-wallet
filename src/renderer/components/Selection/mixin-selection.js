import { InputGrid } from '@/components/Input'

export default {
  components: {
    InputGrid
  },

  props: {
    selected: {
      type: [String, Object],
      required: false,
      default: null
    }
  }
}
