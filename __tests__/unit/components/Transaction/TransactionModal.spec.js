import { shallowMount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import TransactionModal from '@/components/Transaction/TransactionModal'

const i18n = useI18nGlobally()

describe('TransactionModal', () => {
  const profileId = 'exampleId'
  let wrapper
  let $store

  beforeEach(() => {
    $store = { dispatch: jest.fn() }

    wrapper = shallowMount(TransactionModal, {
      i18n,
      propsData: {
        type: 0
      },
      mocks: {
        session_profile: { id: profileId },
        session_network: {
          version: 12,
          constants: {
            epoch: '2017-03-21T13:00:00.000Z'
          }
        },
        $logger: {
          error: jest.fn()
        },
        $store
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

  describe('storeTransaction', () => {
    it('should dispatch `transaction/create` using the transaction, but replacing some attributes, and the current profile', () => {
      const transaction = {
        id: 'tx1',
        type: 0,
        amount: 10000,
        fee: 1000,
        timestamp: 120,
        recipientId: 'Arecipient',
        senderPublicKey: 'Asender',
        vendorField: 'smartbridge'
      }
      wrapper.vm.storeTransaction(transaction)

      const { id, type, amount, fee, vendorField } = transaction
      const timestamp = (new Date(wrapper.vm.session_network.constants.epoch)).getTime() + transaction.timestamp * 1000

      const expected = {
        profileId,
        id,
        type,
        amount,
        fee,
        vendorField,
        confirmations: 0,
        timestamp,
        sender: 'public key of Asender',
        recipient: transaction.recipientId,
        raw: transaction
      }
      expect($store.dispatch).toHaveBeenCalledWith('transaction/create', expected)
    })
  })
})
