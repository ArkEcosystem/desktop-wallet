import { Action } from '@/services/synchronizer/wallets'

describe('Services > Synchronizer > Wallets', () => {
  let action
  let wallets
  let contacts
  let walletUpdate
  let transactionDeleteBulk
  const throwError = jest.fn()

  beforeEach(() => {
    walletUpdate = jest.fn()
    transactionDeleteBulk = jest.fn()
    const synchronizer = {
      $client: {},
      scope: {
        $logger: {
          error: throwError
        },
        $error: jest.fn(),
        $success: jest.fn()
      },
      $store: {
        getters: {
          'wallet/byProfileId': jest.fn(),
          'wallet/contactsByProfileId': jest.fn(),
          'ledger/wallets': []
        },
        dispatch: (action, data) => {
          if (action === 'wallet/update' || action === 'ledger/updateWallet') {
            if (data.throwError) {
              throw new Error('throw error')
            }

            return walletUpdate(action, data)
          } else if (action === 'transaction/deleteBulk') {
            return transactionDeleteBulk(action, data)
          } else if (action === 'transaction/clearExpired') {
            return []
          }
        }
      }
    }

    action = new Action(synchronizer)

    wallets = [
      { address: 'A1', transactions: {} },
      { address: 'A2', transactions: {} },
      { address: 'A3', transactions: {} },
      { address: 'A4', transactions: {} }
    ]
    contacts = [
      { address: 'Acon1', transactions: {} },
      { address: 'Acon2', transactions: {} }
    ]
  })

  describe('run', () => {
    beforeEach(() => {
      action.refresh = jest.fn()
    })

    describe('when there is not a session profile', () => {
      beforeEach(() => {
        action.$scope.session_profile = undefined
      })

      it('should do nothing', async () => {
        await action.run()
        expect(action.$getters['wallet/byProfileId']).not.toHaveBeenCalled()
        expect(action.$getters['wallet/contactsByProfileId']).not.toHaveBeenCalled()
      })
    })

    describe('when there is a session profile', () => {
      beforeEach(() => {
        action.$scope.session_profile = { id: 'profile ID' }
      })

      describe('when the the profile does not have wallets', () => {
        beforeEach(() => {
          action.$getters['wallet/byProfileId'].mockReturnValue([])
          action.$getters['wallet/contactsByProfileId'].mockReturnValue([])
        })

        it('should not try to refresh them', async () => {
          await action.run()
          expect(action.refresh).not.toHaveBeenCalled()
        })
      })

      describe('when the the profile has wallets', () => {
        beforeEach(() => {
          action.$getters['wallet/byProfileId'].mockReturnValue(wallets)
          action.$getters['wallet/contactsByProfileId'].mockReturnValue(contacts)
        })

        describe('when none of them have been checked', () => {
          it('should refresh all', async () => {
            await action.run()
            expect(action.refresh).toHaveBeenCalledWith([
              ...wallets,
              ...contacts
            ])
          })
        })

        describe('when some of them have been checked', () => {
          beforeEach(() => {
            action.checked = [
              wallets[0],
              wallets[2],
              contacts[0]
            ]
          })

          it('should refresh those that have not been checked', async () => {
            await action.run()
            expect(action.refresh).toHaveBeenCalledWith([
              wallets[1],
              wallets[3],
              contacts[1]
            ])
          })
        })
      })
    })
  })

  describe('refresh', () => {
    beforeEach(() => {
      action.processWalletData = jest.fn()
      action.refreshTransactions = jest.fn()
      action.$client.fetchWallets = jest.fn()
    })

    it('should refresh each wallet', async () => {
      action.$client.fetchWallets.mockImplementation(addresses => {
        return wallets
      })

      await action.refresh(wallets)

      wallets.forEach(wallet => {
        expect(action.processWalletData).toHaveBeenCalledWith(wallet, wallet)
      })
    })

    it('should not refresh wallet if empty or cold response', async () => {
      const coldWallet = { ...wallets[0], balance: 0, publicKey: null }
      action.$client.fetchWallets.mockImplementation(addresses => {
        return [
          coldWallet,
          {},
          null,
          wallets[2]
        ]
      })

      await action.refresh(wallets)

      expect(action.processWalletData).toHaveBeenCalledWith(wallets[2], wallets[2])
      expect(action.processWalletData).not.toHaveBeenCalledWith(wallets[0], coldWallet)
    })

    it('should update transactions when finished', async () => {
      action.$client.fetchWallets.mockImplementation(addresses => {
        return wallets
      })

      await action.refresh(wallets)

      expect(action.refreshTransactions).toHaveBeenCalledWith(wallets)
    })
  })

  describe('processWalletData', () => {
    let wallet

    beforeEach(() => {
      wallet = wallets[2]

      action.$client.fetchWallets = jest.fn()
      action.refreshTransactions = jest.fn()
    })

    describe('when there is wallet data', () => {
      it('should dispatch the `wallet/update` Vuex action with the updated wallet', async () => {
        await action.processWalletData(wallet, { balance: 10 })
        expect(walletUpdate).toHaveBeenNthCalledWith(1, 'wallet/update', { ...wallet, balance: 10 })
      })

      it('should log if error in `wallet/update` Vuex action', async () => {
        wallet = { ...wallet, throwError: true }
        await action.processWalletData(wallet, { balance: 11 })
        expect(throwError).toHaveBeenNthCalledWith(1, 'throw error')
      })

      it('should dispatch the `ledger/updateWallet` Vuex action with the updated wallet', async () => {
        const ledgerWallet = { ...wallet, isLedger: true }
        await action.processWalletData(ledgerWallet, { balance: 12 })
        expect(walletUpdate).toHaveBeenNthCalledWith(1, 'ledger/updateWallet', { ...ledgerWallet, balance: 12 })
      })

      it('should log if error in `ledger/updateWallet` Vuex action', async () => {
        const ledgerWallet = { ...wallet, isLedger: true, throwError: true }
        await action.processWalletData(ledgerWallet, { balance: 13 })
        expect(throwError).toHaveBeenNthCalledWith(1, 'throw error')
      })
    })
  })

  describe('refreshTransactions', () => {
    let wallet
    const transactions = [
      { id: 'tx1', timestamp: 300 * 1000 },
      { id: 'tx2', timestamp: 400 * 1000 },
      { id: 'tx3', timestamp: 200 * 1000 },
      { id: 'tx4', timestamp: 110 * 1000 }
    ]

    beforeEach(() => {
      wallet = wallets[2]

      action.$client.fetchTransactionsForWallets = jest.fn()
      action.processWalletTransactions = jest.fn()
      action.displayNewTransaction = jest.fn()
    })

    it('should fetch the transactions of all wallets', async () => {
      action.$client.fetchTransactionsForWallets.mockImplementation(addresses => {
        return {}
      })

      await action.refreshTransactions(wallets)
      expect(action.$client.fetchTransactionsForWallets).toHaveBeenCalledWith(wallets.map(wallet => wallet.address))
    })

    describe('when there are no transactions', () => {
      beforeEach(() => {
        action.$client.fetchTransactionsForWallets.mockImplementation(addresses => {
          if (addresses.includes(wallet.address)) {
            const response = {}
            response[wallet.address] = []

            return response
          }

          return {}
        })
      })

      it('should not call processWalletTransactions', async () => {
        await action.refreshTransactions(wallets)

        wallets.forEach(walletCheck => {
          if (walletCheck.address === wallet.address) {
            expect(action.processWalletTransactions).toHaveBeenCalledWith(walletCheck, [])
          } else {
            expect(action.processWalletTransactions).not.toHaveBeenCalledWith(walletCheck, [])
          }
        })
      })

      it('should not dispatch the `update/wallet` Vuex action', async () => {
        await action.refreshTransactions(wallets)
        expect(walletUpdate).not.toHaveBeenCalled()
      })

      it('should not dispatch the `transaction/deleteBulk` Vuex action', async () => {
        await action.refreshTransactions(wallets)
        expect(transactionDeleteBulk).not.toHaveBeenCalled()
      })
    })

    describe('when there are transactions', () => {
      beforeEach(() => {
        action.$client.fetchTransactionsForWallets.mockImplementation(addresses => {
          if (addresses.includes(wallet.address)) {
            const response = {}
            response[wallet.address] = transactions

            return response
          }

          return {}
        })
      })

      it('should call processWalletTransactions', async () => {
        await action.refreshTransactions(wallets)

        wallets.forEach(walletCheck => {
          if (walletCheck.address === wallet.address) {
            expect(action.processWalletTransactions).toHaveBeenCalledWith(walletCheck, transactions)
          } else {
            expect(action.processWalletTransactions).not.toHaveBeenCalledWith(walletCheck, transactions)
          }
        })
      })
    })
  })

  describe('processWalletTransactions', () => {
    let wallet
    const transactions = [
      { id: 'tx1', timestamp: 300 * 1000 },
      { id: 'tx2', timestamp: 400 * 1000 },
      { id: 'tx3', timestamp: 200 * 1000 },
      { id: 'tx4', timestamp: 110 * 1000 }
    ]

    beforeEach(() => {
      wallet = wallets[2]

      action.displayNewTransaction = jest.fn()
    })

    describe('when there are no transactions', () => {
      it('should not dispatch the `update/wallet` Vuex action', async () => {
        await action.processWalletTransactions(wallet, [])
        expect(walletUpdate).not.toHaveBeenCalled()
      })

      it('should not dispatch the `transaction/deleteBulk` Vuex action', async () => {
        await action.processWalletTransactions(wallet, [])
        expect(transactionDeleteBulk).not.toHaveBeenCalled()
      })
    })

    describe('when there are transactions', () => {
      describe('when all of them are old', () => {
        beforeEach(() => {
          wallet.transactions.checkedAt = 50000 * 1000
        })

        it('should not dispatch the `update/wallet` Vuex action', async () => {
          await action.processWalletTransactions(wallet, transactions)
          expect(walletUpdate).not.toHaveBeenCalled()
        })

        it('should dispatch the `transaction/deleteBulk` Vuex action', async () => {
          await action.processWalletTransactions(wallet, transactions)
          expect(transactionDeleteBulk).toHaveBeenCalledTimes(1)
        })

        it('should not display the new transaction', async () => {
          await action.processWalletTransactions(wallet, transactions)
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
          await action.processWalletTransactions(wallet, transactions)
          expect(walletUpdate).toHaveBeenCalledWith('wallet/update', {
            ...wallet,
            transactions: {
              checkedAt: latestTransaction.timestamp
            }
          })
        })

        it('should display the new transaction', async () => {
          await action.processWalletTransactions(wallet, transactions)
          expect(action.displayNewTransaction).toHaveBeenCalledWith(latestTransaction, wallet)
        })
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
