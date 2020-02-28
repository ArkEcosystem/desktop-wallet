import { createLocalVue, mount } from '@vue/test-utils'
import { Identities } from '@arkecosystem/crypto'
import Vuelidate from 'vuelidate'
import installI18n from '../../../../__utils__/i18n'
import TransactionFormBridgechainRegistration from '@/components/Transaction/TransactionForm/TransactionFormBridgechain/TransactionFormBridgechainRegistration'
import TransactionFormBridgechainUpdate from '@/components/Transaction/TransactionForm/TransactionFormBridgechain/TransactionFormBridgechainUpdate'
import CurrencyMixin from '@/mixins/currency'
import BigNumber from '@/plugins/bignumber'

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
  wallet = wallet || {
    address: 'address-1',
    passphrase: null
  }

  if (component.name === 'TransactionFormBridgechainUpdate' && !wallet.business) {
    wallet.business = {
      name: 'business',
      website: 'https://ark.io',
      vat: 'GB12345678',
      repository: 'https://github.com/arkecosystem/desktop-wallet.git'
    }
  }

  if (component.name === 'TransactionFormBridgechainUpdate' && bridgechain === undefined) {
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
      bridgechainRepository: 'https://github.com/arkecosystem/core.git',
      bridgechainAssetRepository: 'https://github.com/arkecosystem/core-assets.git'
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
        buildBridgechainRegistration: jest.fn((transactionData) => transactionData),
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
      currency_unitToSub: jest.fn(CurrencyMixin.methods.currency_unitToSub),
      wallet_formatAddress: jest.fn(address => `formatted-${address}`),
      wallet_fromRoute: wallet
    }
  })
}

describe.each([
  ['TransactionFormBridgechainRegistration', TransactionFormBridgechainRegistration],
  ['TransactionFormBridgechainUpdate', TransactionFormBridgechainUpdate]
])('%s', (componentName, component) => {
  beforeEach(() => {
    createWrapper(component)
  })

  it('should have magistrate transaction group', () => {
    expect(wrapper.vm.$options.transactionGroup).toBe(2)
  })

  it('should have correct transaction type', () => {
    if (componentName === 'TransactionFormBridgechainRegistration') {
      expect(wrapper.vm.$options.transactionType).toBe(3)
    } else {
      expect(wrapper.vm.$options.transactionType).toBe(5)
    }
  })

  describe('data', () => {
    it('should create form object', () => {
      expect(Object.keys(wrapper.vm.form)).toEqual([
        'fee',
        'passphrase',
        'walletPassword',
        'apiPort',
        'seedNodes',
        'asset'
      ])

      expect(Object.keys(wrapper.vm.form.asset)).toEqual([
        'name',
        'ports',
        'genesisHash',
        'bridgechainRepository',
        'bridgechainAssetRepository'
      ])
    })
  })

  if (componentName === 'TransactionFormBridgechainUpdate') {
    describe('mounted hook', () => {
      it('should load bridgechain into form', () => {
        createWrapper(component, null, {
          genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
          ports: {
            '@arkecosystem/core-api': 8081
          },
          seedNodes: [
            '5.5.5.5',
            '6.6.6.6'
          ],
          bridgechainRepository: '',
          bridgechainAssetRepository: ''
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
          bridgechainRepository: '',
          bridgechainAssetRepository: ''
        })
      })

      it('should use default api port if not provided', () => {
        createWrapper(component, null, {
          genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
          ports: {},
          seedNodes: [
            '5.5.5.5',
            '6.6.6.6'
          ],
          bridgechainRepository: '',
          bridgechainAssetRepository: ''
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
          bridgechainRepository: '',
          bridgechainAssetRepository: ''
        })
      })
    })
  }

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

      if (componentName === 'TransactionFormBridgechainRegistration') {
        describe('registration', () => {
          it('should have name field', () => {
            expect(wrapper.contains('.TransactionFormBridgechain__name')).toBe(true)
          })

          it('should have genesis hash field', () => {
            expect(wrapper.contains('.TransactionFormBridgechain__genesis-hash')).toBe(true)
          })
        })
      } else {
        describe('update', () => {
          it('should not have name field', () => {
            expect(wrapper.contains('.TransactionFormBridgechain__name')).toBe(false)
          })

          it('should not have genesis hash field', () => {
            expect(wrapper.contains('.TransactionFormBridgechain__genesis-hash')).toBe(false)
          })
        })
      }

      it('should have bridgechain repository field', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__bridgechain-repository')).toBe(true)
      })

      it('should have bridgechain asset repository field', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__bridgechain-asset-repository')).toBe(true)
      })

      it('should have api port field', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__api-port')).toBe(true)
      })

      it('should have fee field', () => {
        expect(wrapper.contains('.TransactionFormBridgechain__fee')).toBe(true)
      })

      describe('ledger notice', () => {
        it('should show if wallet is a ledger', async () => {
          createWrapper(component, {
            isLedger: true
          })

          wrapper.vm.step = 2
          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormBridgechain__ledger-notice')).toBe(true)
        })

        it('should show if wallet is not a ledger', async () => {
          createWrapper(component, {
            isLedger: false
          })

          wrapper.vm.step = 2
          await wrapper.vm.$nextTick()

          expect(wrapper.contains('.TransactionFormBridgechain__ledger-notice')).toBe(false)
        })
      })

      describe('password field', () => {
        it('should show if wallet does have a password', async () => {
          createWrapper(component, {
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
          createWrapper(component, {
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
          { ip: '1.1.1.1', isInvalid: false }
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
          { ip: '1.1.1.1', isInvalid: false }
        ]
        wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'https://github.com/arkecosystem/core.git'
        wrapper.vm.$v.form.asset.bridgechainAssetRepository.$model = 'https://github.com/arkecosystem/core-assets.git'

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

  describe('computed', () => {
    describe('isUpdate', () => {
      if (componentName === 'TransactionFormBridgechainRegistration') {
        describe('TransactionFormBridgechainRegistration', () => {
          it('should return false if bridgechain prop is set', () => {
            wrapper.setProps({
              bridgechain: {
                name: 'bridgechain',
                seedNodes: [
                  '1.1.1.1',
                  '2.2.2.2'
                ],
                ports: {
                  '@arkecosystem/core-api': 4003
                },
                genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
                bridgechainRepository: 'https://github.com/arkecosystem/core.git',
                bridgechainAssetRepository: 'https://github.com/arkecosystem/core-assets.git'
              }
            })

            expect(wrapper.vm.isUpdate).toBe(false)
          })

          it('should return false if bridgechain prop is not set', () => {
            wrapper.setProps({
              bridgechain: null
            })

            expect(wrapper.vm.isUpdate).toBe(false)
          })
        })
      } else {
        describe('TransactionFormBridgechainUpdate', () => {
          it('should return true if bridgechain prop is set', () => {
            wrapper.setProps({
              bridgechain: {
                name: 'bridgechain',
                seedNodes: [
                  '1.1.1.1',
                  '2.2.2.2'
                ],
                ports: {
                  '@arkecosystem/core-api': 4003
                },
                genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
                bridgechainRepository: 'https://github.com/arkecosystem/core.git',
                bridgechainAssetRepository: 'https://github.com/arkecosystem/core-assets.git'
              }
            })

            expect(wrapper.vm.isUpdate).toBe(true)
          })

          it('should return false if bridgechain prop is not set', () => {
            wrapper.setProps({
              bridgechain: null
            })

            expect(wrapper.vm.isUpdate).toBe(false)
          })
        })
      }
    })

    describe('isFormValid', () => {
      it('should be true if seed nodes is valid on step 1', async () => {
        wrapper.vm.step = 1
        wrapper.vm.$v.form.seedNodes.$model = [
          { ip: '1.1.1.1', isInvalid: false }
        ]

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.isFormValid).toBe(true)
      })

      it('should be true if form is valid on step 2', async () => {
        wrapper.vm.step = 2
        wrapper.vm.$v.form.fee.$model = (0.1 * 1e8).toString()
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.$v.form.asset.name.$model = 'bridgechain'
        wrapper.vm.$v.form.asset.genesisHash.$model = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'
        wrapper.vm.form.asset.ports = {
          '@arkecosystem/core-api': 4003
        }
        wrapper.vm.$v.form.seedNodes.$model = [
          { ip: '1.1.1.1', isInvalid: false }
        ]
        wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'https://github.com/arkecosystem/core.git'
        wrapper.vm.$v.form.asset.bridgechainAssetRepository.$model = 'https://github.com/arkecosystem/core-assets.git'

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.isFormValid).toBe(true)
      })

      it('should be false if seed nodes is invalid on step 1', async () => {
        wrapper.vm.step = 1
        wrapper.vm.$v.form.seedNodes.$model = []

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.isFormValid).toBe(false)
      })

      it('should be false if form is invalid on step 2', async () => {
        wrapper.vm.step = 2
        wrapper.vm.$v.form.seedNodes.$model = []

        await wrapper.vm.$nextTick()

        expect(wrapper.vm.isFormValid).toBe(false)
      })
    })

    describe('nameError', () => {
      it('should return null if valid', () => {
        wrapper.vm.$v.form.asset.name.$model = 'test'

        expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(false)
        expect(wrapper.vm.nameError).toBe(null)
      })

      it('should return null if not dirty', () => {
        wrapper.vm.$v.form.asset.name.$model = ''
        wrapper.vm.$v.form.asset.name.$reset()

        expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(false)
        if (componentName === 'TransactionFormBridgechainRegistration') {
          expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(true)
        } else {
          expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(false)
        }
        expect(wrapper.vm.nameError).toBe(null)
      })

      if (componentName === 'TransactionFormBridgechainRegistration') {
        describe('TransactionFormBridgechainRegistration', () => {
          it('should return required if empty', () => {
            wrapper.vm.$v.form.asset.name.$model = ''

            expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true)
            expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(true)
            expect(wrapper.vm.nameError).toBe('VALIDATION.REQUIRED')
          })

          it('should not return error if shorter than max (40)', () => {
            wrapper.vm.$v.form.asset.name.$model = ''.padStart(30, 'a')

            expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true)
            expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(false)
            expect(wrapper.vm.nameError).not.toBe('VALIDATION.TOO_LONG')
          })

          it('should not return error if equal to max (40)', () => {
            wrapper.vm.$v.form.asset.name.$model = ''.padStart(40, 'a')

            expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true)
            expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(false)
            expect(wrapper.vm.nameError).not.toBe('VALIDATION.TOO_LONG')
          })

          it('should return error if longer than max (40)', () => {
            wrapper.vm.$v.form.asset.name.$model = ''.padStart(50, 'a')

            expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true)
            expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(true)
            expect(wrapper.vm.nameError).toBe('VALIDATION.TOO_LONG')
          })

          it('should not return error if valid', () => {
            wrapper.vm.$v.form.asset.name.$model = 'test'

            expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true)
            expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(false)
            expect(wrapper.vm.nameError).not.toBe('VALIDATION.NOT_VALID')
          })

          it('should return error if invalid', () => {
            wrapper.vm.$v.form.asset.name.$model = '$ARK'

            expect(wrapper.vm.$v.form.asset.name.$dirty).toBe(true)
            expect(wrapper.vm.$v.form.asset.name.$invalid).toBe(true)
            expect(wrapper.vm.nameError).toBe('VALIDATION.NOT_VALID')
          })
        })
      }
    })

    describe('seedNodeDisabled', () => {
      it('should be false if seed node not empty and no error', () => {
        wrapper.vm.$v.seedNode.$model = '5.5.5.5'

        expect(wrapper.vm.seedNodeDisabled).toBe(false)
      })

      it('should be true if seed node is empty', () => {
        wrapper.vm.$v.seedNode.$model = ''

        expect(wrapper.vm.seedNodeDisabled).toBe(true)
      })

      it('should be true if seed node is invalid', () => {
        wrapper.vm.$v.seedNode.$model = 'invalid seed node'

        expect(wrapper.vm.seedNodeDisabled).toBe(true)
      })
    })

    describe('hasSeedNodesError', () => {
      it('should be true if there is an invalid seed node', () => {
        wrapper.vm.invalidSeeds = [
          { ip: '0.5.5.5', isInvalid: true }
        ]

        expect(wrapper.vm.hasSeedNodesError).toBe(true)
      })

      it('should be false if there are less than maximum seed nodes', () => {
        wrapper.vm.$v.form.seedNodes.$model = [
          { ip: '0.5.5.5', isInvalid: false }
        ]

        expect(wrapper.vm.hasSeedNodesError).toBe(false)
      })

      it('should be true if there are more than maximum seed nodes', () => {
        wrapper.vm.$v.form.seedNodes.$model = [
          { ip: '0.5.5.5', isInvalid: false },
          { ip: '1.5.5.5', isInvalid: false },
          { ip: '2.5.5.5', isInvalid: false },
          { ip: '3.5.5.5', isInvalid: false },
          { ip: '4.5.5.5', isInvalid: false },
          { ip: '5.5.5.5', isInvalid: false },
          { ip: '6.5.5.5', isInvalid: false },
          { ip: '7.5.5.5', isInvalid: false },
          { ip: '8.5.5.5', isInvalid: false },
          { ip: '9.5.5.5', isInvalid: false },
          { ip: '10.5.5.5', isInvalid: false }
        ]

        expect(wrapper.vm.hasSeedNodesError).toBe(true)
      })
    })

    describe('seedNodeError', () => {
      it('should return null if valid', () => {
        wrapper.vm.$v.seedNode.$model = '5.5.5.5'

        expect(wrapper.vm.$v.seedNode.$dirty).toBe(true)
        expect(wrapper.vm.$v.seedNode.$invalid).toBe(false)
        expect(wrapper.vm.seedNodeError).toBe(null)
      })

      it('should return null if not dirty', () => {
        wrapper.vm.$v.seedNode.$model = ''
        wrapper.vm.$v.seedNode.$reset()

        expect(wrapper.vm.$v.seedNode.$dirty).toBe(false)
        expect(wrapper.vm.$v.seedNode.$invalid).toBe(false)
        expect(wrapper.vm.seedNodeError).toBe(null)
      })

      it('should return error if invalid', () => {
        wrapper.vm.$v.seedNode.$model = 'invalid seed node'

        expect(wrapper.vm.$v.seedNode.$dirty).toBe(true)
        expect(wrapper.vm.$v.seedNode.$invalid).toBe(true)
        expect(wrapper.vm.seedNodeError).toBe('VALIDATION.INVALID_SEED')
      })

      it('should return error if duplicate', () => {
        wrapper.vm.$v.form.seedNodes.$model = [
          { ip: '5.5.5.5', isInvalid: false }
        ]
        wrapper.vm.$v.seedNode.$model = '5.5.5.5'

        expect(wrapper.vm.$v.seedNode.$dirty).toBe(true)
        expect(wrapper.vm.$v.seedNode.$invalid).toBe(true)
        expect(wrapper.vm.seedNodeError).toBe('TRANSACTION.BRIDGECHAIN.ERROR_DUPLICATE')
      })
    })

    describe('genesisHashError', () => {
      it('should return null if valid', () => {
        wrapper.vm.$v.form.asset.genesisHash.$model = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'

        expect(wrapper.vm.$v.form.asset.genesisHash.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.genesisHash.$invalid).toBe(false)
        expect(wrapper.vm.genesisHashError).toBe(null)
      })

      it('should return null if not dirty', () => {
        wrapper.vm.$v.form.asset.genesisHash.$model = ''
        wrapper.vm.$v.form.asset.genesisHash.$reset()

        expect(wrapper.vm.$v.form.asset.genesisHash.$dirty).toBe(false)
        if (componentName === 'TransactionFormBridgechainRegistration') {
          expect(wrapper.vm.$v.form.asset.genesisHash.$invalid).toBe(true)
        } else {
          expect(wrapper.vm.$v.form.asset.genesisHash.$invalid).toBe(false)
        }
        expect(wrapper.vm.genesisHashError).toBe(null)
      })

      if (componentName === 'TransactionFormBridgechainRegistration') {
        describe('TransactionFormBridgechainRegistration', () => {
          it('should return error if invalid', () => {
            wrapper.vm.$v.form.asset.genesisHash.$model = '1234'

            expect(wrapper.vm.$v.form.asset.genesisHash.$dirty).toBe(true)
            expect(wrapper.vm.$v.form.asset.genesisHash.$invalid).toBe(true)
            expect(wrapper.vm.genesisHashError).toBe('VALIDATION.NOT_VALID')
          })
        })
      }
    })

    describe('bridgechainRepositoryError', () => {
      it('should return null if valid', () => {
        wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'https://github.com/arkecosystem/desktop-wallet.git'

        expect(wrapper.vm.$v.form.asset.bridgechainRepository.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.bridgechainRepository.$invalid).toBe(false)
        expect(wrapper.vm.bridgechainRepositoryError).toBe(null)
      })

      it('should return null if not dirty', () => {
        wrapper.vm.$v.form.asset.bridgechainRepository.$model = ''
        wrapper.vm.$v.form.asset.bridgechainRepository.$reset()

        expect(wrapper.vm.$v.form.asset.bridgechainRepository.$dirty).toBe(false)
        if (componentName === 'TransactionFormBridgechainRegistration') {
          expect(wrapper.vm.$v.form.asset.bridgechainRepository.$invalid).toBe(true)
        } else {
          expect(wrapper.vm.$v.form.asset.bridgechainRepository.$invalid).toBe(false)
        }

        expect(wrapper.vm.bridgechainRepositoryError).toBe(null)
      })

      if (componentName === 'TransactionFormBridgechainRegistration') {
        describe('TransactionFormBridgechainRegistration', () => {
          it('should not return error if longer than min (12)', () => {
            wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'http://github.com'

            expect(wrapper.vm.$v.form.asset.bridgechainRepository.$dirty).toBe(true)
            expect(wrapper.vm.$v.form.asset.bridgechainRepository.$invalid).toBe(false)
            expect(wrapper.vm.bridgechainRepositoryError).not.toBe('VALIDATION.TOO_SHORT')
          })

          it('should not return error if equal to min (12)', () => {
            wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'http://g.com'

            expect(wrapper.vm.$v.form.asset.bridgechainRepository.$dirty).toBe(true)
            expect(wrapper.vm.$v.form.asset.bridgechainRepository.$invalid).toBe(false)
            expect(wrapper.vm.bridgechainRepositoryError).not.toBe('VALIDATION.TOO_SHORT')
          })

          it('should return error if shorter than min (12)', () => {
            wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'ftp://g.co'

            expect(wrapper.vm.$v.form.asset.bridgechainRepository.$dirty).toBe(true)
            expect(wrapper.vm.$v.form.asset.bridgechainRepository.$invalid).toBe(true)
            expect(wrapper.vm.bridgechainRepositoryError).toBe('VALIDATION.TOO_SHORT')
          })

          it('should not return error if valid', () => {
            wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'https://github.com/arkecosystem/desktop-wallet.git'

            expect(wrapper.vm.$v.form.asset.bridgechainRepository.$dirty).toBe(true)
            expect(wrapper.vm.$v.form.asset.bridgechainRepository.$invalid).toBe(false)
            expect(wrapper.vm.bridgechainRepositoryError).not.toBe('VALIDATION.INVALID_URL')
          })

          it('should return error if invalid', () => {
            wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'https://github/arkecosystem/desktop-wallet.git'

            expect(wrapper.vm.$v.form.asset.bridgechainRepository.$dirty).toBe(true)
            expect(wrapper.vm.$v.form.asset.bridgechainRepository.$invalid).toBe(true)
            expect(wrapper.vm.bridgechainRepositoryError).toBe('VALIDATION.INVALID_URL')
          })
        })
      }
    })

    describe('bridgechainAssetRepositoryError', () => {
      it('should return null if valid', () => {
        wrapper.vm.$v.form.asset.bridgechainAssetRepository.$model = 'https://github.com/arkecosystem/desktop-wallet.git'

        expect(wrapper.vm.$v.form.asset.bridgechainAssetRepository.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.asset.bridgechainAssetRepository.$invalid).toBe(false)
        expect(wrapper.vm.bridgechainAssetRepositoryError).toBe(null)
      })

      it('should return null if not dirty', () => {
        wrapper.vm.$v.form.asset.bridgechainAssetRepository.$model = ''
        wrapper.vm.$v.form.asset.bridgechainAssetRepository.$reset()

        expect(wrapper.vm.$v.form.asset.bridgechainAssetRepository.$dirty).toBe(false)
        expect(wrapper.vm.$v.form.asset.bridgechainAssetRepository.$invalid).toBe(false)
        expect(wrapper.vm.bridgechainAssetRepositoryError).toBe(null)
      })

      if (componentName === 'TransactionFormBridgechainRegistration') {
        describe('TransactionFormBridgechainRegistration', () => {
          it('should not return error if valid', () => {
            wrapper.vm.$v.form.asset.bridgechainAssetRepository.$model = 'https://github.com/arkecosystem/desktop-wallet.git'

            expect(wrapper.vm.$v.form.asset.bridgechainAssetRepository.$dirty).toBe(true)
            expect(wrapper.vm.$v.form.asset.bridgechainAssetRepository.$invalid).toBe(false)
            expect(wrapper.vm.bridgechainAssetRepositoryError).not.toBe('VALIDATION.INVALID_URL')
          })

          it('should return error if invalid', () => {
            wrapper.vm.$v.form.asset.bridgechainAssetRepository.$model = 'https://github/arkecosystem/desktop-wallet.git'

            expect(wrapper.vm.$v.form.asset.bridgechainAssetRepository.$dirty).toBe(true)
            expect(wrapper.vm.$v.form.asset.bridgechainAssetRepository.$invalid).toBe(true)
            expect(wrapper.vm.bridgechainAssetRepositoryError).toBe('VALIDATION.INVALID_URL')
          })
        })
      }
    })

    describe('apiPortError', () => {
      it('should return null if valid', () => {
        wrapper.vm.$v.form.apiPort.$model = 4003

        expect(wrapper.vm.$v.form.apiPort.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.apiPort.$invalid).toBe(false)
        expect(wrapper.vm.apiPortError).toBe(null)
      })

      it('should return null if not dirty', () => {
        wrapper.vm.$v.form.apiPort.$model = ''
        wrapper.vm.$v.form.apiPort.$reset()

        expect(wrapper.vm.$v.form.apiPort.$dirty).toBe(false)
        expect(wrapper.vm.$v.form.apiPort.$invalid).toBe(true)
        expect(wrapper.vm.apiPortError).toBe(null)
      })

      it('should return error if empty', () => {
        wrapper.vm.$v.form.apiPort.$model = ''

        expect(wrapper.vm.$v.form.apiPort.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.apiPort.$invalid).toBe(true)
        expect(wrapper.vm.apiPortError).toBe('VALIDATION.REQUIRED')
      })

      it('should return error if not numeric', () => {
        wrapper.vm.$v.form.apiPort.$model = 'test'

        expect(wrapper.vm.$v.form.apiPort.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.apiPort.$invalid).toBe(true)
        expect(wrapper.vm.apiPortError).toBe('VALIDATION.NOT_NUMERIC')
      })

      it('should return error if not valid port', () => {
        wrapper.vm.$v.form.apiPort.$model = '9999999'

        expect(wrapper.vm.$v.form.apiPort.$dirty).toBe(true)
        expect(wrapper.vm.$v.form.apiPort.$invalid).toBe(true)
        expect(wrapper.vm.apiPortError).toBe('VALIDATION.INVALID_PORT')
      })
    })
  })

  describe('methods', () => {
    describe('getTransactionData', () => {
      it('should return correct data with passphrase', () => {
        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.$v.form.asset.name.$model = 'bridgechain'
        wrapper.vm.$v.form.asset.genesisHash.$model = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'
        wrapper.vm.$v.form.seedNodes.$model = [
          { ip: '1.1.1.1', isInvalid: false },
          { ip: '2.2.2.2', isInvalid: false }
        ]
        wrapper.vm.form.asset.ports = {
          '@arkecosystem/core-api': 4003
        }
        wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'https://github.com/arkecosystem/core.git'
        wrapper.vm.$v.form.asset.bridgechainAssetRepository.$model = 'https://github.com/arkecosystem/core-assets.git'

        let expectedAsset = {
          name: 'bridgechain',
          seedNodes: [
            '1.1.1.1',
            '2.2.2.2'
          ],
          ports: {
            '@arkecosystem/core-api': 4003
          },
          genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
          bridgechainRepository: 'https://github.com/arkecosystem/core.git',
          bridgechainAssetRepository: 'https://github.com/arkecosystem/core-assets.git'
        }

        if (componentName === 'TransactionFormBridgechainUpdate') {
          expectedAsset = {
            bridgechainId: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'
          }
        }

        expect(wrapper.vm.getTransactionData()).toEqual({
          address: 'address-1',
          asset: expectedAsset,
          passphrase: 'passphrase',
          fee: new BigNumber(0.1 * 1e8),
          wif: undefined,
          networkWif: 170,
          multiSignature: undefined
        })
      })

      it('should return correct data with passphrase and second passphrase', () => {
        createWrapper(component, {
          address: 'address-1',
          passphrase: null,
          secondPublicKey: Identities.PublicKey.fromPassphrase('second passphrase')
        })

        wrapper.vm.$v.form.fee.$model = 0.1
        wrapper.vm.$v.form.passphrase.$model = 'passphrase'
        wrapper.vm.$v.form.secondPassphrase.$model = 'second passphrase'
        wrapper.vm.$v.form.asset.name.$model = 'bridgechain'
        wrapper.vm.$v.form.asset.genesisHash.$model = '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'
        wrapper.vm.$v.form.seedNodes.$model = [
          { ip: '1.1.1.1', isInvalid: false },
          { ip: '2.2.2.2', isInvalid: false }
        ]
        wrapper.vm.form.asset.ports = {
          '@arkecosystem/core-api': 4003
        }
        wrapper.vm.$v.form.asset.bridgechainRepository.$model = 'https://github.com/arkecosystem/core.git'
        wrapper.vm.$v.form.asset.bridgechainAssetRepository.$model = 'https://github.com/arkecosystem/core-assets.git'

        let expectedAsset = {
          name: 'bridgechain',
          seedNodes: [
            '1.1.1.1',
            '2.2.2.2'
          ],
          ports: {
            '@arkecosystem/core-api': 4003
          },
          genesisHash: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867',
          bridgechainRepository: 'https://github.com/arkecosystem/core.git',
          bridgechainAssetRepository: 'https://github.com/arkecosystem/core-assets.git'
        }

        if (componentName === 'TransactionFormBridgechainUpdate') {
          expectedAsset = {
            bridgechainId: '2a44f340d76ffc3df204c5f38cd355b7496c9065a1ade2ef92071436bd72e867'
          }
        }

        expect(wrapper.vm.getTransactionData()).toEqual({
          address: 'address-1',
          asset: expectedAsset,
          passphrase: 'passphrase',
          secondPassphrase: 'second passphrase',
          fee: new BigNumber(0.1 * 1e8),
          wif: undefined,
          networkWif: 170,
          multiSignature: undefined
        })
      })
    })

    describe('buildTransaction', () => {
      it('should build bridgechain update', async () => {
        const transactionData = {
          type: 2,
          typeGroup: 2
        }

        const response = await wrapper.vm.buildTransaction(transactionData, true, true)

        if (componentName === 'TransactionFormBridgechainRegistration') {
          expect(wrapper.vm.$client.buildBridgechainRegistration).toHaveBeenCalledWith(transactionData, true, true)
        } else {
          expect(wrapper.vm.$client.buildBridgechainUpdate).toHaveBeenCalledWith(transactionData, true, true)
        }
        expect(response).toBe(transactionData)
      })

      it('should build bridgechain update with default arguments', async () => {
        const transactionData = {
          type: 2,
          typeGroup: 2
        }

        const response = await wrapper.vm.buildTransaction(transactionData)

        if (componentName === 'TransactionFormBridgechainRegistration') {
          expect(wrapper.vm.$client.buildBridgechainRegistration).toHaveBeenCalledWith(transactionData, false, false)
        } else {
          expect(wrapper.vm.$client.buildBridgechainUpdate).toHaveBeenCalledWith(transactionData, false, false)
        }
        expect(response).toBe(transactionData)
      })
    })

    describe('transactionError', () => {
      it('should generate transaction error', () => {
        wrapper.vm.transactionError()

        if (componentName === 'TransactionFormBridgechainRegistration') {
          expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.BRIDGECHAIN_REGISTRATION')
        } else {
          expect(wrapper.vm.$error).toHaveBeenCalledWith('TRANSACTION.ERROR.VALIDATION.BRIDGECHAIN_UPDATE')
        }
      })
    })

    describe('previousStep', () => {
      it('should go from step 2 to step 1', () => {
        wrapper.vm.step = 2

        wrapper.vm.previousStep()

        expect(wrapper.vm.step).toBe(1)
      })

      it('should do nothing on step 1', () => {
        wrapper.vm.step = 1

        wrapper.vm.previousStep()

        expect(wrapper.vm.step).toBe(1)
      })
    })

    describe('nextStep', () => {
      it('should go from step 1 to step 2', () => {
        wrapper.vm.step = 1

        wrapper.vm.nextStep()

        expect(wrapper.vm.step).toBe(2)
      })

      it('should submit form data on step 2', async () => {
        const spy = jest.spyOn(wrapper.vm, 'onSubmit').mockImplementation()
        const validateSeedsSpy = jest.spyOn(wrapper.vm, 'validateSeeds').mockImplementation()

        wrapper.vm.step = 2

        await wrapper.vm.$nextTick()

        await wrapper.vm.nextStep()

        expect(validateSeedsSpy).toHaveBeenCalledTimes(1)
        expect(wrapper.vm.invalidSeeds.length).toBe(0)
        expect(spy).toHaveBeenCalledTimes(1)
      })
    })

    describe('addSeedNode', () => {
      it('should add current seed to list', async () => {
        wrapper.vm.$v.form.seedNodes.$model = []
        wrapper.vm.$v.seedNode.$model = '5.5.5.5'

        await wrapper.vm.$nextTick()

        wrapper.vm.addSeedNode()

        expect(wrapper.vm.$v.form.seedNodes.$model).toEqual([{ ip: '5.5.5.5', isInvalid: false }])
      })

      it('should reset current seed', async () => {
        wrapper.vm.$v.seedNode.$model = '7.7.7.7'

        await wrapper.vm.$nextTick()

        wrapper.vm.addSeedNode()

        expect(wrapper.vm.$v.seedNode.$model).toBe('')
      })

      it('should do nothing if invalid seed', async () => {
        wrapper.vm.$v.form.seedNodes.$model = []
        wrapper.vm.$v.seedNode.$model = 'invalid seed'

        await wrapper.vm.$nextTick()

        wrapper.vm.addSeedNode()

        expect(wrapper.vm.$v.form.seedNodes.$model).toEqual([])
      })
    })

    describe('emitRemoveSeedNode', () => {
      it('should remove seed at index', () => {
        wrapper.vm.$v.form.seedNodes.$model = [
          { ip: '5.5.5.5', isInvalid: false },
          { ip: '6.6.6.6', isInvalid: false },
          { ip: '7.7.7.7', isInvalid: false }
        ]

        wrapper.vm.emitRemoveSeedNode(1)

        expect(wrapper.vm.$v.form.seedNodes.$model).toEqual([
          { ip: '5.5.5.5', isInvalid: false },
          { ip: '7.7.7.7', isInvalid: false }
        ])
      })

      it('should do nothing if index does not exist', () => {
        const seeds = [
          { ip: '5.5.5.5', isInvalid: false },
          { ip: '6.6.6.6', isInvalid: false }
        ]

        wrapper.vm.$v.form.seedNodes.$model = seeds

        wrapper.vm.emitRemoveSeedNode(3)

        expect(wrapper.vm.$v.form.seedNodes.$model).toBe(seeds)
      })
    })
  })
})
