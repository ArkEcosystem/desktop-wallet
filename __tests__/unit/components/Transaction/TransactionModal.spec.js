import { shallowMount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import TransactionModal from '@/components/Transaction/TransactionModal'

const i18n = useI18nGlobally()

describe('TransactionModal', () => {
  let wrapper

  beforeEach(() => {
    wrapper = shallowMount(TransactionModal, {
      i18n,
      propsData: {
        type: 0
      },
      mocks: {
        $logger: {
          error: jest.fn()
        }
      }
    })
  })

  it('should be instantiated', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('isSuccessfulRsponse', () => {
    // Only V2
    let response = {
      data: { data: {} }
    }

    describe('when the response status is not 200', () => {
      beforeEach(() => {
        response.status = 500
      })

      it('should return `false`', () => {
        expect(wrapper.vm.isSuccessfulResponse(response)).toBeFalse()
      })
    })

    describe('when the response status is 200', () => {
      beforeEach(() => {
        response.status = 200
      })

      describe('when the response does not include invalid transactions', () => {
        beforeEach(() => {
          response.data.data.invalid = []
        })

        it('should return `true`', () => {
          expect(wrapper.vm.isSuccessfulResponse(response)).toBeTrue()
        })
      })

      describe('when the response includes invalid transactions', () => {
        beforeEach(() => {
          response.data.data.invalid = ['tx1']
        })

        describe('when the error is `ERR_LOW_FEE`', () => {
          beforeEach(() => {
            response.data.errors = { tx1: [{ type: 'ERR_LOW_FEE' }] }
          })

          it('should return `true`', () => {
            expect(wrapper.vm.isSuccessfulResponse(response)).toBeTrue()
          })
        })

        xdescribe('when the error is not `ERR_LOW_FEE`', () => {
          it('should return `false`', () => {
            expect(wrapper.vm.isSuccessfulResponse(response)).toBeFalse()
          })
        })
      })
    })
  })
})
