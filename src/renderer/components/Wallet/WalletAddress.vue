<template>
  <span class="WalletAddress flex items-center">
    <span
      v-if="!type"
      v-tooltip="{
        content: address,
        container: tooltipContainer
      }"
    >
      <a @click.stop="onClick">
        {{ wallet_formatAddress(address, addressLength) }}
      </a>
    </span>
    <span v-else-if="type === 1">
      {{ $t("TRANSACTION.TYPE.SECOND_SIGNATURE") }}
    </span>
    <span v-else-if="type === 2">
      {{ $t("TRANSACTION.TYPE.DELEGATE_REGISTRATION") }}
    </span>
    <span
      v-else-if="type === 3"
      v-tooltip="{
        content: votedDelegateAddress,
        container: tooltipContainer
      }"
    >
      <a
        :class="[isUnvote ? 'text-red' : 'text-green']"
        @click.stop="onClick"
      >
        {{ isUnvote ? $t("TRANSACTION.TYPE.UNVOTE") : $t("TRANSACTION.TYPE.VOTE") }}
        <span
          v-if="votedDelegate"
          class="italic"
        >
          ({{ votedDelegateUsername }})
        </span>
      </a>
    </span>
    <span v-else-if="type === 4">
      {{ $t("TRANSACTION.TYPE.MULTI_SIGNATURE") }}
    </span>
    <span v-else-if="type === 5">
      {{ $t("TRANSACTION.TYPE.IPFS") }}
    </span>
    <span v-else-if="type === 6">
      {{ $t("TRANSACTION.TYPE.TIMELOCK_TRANSFER") }}
    </span>
    <span v-else-if="type === 7">
      {{ $t("TRANSACTION.TYPE.MULTI_PAYMENT") }}
    </span>
    <span v-else-if="type === 8">
      {{ $t("TRANSACTION.TYPE.DELEGATE_RESIGNATION") }}
    </span>

    <SvgIcon
      v-if="isKnownWallet()"
      v-tooltip="{ content: verifiedAddressText, trigger: 'hover' }"
      name="verified-address"
      view-box="0 0 14 14"
      class="ml-2 text-blue"
    />
  </span>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'WalletAddress',

  components: {
    SvgIcon
  },

  props: {
    address: {
      type: String,
      required: false,
      default: () => ''
    },
    asset: {
      type: Object,
      required: false,
      default: () => {}
    },
    type: {
      type: Number,
      required: false,
      default: () => 0
    },
    tooltipContainer: {
      type: String,
      required: false,
      default: () => '#app'
    },
    addressLength: {
      type: Number,
      required: false,
      default: 10
    }
  },

  computed: {
    isUnvote () {
      if (this.asset && this.asset.votes) {
        const vote = this.asset.votes[0]
        return vote.charAt(0) === '-'
      }
      return false
    },

    votePublicKey () {
      if (this.asset && this.asset.votes) {
        const vote = this.asset.votes[0]
        return vote.substr(1)
      }
      return ''
    },

    votedDelegate () {
      if (this.votePublicKey) {
        return this.$store.getters['delegate/byPublicKey'](this.votePublicKey)
      }

      return null
    },

    votedDelegateUsername () {
      return this.votedDelegate ? this.votedDelegate.username : ''
    },

    votedDelegateAddress () {
      return this.votedDelegate ? this.votedDelegate.address : ''
    },

    verifiedAddressText () {
      let verifiedText = ''
      let knownWallet = this.isKnownWallet()
      if (knownWallet && knownWallet !== this.wallet_formatAddress(this.address, this.addressLength)) {
        verifiedText = `${knownWallet} - `
      }

      return verifiedText + this.$t('COMMON.VERIFIED_ADDRESS')
    }
  },

  methods: {
    isKnownWallet () {
      return this.session_network.knownWallets[this.address]
    },

    onClick () {
      this.openAddress()
      this.$emit('click')
    },

    openAddress () {
      if (this.votePublicKey) {
        this.$router.push({ name: 'wallet-show', params: { address: this.votedDelegateAddress } })
      } else {
        this.$router.push({ name: 'wallet-show', params: { address: this.address } })
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.WalletAddress > span {
  @apply truncate
}
</style>
