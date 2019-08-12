import { shallowMount } from '@vue/test-utils'
import QrMixin from '@/mixins/qr'

describe('Mixins > Qr', () => {
  let wrapper

  beforeEach(() => {
    const TestComponent = {
      name: 'TestComponent',
      template: '<div/>'
    }

    wrapper = shallowMount(TestComponent, {
      mixins: [QrMixin]
    })
  })

  describe('qr_getAddress', () => {
    it('should return an address from an uri string', () => {
      expect(wrapper.vm.qr_getAddress('ark:AewxfHQobSc49a4radHp74JZCGP8LRe4xA')).toEqual('AewxfHQobSc49a4radHp74JZCGP8LRe4xA')
    })

    it('should return an address from a json object with the "a" property', () => {
      expect(wrapper.vm.qr_getAddress('{"a": "AewxfHQobSc49a4radHp74JZCGP8LRe4xA"}')).toEqual('AewxfHQobSc49a4radHp74JZCGP8LRe4xA')
    })

    it('should return an address from a json object with the "address" property', () => {
      expect(wrapper.vm.qr_getAddress('{"address": "AewxfHQobSc49a4radHp74JZCGP8LRe4xA"}')).toEqual('AewxfHQobSc49a4radHp74JZCGP8LRe4xA')
    })

    it('should return an address from string', () => {
      expect(wrapper.vm.qr_getAddress('AewxfHQobSc49a4radHp74JZCGP8LRe4xA')).toEqual('AewxfHQobSc49a4radHp74JZCGP8LRe4xA')
    })

    it('should return undefined or the same string from an incorrect entry', () => {
      expect(wrapper.vm.qr_getAddress('ark:address')).toEqual('ark:address')
      expect(wrapper.vm.qr_getAddress('{"b": "address"}')).toBeUndefined()
      expect(wrapper.vm.qr_getAddress('asdf')).toEqual('asdf')
    })
  })

  describe('qr_getPassphrase', () => {
    it('should return a passphrase from a json object', () => {
      expect(wrapper.vm.qr_getPassphrase('{"passphrase": "this is a top secret passphrase"}')).toEqual('this is a top secret passphrase')
    })

    it('should return a passphrase from string', () => {
      expect(wrapper.vm.qr_getPassphrase('this is a top secret passphrase')).toEqual('this is a top secret passphrase')
    })

    it('should return undefined or the same string from an incorrect entry', () => {
      expect(wrapper.vm.qr_getPassphrase('{"asdf": "this is a top secret passphrase"}')).toBeUndefined()
      expect(wrapper.vm.qr_getPassphrase('asdf')).toEqual('asdf')
    })
  })
})
