import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import { DashboardTransactions } from '@/components/Dashboard'

const i18n = useI18nGlobally()
let wrapper
let wallets
const transactions = [
  { id: 'tx1', timestamp: 300 * 1000 },
  { id: 'tx2', timestamp: 400 * 1000 },
  { id: 'tx3', timestamp: 200 * 1000 },
  { id: 'tx4', timestamp: 110 * 1000 },
  { id: 'tx5', timestamp: 120 * 1000 }
]
let walletTransactions
let fetchTransactionsForWallets
const loggerError = jest.fn()
const alertError = jest.fn()
const transactionByProfileId = jest.fn(() => 'profileId')
const walletByProfileId = jest.fn(() => wallets)
let mocks

beforeEach(() => {
  wallets = [
    { address: 'A1', transactions: {} },
    { address: 'A2', transactions: {} },
    { address: 'A3', transactions: {} },
    { address: 'A4', transactions: {} }
  ]
  walletTransactions = {
    A1: [
      transactions[0],
      transactions[1]
    ],
    A2: [
      transactions[2]
    ],
    A4: [
      transactions[3],
      transactions[4]
    ]
  }
  fetchTransactionsForWallets = jest.fn(() => walletTransactions)
  // walletByProfileId = jest.fn(() => wallets)
  mocks = {
    $client: {
      fetchTransactionsForWallets
    },
    $error: alertError,
    $logger: {
      error: loggerError
    },
    $store: {
      getters: {
        'transaction/byProfileId': transactionByProfileId,
        'wallet/byProfileId': walletByProfileId,
        'ledger/wallets': []
      }
    }
  }
  wrapper = shallowMount(DashboardTransactions, {
    i18n,
    mocks
  })
})

describe('DashboardTransactions', () => {
  it('should render modal', () => {
    expect(wrapper.isVueInstance()).toBeTrue()
  })

  describe('fetchTransactions', () => {
    it('should not run if no wallets', () => {
      wallets = []
      mocks.$client.fetchTransactionsForWallets = jest.fn(() => [])
      wrapper = shallowMount(DashboardTransactions, {
        i18n,
        mocks
      })

      wrapper.vm.fetchTransactions()
      expect(mocks.$client.fetchTransactionsForWallets).not.toHaveBeenCalled()
    })
    it('should fetch transactions for wallets', () => {
      wrapper.vm.fetchTransactions()
      expect(fetchTransactionsForWallets).toHaveBeenNthCalledWith(1, wallets.map(wallet => wallet.address))
    })

    it('should consolidate transactions', () => {
      wrapper.vm.fetchTransactions()
      expect(wrapper.vm.fetchedTransactions).toIncludeAllMembers(transactions)
    })

    it('should remove duplicate transactions', () => {
      walletTransactions['A1'].push(transactions[0])
      wrapper.vm.fetchTransactions()
      expect(walletTransactions['A1'].filter(tx => tx.id === 'tx1')).toBeArrayOfSize(2)
      expect(wrapper.vm.fetchedTransactions.filter(tx => tx.id === 'tx1')).toBeArrayOfSize(1)
    })

    it('should log error and show alert message', () => {
      fetchTransactionsForWallets.mockImplementation(() => {
        throw new Error('throw error')
      })
      wrapper.vm.fetchTransactions()
      expect(loggerError).toHaveBeenCalledWith(new Error('throw error'))
      expect(alertError).toHaveBeenCalledWith(i18n.t('COMMON.FAILED_FETCH', {
        name: 'transactions',
        msg: 'throw error'
      }))
    })
  })
})
