import { shallowMount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import nock from 'nock'
import { NetworkModal } from '@/components/Network'
import { testIsValid, testNumeric, testRequired, testScheme, testUrl } from '../../__utils__/validation'

const i18n = useI18nGlobally()

let wrapper
const mocks = {
  $store: {
    dispatch: jest.fn(),
    getters: {
      'network/byName': jest.fn((name) => {
        return name === 'exists'
      })
    }
  },

  $error: jest.fn(),

  $logger: {
    error: jest.fn()
  }
}

jest.mock('@/store', () => ({
  getters: {
    'session/network': {
      nethash: '1234'
    }
  }
}))

Vue.use(Vuelidate)

describe('NetworkModal', () => {
  beforeEach(() => {
    wrapper = shallowMount(NetworkModal, {
      i18n,
      mocks,
      props: {
        title: 'Network Modal'
      }
    })

    nock.cleanAll()
  })

  it('should render modal', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('form validation', () => {
    describe('name', () => {
      it('should switch from invalid to valid to invalid for required when changed', () => {
        testRequired(wrapper.vm.$v.form.name)
      })

      it('should switch from invalid to valid to invalid when network name exists', () => {
        wrapper.vm.$v.form.name.$model = 'exists'

        expect(wrapper.vm.$v.form.name.doesNotExist).toBe(false)
        expect(wrapper.vm.$v.form.name.$invalid).toBe(true)

        wrapper.vm.$v.form.name.$model = 'not exists'

        expect(wrapper.vm.$v.form.name.doesNotExist).toBe(true)
        expect(wrapper.vm.$v.form.name.$invalid).toBe(false)

        wrapper.vm.$v.form.name.$model = 'exists'

        expect(wrapper.vm.$v.form.name.doesNotExist).toBe(false)
        expect(wrapper.vm.$v.form.name.$invalid).toBe(true)
      })
    })

    describe('description', () => {
      it('should switch from invalid to valid to invalid for required when changed', () => {
        testRequired(wrapper.vm.$v.form.description)
      })
    })

    describe('server', () => {
      it('should switch from invalid to valid to invalid for required when changed', () => {
        testRequired(wrapper.vm.$v.form.server, 'http://1.2.3.4')
      })

      it('should switch from invalid to valid to invalid for url', () => {
        testUrl(wrapper.vm.$v.form.server)
      })

      it('should switch from invalid to valid to invalid when has scheme', () => {
        testScheme(wrapper.vm.$v.form.server)
      })
    })

    describe('fetch button', () => {
      beforeEach(() => {
        wrapper.vm.$v.form.name.$model = 'sample name'
        wrapper.vm.$v.form.description.$model = 'sample description'
        wrapper.vm.$v.form.server.$model = 'http://1.2.3.4'
      })

      it('should enable if all valid', () => {
        expect(wrapper.vm.$v.form.$invalid).toBe(false)
      })

      it('should disable if invalid name', () => {
        wrapper.vm.$v.form.name.$model = 'exists'

        expect(wrapper.vm.$v.form.$invalid).toBe(true)
      })

      it('should disable if invalid description', () => {
        wrapper.vm.$v.form.description.$model = ''

        expect(wrapper.vm.$v.form.$invalid).toBe(true)
      })

      it('should disable if invalid server', () => {
        wrapper.vm.$v.form.server.$model = 'http://test.com:abcd'

        expect(wrapper.vm.$v.form.$invalid).toBe(true)
      })
    })

    describe('fetchNetworkInfo', () => {
      beforeEach(() => {
        wrapper.vm.$v.form.name.$model = 'sample name'
        wrapper.vm.$v.form.description.$model = 'sample description'
        wrapper.vm.$v.form.server.$model = 'http://1.2.3.4'
      })

      it('should fetch data and populate', async () => {
        nock('http://1.2.3.4')
          .get('/api/node/configuration')
          .reply(200, {
            data: {
              nethash: 1234,
              token: 'TEST',
              constants: {
                activeDelegates: 48,
                vendorFieldLength: 10
              }
            }
          })

        nock('https://min-api.cryptocompare.com')
          .get('/data/price')
          .query({
            fsym: 'TEST',
            tsyms: 'BTC'
          })
          .reply(200, {
            BTC: true
          })

        await wrapper.vm.fetchNetworkInfo()

        expect(wrapper.vm.$v.form.$model.activeDelegates).toBe('48')
        expect(wrapper.vm.$v.form.$model.vendorField.maxLength).toBe(10)
      })
    })

    describe('full form', () => {
      beforeEach(() => {
        wrapper.vm.configChoice = 'Basic'
        wrapper.vm.showFull = true
      })

      describe('nethash', () => {
        it('should switch from invalid to valid to invalid for required when changed', () => {
          testRequired(wrapper.vm.$v.form.nethash, '6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988')
        })

        it('should switch from invalid to valid to invalid for format', () => {
          testIsValid(wrapper.vm.$v.form.nethash, [
            {
              value: 'not a nethash',
              valid: false
            },
            {
              value: '6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988',
              valid: true
            },
            {
              value: 'not a nethash',
              valid: false
            }
          ])
        })
      })

      describe('token', () => {
        it('should switch from invalid to valid to invalid for required when changed', () => {
          testRequired(wrapper.vm.$v.form.token)
        })
      })

      describe('symbol', () => {
        it('should switch from invalid to valid to invalid for required when changed', () => {
          testRequired(wrapper.vm.$v.form.symbol)
        })
      })

      describe('version', () => {
        it('should switch from invalid to valid to invalid for required when changed', () => {
          testRequired(wrapper.vm.$v.form.version, 1)
        })

        it('should switch from invalid to valid to invalid for format', () => {
          testNumeric(wrapper.vm.$v.form.version)
        })
      })

      describe('explorer', () => {
        it('should switch from invalid to valid to invalid for required when changed', () => {
          testRequired(wrapper.vm.$v.form.explorer, 'http://1.2.3.4')
        })

        it('should switch from invalid to valid to invalid for url', () => {
          testUrl(wrapper.vm.$v.form.explorer)
        })

        it('should switch from invalid to valid to invalid when has scheme', () => {
          testScheme(wrapper.vm.$v.form.explorer)
        })
      })

      describe('knownWalletsUrl', () => {
        it('should switch from invalid to valid to invalid for url', () => {
          testUrl(wrapper.vm.$v.form.knownWalletsUrl)
        })
      })

      describe('epoch', () => {
        it('should switch from invalid to valid to invalid for required when changed', () => {
          testRequired(wrapper.vm.$v.form.epoch, '2019-04-09T15:32:16.123Z')
        })

        it('should switch from invalid to valid to invalid for epoch timestamp', () => {
          testIsValid(wrapper.vm.$v.form.epoch, [
            {
              value: 'not valid',
              valid: false
            },
            {
              value: '2019-04-09T15:32:16.123Z',
              valid: true
            },
            {
              value: '2019-04-09T15:32:16.123',
              valid: false
            },
            {
              value: '2019-04-09T15:32:16.000Z',
              valid: true
            },
            {
              value: '04/09/2019 15:32:16',
              valid: false
            }
          ])
        })
      })

      describe('wif', () => {
        it('should switch from invalid to valid to invalid for required when changed', () => {
          testRequired(wrapper.vm.$v.form.wif, 1)
        })

        it('should switch from invalid to valid to invalid for format', () => {
          testNumeric(wrapper.vm.$v.form.wif)
        })
      })

      describe('slip44', () => {
        it('should switch from invalid to valid to invalid for required when changed', () => {
          testRequired(wrapper.vm.$v.form.slip44, 1)
        })
      })

      describe('activeDelegates', () => {
        it('should switch from invalid to valid to invalid for required when changed', () => {
          testRequired(wrapper.vm.$v.form.activeDelegates, 1)
        })

        it('should switch from invalid to valid to invalid for format', () => {
          testNumeric(wrapper.vm.$v.form.activeDelegates)
        })
      })

      describe('validateSeed', () => {
        let spyDispatch
        beforeEach(() => {
          spyDispatch = jest.spyOn(mocks.$store, 'dispatch')
        })
        afterEach(() => {
          spyDispatch.mockRestore()
        })

        it('should return true for correct urls', async () => {
          wrapper.vm.$v.form.server.$model = 'http://1.2.3.4:4040'
          spyDispatch.mockImplementation(() => ({}))

          expect(await wrapper.vm.validateSeed()).toBeTruthy()
        })

        it('should return false for incorrect urls', async () => {
          wrapper.vm.$v.form.server.$model = 'http://1.2.3.4:4040:4040'

          expect(await wrapper.vm.validateSeed()).toBe(false)
          expect(spyDispatch).not.toHaveBeenCalled()
        })
      })

      describe('save button', () => {
        beforeEach(() => {
          wrapper.vm.$v.form.name.$model = 'sample name'
          wrapper.vm.$v.form.description.$model = 'sample description'
          wrapper.vm.$v.form.server.$model = 'http://1.2.3.4'

          wrapper.vm.$v.form.nethash.$model = '6e84d08bd299ed97c212c886c98a57e36545c8f5d645ca7eeae63a8bd62d8988'
          wrapper.vm.$v.form.token.$model = 'A'
          wrapper.vm.$v.form.symbol.$model = 'A'
          wrapper.vm.$v.form.version.$model = '1'
          wrapper.vm.$v.form.explorer.$model = 'http://1.2.3.4'
          wrapper.vm.$v.form.knownWalletsUrl.$model = 'http://1.2.3.4/know-wallets.json'
          wrapper.vm.$v.form.epoch.$model = '2019-04-09T15:32:16.123Z'
          wrapper.vm.$v.form.wif.$model = '1'
          wrapper.vm.$v.form.slip44.$model = '1'
          wrapper.vm.$v.form.activeDelegates.$model = '1'
        })

        it('should enable if all valid', () => {
          expect(wrapper.vm.$v.form.$invalid).toBe(false)
        })

        it('should disable if invalid name', () => {
          wrapper.vm.$v.form.name.$model = 'exists'

          expect(wrapper.vm.$v.form.$invalid).toBe(true)
        })

        it('should disable if invalid description', () => {
          wrapper.vm.$v.form.description.$model = ''

          expect(wrapper.vm.$v.form.$invalid).toBe(true)
        })

        it('should disable if invalid server', () => {
          wrapper.vm.$v.form.server.$model = 'http://test.com:abcd'

          expect(wrapper.vm.$v.form.$invalid).toBe(true)
        })

        it('should disable if invalid nethash', () => {
          wrapper.vm.$v.form.nethash.$model = 'not a nethash'

          expect(wrapper.vm.$v.form.$invalid).toBe(true)
        })

        it('should disable if invalid token', () => {
          wrapper.vm.$v.form.token.$model = ''

          expect(wrapper.vm.$v.form.$invalid).toBe(true)
        })

        it('should disable if invalid symbol', () => {
          wrapper.vm.$v.form.symbol.$model = ''

          expect(wrapper.vm.$v.form.$invalid).toBe(true)
        })

        it('should disable if invalid version', () => {
          wrapper.vm.$v.form.version.$model = 'ten'

          expect(wrapper.vm.$v.form.$invalid).toBe(true)
        })

        it('should disable if invalid explorer', () => {
          wrapper.vm.$v.form.explorer.$model = 'http://test.com:abcd'

          expect(wrapper.vm.$v.form.$invalid).toBe(true)
        })

        it('should disable if invalid knownWalletsUrl', () => {
          wrapper.vm.$v.form.knownWalletsUrl.$model = 'http://test.com:abcd/know-wallets.json'

          expect(wrapper.vm.$v.form.$invalid).toBe(true)
        })

        it('should disable if invalid epoch', () => {
          wrapper.vm.$v.form.epoch.$model = '04/09/2019 15:32:16'

          expect(wrapper.vm.$v.form.$invalid).toBe(true)
        })

        it('should disable if invalid wif', () => {
          wrapper.vm.$v.form.wif.$model = 'ten'

          expect(wrapper.vm.$v.form.$invalid).toBe(true)
        })

        it('should disable if invalid slip44', () => {
          wrapper.vm.$v.form.slip44.$model = ''

          expect(wrapper.vm.$v.form.$invalid).toBe(true)
        })

        it('should disable if invalid activeDelegates', () => {
          wrapper.vm.$v.form.activeDelegates.$model = 'ten'

          expect(wrapper.vm.$v.form.$invalid).toBe(true)
        })
      })
    })
  })
})
