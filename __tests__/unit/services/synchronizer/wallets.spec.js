import { Action } from '@/services/synchronizer/wallets'

describe('Services > Synchronizer > Wallets', () => {
  let action
  let wallets

  beforeEach(() => {
    const synchronizer = {
      $client: {},
      scope: {
        $logger: {
          error: jest.fn()
        },
        $error: jest.fn(),
        $success: jest.fn()
      },
      $store: {
        getters: {
          'wallet/byProfileId': jest.fn()
        },
        dispatch: jest.fn()
      }
    }

    action = new Action(synchronizer)

    wallets = [
      { address: 'A1', transactions: {} },
      { address: 'A2', transactions: {} },
      { address: 'A3', transactions: {} },
      { address: 'A4', transactions: {} }
    ]
  })

  describe('run', () => {
    beforeEach(() => {
      action.refreshWallets = jest.fn()
    })

    describe('when there is not a session profile', () => {
      beforeEach(() => {
        action.$scope.session_profile = undefined
      })

      it('should do nothing', async () => {
        await action.run()
        expect(action.$getters['wallet/byProfileId']).not.toHaveBeenCalled()
      })
    })

    describe('when there is a session profile', () => {
      beforeEach(() => {
        action.$scope.session_profile = { id: 'profile ID' }
      })

      describe('when the the profile does not have wallets', () => {
        beforeEach(() => {
          action.$getters['wallet/byProfileId'].mockReturnValue([])
        })

        it('should not try to refresh them', async () => {
          await action.run()
          expect(action.refreshWallets).not.toHaveBeenCalled()
        })
      })

      describe('when the the profile has wallets', () => {
        beforeEach(() => {
          action.$getters['wallet/byProfileId'].mockReturnValue(wallets)
        })

        describe('when none of them have been checked', () => {
          it('should refresh all', async () => {
            await action.run()
            expect(action.refreshWallets).toHaveBeenCalledWith(wallets)
          })
        })

        describe('when some of them have been checked', () => {
          beforeEach(() => {
            action.checked = [
              wallets[0],
              wallets[2]
            ]
          })

          it('should refresh those that have not been checked', async () => {
            await action.run()
            expect(action.refreshWallets).toHaveBeenCalledWith([
              wallets[1],
              wallets[3]
            ])
          })
        })
      })
    })
  })

  describe('refreshWallets', () => {
    beforeEach(() => {
      action.refreshWallet = jest.fn()
    })

    it('should refresh each wallet', async () => {
      await action.refreshWallets(wallets)

      wallets.forEach(wallet => {
        expect(action.refreshWallet).toHaveBeenCalledWith(wallet)
      })
    })

    xit('should wait until all wallets have been updated', () => {
    })
  })

  describe('refreshWallet', () => {
    let wallet

    beforeEach(() => {
      wallet = wallets[2]

      action.$client.fetchWallet = jest.fn()
      action.fetchWalletTransactions = jest.fn()
    })

    it('should fetch the wallet address data', async () => {
      await action.refreshWallet(wallet)
      expect(action.$client.fetchWallet).toHaveBeenCalledWith(wallet.address)
    })

    describe('when there is not wallet data', () => {
      beforeEach(() => {
        action.$client.fetchWallet.mockImplementation(() => null)
      })

      it('should not dispatch the `wallet/update` Vuex action with the updated wallet', async () => {
        await action.refreshWallet(wallet)
        expect(action.$dispatch).not.toHaveBeenCalled()
      })
    })

    describe('when there is wallet data', () => {
      const newData = {
        field: 'other'
      }

      beforeEach(() => {
        action.$client.fetchWallet.mockImplementation(address => {
          if (address === wallet.address) {
            return newData
          }
        })
      })

      it('should dispatch the `wallet/update` Vuex action with the updated wallet', async () => {
        await action.refreshWallet(wallet)
        expect(action.$dispatch).toHaveBeenCalledWith('wallet/update', {
          ...wallet,
          ...newData
        })
      })

      it('should fetch the transactions of the updated wallet', async () => {
        await action.refreshWallet(wallet)
        expect(action.fetchWalletTransactions).toHaveBeenCalledWith({
          ...wallet,
          ...newData
        })
      })
    })

    xdescribe('when there is an Error', () => {
      it('should not propagate it', () => {
      })

      it('should log it', () => {
      })
    })
  })

  describe('fetchWalletTransactions', () => {
    let wallet
    const transactions = [
      { id: 'tx1', timestamp: 300 * 1000 },
      { id: 'tx2', timestamp: 400 * 1000 },
      { id: 'tx3', timestamp: 200 * 1000 },
      { id: 'tx4', timestamp: 110 * 1000 }
    ]

    beforeEach(() => {
      wallet = wallets[2]

      action.$client.fetchWalletTransactions = jest.fn()
      action.displayNewTransaction = jest.fn()
    })

    it('should fetch the transactions of the wallet', async () => {
      await action.fetchWalletTransactions(wallet)
      expect(action.$client.fetchWalletTransactions).toHaveBeenCalledWith(wallet.address)
    })

    describe('when there are not transactions', () => {
      beforeEach(() => {
        action.$client.fetchWalletTransactions.mockImplementation(address => {
          if (address === wallet.address) {
            return { transactions: [], totalCount: 0 }
          }
        })
      })

      it('should not dispatch the `update/wallet` Vuex action', async () => {
        await action.fetchWalletTransactions(wallet)
        expect(action.$dispatch).not.toHaveBeenCalled()
      })
    })

    describe('when there are transactions', () => {
      beforeEach(() => {
        action.$client.fetchWalletTransactions.mockImplementation(address => {
          if (address === wallet.address) {
            return { transactions, totalCount: transactions.length }
          }
        })
      })

      describe('when all of them are old', () => {
        beforeEach(() => {
          wallet.transactions.checkedAt = 50000 * 1000
        })

        it('should not dispatch the `update/wallet` Vuex action', async () => {
          await action.fetchWalletTransactions(wallet)
          expect(action.$dispatch).not.toHaveBeenCalled()
        })

        it('should not display the new transaction', async () => {
          await action.fetchWalletTransactions(wallet)
          expect(action.displayNewTransaction).not.toHaveBeenCalled()
        })
      })

      describe('when at least 1 of them is new', () => {
        let latestTransaction

        beforeEach(() => {
          latestTransaction = transactions[1]
          wallet.transactions.checkedAt = latestTransaction.timestamp - 10
        })

        it('should dispatch the `update/wallet` Vuex action with the new `transactions.checkedAt` numeric timestamp', async () => {
          await action.fetchWalletTransactions(wallet)
          expect(action.$dispatch).toHaveBeenCalledWith('wallet/update', {
            ...wallet,
            transactions: {
              checkedAt: latestTransaction.timestamp
            }
          })
        })

        it('should display the new transaction', async () => {
          await action.fetchWalletTransactions(wallet)
          expect(action.displayNewTransaction).toHaveBeenCalledWith(latestTransaction)
        })
      })
    })

    xdescribe('when there is an Error', () => {
      it('should not propagate it', () => {
      })

      it('should log it', () => {
      })
    })
  })

  describe('findLatestTransaction', () => {
    it('returns the transaction with bigger `timestamp`', () => {
      const transactions = [
        { id: 'tx1', timestamp: 300 * 1000 },
        { id: 'tx2', timestamp: 400 * 1000 },
        { id: 'tx3', timestamp: 200 * 1000 },
        { id: 'tx4', timestamp: 110 * 1000 }
      ]

      expect(action.findLatestTransaction(transactions)).toBe(transactions[1])
    })
  })
})
