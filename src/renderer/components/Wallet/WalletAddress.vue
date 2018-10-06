
<template>
  <span>
    <span v-if="!type">
      <span v-tooltip="address">{{ wallet_formatAddress(address, 10) }}</span>
    </span>
    <span v-else-if="type === 1">{{ $t("TRANSACTION.TYPE.SECOND_SIGNATURE") }}</span>
    <span v-else-if="type === 2">{{ $t("TRANSACTION.TYPE.DELEGATE_REGISTRATION") }}</span>
    <span v-else-if="type === 3">
      {{ isUnvote ? $t("TRANSACTION.TYPE.UNVOTE") : $t("TRANSACTION.TYPE.VOTE") }}
    </span>
    <!-- TODO: extend vote with vote / unvote information -->
    <span v-else-if="type === 4">{{ $t("TRANSACTION.TYPE.MULTI_SIGNATURE") }}</span>
    <span v-else-if="type === 5">{{ $t("TRANSACTION.TYPE.IPFS") }}</span>
    <span v-else-if="type === 6">{{ $t("TRANSACTION.TYPE.TIMELOCK_TRANSFER") }}</span>
    <span v-else-if="type === 7">{{ $t("TRANSACTION.TYPE.MULTI_PAYMENT") }}</span>
    <span v-else-if="type === 8">{{ $t("TRANSACTION.TYPE.DELEGATE_RESIGNATION") }}</span>
  </span>
</template>

<script>

export default {
  name: 'WalletAddress',

  props: {
    address: {
      type: String,
      required: true
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

  computed: {
    isUnvote () {
      if (this.asset && this.asset.votes) {
        const vote = this.asset.votes[0]
        return vote.charAt(0) === '-'
      }
      return false
    }
  }
}

</script>
