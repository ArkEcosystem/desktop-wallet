'use strict'

describe('accountService',() => {

  let accountService
  let gettextCatalogMock, networkServiceMock
  let intervalRef

   function mockGetFromPeer(transactionsArray) {
    let returnIndex = 0
    networkServiceMock.getFromPeer = () => {
      return new Promise((resolve, rejct) => {
        // each time the method getFromPeer is called the next value of the array is taken
        // if the value is "false" we reject the promise, else we return a success response with the transactions
        const transactions = transactionsArray[returnIndex++]
        if (!transactions) {
          reject("Error")
        } else {
          resolve({success: true, transactions: transactions})
        }
      })
    }
   }

   function createTxArray(arraySize) {
    const arr = []
    if (!arraySize) {
      return arr
    }

    for (let i = 0; i < arraySize; i++) {
      arr.push({type: 0})
    }

    return arr
   }

   beforeEach(module((_$exceptionHandlerProvider_) => {
    _$exceptionHandlerProvider_.mode('log');
   }));

  beforeEach(() => {
    module("arkclient.accounts", $provide => {
      gettextCatalogMock = {getString: sinon.stub().returnsArg(0)}
      networkServiceMock = { listenNetworkHeight: sinon.stub(),
                             getPeer: sinon.stub().returns("127.0.0.1"),
                             getNetwork: sinon.stub().returns({ version: 0x17 }) }

      // inject the mock services
      $provide.value('gettextCatalog', gettextCatalogMock)
      $provide.value('networkService', networkServiceMock)
      $provide.value('ARKTOSHI_UNIT', Math.pow(10, 8))
    })

    inject(($injector, _$rootScope_) => {

      accountService = $injector.get('accountService')

      // because the transactionBuilderService creates a deferred-promise via '$q.defer()' we have to apply the scope "all the time"
      // the reason for this is, how $q.defer works: For a promise to really be resolved not only "resolve()" or "reject()" has to be called
      // but also $scope.apply() has to be called AFTER the other methods, however since this resolve is called async, we cannot know when
      // to call $scope.apply, therefore we just call it "all the time"
      // see: https://github.com/angular/angular.js/issues/9954
      intervalRef = setInterval(()=>  _$rootScope_.$apply(), 1)
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
                          },
                          err => done(err))
                    .catch(err => done(err))
    })

    it('has 50 transactions, max limit 50, returns all at once', (done) => {
      mockGetFromPeer([createTxArray(50)])

      accountService.getAllTransactions(null, 50)
                    .then(transactions => {
                            expect(transactions.length).to.eql(50)
                            done()
                          },
                          err => done(err))
                    .catch(err => done(err))
    })

    it('has 50 transactions, no max limit, has one update and is then finished', (done) => {
      mockGetFromPeer([createTxArray(50), createTxArray(0)])

      let numberOfTimesUpdateWasCalled = 0
      const onUpdateCheck = (updateObj) => {
        expect(updateObj.transactions.length).to.eql(50)
        numberOfTimesUpdateWasCalled++
      }

      accountService.getAllTransactions(null, null, onUpdateCheck)
                    .then(transactions => {
                            expect(transactions.length).to.eql(50)
                            expect(numberOfTimesUpdateWasCalled).to.eql(1)
                            done()
                          },
                          err => done(err))
                    .catch(err => done(err))
    })

    it('has 51 transactions, max limit 51, has 1 updates and is then finished', (done) => {
      mockGetFromPeer([createTxArray(50), createTxArray(1)])

      let numberOfTimesUpdateWasCalled = 0
      const onUpdateCheck = (updateObj) => {
        expect(updateObj.transactions.length).to.eql(50)
        numberOfTimesUpdateWasCalled++
      }

      accountService.getAllTransactions(null, 51, onUpdateCheck)
                    .then(transactions => {
                            expect(transactions.length).to.eql(51)
                            expect(numberOfTimesUpdateWasCalled).to.eql(1)
                            done()
                          },
                          err => done(err))
                    .catch(err => done(err))
    })

    it('has 51 transactions, max limit 100, has 2 updates and is then finished', (done) => {
      mockGetFromPeer([createTxArray(50), createTxArray(1), createTxArray(0)])

      let numberOfTimesUpdateWasCalled = 0
      const onUpdateCheck = (updateObj) => {
        expect(updateObj.transactions.length).to.eql(numberOfTimesUpdateWasCalled === 0 ? 50 : 1)
        numberOfTimesUpdateWasCalled++
      }

      accountService.getAllTransactions(null, 100, onUpdateCheck)
                    .then(transactions => {
                            expect(transactions.length).to.eql(51)
                            expect(numberOfTimesUpdateWasCalled).to.eql(2)
                            done()
                          },
                          err => done(err))
                    .catch(err => done(err))
    })

    it('throws error immediately', (done) => {
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
})
