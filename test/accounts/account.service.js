'use strict'

describe('accountService', () => {
  let accountService
  let gettextCatalogMock, networkServiceMock
  let intervalRef

  function mockGetFromPeer (transactionsArray) {
    let returnIndex = 0
    networkServiceMock.getFromPeer = () => {
      return new Promise((resolve, reject) => {
        // each time the method getFromPeer is called the next value of the array is taken
        // if the value is "false" we reject the promise, else we return a success response with the transactions
        const transactions = transactionsArray[returnIndex++]
        if (!transactions) {
          reject(new Error('Error'))
        } else {
          resolve({success: true, transactions: transactions})
        }
      })
    }
  }

  function createTxArray (arraySize, timestamp) {
    const arr = []
    if (!arraySize) {
      return arr
    }

    for (let i = 0; i < arraySize; i++) {
      arr.push({type: 0, timestamp: timestamp})
    }

    return arr
  }

  beforeEach(module('arkclient.constants'))

  beforeEach(module((_$exceptionHandlerProvider_) => _$exceptionHandlerProvider_.mode('log')))

  beforeEach(() => {
    module('arkclient.accounts', $provide => {
      gettextCatalogMock = {getString: sinon.stub().returnsArg(0)}
      networkServiceMock = { listenNetworkHeight: sinon.stub(),
        getPeer: sinon.stub().returns('127.0.0.1'),
        getNetwork: sinon.stub().returns({ version: 0x17 }) }

      // inject the mock services
      $provide.value('gettextCatalog', gettextCatalogMock)
      $provide.value('networkService', networkServiceMock)
    })

    inject(($injector, _$rootScope_) => {
      accountService = $injector.get('accountService')

      // because the transactionBuilderService creates a deferred-promise via '$q.defer()' we have to apply the scope "all the time"
      // the reason for this is, how $q.defer works: For a promise to really be resolved not only "resolve()" or "reject()" has to be called
      // but also $scope.apply() has to be called AFTER the other methods, however since this resolve is called async, we cannot know when
      // to call $scope.apply, therefore we just call it "all the time"
      // see: https://github.com/angular/angular.js/issues/9954
      intervalRef = setInterval(() => _$rootScope_.$apply(), 1)
    })
  })

  afterEach(() => clearInterval(intervalRef))

  describe('getAllTransactions', () => {
    it('has 0 transactions, no max limit, length should be 0', (done) => {
      mockGetFromPeer([createTxArray(0)])

      accountService.getAllTransactions()
        .then(transactions => {
          expect(transactions.length).to.eql(0)
          done()
        }, err => done(err))
        .catch(err => done(err))
    })

    it('has 50 transactions, max limit 50, returns all at once', (done) => {
      mockGetFromPeer([createTxArray(50)])

      accountService.getAllTransactions(null, 50)
        .then(transactions => {
          expect(transactions.length).to.eql(50)
          done()
        }, err => done(err))
        .catch(err => done(err))
    })

    it('has 50 transactions, no max limit, has two updates and is then finished', (done) => {
      mockGetFromPeer([createTxArray(50), createTxArray(0)])

      let numberOfTimesUpdateWasCalled = 0
      const onUpdateCheck = (updateObj) => {
        expect(updateObj.transactions.length).to.eql(numberOfTimesUpdateWasCalled === 0 ? 50 : 0)
        numberOfTimesUpdateWasCalled++
      }

      accountService.getAllTransactions(null, null, onUpdateCheck)
        .then(transactions => {
          expect(transactions.length).to.eql(50)
          expect(numberOfTimesUpdateWasCalled).to.eql(2)
          done()
        }, err => done(err))
        .catch(err => done(err))
    })

    it('has 51 transactions, max limit 51, has 2 updates and is then finished', (done) => {
      mockGetFromPeer([createTxArray(50), createTxArray(1)])

      let numberOfTimesUpdateWasCalled = 0
      const onUpdateCheck = (updateObj) => {
        expect(updateObj.transactions.length).to.eql(numberOfTimesUpdateWasCalled === 0 ? 50 : 1)
        numberOfTimesUpdateWasCalled++
      }

      accountService.getAllTransactions(null, 51, onUpdateCheck)
        .then(transactions => {
          expect(transactions.length).to.eql(51)
          expect(numberOfTimesUpdateWasCalled).to.eql(2)
          done()
        }, err => done(err))
        .catch(err => done(err))
    })

    it('has 51 transactions, max limit 100, has 3 updates and is then finished', (done) => {
      mockGetFromPeer([createTxArray(50), createTxArray(1), createTxArray(0)])

      let numberOfTimesUpdateWasCalled = 0
      const expectedUpdateNumbers = [50, 1, 0]
      const onUpdateCheck = (updateObj) => {
        expect(updateObj.transactions.length).to.eql(expectedUpdateNumbers[numberOfTimesUpdateWasCalled])
        numberOfTimesUpdateWasCalled++
      }

      accountService.getAllTransactions(null, 100, onUpdateCheck)
        .then(transactions => {
          expect(transactions.length).to.eql(51)
          expect(numberOfTimesUpdateWasCalled).to.eql(3)
          done()
        }, err => done(err))
        .catch(err => done(err))
    })

    it('has 51 transactions, max limit 100, cancels after first update, has only 50 transactions as a result', (done) => {
      mockGetFromPeer([createTxArray(50), createTxArray(1), createTxArray(0)])

      let numberOfTimesUpdateWasCalled = 0
      const onUpdateCheck = (updateObj) => {
        expect(updateObj.transactions.length).to.eql(50)
        numberOfTimesUpdateWasCalled++
        // this cancels, getAllTransactions
        return true
      }

      accountService.getAllTransactions(null, 100, onUpdateCheck)
        .then(transactions => {
          expect(transactions.length).to.eql(50)
          expect(numberOfTimesUpdateWasCalled).to.eql(1)
          done()
        }, err => done(err))
        .catch(err => done(err))
    })

    it('throws error immediately, returns 0 transactions', (done) => {
      mockGetFromPeer([false])

      accountService.getAllTransactions(null, 100)
        .then(transactions => done("error: shouldn't be here!"))
        .catch(err => {
          expect(err.transactions.length).to.eql(0)
          done()
        })
        .catch(err => done(err))
    })

    it('throws error after first update, still returns transactions', (done) => {
      mockGetFromPeer([createTxArray(50), false])

      let numberOfTimesUpdateWasCalled = 0
      const onUpdateCheck = (updateObj) => {
        expect(updateObj.transactions.length).to.eql(50)
        numberOfTimesUpdateWasCalled++
      }

      accountService.getAllTransactions(null, null, onUpdateCheck)
        .then(transactions => done("error: shouldn't be here!"))
        .catch(err => {
          expect(err.transactions.length).to.eql(50)
          expect(numberOfTimesUpdateWasCalled).to.eql(1)
          done()
        })
        .catch(err => done(err))
    })
  })

  describe('getRangedTransactions', () => {
    // these are all ark-relative timestamps
    const timestamps = {
      '2017_05_05': 3834000,
      '2017_10_10': 17485200,
      '2017_12_12': 22932000
    }

    it('has 0 transactions, length should be 0', (done) => {
      mockGetFromPeer([createTxArray(0)])

      accountService.getRangedTransactions()
        .then(transactions => {
          expect(transactions.length).to.eql(0)
          done()
        }, err => done(err))
        .catch(err => done(err))
    })

    it('has 0 transactions in range, length should be 0', (done) => {
      mockGetFromPeer([createTxArray(50, timestamps['2017_05_05'])])

      const startDate = new Date(2017, 10, 21)
      const endDate = new Date(2017, 11, 21)
      accountService.getRangedTransactions(null, startDate, endDate)
        .then(transactions => {
          expect(transactions.length).to.eql(0)
          done()
        }, err => done(err))
        .catch(err => done(err))
    })

    it('has 0 transactions in range, has a total of 150 transactions, cancels after first run (because timestamp is older than startdate), length should be 0', (done) => {
      mockGetFromPeer([createTxArray(50, timestamps['2017_05_05']),
        createTxArray(50, timestamps['2017_05_05']),
        createTxArray(50, timestamps['2017_05_05'])])

      let numberOfTimesUpdateWasCalled = 0
      const onUpdateCheck = (updateObj) => {
        expect(updateObj.transactions.length).to.eql(0)
        numberOfTimesUpdateWasCalled++
      }

      const startDate = new Date(2017, 10, 21)
      const endDate = new Date(2017, 11, 21)
      accountService.getRangedTransactions(null, startDate, endDate, onUpdateCheck)
        .then(transactions => {
          expect(transactions.length).to.eql(0)
          expect(numberOfTimesUpdateWasCalled).to.eql(1)
          done()
        }, err => done(err))
        .catch(err => done(err))
    })

    it('has 0 transactions in range, has a total of 150 transactions, has to do all runs (because timestamp is never older than startdate), length should be 0', (done) => {
      mockGetFromPeer([createTxArray(50, timestamps['2017_12_12']),
        createTxArray(50, timestamps['2017_12_12']),
        createTxArray(50, timestamps['2017_12_12']),
        createTxArray(0)])

      let numberOfTimesUpdateWasCalled = 0
      const onUpdateCheck = (updateObj) => {
        expect(updateObj.transactions.length).to.eql(0)
        numberOfTimesUpdateWasCalled++
      }

      const startDate = new Date(2017, 9, 21)
      const endDate = new Date(2017, 10, 21)
      accountService.getRangedTransactions(null, startDate, endDate, onUpdateCheck)
        .then(transactions => {
          expect(transactions.length).to.eql(0)
          expect(numberOfTimesUpdateWasCalled).to.eql(4)
          done()
        }, err => done(err))
        .catch(err => done(err))
    })

    it('has all (50) transactions in range, length should be 50', (done) => {
      mockGetFromPeer([createTxArray(50, timestamps['2017_05_05']), createTxArray(0)])

      const startDate = new Date(2017, 4, 4)
      const endDate = new Date(2017, 4, 6)
      accountService.getRangedTransactions(null, startDate, endDate)
        .then(transactions => {
          expect(transactions.length).to.eql(50)
          done()
        }, err => done(err))
        .catch(err => done(err))
    })

    it('has 25 of 75 transactions in range, length should be 25 (in different arrays/calls), update called 3 times', (done) => {
      mockGetFromPeer([createTxArray(25, timestamps['2017_12_12']),
        createTxArray(25, timestamps['2017_10_10']),
        createTxArray(25, timestamps['2017_05_05'])])

      let numberOfTimesUpdateWasCalled = 0
      const expectedUpdateNumbers = [0, 25, 0]
      const onUpdateCheck = (updateObj) => {
        expect(updateObj.transactions.length).to.eql(expectedUpdateNumbers[numberOfTimesUpdateWasCalled])
        numberOfTimesUpdateWasCalled++
      }

      const startDate = new Date(2017, 9, 9)
      const endDate = new Date(2017, 9, 11)
      accountService.getRangedTransactions(null, startDate, endDate, onUpdateCheck)
        .then(transactions => {
          expect(transactions.length).to.eql(25)
          expect(numberOfTimesUpdateWasCalled).to.eql(3)
          done()
        }, err => done(err))
        .catch(err => done(err))
    })

    it('has 25 of 75 transactions in range, length should be 25 (in same arrays/calls), update called 1 time', (done) => {
      mockGetFromPeer([createTxArray(25, timestamps['2017_12_12'])
        .concat(createTxArray(25, timestamps['2017_10_10']))
        .concat(createTxArray(25, timestamps['2017_05_05'])),
      createTxArray(0)])

      let numberOfTimesUpdateWasCalled = 0
      const onUpdateCheck = (updateObj) => {
        expect(updateObj.transactions.length).to.eql(25)
        numberOfTimesUpdateWasCalled++
      }

      const startDate = new Date(2017, 9, 9)
      const endDate = new Date(2017, 9, 11)
      accountService.getRangedTransactions(null, startDate, endDate, onUpdateCheck)
        .then(transactions => {
          expect(transactions.length).to.eql(25)
          expect(numberOfTimesUpdateWasCalled).to.eql(1)
          done()
        }, err => done(err))
        .catch(err => done(err))
    })

    it('no startDate, has all (75) transactions in range, length should be 75', (done) => {
      mockGetFromPeer([createTxArray(25, timestamps['2017_12_12']),
        createTxArray(25, timestamps['2017_10_10']),
        createTxArray(25, timestamps['2017_05_05']),
        createTxArray(0)])

      const startDate = null
      const endDate = new Date(2018, 0, 1)
      accountService.getRangedTransactions(null, startDate, endDate)
        .then(transactions => {
          expect(transactions.length).to.eql(75)
          done()
        }, err => done(err))
        .catch(err => done(err))
    })

    it('no endDate, has all (75) transactions in range, length should be 75', (done) => {
      mockGetFromPeer([createTxArray(25, timestamps['2017_12_12']),
        createTxArray(25, timestamps['2017_10_10']),
        createTxArray(25, timestamps['2017_05_05']),
        createTxArray(0)])

      const startDate = new Date(2017, 0, 1)
      const endDate = null
      accountService.getRangedTransactions(null, startDate, endDate)
        .then(transactions => {
          expect(transactions.length).to.eql(75)
          done()
        }, err => done(err))
        .catch(err => done(err))
    })

    it('throws error immediately, returns 0 transactions', (done) => {
      mockGetFromPeer([false])

      const startDate = new Date(2017, 9, 10)
      const endDate = new Date(2017, 9, 10)
      accountService.getRangedTransactions(null, startDate, endDate)
        .then(transactions => done("error: shouldn't be here!"))
        .catch(err => {
          expect(err.transactions.length).to.eql(0)
          done()
        })
        .catch(err => done(err))
    })

    it('throws error after first update, still returns transactions', (done) => {
      mockGetFromPeer([createTxArray(50, timestamps['2017_10_10']), false])

      let numberOfTimesUpdateWasCalled = 0
      const onUpdateCheck = (updateObj) => {
        expect(updateObj.transactions.length).to.eql(50)
        numberOfTimesUpdateWasCalled++
      }

      const startDate = new Date(2017, 9, 9)
      const endDate = new Date(2017, 9, 11)
      accountService.getRangedTransactions(null, startDate, endDate, onUpdateCheck)
        .then(transactions => done("error: shouldn't be here!"))
        .catch(err => {
          expect(err.transactions.length).to.eql(50)
          expect(numberOfTimesUpdateWasCalled).to.eql(1)
          done()
        })
        .catch(err => done(err))
    })
  })
})
