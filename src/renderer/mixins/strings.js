import { snakeCase } from 'lodash'

export default {
  methods: {
    strings_snakeCase (value) {
      return snakeCase(value)
    }
  }
}
