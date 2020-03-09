<template>
  <div
    class="WalletSelection"
  >
    <InputSelect
      ref="input-profile"
      v-model="profileId"
      :items="profileList"
      :label="$t('WALLET_SELECTION.PROFILE')"
      name="profile"
      :class="profileClass"
      class="flex-1 mr-2"
      @select="onSelect"
    />

    <InputSelect
      ref="input-wallet"
      v-model="walletId"
      :is-disabled="!profileId"
      :items="walletList"
      :label="$t('WALLET_SELECTION.WALLET')"
      name="wallet"
      :class="walletClass"
      class="flex-1 mr-2"
      @select="onSelect"
    />
  </div>
</template>

<script>
import { orderBy } from 'lodash'
import { InputSelect } from '@/components/Input'
import truncate from '@/filters/truncate'

export default {
  name: 'WalletSelection',

  components: {
    InputSelect
  },

  model: {
    prop: 'value',
    event: 'input'
  },

  props: {
    value: {
      type: Object,
      required: false,
      default: undefined
    },
    compatibleAddress: {
      type: String,
      required: false,
      default: undefined
    },
    profileClass: {
      type: String,
      required: false,
      default: undefined
    },
    walletClass: {
      type: String,
      required: false,
      default: undefined
    }
  },

  data: vm => {
    return {
      currentProfileId: vm.value ? vm.value.profileId : null,
      currentWalletId: vm.value ? vm.value.id : null,
      wallet: vm.value,
      isProfileFocused: false,
      isWalletFocused: false
    }
  },

  computed: {
    model: {
      get () {
        return this.wallet
      },
      set (value) {
        if (value) {
          this.walletId = value.id
          this.$emit('input', value)
        }
      }
    },

    profileId: {
      get () {
        if (this.profiles.length === 1) {
          return this.profiles[0].id
        }

        return this.currentProfileId
      },
      set (profileId) {
        this.currentProfileId = profileId
      }
    },

    walletId: {
      get () {
        if (this.wallets.length === 1) {
          return this.wallets[0].id
        }

        return this.currentWalletId
      },
      set (walletId) {
        this.currentWalletId = walletId
      }
    },

    profiles () {
      if (this.compatibleAddress) {
        return this.$store.getters['profile/byCompatibleAddress'](this.compatibleAddress)
      } else {
        return this.$store.getters['profile/all']
      }
    },

    profileList () {
      return this.profiles.reduce((map, profile) => {
        map[profile.id] = profile.name

        return map
      }, {})
    },

    profile () {
      return this.$store.getters['profile/byId'](this.profileId)
    },

    wallets () {
      if (!this.profileId) {
        return []
      }

      const wallets = this.$store.getters['wallet/byProfileId'](this.profileId)
      const ledgerWallets = this.$store.getters['ledger/isConnected'] ? this.$store.getters['ledger/wallets'] : []
      if (ledgerWallets.length && this.profile && this.profile.networkId === this.session_network.id) {
        wallets.push(...ledgerWallets)
      }

      return wallets
    },

    walletList () {
      const addresses = this.wallets.map(wallet => {
        const address = {
          name: null,
          address: wallet.address
        }

        const walletName = this.wallet_name(wallet.address)
        if (walletName && walletName !== wallet.address) {
          address.name = `${truncate(walletName, 25)} (${this.wallet_truncate(wallet.address)})`
        }

        return address
      })

      const results = orderBy(addresses, (object) => {
        return object.name || object.address.toLowerCase()
      })

      return results.reduce((wallets, wallet) => {
        const value = wallet.name || wallet.address
        wallets[wallet.address] = value

        return wallets
      }, {})
    }
  },

  watch: {
    value (val) {
      this.wallet = val
    },

    wallet (wallet) {
      let profileId = null
      let walletId = null
      if (wallet && wallet.profileId) {
        profileId = wallet.profileId
        walletId = wallet.id
      }

      this.profileId = profileId
      this.walletId = walletId
      this.model = wallet
    },

    walletId (walletId) {
      this.wallet = this.wallets.find(wallet => wallet.id === walletId)
    }
  },

  methods: {
    focusProfile () {
      this.$refs['input-profile'].focus()
    },

    blurProfile () {
      this.$refs['input-profile'].blur()
    },

    blurDropdown () {
      this.$refs['input-profile'].blur()
      this.$refs['input-wallet'].blur()
    },

    focusWallet () {
      this.$refs['input-wallet'].focus()
    },

    blurWallet () {
      this.$refs['input-wallet'].blur()
    },

    onSelect () {
      this.$emit('select')
    }
  }
}
</script>
