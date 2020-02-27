import { snakeCase } from 'lodash'

export default {
  methods: {
    strings_snakeCase (value) {
      return snakeCase(value)
    },

    strings_capitalizeFirst (value) {
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  }
}
