import truncateMiddle from '@/filters/truncate-middle'
import WalletService from '@/services/wallet'

export default {
  computed: {
    wallet_fromRoute () {
      const params = this.$route.params
      if (!params || !params.address) {
        return
      }

      const address = params.address
      let wallet = this.$store.getters['wallet/byAddress'](address)

      if (this.$store.getters['ledger/isConnected'] && !wallet) {
        const ledgerWallet = this.$store.getters['ledger/wallet'](address)
        if (ledgerWallet) {
          wallet = ledgerWallet
        }
      }

      return wallet
    }
  },

  methods: {
    wallet_nameOnLedger (address) {
      if (!this.$store.getters['ledger/isConnected']) {
        return null
      }
      const ledgerWallet = this.$store.getters['ledger/wallet'](address)

      return ledgerWallet ? ledgerWallet.name : null
    },

    wallet_nameOnContact (address) {
      const contactWallets = this.$store.getters['wallet/contactsByProfileId'](this.session_profile.id)
      const contact = contactWallets.find(contact => contact.address === address)
      return contact ? contact.name : null
    },

    wallet_nameOnProfile (address) {
      const profileWallets = this.$store.getters['wallet/byProfileId'](this.session_profile.id)
      const profileWallet = profileWallets.find(wallet => wallet.address === address)
      return profileWallet ? profileWallet.name : null
    },

    wallet_name (address) {
      const ledgerWallet = this.wallet_nameOnLedger(address)
      if (ledgerWallet) {
        return ledgerWallet
      }

      const profileWallet = this.wallet_nameOnProfile(address)
      if (profileWallet) {
        return profileWallet
      }

      const contactWallet = this.wallet_nameOnContact(address)
      if (contactWallet) {
        return contactWallet
      }

      const networkWallet = this.session_network.knownWallets[address]
      if (networkWallet) {
        return networkWallet
      }

      const delegateWallet = this.$store.getters['delegate/byAddress'](address)
      if (delegateWallet) {
        return delegateWallet.username
      }

      return null
    },

    /**
     * @param {String} address
     * @param {Number} truncateLength
     */
    wallet_formatAddress (address, truncateLength) {
      const ledgerWallet = this.wallet_nameOnLedger(address)
      if (ledgerWallet) {
        return WalletService.validateAddress(ledgerWallet, this.session_network.version)
          ? truncateMiddle(ledgerWallet, truncateLength)
          : ledgerWallet
      }

      const profileWallet = this.wallet_nameOnProfile(address)
      if (profileWallet) {
        return WalletService.validateAddress(profileWallet, this.session_network.version)
          ? truncateMiddle(profileWallet, truncateLength)
          : profileWallet
      }

      const contactWallet = this.wallet_nameOnContact(address)
      if (contactWallet) {
        return WalletService.validateAddress(contactWallet, this.session_network.version)
          ? truncateMiddle(contactWallet, truncateLength)
          : contactWallet
      }

      const networkWallet = this.session_network.knownWallets[address]
      if (networkWallet) {
        return networkWallet
      }

      const delegate = this.$store.getters['delegate/byAddress'](address)
      if (delegate) {
        return delegate.username
      }

      return Number.isFinite(truncateLength) ? truncateMiddle(address, truncateLength) : address
    },

    /**
     * @param {String} value
     * @param {Number} truncateLength
     */
    wallet_truncate (value, truncateLength = 10) {
      return truncateMiddle(value, truncateLength)
    }
  }
}
