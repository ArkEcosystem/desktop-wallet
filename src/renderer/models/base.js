import { transform } from 'lodash'
import { validate as jsonValidate } from 'jsonschema'
import { isNil } from '@/utils'

export default class BaseModel {
  constructor (schema) {
    this.schema = schema
  }

  deserialize (input) {
    if (typeof input !== 'object') {
      throw new Error(`Invalid model input type: \`${input}\``)
    }

    const model = {}

    const properties = this.formatProperties(input)
    Object.defineProperties(model, properties)

    this.validate(model)
    return model
  }

  formatProperties (input) {
    return transform(this.schema.properties, (result, item, key) => {
      let value

      if (item.format && typeof item.format === 'function') {
        value = item.format(input)
      } else if (input[key] !== undefined) {
        value = input[key]
      }

      if (isNil(value) && item.default) {
        value = item.default
      }

      result[key] = {
        enumerable: true,
        writable: true,
        value
      }
    }, {})
  }

  validate (input) {
    const validation = jsonValidate(input, this.schema)

    if (!validation.valid) {
      const errors = validation.errors.map(error => error.stack).join(', ')
      throw new Error(`JSON: ${JSON.stringify(this.schema, null, 2)} Cannot be instantiated due to errors: ${errors}
        input: ${JSON.stringify(input)}
      `)
    }
  }
}
