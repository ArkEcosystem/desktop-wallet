
<template>
  <span>
    <span v-if="!type">
      <a
        v-tooltip="address"
        href="#"
        @click.stop="openAddress"
      >
        {{ wallet_formatAddress(address, 10) }}
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
      :class="[isUnvote ? 'text-red' : 'text-green']"
    >
      {{ isUnvote ? $t("TRANSACTION.TYPE.UNVOTE") : $t("TRANSACTION.TYPE.VOTE") }}
      <span
        v-if="votedDelegate"
        class="italic"
      >
        ({{ votedDelegateUsername }})
      </span>
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
  </span>
</template>

<script>
import store from '@/store'

export default {
  name: 'WalletAddress',

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
    }
  },

  data: () => ({
    votedDelegate: null
  }),

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

    votedDelegateUsername () {
      return this.votedDelegate ? this.votedDelegate.username : ''
    }
  },

  mounted () {
    if (this.votePublicKey) {
      this.determineVote()
    }
  },

  methods: {
    determineVote () {
      this.votedDelegate = store.getters['delegate/byPublicKey'](this.votePublicKey)
    },

    openAddress () {
      this.$router.push({ name: 'wallet-show', params: { address: this.address } })
    }
  }
}
</script>
