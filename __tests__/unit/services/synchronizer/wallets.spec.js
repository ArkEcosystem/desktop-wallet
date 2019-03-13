import config from '@config'
import { Action } from '@/services/synchronizer/wallets'

describe('Services > Synchronizer > Wallets', () => {
  let action
  let profile
  let profileWallets
  let ledgerWallets
  let contacts
  let transactions

  let transactionDeleteBulk

  beforeEach(() => {
    transactionDeleteBulk = jest.fn()

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
          'ledger/wallets': [],
          'session/backgroundUpdateLedger': true,
          'wallet/byProfileId': jest.fn(),
          'wallet/contactsByProfileId': jest.fn()
        },
        dispatch: (action, data) => {
          if (action === 'transaction/deleteBulk') {
            return transactionDeleteBulk(action, data)
          } else if (action === 'transaction/clearExpired') {
            return []
          }
        }
      }
    }

    action = new Action(synchronizer)

    profile = { id: 'profile ID' }
    profileWallets = [
      { address: 'A1', transactions: {} },
      { address: 'A2', transactions: {} },
      { address: 'A3', transactions: {} },
      { address: 'A4', transactions: {} }
    ]
    ledgerWallets = [
      { address: 'A1ledger', transactions: {}, isLedger: true },
      { address: 'A2ledger', transactions: {}, isLedger: true }
    ]
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

  describe('static compareWalletData', () => {
    // TODO more properties
    const wallet = {
      address: 'A',
      isLedger: false
    }

    it('shoud return `true` if the data and the wallet data is the same', () => {
      const data = {
        address: wallet.address
      }
      expect(Action.compareWalletData(wallet, data)).toBeTrue()
    })

    it('shoud return `false` if the data and the wallet data is not the same', () => {
      const data = {
        address: 'Anot'
      }
      expect(Action.compareWalletData(wallet, data)).toBeFalse()
    })
  })

  describe('get profileWallets', () => {
    describe('when there is not a session profile', () => {
      beforeEach(() => (action.$scope.session_profile = undefined))

      it('should return an empty Array', () => {
        expect(action.profileWallets).toBeEmpty()
      })
    })

    describe('when there is a session profile', () => {
      beforeEach(() => {
        action.$scope.session_profile = profile
        action.$getters['wallet/byProfileId'].mockReturnValue(profileWallets)
      })

      it('should return its wallet', () => {
        expect(action.profileWallets).toBe(profileWallets)
        expect(action.$getters['wallet/byProfileId']).toHaveBeenCalledWith(profile.id)
      })
    })
  })

  describe('get ledgerWallets', () => {
    beforeEach(() => {
      action.$getters['ledger/wallets'] = ledgerWallets
    })

    describe('when the Ledger is set to be updated on the background', () => {
      beforeEach(() => {
        action.$getters['session/backgroundUpdateLedger'] = true
      })

      it('should return all the Ledger wallets', () => {
        expect(action.ledgerWallets).toBe(ledgerWallets)
      })
    })

    describe('when the Ledger is not set to be updated on the background', () => {
      beforeEach(() => {
        action.$getters['session/backgroundUpdateLedger'] = false
      })

      it('should return an empty Array', () => {
        expect(action.ledgerWallets).toBeEmpty()
      })
    })
  })

  describe('get wallets', () => {
    beforeEach(() => {
      action.$scope.session_profile = profile
      action.$getters['wallet/byProfileId'].mockReturnValue(profileWallets)
      action.$getters['ledger/wallets'] = ledgerWallets
    })

    it('should return the regular wallets and Ledger wallets', () => {
      expect(action.wallets).toIncludeSameMembers([
        ...profileWallets,
        ...ledgerWallets
      ])
    })
  })

  describe('get contacts', () => {
    describe('when there is not a session profile', () => {
      beforeEach(() => (action.$scope.session_profile = undefined))

      it('should return an empty Array', () => {
        expect(action.contacts).toBeEmpty()
      })
    })

    describe('when there is a session profile', () => {
      beforeEach(() => {
        action.$scope.session_profile = profile
        action.$getters['wallet/contactsByProfileId'].mockReturnValue(contacts)
      })

      it('should return its contacts', () => {
        expect(action.contacts).toBe(contacts)
        expect(action.$getters['wallet/contactsByProfileId']).toHaveBeenCalledWith(profile.id)
      })
    })
  })

  describe('get allWallets', () => {
    beforeEach(() => {
      action.$scope.session_profile = profile
      action.$getters['wallet/byProfileId'].mockReturnValue(profileWallets)
      action.$getters['wallet/contactsByProfileId'].mockReturnValue(contacts)
      action.$getters['ledger/wallets'] = ledgerWallets
    })

    it('should return the regular wallets, contacts and Ledger wallets', () => {
      expect(action.allWallets).toIncludeSameMembers([
        ...profileWallets,
        ...contacts,
        ...ledgerWallets
      ])
    })
  })

  describe('get allWalletsByAdress', () => {
    beforeEach(() => {
      action.$scope.session_profile = profile
      action.$getters['wallet/byProfileId'].mockReturnValue([
        profileWallets[0],
        profileWallets[1]
      ])
      action.$getters['wallet/contactsByProfileId'].mockReturnValue(contacts)
      action.$getters['ledger/wallets'] = [
        ...ledgerWallets,
        { ...profileWallets[0], isLedger: true }
      ]
    })

    it('should return the regular wallets, contacts and Ledger wallets', () => {
      expect(action.allWalletsByAddress).toEqual({
        A1: [{ address: 'A1', transactions: {} }, { address: 'A1', isLedger: true, transactions: {} }],
        A2: [{ address: 'A2', transactions: {} }],
        Acon1: [{ address: 'Acon1', transactions: {} }],
        Acon2: [{ address: 'Acon2', transactions: {} }],
        A1ledger: [{ address: 'A1ledger', isLedger: true, transactions: {} }],
        A2ledger: [{ address: 'A2ledger', isLedger: true, transactions: {} }]
      })
    })
  })

  describe('run', () => {
    beforeEach(() => (action.sync = jest.fn()))

    describe('when there are wallets of any kind', () => {
      beforeEach(() => {
        jest.spyOn(action, 'allWallets', 'get').mockReturnValue(contacts)
      })

      it('should sync them', async () => {
        await action.run()
        expect(action.sync).toHaveBeenCalled()
      })
    })

    describe('when there are not any wallet of any kind', () => {
      beforeEach(() => {
        jest.spyOn(action, 'allWallets', 'get').mockReturnValue([])
      })

      it('should not even try to sync them', async () => {
        await action.run()
        expect(action.sync).not.toHaveBeenCalled()
      })
    })
  })

  describe('sync', () => {
    let walletsData
    let transactionsByAddress
    let walletsToUpdate

    beforeEach(() => {
      transactionsByAddress = {}
      profileWallets.forEach(wallet => {
        transactionsByAddress[wallet.address] = []
      })
      walletsToUpdate = ledgerWallets

      action.fetch = jest.fn()
      action.process = jest.fn()
      action.update = jest.fn()

      action.fetch.mockImplementation(addresses => {
        return { walletsData, transactionsByAddress }
      })
      action.process.mockImplementation(addresses => {
        return walletsToUpdate
      })
    })

    it('should fetch the data', async () => {
      await action.sync()

      expect(action.fetch).toHaveBeenCalled()
    })

    it('should process the fetched data', async () => {
      await action.sync()

      expect(action.process).toHaveBeenCalledWith(walletsData, transactionsByAddress)
    })

    describe('when there are not wallets to update', () => {
      beforeEach(() => {
        action.process.mockImplementation(addresses => {
          return []
        })
      })

      it('should not update them', async () => {
        await action.sync()

        expect(action.update).not.toHaveBeenCalled()
      })
    })

    describe('when there are wallets to update', () => {
      it('should update them', async () => {
        await action.sync()

        expect(action.update).toHaveBeenCalledWith(walletsToUpdate)
      })
    })
  })

  describe('fetch', () => {
    let addresses
    let allAddresses
    let walletsData
    let transactionsByAddress

    beforeEach(() => {
      jest.spyOn(action, 'wallets', 'get').mockReturnValue([
        ...profileWallets,
        ...ledgerWallets
      ])
      jest.spyOn(action, 'allWallets', 'get').mockReturnValue([
        ...profileWallets,
        ...ledgerWallets,
        ...contacts
      ])
      action.emit = jest.fn()

      addresses = action.wallets.map(wallet => wallet.address)
      allAddresses = action.allWallets.map(wallet => wallet.address)

      action.fetchWalletsData = jest.fn()
      action.fetchWalletsTransactions = jest.fn()

      walletsData = [
        profileWallets[0],
        { address: ledgerWallets[1].address }
      ]

      transactionsByAddress = {}
      profileWallets.forEach(wallet => {
        transactionsByAddress[wallet.address] = wallet
      })

      action.fetchWalletsData.mockImplementation(addresses => {
        return walletsData
      })
      action.fetchWalletsTransactions.mockImplementation(addresses => {
        return transactionsByAddress
      })
    })

    it('should fetch the data of every regular wallet, Ledger wallet or contact', async () => {
      await action.fetch()
      expect(action.fetchWalletsData).toHaveBeenCalledWith(allAddresses)
    })

    it('should fetch the transactions of every regular or Ledger wallet', async () => {
      await action.fetch()
      expect(action.fetchWalletsTransactions).toHaveBeenCalledWith(addresses)
    })

    it('should return the fetched data and transactions', async () => {
      expect(await action.fetch()).toEqual({ walletsData, transactionsByAddress })
    })

    it('should emit `transactions:fetched` with the transactions grouped by address', async () => {
      await action.fetch()
      expect(action.emit).toHaveBeenCalledWith('transactions:fetched', transactionsByAddress)
    })

    describe('when there are duplicated addresses', () => {
      it('should ignore duplicates', async () => {
        jest.spyOn(action, 'wallets', 'get').mockReturnValue([
          ...profileWallets,
          ...ledgerWallets,
          profileWallets[1],
          ledgerWallets[0]
        ])
        jest.spyOn(action, 'allWallets', 'get').mockReturnValue([
          ...profileWallets,
          ...ledgerWallets,
          ...contacts,
          contacts[1],
          ledgerWallets[1],
          profileWallets[3]
        ])

        await action.fetch()

        expect(action.fetchWalletsData).toHaveBeenCalledWith(allAddresses)
        expect(action.fetchWalletsTransactions).toHaveBeenCalledWith(addresses)
      })
    })
  })

  describe('fetchWalletsData', () => {
    let addresses

    beforeEach(() => {
      addresses = action.wallets.map(wallet => wallet.address)
      action.$client.fetchWallets = jest.fn()
    })

    it('should fetch the data of each wallet address', async () => {
      await action.fetchWalletsData(addresses)
      expect(action.$client.fetchWallets).toHaveBeenCalledWith(addresses)
    })
  })

  describe('fetchWalletsTransactions', () => {
    let addresses

    beforeEach(() => {
      addresses = action.wallets.map(wallet => wallet.address)
      action.$client.fetchTransactionsForWallets = jest.fn()
    })

    it('should fetch the transactions of each wallet address', async () => {
      await action.fetchWalletsTransactions(addresses)
      expect(action.$client.fetchTransactionsForWallets).toHaveBeenCalledWith(addresses)
    })
  })

  describe('process', () => {
    let walletsData
    let transactionsByAddress

    beforeEach(() => {
      walletsData = [
        { address: profileWallets[0].address, balance: 1 }
      ]

      transactionsByAddress = {
        [profileWallets[0].address]: transactions,
        [profileWallets[1].address]: transactions
      }

      action.processWalletsData = jest.fn()
      action.processTransactions = jest.fn()

      jest.spyOn(action, 'allWallets', 'get').mockReturnValue([
        profileWallets[0],
        profileWallets[1]
      ])

      action.processWalletsData = jest.fn().mockImplementation(() => {
        return { [walletsData[0].address]: walletsData[0] }
      })
      action.processTransactions = jest.fn().mockImplementation(transactionsByAddress => {
        return Object.keys(transactionsByAddress).reduce((all, address) => {
          all[address] = transactionsByAddress[address][0].timestamp
          return all
        }, {})
      })
    })

    it('should process the wallet data', async () => {
      await action.process(walletsData, transactionsByAddress)

      expect(action.processWalletsData).toHaveBeenCalledWith(walletsData)
    })

    it('should process the transactions', async () => {
      await action.process(walletsData, transactionsByAddress)

      expect(action.processTransactions).toHaveBeenCalledWith(transactionsByAddress)
    })
  })

  describe('processWalletsData', () => {
    beforeEach(() => {
      jest.spyOn(action, 'allWallets', 'get').mockReturnValue([
        profileWallets[0],
        ledgerWallets[0],
        contacts[0]
      ])
    })

    describe('when no data is passed', () => {
      it('should return an empty `Object`', () => {
        expect(action.processWalletsData([])).toEqual({})
      })
    })

    describe('when the data has changed', () => {
      it('should return them aggregated by address', () => {
        const data = [
          { ...profileWallets[0], balance: 10 },
          { ...ledgerWallets[0], balance: 11 },
          { ...contacts[0], balance: 12 }
        ]

        expect(action.processWalletsData(data)).toEqual({
          [data[0].address]: data[0],
          [data[1].address]: data[1],
          [data[2].address]: data[2]
        })
      })
    })

    describe('when the data has not changed', () => {
      it('should not return them', () => {
        const data = [
          { ...profileWallets[0] },
          { ...ledgerWallets[0] },
          { ...contacts[0] }
        ]

        expect(action.processWalletsData(data)).toEqual({})
      })
    })
  })

  describe('processTransactions', () => {
    let transactionsByAddress

    beforeEach(() => {
      transactionsByAddress = {
        [profileWallets[0].address]: transactions,
        [profileWallets[1].address]: transactions
      }

      action.processWalletTransactions = jest.fn().mockImplementation((_, transactions) => {
        return transactions[0].timestamp
      })
      jest.spyOn(action, 'wallets', 'get').mockReturnValue(profileWallets)
    })

    describe('when a wallet doest not have transactions', () => {
      beforeEach(() => {
        profileWallets.forEach(wallet => {
          transactionsByAddress[wallet.address] = []
        })
      })

      it('should not try to process them', async () => {
        await action.processTransactions(transactionsByAddress)

        expect(action.processWalletTransactions).not.toHaveBeenCalled()
      })
    })

    describe('when wallets have transactions', () => {
      it('should process them', async () => {
        await action.processTransactions(transactionsByAddress)

        profileWallets.slice(0, 2).forEach(wallet => {
          expect(action.processWalletTransactions).toHaveBeenCalledWith(wallet, transactions)
        })
      })

      it('should return the timestamp of new transactions', async () => {
        expect(await action.processTransactions(transactionsByAddress)).toEqual({
          [profileWallets[0].address]: transactions[0].timestamp
        })
      })
    })
  })

  describe('processWalletTransactions', () => {
    let wallet

    beforeEach(() => {
      wallet = profileWallets[2]

      action.displayNewTransaction = jest.fn()
      action.processVotes = jest.fn()
    })

    describe('when all of them are old', () => {
      beforeEach(() => {
        wallet.transactions.checkedAt = 50000 * 1000
      })

      it('should not return the timestamp', async () => {
        expect(await action.processWalletTransactions(wallet, transactions)).toBeUndefined()
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

    describe('when transactions include votes', () => {
      let votes

      beforeEach(() => {
        transactions[0].type = config.TRANSACTION_TYPES.VOTE
        votes = [transactions[0]]
      })

      it('should process the votes', async () => {
        await action.processWalletTransactions(wallet, transactions)
        expect(action.processVotes).toHaveBeenCalledWith(votes)
      })
    })

    describe('when at least 1 of them is new', () => {
      let latestTransaction

      beforeEach(() => {
        latestTransaction = transactions[1]
        wallet.transactions.checkedAt = latestTransaction.timestamp - 10
      })

      it('should return the timestamp', async () => {
        expect(await action.processWalletTransactions(wallet, transactions))
          .toEqual(latestTransaction.timestamp)
      })

      it('should display the new transaction', async () => {
        await action.processWalletTransactions(wallet, transactions)
        expect(action.displayNewTransaction).toHaveBeenCalledWith(latestTransaction, wallet)
      })
    })
  })

  describe('update', () => {
    beforeEach(() => {
      jest.spyOn(action.synchronizer.$store, 'dispatch')
    })

    it('should update in bulk regular wallets', async () => {
      await action.update(profileWallets)

      expect(action.synchronizer.$store.dispatch).toHaveBeenCalledWith('wallet/updateBulk', profileWallets)
    })

    it('should update Ledger wallets, 1 by 1', async () => {
      await action.update(ledgerWallets)

      ledgerWallets.forEach((wallet, i) => {
        expect(action.synchronizer.$store.dispatch).toHaveBeenNthCalledWith(i + 1, 'ledger/updateWallet', wallet)
      })
    })

    it('should log errors', async () => {
      jest.spyOn(action.synchronizer.$store, 'dispatch').mockImplementation(() => {
        throw new Error('Example error')
      })
      await action.update(profileWallets)

      expect(action.$scope.$logger.error).toHaveBeenCalledWith('Example error')
    })
  })
})
