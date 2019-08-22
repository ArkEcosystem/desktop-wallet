import URIHandler from '@/services/uri-handler'

describe('URI Handler', () => {
  describe('legacy URI validation', () => {
    it('should validate minimal schema for addresses', () => {
      const uri = new URIHandler('ark:DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9', true)
      expect(uri.validateLegacy()).toBeTrue()
    })

    it('should invalidate minimal schema for addresses if not QR', () => {
      const uri = new URIHandler('ark:DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9', false)
      expect(uri.validateLegacy()).toBeTrue()
    })

    it('should validate custom network', () => {
      const uri = new URIHandler('ark:LNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9')
      expect(uri.validateLegacy()).toBeTrue()
    })

    it('should validate with params', () => {
      const uri = new URIHandler('ark:DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9?amount=1.2&')
      expect(uri.validateLegacy()).toBeTrue()
    })

    it('should invalidate wrong address', () => {
      const uri = new URIHandler('ark:x')
      expect(uri.validateLegacy()).toBeFalse()
    })

    it('should invalidate wrong protocol', () => {
      const uri = new URIHandler('mailto:DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9')
      expect(uri.validateLegacy()).toBeFalse()
    })
  })

  describe('AIP26 URI validation', () => {
    it('should validate minimal schemas', () => {
      let uri = new URIHandler('ark:transfer?recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=10')
      expect(uri.validate()).toBeTrue()
      uri = new URIHandler('ark:vote?delegate=genesis_10')
      expect(uri.validate()).toBeTrue()
      uri = new URIHandler('ark:register-delegate?delegate=mynewdelegate')
      expect(uri.validate()).toBeTrue()
      uri = new URIHandler('ark:sign-message?message=This%20is%20my%20message')
      expect(uri.validate()).toBeTrue()
    })
  })

  describe('legacy URI deserialization', () => {
    it('should contain keys for QR', () => {
      const schema = new URIHandler('ark:DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9', true).deserialize()
      expect(schema).toContainAllKeys(['type', 'address', 'amount', 'label', 'vendorField'])
    })

    it('should contain keys', () => {
      const schema = new URIHandler('ark:DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=12').deserialize()
      expect(schema).toContainAllKeys(['type', 'address', 'amount', 'label', 'vendorField'])
    })

    it('should fill params', () => {
      const schema = new URIHandler('ark:DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9?amount=1.2&label=Hello&vendorField=ARK').deserialize()
      expect(schema.type).toBe('legacy')
      expect(schema.address).toBe('DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9')
      expect(schema.amount).toBe('1.2')
      expect(schema.label).toBe('Hello')
      expect(schema.vendorField).toBe('ARK')
    })
  })

  describe('AIP26 URI deserialization', () => {
    it('should not deserialize when required parameters are missing', () => {
      let uri = new URIHandler('ark:transfer?recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9')
      expect(() => { uri.deserialize() }).toThrowError('amount')
      uri = new URIHandler('ark:transfer?amount=1.2')
      expect(() => { uri.deserialize() }).toThrowError('address')
      uri = new URIHandler('ark:vote')
      expect(() => { uri.deserialize() }).toThrowError('delegate')
      uri = new URIHandler('ark:register-delegate')
      expect(() => { uri.deserialize() }).toThrowError('username')
      uri = new URIHandler('ark:sign-message')
      expect(() => { uri.deserialize() }).toThrowError('message')
    })

    // TODO:
    // - correct schema deserialization
    // - invalid address (length != 34)
    // - too long smartbridge message
    // - limit sign-message message?
    // - non-existent delegate to vote for
    // - already existing delegate name
    // - too low fee (< 1e8)
    // - numeric values for string fields / strings for numeric fields
  })
})
