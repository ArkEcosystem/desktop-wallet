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
import { InputSelect } from '@/components/Input'

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
      return this.profiles.reduce((map, profile, index) => {
        map[profile.id] = profile.name

        return map
      }, {})
    },

    wallets () {
      if (!this.profileId) {
        return []
      }

      return this.$store.getters['wallet/byProfileId'](this.profileId)
    },

    walletList () {
      return this.wallets.reduce((map, wallet, index) => {
        map[wallet.id] = wallet.name

        return map
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
