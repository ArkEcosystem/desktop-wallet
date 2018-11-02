import URIHandler from '@/services/uri-handler'

describe('URI Handler', () => {
  describe('validation', () => {
    it('should validate minimal schema', () => {
      const uri = new URIHandler('ark:DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9')
      expect(uri.validate()).toBeTrue()
    })

    it('should validate with params', () => {
      const uri = new URIHandler('ark:DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9?amount=1.2&')
      expect(uri.validate()).toBeTrue()
    })

    it('should invalidate wrong address', () => {
      const uri = new URIHandler('ark:x')
      expect(uri.validate()).toBeFalse()
    })

    it('should invalidate wrong protocol', () => {
      const uri = new URIHandler('mailto:DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9')
      expect(uri.validate()).toBeFalse()
    })
  })

  describe('deserialize', () => {
    it('should contain keys', () => {
      const schema = new URIHandler('ark:DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9').deserialize()
      expect(schema).toContainAllKeys(['address', 'amount', 'label', 'vendorField'])
    })

    it('should fill params', () => {
      const schema = new URIHandler('ark:DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9?amount=1.2&label=Hello&vendorField=ARK').deserialize()
      expect(schema.address).toBe('DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9')
      expect(schema.amount).toBe(1.2)
      expect(schema.label).toBe('Hello')
      expect(schema.vendorField).toBe('ARK')
    })
  })
})
