import { shallowMount } from '@vue/test-utils'
import { useI18nGlobally } from '../../__utils__/i18n'
import transaction from '../../__fixtures__/models/transaction'
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
      },
      stubs: {
        PortalTarget: true
      }
    })
  })

  it('should be instantiated', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('isSuccessfulResponse', () => {
    // Only V2
    const response = {
      body: { data: {} }
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

      describe('when the response does not include errors', () => {
        beforeEach(() => {
          response.body.errors = null
          response.body.data = {
            invalid: [],
            accept: []
          }
        })

        it('should return `true`', () => {
          expect(wrapper.vm.isSuccessfulResponse(response)).toBeTrue()
        })
      })

      describe('when the response includes errors', () => {
        beforeEach(() => {
          response.body.errors = {
            tx1: [{ type: 'ERR_LOW_FEE' }]
          }
          response.body.data = {
            invalid: [],
            accept: []
          }
        })

        it('should return `false`', () => {
          expect(wrapper.vm.isSuccessfulResponse(response)).toBeFalse()
        })
      })

      describe('when the response does not include invalid transactions', () => {
        beforeEach(() => {
          response.body.errors = null
          response.body.data.invalid = []
        })

        it('should return `true`', () => {
          expect(wrapper.vm.isSuccessfulResponse(response)).toBeTrue()
        })
      })

      describe('when the response includes invalid transactions', () => {
        beforeEach(() => {
          response.body.data = {
            invalid: ['tx1']
          }
        })

        it('should return `false`', () => {
          expect(wrapper.vm.isSuccessfulResponse(response)).toBeFalse()
        })
      })
    })
  })

  describe('storeTransaction', () => {
    const expectTransactionStored = (transaction, timestamp) => {
      const { id, type, typeGroup, amount, fee, vendorField } = transaction

      const expected = {
        profileId,
        id,
        type,
        typeGroup,
        amount,
        fee,
        vendorField,
        confirmations: 0,
        timestamp,
        sender: `address of ${transaction.senderPublicKey}`,
        recipient: transaction.recipientId,
        raw: transaction
      }

      expect($store.dispatch).toHaveBeenCalledWith('transaction/create', expected)
    }

    describe('when the transaction has a timestamp (V1)', () => {
      it('should calculate the timestamp based on the epoch', () => {
        const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(1000000)

        const timestamp = (new Date(wrapper.vm.session_network.constants.epoch)).getTime() + transaction.timestamp * 1000

        wrapper.vm.storeTransaction(transaction)
        expectTransactionStored(transaction, timestamp)

        dateSpy.mockRestore()
      })
    })

    describe('when the transaction has no timestamp (V2)', () => {
      it('should set the timestamp to the current time', () => {
        const dateSpy = jest.spyOn(Date, 'now').mockReturnValue(1000000)

        const v2Transaction = {
          ...transaction,
          version: 2,
          expiration: 0
        }

        delete v2Transaction.timestamp

        wrapper.vm.storeTransaction(v2Transaction)
        expectTransactionStored(v2Transaction, Date.now())

        dateSpy.mockRestore()
      })
    })
  })
})
