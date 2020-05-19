import store from '@/store';
describe('WalletModule', function () {
    var sessionNetwork = { id: 'exampleNetworkId' };
    var sessionProfile = {
        id: 'exampleId',
        networkId: 'exampleNetworkId'
    };
    var otherProfile = {
        id: 'otherId',
        networkId: 'otherNetworkId'
    };
    var models = [
        { id: 1, address: 'A1', publicKey: 'PK1', balance: '1', profileId: sessionProfile.id, name: 'name1', vote: null },
        { id: 2, address: 'A2', publicKey: 'PK2', balance: '2', profileId: otherProfile.id, name: 'name2', vote: null },
        { id: 3, address: 'A3', publicKey: 'PK3', balance: '3', profileId: otherProfile.id, name: 'name3', vote: null },
        { id: 4, address: 'A3', publicKey: 'PK4', balance: '4', profileId: sessionProfile.id, name: 'name4', vote: null },
        { id: 5, address: 'A4', publicKey: 'PK5', balance: '5', profileId: sessionProfile.id, name: 'name5', vote: null, isContact: true },
        { id: 6, address: 'A5', publicKey: 'PK6', balance: '6', profileId: sessionProfile.id, name: 'name6', vote: null, isContact: true }
    ];
    var ledgerWallets = {
        L1: { address: 'L1', publicKey: 'PKL1', balance: '1', profileId: sessionProfile.id, name: null, vote: null, isLedger: true },
        L2: { address: 'L2', publicKey: 'PKL2', balance: '2', profileId: sessionProfile.id, name: null, vote: null, isLedger: true },
        L3: { address: 'L3', publicKey: 'PKL3', balance: '3', profileId: otherProfile.id, name: null, vote: null, isLedger: true }
    };
    var messages = [
        { message: 'hello 1', timestamp: (new Date()).getTime() },
        { message: 'hello 2', timestamp: (new Date()).getTime() + 10 }
    ];
    store.commit('network/CREATE', sessionNetwork);
    store.commit('profile/CREATE', sessionProfile);
    store.commit('profile/CREATE', otherProfile);
    store.commit('session/SET_PROFILE_ID', sessionProfile.id);
    store.commit('ledger/SET_WALLETS', ledgerWallets);
    beforeEach(function () {
        models.forEach(function (model) { return store.commit('wallet/STORE', model); });
        messages.forEach(function (message) { return store.commit('wallet/DELETE_SIGNED_MESSAGE', message); });
    });
    describe('getters byAddress', function () {
        describe('when the wallet address param does not exist', function () {
            it('should return `undefined`', function () {
                expect(store.getters['wallet/byAddress']('AunKno0n')).toBeUndefined();
            });
        });
        describe('when the wallet address param exists', function () {
            it('should find and return the wallet', function () {
                expect(store.getters['wallet/byAddress']('A1')).toEqual(models[0]);
            });
        });
        describe('when the wallet is a contact', function () {
            it('should find and return the wallet', function () {
                expect(store.getters['wallet/byAddress']('A4')).toEqual(models[4]);
            });
        });
    });
    describe('getters byName', function () {
        describe('when the wallet name param does not exist', function () {
            it('should return `undefined`', function () {
                expect(store.getters['wallet/byName']('not a name')).toBeUndefined();
            });
        });
        describe('when the wallet name param exists', function () {
            it('should find and return the wallet', function () {
                expect(store.getters['wallet/byName']('name1')).toEqual(models[0]);
            });
        });
        describe('when the wallet is a contact', function () {
            it('should find and return the wallet', function () {
                expect(store.getters['wallet/byName']('name5')).toEqual(models[4]);
            });
        });
    });
    describe('getters byProfileId', function () {
        describe('when the profile does not have any wallet', function () {
            it('should return an empty `Array`', function () {
                expect(store.getters['wallet/byProfileId']('unknownId')).toBeEmpty();
            });
        });
        describe('when the profile has wallets', function () {
            it('should return them', function () {
                var walletsOfExampleId = [models[0], models[3]];
                var contactWalletsOfExampleId = [models[4], models[5]];
                expect(store.getters['wallet/byProfileId']('exampleId')).toIncludeSameMembers(walletsOfExampleId);
                expect(store.getters['wallet/byProfileId']('exampleId')).not.toIncludeSameMembers(contactWalletsOfExampleId);
            });
        });
        describe('wallet should can be on multiple profiles', function () {
            it('should get them individually', function () {
                expect(store.getters['wallet/byProfileId']('exampleId')).toIncludeSameMembers([models[0], models[3]]);
                expect(store.getters['wallet/byProfileId']('otherId')).toIncludeSameMembers([models[1], models[2]]);
            });
        });
    });
    describe('getters contactsByProfileId', function () {
        describe('when the profile does not have any wallets', function () {
            it('should return an empty `Array`', function () {
                expect(store.getters['wallet/contactsByProfileId']('unknownId')).toBeEmpty();
            });
        });
        describe('when the profile has wallets', function () {
            it('should return them', function () {
                var contactWalletsOfExampleId = [models[4], models[5]];
                var walletsOfExampleId = [models[0], models[3]];
                expect(store.getters['wallet/contactsByProfileId']('exampleId')).toIncludeSameMembers(contactWalletsOfExampleId);
                expect(store.getters['wallet/contactsByProfileId']('exampleId')).not.toIncludeSameMembers(walletsOfExampleId);
            });
        });
    });
    describe('getters publicByProfileId', function () {
        it.each(['address', 'balance', 'name', 'publicKey', 'vote'])('should include wallet %s property', function (property) {
            var publicByProfileId = store.getters['wallet/publicByProfileId']('exampleId');
            for (var _i = 0, publicByProfileId_1 = publicByProfileId; _i < publicByProfileId_1.length; _i++) {
                var publicWallet = publicByProfileId_1[_i];
                expect(publicWallet[property]).not.toBeUndefined();
            }
        });
        describe('when the session network is the network of the requested profile', function () {
            it('should include ledger wallets', function () {
                var walletsOfExampleId = [
                    models[0],
                    models[3],
                    ledgerWallets.L1,
                    ledgerWallets.L2
                ].map(function (wallet) { return wallet.address; });
                var publicByProfileId = store.getters['wallet/publicByProfileId']('exampleId');
                expect(publicByProfileId.map(function (wallet) { return wallet.address; })).toIncludeSameMembers(walletsOfExampleId);
            });
        });
        describe('when the session network is not the network of the requested profile', function () {
            it('should not include ledger wallets', function () {
                var ledgerWalletsOfOtherId = [ledgerWallets.L3];
                expect(store.getters['wallet/publicByProfileId']('otherId')).not.toIncludeSameMembers(ledgerWalletsOfOtherId);
            });
        });
    });
    describe('Signed Messages', function () {
        it('should add a signed message', function () {
            store.dispatch('wallet/addSignedMessage', messages[0]);
            expect(store.getters['wallet/signedMessages']()).toIncludeSameMembers([messages[0]]);
        });
        it('should delete a signed message', function () {
            store.dispatch('wallet/addSignedMessage', messages[0]);
            store.dispatch('wallet/addSignedMessage', messages[1]);
            store.dispatch('wallet/deleteSignedMessage', messages[0]);
            expect(store.getters['wallet/signedMessages']()).toEqual([messages[1]]);
        });
    });
    describe('actions', function () {
        it('should fail to create a new wallet', function () {
            expect(function () { return store.dispatch('wallet/create', { id: 'test' }); }).toThrow();
        });
    });
});
//# sourceMappingURL=wallet.spec.js.map