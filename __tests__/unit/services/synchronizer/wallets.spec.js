import { Action } from '@/services/synchronizer/wallets'

describe('Services > Synchronizer > Wallets', () => {
  let action
  let wallets
  let addresses
  let contacts
  let walletUpdate
  let transactionDeleteBulk
  let transactions
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
    addresses = wallets.map(wallet => wallet.address)
    contacts = [
      { address: 'Acon1', transactions: {} },
      { address: 'Acon2', transactions: {} }
    ]
    transactions = [
      { id: 'tx1', timestamp: 300 * 1000 },
      { id: 'tx2', timestamp: 400 * 1000 },
      { id: 'tx3', timestamp: 200 * 1000 },
      { id: 'tx4', timestamp: 110 * 1000 }
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
    let walletsData
    let transactionsByWallet

    beforeEach(() => {
      walletsData = [
        wallets[0],
        wallets[2],
        { address: wallets[1].address }
      ]

      transactionsByWallet = {}
      wallets.forEach(wallet => {
        transactionsByWallet[wallet.address] = []
      })

      action.refreshWalletsData = jest.fn()
      action.refreshTransactions = jest.fn()
      action.fetchWalletsData = jest.fn()
      action.fetchWalletsTransactions = jest.fn()

      action.fetchWalletsData.mockImplementation(addresses => {
        return walletsData
      })
      action.fetchWalletsTransactions.mockImplementation(addresses => {
        return transactionsByWallet
      })
    })

    it('should fetch the data of all wallets', async () => {
      await action.refresh(wallets)
      expect(action.fetchWalletsData).toHaveBeenCalledWith(addresses)
    })

    it('should fetch the transactions of all wallets', async () => {
      await action.refresh(wallets)
      expect(action.fetchWalletsTransactions).toHaveBeenCalledWith(addresses)
    })

    it('should refresh the data of all wallets', async () => {
      await action.refresh(wallets)

      expect(action.refreshWalletsData).toHaveBeenCalledWith(wallets, walletsData)
    })

    it('should refresh all transactions of all wallets', async () => {
      await action.refresh(wallets)

      expect(action.refreshTransactions).toHaveBeenCalledWith(wallets, transactionsByWallet)
    })
  })

  describe('fetchWalletsData', () => {
    beforeEach(() => {
      action.$client.fetchWallets = jest.fn()
    })

    it('should fetch the data of each wallet address', async () => {
      await action.fetchWalletsData(addresses)
      expect(action.$client.fetchWallets).toHaveBeenCalledWith(addresses)
    })
  })

  describe('fetchWalletsTransactions', () => {
    beforeEach(() => {
      action.$client.fetchTransactionsForWallets = jest.fn()
    })

    it('should fetch the transactions of each wallet address', async () => {
      await action.fetchWalletsTransactions(addresses)
      expect(action.$client.fetchTransactionsForWallets).toHaveBeenCalledWith(addresses)
    })
  })

  describe('refreshWalletsData', () => {
    beforeEach(() => {
      action.processWalletData = jest.fn()
      action.fetchWalletsData = jest.fn()
    })

    it('should not process wallet if cold', async () => {
      const coldWallet = { ...wallets[0], publicKey: null }
      const walletsData = [
        coldWallet,
        {},
        null,
        wallets[2]
      ]
      action.fetchWalletsData.mockImplementation(addresses => walletsData)

      await action.refreshWalletsData(wallets, walletsData)

      expect(action.processWalletData).toHaveBeenCalledWith(wallets[2], wallets[2])
      expect(action.processWalletData).not.toHaveBeenCalledWith(wallets[0], coldWallet)
      expect(action.processWalletData).not.toHaveBeenCalledWith(wallets[0], {})
      expect(action.processWalletData).not.toHaveBeenCalledWith(wallets[0], null)
    })
  })

  describe('refreshTransactions', () => {
    let transactionsByWallet

    beforeEach(() => {
      action.processWalletTransactions = jest.fn()
    })

    describe('when a wallet doest not have transactions', () => {
      beforeEach(() => {
        transactionsByWallet = {}
        wallets.forEach(wallet => {
          transactionsByWallet[wallet.address] = []
        })
      })

      it('should not try to process them', async () => {
        await action.refreshTransactions(wallets, transactionsByWallet)

        wallets.forEach(wallet => {
          expect(action.processWalletTransactions).not.toHaveBeenCalled()
        })
      })
    })

    describe('when wallets have transactions', () => {
      beforeEach(() => {
        transactionsByWallet = {}
        wallets.forEach(wallet => {
          transactionsByWallet[wallet.address] = transactions
        })
      })

      it('should process them', async () => {
        await action.refreshTransactions(wallets, transactionsByWallet)

        wallets.forEach(wallet => {
          expect(action.processWalletTransactions).toHaveBeenCalledWith(wallet, transactions)
        })
      })
    })
  })

  describe('processWalletData', () => {
    let wallet

    beforeEach(() => {
      wallet = wallets[2]
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

  describe('processWalletTransactions', () => {
    let wallet

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
      expect(action.findLatestTransaction(transactions)).toBe(transactions[1])
    })
  })
})
