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

    it('should deserialize when required parameters are given', () => {
      let schema = new URIHandler('ark:transfer?recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=100').deserialize()
      expect(schema.recipient).toBe('DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9')
      expect(schema.amount).toBe('100')
      schema = new URIHandler('ark:transfer?recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=100&fee=0.1&vendorField=This%20is%20my%20vendorfield%20message').deserialize()
      expect(schema.recipient).toBe('DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9')
      expect(schema.amount).toBe('100')
      expect(schema.fee).toBe('0.1')
      expect(schema.vendorField).toBe('This is my vendorfield message')
      schema = new URIHandler('ark:vote?delegate=genesis_10').deserialize()
      expect(schema.delegate).toBe('genesis_10')
      schema = new URIHandler('ark:register-delegate?delegate=mynewdelegate').deserialize()
      expect(schema.delegate).toBe('mynewdelegate')
      schema = new URIHandler('ark:sign-message?message=This%20is%20my%20message').deserialize()
      expect(schema.message).toBe('This is my message')
    })

    it('should not allow fees below 1e8, being 0 or negative', () => {
      let uri = new URIHandler('ark:transfer?recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=10&fee=0')
      expect(() => { uri.deserialize() }).toThrowError('zero')
      uri = new URIHandler('ark:transfer?recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=10&fee=-123')
      expect(() => { uri.deserialize() }).toThrowError('negative')
      uri = new URIHandler('ark:transfer?recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=10&fee=0.00000000001')
      expect(() => { uri.deserialize() }).toThrowError('below')
    })

    it('should not allow vendor field messages over 255', () => {
      const uri = new URIHandler('ark:transfer?recipient=DNjuJEDQkhrJ7cA9FZ2iVXt5anYiM8Jtc9&amount=1&vendorField=Message%20for%20Arkbutverylonganditgoesonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandonandon')
      expect(() => { uri.deserialize() }).toThrowError('smartbridge')
    })

    // TODO:
    // - invalid address (length != 34)
    // - limit sign-message message?
    // - non-existent delegate to vote for
    // - already existing delegate name
    // - numeric values for string fields / strings for numeric fields
  })
})
