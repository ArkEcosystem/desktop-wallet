import InputGrid from '@/components/Input/InputGrid'

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
