'use strict'

describe('transactionBuilderService',() => {

  const tokenName = 'test-ark'
  let transactionBuilderService, accountService
  let configServiceMock, gettextCatalogMock, networkServiceMock, ledgerServiceMock, getAccountStub
  let intervalRef

  const fees = {
    send: 20000000,
    vote: 300000000,
    secondsignature: 400000000,
    delegate: 500000000,
    multisignature: 600000000
  }

  const from = {
    username: "Luke Skywalker",
    address: "AVjcAoo282db5Xgm7oaps1AEbKoC26eTyB",
    masterpassphrase: "agent cube glass fade lonely salon border notable weekend expect image grunt",
    secondpassphrase: "agent cube glass fade lonely salon border notable weekend expect image grunt",
    balance: 600000000
  }

  const to = {
    address: "AYxKh6vwACWicSGJATGE3rBreFK7whc7YA",
    publicKey: "02dcb94d73fb54e775f734762d26975d57f18980314f3b67bc52beb393893bc705"
  }

  function createValidConfigObject() {
    return {
      amount: 1,
      username: from.username,
      fromAddress: from.address,
      masterpassphrase: from.masterpassphrase,
      secondpassphrase: from.masterpassphrase,
      toAddress: to.address,
      publicKeys: to.publicKey, // required for vote transaction
      publicKey: to.publicKey // required for ledger
    }
  }

  function mockGetAccount(balance) {
    getAccountStub = sinon.stub(accountService, 'getAccount').returns({balance: balance})
  }

  function restoreGetAccount() {
    if (getAccountStub) {
      getAccountStub.restore()
    }
  }

  beforeEach(module((_$exceptionHandlerProvider_) => {
    _$exceptionHandlerProvider_.mode('log');
   }));

  beforeEach(() => {
    module("arkclient.accounts", $provide => {
      configServiceMock = { notice: sinon.stub(), getByGroupAndKey: sinon.stub() }
      gettextCatalogMock = {getString: sinon.stub().returnsArg(0)}
      networkServiceMock = { listenNetworkHeight: sinon.stub(),
                          getPeer: sinon.stub().returns("127.0.0.1"),
                          getNetwork: sinon.stub().returns({ version: 0x17, token: tokenName })
                        }
      ledgerServiceMock = {signTransaction: sinon.stub().resolves({})}

      // inject the mock services
      $provide.value('configService', configServiceMock)
      $provide.value('gettextCatalog', gettextCatalogMock)
      $provide.value('networkService', networkServiceMock)
      $provide.value('ledgerService', ledgerServiceMock)
      $provide.value('ARKTOSHI_UNIT', Math.pow(10, 8))
    })

    inject(($injector, _$rootScope_) => {
      transactionBuilderService = $injector.get('transactionBuilderService')

      accountService =  $injector.get('accountService')
      sinon.stub(accountService, 'getFees').resolves(fees)

      // because the transactionBuilderService creates a deferred-promise via '$q.defer()' we have to apply the scope "all the time"
      // the reason for this is, how $q.defer works: For a promise to really be resolved not only "resolve()" or "reject()" has to be called
      // but also $scope.apply() has to be called AFTER the other methods, however since this resolve is called async, we cannot know when
      // to call $scope.apply, therefore we just call it "all the time"
      // see: https://github.com/angular/angular.js/issues/9954
      intervalRef = setInterval(()=>  _$rootScope_.$apply(), 1)
    })
  })

  afterEach(() => clearInterval(intervalRef))

  describe('createSendTransaction', () => {

    beforeEach(() => mockGetAccount(from.balance))
    afterEach(() => restoreGetAccount())

    it('should have correct type', (done) => {
      var sendPromise = transactionBuilderService.createSendTransaction(createValidConfigObject())

      sendPromise.then(transaction => {
        expect(transaction.type).to.eql(0)
        done()
      }, err => done(err)).catch(err => done(err))
    })

    it('should have correct amount', (done) => {
      var sendPromise = transactionBuilderService.createSendTransaction(createValidConfigObject())

      sendPromise.then(transaction => {
        expect(transaction.amount).to.eql(1)
        done()
      }, err => done(err)).catch(err => done(err))
    })

    it('should have correct fee', (done) => {
      var sendPromise = transactionBuilderService.createSendTransaction(createValidConfigObject())

      sendPromise.then(transaction => {
        expect(transaction.fee).to.eql(fees.send)
        done()
      }, err => done(err)).catch(err => done(err))
    })

    it('should work with ledger', (done) => {
      const config = createValidConfigObject();
      config.ledger = true
      var sendPromise = transactionBuilderService.createSendTransaction(config)

      sendPromise.then(transaction => {
        expect(transaction.type).to.eql(0)
        expect(transaction.amount).to.eql(1)
        expect(transaction.fee).to.eql(fees.send)
        done()
      }, err => done(err)).catch(err => done(err))
    })

    it('should fail when to address is invalid', (done) => {
      const config = createValidConfigObject();
      config.toAddress += "B"
      var sendPromise = transactionBuilderService.createSendTransaction(config)

      sendPromise.then(transaction => {
          done("error: shouldn't be here!");
        }, err => {
          done()
        })
    })

    it('should fail when when passphrase is invalid', (done) => {
      const config = createValidConfigObject();
      config.masterpassphrase = "C"
      var sendPromise = transactionBuilderService.createSendTransaction(config)

      sendPromise.then(transaction => {
          done("error: shouldn't be here!");
        }, err => {
          done()
        })
    })

    it('should fail when balance is too low', (done) => {
      const config = createValidConfigObject();
      config.amount = from.balance - 1
      var sendPromise = transactionBuilderService.createSendTransaction(config)

      sendPromise.then(transaction => {
          done("error: shouldn't be here!");
        }, err => {
          done()
        })
    })
  })

  describe('createSecondPassphraseCreationTransaction', () => {

    beforeEach(() => mockGetAccount(from.balance))
    afterEach(() => restoreGetAccount())

    it('should have correct type', (done) => {
      var sendPromise = transactionBuilderService.createSecondPassphraseCreationTransaction(createValidConfigObject())

      sendPromise.then(transaction => {
        expect(transaction.type).to.eql(1)
        done()
      }, err => done(err)).catch(err => done(err))
    })

    it('should have correct fee', (done) => {
      var sendPromise = transactionBuilderService.createSecondPassphraseCreationTransaction(createValidConfigObject())

      sendPromise.then(transaction => {
        expect(transaction.fee).to.eql(fees.secondsignature)
        done()
      }, err => done(err)).catch(err => done(err))
    })

    it('should fail when balance is too low', (done) => {
      restoreGetAccount()
      mockGetAccount(fees.secondsignature - 1)
      var sendPromise = transactionBuilderService.createSecondPassphraseCreationTransaction(createValidConfigObject())

      sendPromise.then(transaction => {
          done("error: shouldn't be here!");
        }, err => {
          expect(err).to.have.string(tokenName);
          done()
        }).catch(err => done(err))
    })
  })

  describe('createDelegateCreationTransaction', () => {

    beforeEach(() => mockGetAccount(from.balance))
    afterEach(() => restoreGetAccount())

    it('should have correct type', (done) => {
      var sendPromise = transactionBuilderService.createDelegateCreationTransaction(createValidConfigObject())

      sendPromise.then(transaction => {
        expect(transaction.type).to.eql(2)
        done()
      }, err => done(err)).catch(err => done(err))
    })

    it('should have correct fee', (done) => {
      var sendPromise = transactionBuilderService.createDelegateCreationTransaction(createValidConfigObject())

      sendPromise.then(transaction => {
        expect(transaction.fee).to.eql(fees.delegate)
        done()
      }, err => done(err)).catch(err => done(err))
    })

    it('should fail when balance is too low', (done) => {
      restoreGetAccount()
      mockGetAccount(fees.delegate - 1)
      var sendPromise = transactionBuilderService.createDelegateCreationTransaction(createValidConfigObject())

      sendPromise.then(transaction => {
          done("error: shouldn't be here!");
        }, err => {
          expect(err).to.have.string(tokenName);
          done()
        }).catch(err => done(err))
    })
  })

  describe('createVoteTransaction', () => {
    beforeEach(() => mockGetAccount(from.balance))
    afterEach(() => restoreGetAccount())

    it('should have correct type', (done) => {
      var sendPromise = transactionBuilderService.createVoteTransaction(createValidConfigObject())

      sendPromise.then(transaction => {
        expect(transaction.type).to.eql(3)
        done()
      }, err => done(err)).catch(err => done(err))
    })

    it('should have correct fee', (done) => {
      var sendPromise = transactionBuilderService.createVoteTransaction(createValidConfigObject())

      sendPromise.then(transaction => {
        expect(transaction.fee).to.eql(fees.vote)
        done()
      }, err => done(err)).catch(err => done(err))
    })

    it('should fail when balance is too low', (done) => {
      restoreGetAccount()
      mockGetAccount(fees.vote - 1)
      var sendPromise = transactionBuilderService.createVoteTransaction(createValidConfigObject())

      sendPromise.then(transaction => {
          done("error: shouldn't be here!");
        }, err => {
          expect(err).to.have.string(tokenName);
          done()
        }).catch(err => done(err))
    })

    it('should work with ledger (additional field recipientId is correct)', (done) => {
      const config = createValidConfigObject();
      config.ledger = true
      var sendPromise = transactionBuilderService.createVoteTransaction(config)

      sendPromise.then(transaction => {
        expect(transaction.type).to.eql(3)
        expect(transaction.fee).to.eql(fees.vote)
        expect(transaction.recipientId).to.eql(config.fromAddress)
        done()
      }, err => done(err)).catch(err => done(err))
    })
  })
})
