import { shallowMount } from '@vue/test-utils'
import useI18nGlobally from '../../__utils__/i18n'
import { DashboardTransactions } from '@/components/Dashboard'

const i18n = useI18nGlobally()
let wrapper
let wallets
let transactions
let walletTransactions
let fetchTransactionsForWallets
const loggerError = jest.fn()
const alertError = jest.fn()
const transactionByProfileId = jest.fn(() => 'profileId')
const walletByProfileId = jest.fn(() => wallets)
let mocks

beforeEach(() => {
  transactions = [
    { id: 'tx1', timestamp: 300 * 1000 },
    { id: 'tx2', timestamp: 400 * 1000 },
    { id: 'tx3', timestamp: 200 * 1000 },
    { id: 'tx4', timestamp: 110 * 1000 },
    { id: 'tx5', timestamp: 120 * 1000 }
  ]
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

  describe('processTransactions', () => {
    it('should remove duplicate transactions', () => {
      const toProcess = [
        ...transactions,
        transactions[0],
        transactions[2]
      ]
      expect(wrapper.vm.processTransactions(toProcess)).toIncludeSameMembers(transactions)
    })

    it('should sort transactions by `timestamp` descently', () => {
      expect(wrapper.vm.processTransactions(transactions)).toEqual([
        transactions[1],
        transactions[0],
        transactions[2],
        transactions[4],
        transactions[3]
      ])
    })
  })
})
