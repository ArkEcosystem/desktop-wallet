import truncateMiddle from '@/filters/truncate-middle';
import WalletModel from '@/models/wallet';
import WalletService from '@/services/wallet';
import { sortByProps } from '@/utils';
export default {
    computed: {
        wallet_fromRoute: function () {
            var params = this.$route.params;
            if (!params || !params.address) {
                return;
            }
            var address = params.address;
            if (this.$store.getters['ledger/isConnected']) {
                var ledgerWallet = this.$store.getters['ledger/wallet'](address);
                if (ledgerWallet) {
                    return ledgerWallet;
                }
            }
            var freshWallet = function () {
                return WalletModel.deserialize({
                    address: address,
                    name: '',
                    profileId: '',
                    isContact: true,
                    isWatchOnly: true
                });
            };
            return this.$store.getters['wallet/byAddress'](address) || freshWallet();
        }
    },
    methods: {
        wallet_nameOnLedger: function (address) {
            if (!this.$store.getters['ledger/isConnected']) {
                return null;
            }
            var ledgerWallet = this.$store.getters['ledger/wallet'](address);
            return ledgerWallet ? ledgerWallet.name : null;
        },
        wallet_nameOnContact: function (address) {
            var contactWallets = this.$store.getters['wallet/contactsByProfileId'](this.session_profile.id);
            var contact = contactWallets.find(function (contact) { return contact.address === address; });
            return contact ? contact.name : null;
        },
        wallet_nameOnProfile: function (address) {
            var profileWallets = this.$store.getters['wallet/byProfileId'](this.session_profile.id);
            var profileWallet = profileWallets.find(function (wallet) { return wallet.address === address; });
            return profileWallet ? profileWallet.name : null;
        },
        wallet_name: function (address) {
            var ledgerWallet = this.wallet_nameOnLedger(address);
            if (ledgerWallet) {
                return ledgerWallet;
            }
            var profileWallet = this.wallet_nameOnProfile(address);
            if (profileWallet) {
                return profileWallet;
            }
            var contactWallet = this.wallet_nameOnContact(address);
            if (contactWallet) {
                return contactWallet;
            }
            var networkWallet = this.session_network.knownWallets[address];
            if (networkWallet) {
                return networkWallet;
            }
            var delegateWallet = this.$store.getters['delegate/byAddress'](address);
            if (delegateWallet) {
                return delegateWallet.username;
            }
            return null;
        },
        /**
         * @param {String} address
         * @param {Number} truncateLength
         */
        wallet_formatAddress: function (address, truncateLength) {
            var ledgerWallet = this.wallet_nameOnLedger(address);
            if (ledgerWallet) {
                return WalletService.validateAddress(ledgerWallet, this.session_network.version)
                    ? truncateMiddle(ledgerWallet, truncateLength)
                    : ledgerWallet;
            }
            var profileWallet = this.wallet_nameOnProfile(address);
            if (profileWallet) {
                return WalletService.validateAddress(profileWallet, this.session_network.version)
                    ? truncateMiddle(profileWallet, truncateLength)
                    : profileWallet;
            }
            var contactWallet = this.wallet_nameOnContact(address);
            if (contactWallet) {
                return WalletService.validateAddress(contactWallet, this.session_network.version)
                    ? truncateMiddle(contactWallet, truncateLength)
                    : contactWallet;
            }
            var networkWallet = this.session_network.knownWallets[address];
            if (networkWallet) {
                return networkWallet;
            }
            var delegate = this.$store.getters['delegate/byAddress'](address);
            if (delegate) {
                return delegate.username;
            }
            return Number.isFinite(truncateLength) ? truncateMiddle(address, truncateLength) : address;
        },
        /**
         * @param {String} value
         * @param {Number} truncateLength
         */
        wallet_truncate: function (value, truncateLength) {
            if (truncateLength === void 0) { truncateLength = 10; }
            return truncateMiddle(value, truncateLength);
        },
        /**
         * @param {Object[]} wallets
         */
        wallet_sortByName: function (wallets) {
            var _this = this;
            return wallets.slice()
                .map(function (wallet) {
                wallet.sortName = wallet.name || _this.wallet_name(wallet.address) || '';
                return wallet;
            })
                .sort(sortByProps(['sortName', 'address']))
                .map(function (wallet) {
                delete wallet.sortName;
                return wallet;
            });
        }
    }
};
//# sourceMappingURL=wallet.js.map