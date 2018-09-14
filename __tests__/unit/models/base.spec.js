import BaseModel from '@/models/base'
import emptySchema from '@tests/unit/__fixtures__/models/empty'
import rigidSchema from '@tests/unit/__fixtures__/models/rigid'

describe('BaseModel', () => {
  it('should create a model', () => {
    const model = new BaseModel(emptySchema)
    expect(model).toBeInstanceOf(BaseModel)
  })

  describe('Validation', () => {
    let rigidModel
    let item

    beforeEach(() => {
      rigidModel = new BaseModel(rigidSchema)
      item = { integer: 1, timestamp: new Date().getTime() }
    })

    it('should be instatiated', () => {
      expect(rigidModel).toBeInstanceOf(BaseModel)
    })

    it('should format properties', () => {
      const properties = rigidModel.formatProperties(item)
      expect(properties).toBeObject()
      expect(properties.integer.value).toBeNumber()
      expect(properties.date.value).toBeDate()
    })

    it('should deserialize', () => {
      const doc = rigidModel.deserialize(item)
      expect(doc).toContainAllKeys(['date', 'integer', 'timestamp'])
    })
  })
})
