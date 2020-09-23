import { createLocalVue, mount } from '@vue/test-utils'
import installI18n from '../../../__utils__/i18n'
import TransactionConfirm, * as TransactionConfirmComponents from '@/components/Transaction/TransactionConfirm'
import CurrencyMixin from '@/mixins/currency'

const transactions = {
  delegateRegistration: {
    type: 2,
    asset: {
      delegate: {
        username: 'test_delegate'
      }
    }
  },

  delegateResignation: {
    type: 7
  },

  ipfs: {
    type: 5
  },

  multiPayment: {
    type: 6,
    asset: {
      payments: [{
        address: 'address-1',
        amount: (1 * 1e8).toString()
      },
      {
        address: 'address-2',
        amount: (5 * 1e8).toString()
      }]
    }
  },

  multiSignature: {
    type: 4,
    multiSignature: {}
  },

  secondSignature: {
    type: 1
  },

  transfer: {
    type: 0,
    amount: (1 * 1e8).toString(),
    fee: (0.1 * 1e8).toString(),
    recipientId: 'recipient-address'
  },

  vote: {
    type: 3
  },

  businessRegistration: {
    type: 0,
    typeGroup: 2,
    asset: {
      businessRegistration: {
        name: 'test business',
        website: 'https://ark.io',
        vat: 'GB12345678',
        repository: 'https://github.com/arkecosystem/desktop-wallet.git'
      }
    }
  },

  businessResignation: {
    type: 1,
    typeGroup: 2
  },

  businessUpdate: {
    type: 2,
    typeGroup: 2,
    asset: {
      businessUpdate: {
        name: 'test business',
        website: 'https://ark.io',
        vat: 'GB12345678',
        repository: 'https://github.com/arkecosystem/desktop-wallet.git'
      }
    }
  },

  bridgechainRegistration: {
    type: 3,
    typeGroup: 2,
    asset: {
      bridgechainRegistration: {
        name: 'test bridgechain',
        genesisHash: 'genesis_hash_1234',
        seedNodes: [
          '1.1.1.1',
          '2.2.2.2'
        ],
        ports: {
          '@arkecosystem/core-api': 4003
        },
        bridgechainRepository: 'https://github.com/arkecosystem/core.git'
      }
    }
  },

  bridgechainResignation: {
    type: 4,
    typeGroup: 2
  },

  bridgechainUpdate: {
    type: 5,
    typeGroup: 2,
    asset: {
      bridgechainUpdate: {
        seedNodes: [
          '1.1.1.1',
          '2.2.2.2'
        ],
        ports: {
          '@arkecosystem/core-api': 4003
        }
      }
    }
  }
}

const localVue = createLocalVue()
const i18n = installI18n(localVue)

let wrapper
const createWrapper = (component, transaction) => {
  component = component || TransactionConfirm
  transaction = transaction || transactions.transfer

  if (!transaction.network) {
    transaction.network = 23
  }
  if (!transaction.fee) {
    transaction.fee = (0.1 * 1e8).toString()
  }
  if (!transaction.version) {
    transaction.version = 2
  }
  if (!transaction.nonce) {
    transaction.nonce = '1'
  }

  wrapper = mount(component, {
    i18n,
    localVue,
    sync: false,
    propsData: {
      transaction
    },
    mocks: {
      wallet_formatAddress: jest.fn((address) => `formatted-${address}`),
      formatter_networkCurrency: jest.fn((amount) => amount.toString()),
      currency_toBuilder: jest.fn(CurrencyMixin.methods.currency_toBuilder),
      electron_writeFile: jest.fn((_, path) => `/home/test/${path}`),
      wallet_fromRoute: {
        address: 'address-1'
      },
      wallet_name: jest.fn(wallet => wallet),
      $success: jest.fn(),
      $error: jest.fn()
    },
    stubs: {
      Identicon: true,
      TransactionDetail: true,
      ...TransactionConfirmComponents
    }
  })
}

describe('TransactionConfirm', () => {
  beforeEach(() => {
    createWrapper()
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionConfirm')).toBe(true)
    })

    it('should render transfer confirm component', async () => {
      createWrapper(null, transactions.transfer)

      await wrapper.vm.$nextTick()

      expect(wrapper.contains('.TransactionConfirmTransfer')).toBe(true)
    })

    it('should render second signature confirm component', async () => {
      createWrapper(null, transactions.secondSignature)

      await wrapper.vm.$nextTick()

      expect(wrapper.contains('.TransactionConfirmSecondSignature')).toBe(true)
    })

    it('should render delegate registration confirm component', async () => {
      createWrapper(null, transactions.delegateRegistration)

      await wrapper.vm.$nextTick()

      expect(wrapper.contains('.TransactionConfirmDelegateRegistration')).toBe(true)
    })

    it('should render vote confirm component', async () => {
      createWrapper(null, transactions.vote)

      await wrapper.vm.$nextTick()

      expect(wrapper.contains('.TransactionConfirmVote')).toBe(true)
    })

    it('should render multi-signature confirm component', async () => {
      createWrapper(null, transactions.multiSignature)

      await wrapper.vm.$nextTick()

      expect(wrapper.contains('.TransactionConfirmMultiSignature')).toBe(true)
    })

    it('should render ipfs confirm component', async () => {
      createWrapper(null, transactions.ipfs)

      await wrapper.vm.$nextTick()

      expect(wrapper.contains('.TransactionConfirmIpfs')).toBe(true)
    })

    it('should render multi-payment confirm component', async () => {
      createWrapper(null, transactions.multiPayment)

      await wrapper.vm.$nextTick()

      expect(wrapper.contains('.TransactionConfirmMultiPayment')).toBe(true)
    })

    it('should render delegate resignation confirm component', async () => {
      createWrapper(null, transactions.delegateResignation)

      await wrapper.vm.$nextTick()

      expect(wrapper.contains('.TransactionConfirmDelegateResignation')).toBe(true)
    })
  })

  describe('computed', () => {
    describe('totalAmount', () => {
      it('should calculate full amount of transaction', async () => {
        createWrapper(null, transactions.transfer)

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.totalAmount + '').toEqual('110000000')
      })

      it('should use only fee if no amount', async () => {
        createWrapper(null, transactions.vote)

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.totalAmount + '').toBe('10000000')
      })

      it('should calculate total including payments of multi-payment', async () => {
        createWrapper(null, transactions.multiPayment)

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.totalAmount + '').toBe('610000000')
      })
    })

    describe('currentWallet', () => {
      it('should return wallet from prop if set', async () => {
        const wallet = {
          address: 'prop-address-1'
        }

        wrapper.setProps({
          transaction: transactions.vote,
          wallet
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.currentWallet).toBe(wallet)
      })

      it('should return wallet from route if no prop is set', async () => {
        expect(wrapper.vm.currentWallet).toEqual({
          address: 'address-1'
        })
      })

      it('should return updated wallet from route if changed', async () => {
        expect(wrapper.vm.currentWallet).toEqual({
          address: 'address-1'
        })

        const wallet = {
          address: 'prop-address-1'
        }

        wrapper.setProps({
          transaction: transactions.vote,
          wallet
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.currentWallet).toEqual({
          address: 'prop-address-1'
        })
      })
    })

    describe('address', () => {
      it('should get address of current wallet', () => {
        expect(wrapper.vm.address).toEqual('address-1')
      })

      it('should update address when current wallet changes', async () => {
        const wallet = {
          address: 'prop-address-1'
        }

        expect(wrapper.vm.address).toEqual('address-1')

        wrapper.setProps({
          transaction: transactions.vote,
          wallet
        })

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.address).toEqual('prop-address-1')
      })
    })

    describe('showSave', () => {
      it('should return true if transaction is not multi-signature', async () => {
        createWrapper(null, transactions.secondSignature)

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.showSave).toBe(true)
      })

      it('should return false if transaction is multi-signature', () => {
        createWrapper(null, transactions.multiSignature)

        expect(wrapper.vm.showSave).toBe(false)
      })
    })
  })

  describe('mounted hook', () => {
    it('should render transfer confirm component', async () => {
      createWrapper(null, transactions.transfer)

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.activeComponent).toBe('TransactionConfirmTransfer')
    })

    it('should render second signature confirm component', async () => {
      createWrapper(null, transactions.secondSignature)

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.activeComponent).toBe('TransactionConfirmSecondSignature')
    })

    it('should render delegate registration confirm component', async () => {
      createWrapper(null, transactions.delegateRegistration)

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.activeComponent).toBe('TransactionConfirmDelegateRegistration')
    })

    it('should render vote confirm component', async () => {
      createWrapper(null, transactions.vote)

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.activeComponent).toBe('TransactionConfirmVote')
    })

    it('should render multi-signature confirm component', async () => {
      createWrapper(null, transactions.multiSignature)

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.activeComponent).toBe('TransactionConfirmMultiSignature')
    })

    it('should render ipfs confirm component', async () => {
      createWrapper(null, transactions.ipfs)

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.activeComponent).toBe('TransactionConfirmIpfs')
    })

    it('should render multi-payment confirm component', async () => {
      createWrapper(null, transactions.multiPayment)

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.activeComponent).toBe('TransactionConfirmMultiPayment')
    })

    it('should render delegate resignation confirm component', async () => {
      createWrapper(null, transactions.delegateResignation)

      await wrapper.vm.$nextTick()

      expect(wrapper.vm.activeComponent).toBe('TransactionConfirmDelegateResignation')
    })

    it('should error if no component based on transaction type', () => {
      expect(() => { createWrapper(null, { type: 1000 }) }).toThrow('[TransactionConfirm] - Confirm for type 1000 (group 1) not found.')
    })
  })

  describe('methods', () => {
    describe('emitBack', () => {
      it('should emit', () => {
        wrapper.vm.emitBack()

        expect(wrapper.emitted().back).toBeTruthy()
      })
    })

    describe('emitConfirm', () => {
      it('should emit if not already clicked', () => {
        wrapper.vm.wasClicked = false
        wrapper.vm.emitConfirm()

        expect(wrapper.emitted().confirm).toBeTruthy()
      })

      it('should not emit if already clicked', () => {
        wrapper.vm.wasClicked = true
        wrapper.vm.emitConfirm()

        expect(wrapper.emitted().confirm).toBeFalsy()
      })
    })

    describe('saveTransaction', () => {
      it('should save to file & output success message', async () => {
        const $tSpy = jest.spyOn(wrapper.vm, '$t')
        await wrapper.vm.saveTransaction()

        const json = JSON.stringify(wrapper.vm.transaction)
        const path = `${wrapper.vm.transaction.id}.json`

        expect(wrapper.vm.electron_writeFile).toHaveBeenCalledWith(json, path)
        expect(wrapper.vm.$success).toHaveBeenCalledWith('TRANSACTION.SUCCESS.SAVE_OFFLINE')
        expect($tSpy).toHaveBeenCalledWith('TRANSACTION.SUCCESS.SAVE_OFFLINE', { path: `/home/test/${path}` })

        $tSpy.mockRestore()
      })

      it('should error if saving fails', async () => {
        const $tSpy = jest.spyOn(wrapper.vm, '$t')
        wrapper.vm.electron_writeFile.mockImplementation(() => {
          throw new Error('failed to save')
        })

        await wrapper.vm.saveTransaction()

        const json = JSON.stringify(wrapper.vm.transaction)
        const path = `${wrapper.vm.transaction.id}.json`

        expect(wrapper.vm.electron_writeFile).toHaveBeenCalledWith(json, path)
        expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.SAVE_OFFLINE')
        expect($tSpy).toHaveBeenCalledWith('TRANSACTION.ERROR.SAVE_OFFLINE', { error: 'failed to save' })

        $tSpy.mockRestore()
      })
    })
  })
})
