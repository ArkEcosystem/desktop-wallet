import { createLocalVue, mount } from '@vue/test-utils'
import Vuelidate from 'vuelidate'
import installI18n from '../../../../__utils__/i18n'
import TransactionFormBridgechainUpdate from '@/components/Transaction/TransactionForm/TransactionFormBridgechain/TransactionFormBridgechainUpdate'
import CurrencyMixin from '@/mixins/currency'

const localVue = createLocalVue()
localVue.use(Vuelidate)
const i18n = installI18n(localVue)

const network = {
  token: 'ARK',
  version: 23,
  wif: 170,
  market: {
    enabled: false
  }
}

let wrapper
const createWrapper = (component, wallet, bridgechain) => {
  component = component || TransactionFormBridgechainUpdate
  wallet = wallet || {
    passphrase: null
  }

  if (bridgechain === undefined) {
    bridgechain = {
      name: 'bridgechain',
      seedNodes: [
        '1.1.1.1',
        '2.2.2.2'
      ],
      ports: {
        '@arkecosystem/core-api': 4003
      },
      genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
      bridgechainRepository: 'https://github.com/arkecosystem/core.git'
    }
  }

  wrapper = mount(component, {
    i18n,
    localVue,
    sync: false,
    propsData: {
      bridgechain
    },
    mocks: {
      $client: {
        buildBridgechainUpdate: jest.fn((transactionData) => transactionData)
      },
      $error: jest.fn(),
      $store: {
        getters: {
          'transaction/staticFee': jest.fn(() => null),
          'session/lastFeeByType': jest.fn(() => (1 * 1e8).toString()),
          'session/network': network,
          'network/byToken': jest.fn(() => (network))
        }
      },
      $synchronizer: {
        appendFocus: jest.fn()
      },
      session_network: network,
      currency_format: jest.fn(CurrencyMixin.methods.currency_format),
      currency_subToUnit: jest.fn(CurrencyMixin.methods.currency_subToUnit),
      currency_toBuilder: jest.fn(CurrencyMixin.methods.currency_toBuilder),
      wallet_formatAddress: jest.fn(address => `formatted-${address}`),
      wallet_fromRoute: wallet
    }
  })
}

describe('TransactionFormBridgechainUpdate', () => {
  beforeEach(() => {
    createWrapper()
  })

  it('should have magistrate transaction group', () => {
    expect(wrapper.vm.$options.transactionGroup).toBe(2)
  })

  it('should have bridgechain update transaction type', () => {
    expect(wrapper.vm.$options.transactionType).toBe(5)
  })

  describe('template', () => {
    it('should render', () => {
      expect(wrapper.contains('.TransactionFormBridgechain')).toBe(true)
    })

    describe('step 1', () => {
      it('should have seed node field', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__seed-node')).toBe(true)
      })

      it('should have add button', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__add')).toBe(true)
      })

      it('should have seed nodes list', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__seed-nodes')).toBe(true)
      })
    })

    describe('step 2', () => {
      beforeEach(() => {
        wrapper.vm.step = 2
      })

      it('should not have name field', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__name')).toBe(false)
      })

      it('should not have genesis hash field', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__genesis-hash')).toBe(false)
      })

      it('should not have bridgechain repository field', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__bridgechain-repository')).toBe(false)
      })

      it('should have api port field', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__api-port')).toBe(true)
      })

      it('should have fee field', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__fee')).toBe(true)
      })

      describe('ledger notice', () => {
        it('should show if wallet is a ledger', async () => {
          createWrapper(null, {
            isLedger: true
          })

          wrapper.vm.step = 2
          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormBridgechain__ledger-notice')).toBe(true)
        })

        it('should show if wallet is not a ledger', async () => {
          createWrapper(null, {
            isLedger: false
          })

          wrapper.vm.step = 2
          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormBridgechain__ledger-notice')).toBe(false)
        })
      })

      describe('password field', () => {
        it('should show if wallet does have a password', async () => {
          createWrapper(null, {
            passphrase: 'password'
          })

          wrapper.vm.step = 2
          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormBridgechain__password')).toBe(true)
        })

        it('should show if wallet does not have a password', () => {
          expect(wrapper.contains('.TransactionFormBridgechain__password')).toBe(false)
        })
      })

      describe('passphrase field', () => {
        it('should show if wallet does not have a password', () => {
          expect(wrapper.contains('.TransactionFormBridgechain__passphrase')).toBe(true)
        })

        it('should not show if wallet does have a password', async () => {
          createWrapper(null, {
            passphrase: 'password'
          })

          wrapper.vm.step = 2
          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormBridgechain__passphrase')).toBe(false)
        })
      })
    })

    describe('prev button', () => {
      it('should be enabled if form is on step 2', async () => {
        wrapper.vm.step = 2

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormBridgechain__prev').attributes('disabled')).toBeFalsy()
      })

      it('should be disabled if form is on step 1', async () => {
        wrapper.vm.step = 1

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormBridgechain__prev').attributes('disabled')).toBe('disabled')
      })
    })

    describe('next button', () => {
      it('should be enabled if seed nodes is valid on step 1', async () => {
        wrapper.vm.step = 1
        wrapper.vm.$v.form.seedNodes.$model = [
          '1.1.1.1'
        ]

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormBridgechain__next').attributes('disabled')).toBeFalsy()
      })

      it('should be enabled if form is valid on step 2', async () => {
        wrapper.vm.step = 2
        wrapper.vm.$v.form.fee.$model = (0.1 * 1e8).toString()
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.$v.form.asset.name.$model = 'bridgechain'
        wrapper.vm.$v.form.asset.genesisHash.$model = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'
        wrapper.vm.form.asset.ports = {
          '@arkecosystem/core-api': 4003
        }
        wrapper.vm.$v.form.seedNodes.$model = [
          '1.1.1.1'
        ]
        wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'https://github.com/arkecosystem/core.git'

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormBridgechain__next').attributes('disabled')).toBeFalsy()
      })

      it('should be disabled if seed nodes is invalid on step 1', async () => {
        wrapper.vm.step = 1
        wrapper.vm.$v.form.seedNodes.$model = []

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormBridgechain__next').attributes('disabled')).toBe('disabled')
      })

      it('should be disabled if form is invalid on step 2', async () => {
        wrapper.vm.step = 2
        wrapper.vm.$v.form.seedNodes.$model = []

        await wrapper.vm.$nextTick()

        expect(wrapper.find('.TransactionFormBridgechain__next').attributes('disabled')).toBe('disabled')
      })
    })
  })

  describe('mounted hook', () => {
    it('should load bridgechain into form', () => {
      createWrapper(null, null, {
        genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
        ports: {
          '@arkecosystem/core-api': 8081
        },
        seedNodes: [
          '5.5.5.5',
          '6.6.6.6'
        ]
      })

      expect(wrapper.vm.form.apiPort).toBe(8081)
      expect(wrapper.vm.form.seedNodes).toEqual([
        { ip: '5.5.5.5', isInvalid: false },
        { ip: '6.6.6.6', isInvalid: false }
      ])
      expect(wrapper.vm.form.asset).toEqual({
        name: '',
        ports: {},
        genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
        bridgechainRepository: ''
      })
    })

    it('should use default api port if not provided', () => {
      createWrapper(null, null, {
        genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
        ports: {},
        seedNodes: [
          '5.5.5.5',
          '6.6.6.6'
        ]
      })

      expect(wrapper.vm.form.apiPort).toBe(4003)
      expect(wrapper.vm.form.seedNodes).toEqual([
        { ip: '5.5.5.5', isInvalid: false },
        { ip: '6.6.6.6', isInvalid: false }
      ])
      expect(wrapper.vm.form.asset).toEqual({
        name: '',
        ports: {},
        genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
        bridgechainRepository: ''
      })
    })
  })

  describe('methods', () => {
    describe('buildTransaction', () => {
      it('should build bridgechain update', async () => {
        const transactionData = {
          type: 5,
          typeGroup: 2
        }

        const response = await wrapper.vm.buildTransaction(transactionData, true, true)

        expect(wrapper.vm.$client.buildBridgechainUpdate).toHaveBeenCalledWith(transactionData, true, true)
        expect(response).toBe(transactionData)
      })

      it('should build bridgechain update with default arguments', async () => {
        const transactionData = {
          type: 5,
          typeGroup: 2
        }

        const response = await wrapper.vm.buildTransaction(transactionData)

        expect(wrapper.vm.$client.buildBridgechainUpdate).toHaveBeenCalledWith(transactionData, false, false)
        expect(response).toBe(transactionData)
      })
    })

    describe('transactionError', () => {
      it('should generate transaction error', () => {
        wrapper.vm.transactionError()

        expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.BRIDGECHAIN_UPDATE')
      })
    })
  })
})
