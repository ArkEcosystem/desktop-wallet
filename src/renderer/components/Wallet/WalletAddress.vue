<template>
  <span class="WalletAddress flex items-center">
    <span v-if="transaction_isSecondSignature(type, group)">
      {{ $t("TRANSACTION.TYPE.SECOND_SIGNATURE") }}
    </span>
    <span v-else-if="transaction_isDelegateRegistration(type, group)">
      {{ $t("TRANSACTION.TYPE.DELEGATE_REGISTRATION") }}
    </span>
    <span
      v-else-if="transaction_isVote(type, group)"
      v-tooltip="{
        content: votedDelegateAddress,
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
    >
      <a
        :class="[isUnvote ? 'text-red' : 'text-green']"
        @click.stop="onClick"
        @mouseover="onMouseOver"
        @mouseout="onMouseOut"
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
    <span v-else-if="transaction_isMultiSignature(type, group)">
      {{ $t("TRANSACTION.TYPE.MULTI_SIGNATURE") }}
    </span>
    <span v-else-if="transaction_isIpfs(type, group)">
      {{ $t("TRANSACTION.TYPE.IPFS") }}
    </span>
    <span v-else-if="transaction_isMultiPayment(type, group)">
      {{ $t("TRANSACTION.TYPE.MULTI_PAYMENT") }}
    </span>
    <span v-else-if="transaction_isDelegateResignation(type, group)">
      {{ $t("TRANSACTION.TYPE.DELEGATE_RESIGNATION") }}
    </span>
    <span v-else-if="transaction_isTimelock(type, group)">
      {{ $t("TRANSACTION.TYPE.HTLC_LOCK") }}
    </span>
    <span v-else-if="transaction_isTimelockClaim(type, group)">
      {{ $t("TRANSACTION.TYPE.HTLC_CLAIM") }}
    </span>
    <span v-else-if="transaction_isTimelockRefund(type, group)">
      {{ $t("TRANSACTION.TYPE.HTLC_REFUND") }}
    </span>
    <!-- Magistrate 2.0 -->
    <span v-else-if="transaction_isBusinessEntityRegistration(type, group, asset)">
      {{ $t("TRANSACTION.TYPE.BUSINESS_ENTITY_REGISTRATION") }}
    </span>
    <span v-else-if="transaction_isBusinessEntityResignation(type, group, asset)">
      {{ $t("TRANSACTION.TYPE.BUSINESS_ENTITY_RESIGNATION") }}
    </span>
    <span v-else-if="transaction_isBusinessEntityUpdate(type, group, asset)">
      {{ $t("TRANSACTION.TYPE.BUSINESS_ENTITY_UPDATE") }}
    </span>
    <span v-else-if="transaction_isDeveloperEntityRegistration(type, group, asset)">
      {{ $t("TRANSACTION.TYPE.DEVELOPER_ENTITY_REGISTRATION") }}
    </span>
    <span v-else-if="transaction_isDeveloperEntityResignation(type, group, asset)">
      {{ $t("TRANSACTION.TYPE.DEVELOPER_ENTITY_RESIGNATION") }}
    </span>
    <span v-else-if="transaction_isDeveloperEntityUpdate(type, group, asset)">
      {{ $t("TRANSACTION.TYPE.DEVELOPER_ENTITY_UPDATE") }}
    </span>
    <span v-else-if="transaction_isCorePluginEntityRegistration(type, group, asset)">
      {{ $t("TRANSACTION.TYPE.CORE_PLUGIN_ENTITY_REGISTRATION") }}
    </span>
    <span v-else-if="transaction_isCorePluginEntityResignation(type, group, asset)">
      {{ $t("TRANSACTION.TYPE.CORE_PLUGIN_ENTITY_RESIGNATION") }}
    </span>
    <span v-else-if="transaction_isCorePluginEntityUpdate(type, group, asset)">
      {{ $t("TRANSACTION.TYPE.CORE_PLUGIN_ENTITY_UPDATE") }}
    </span>
    <span v-else-if="transaction_isDesktopPluginEntityRegistration(type, group, asset)">
      {{ $t("TRANSACTION.TYPE.DESKTOP_PLUGIN_ENTITY_REGISTRATION") }}
    </span>
    <span v-else-if="transaction_isDesktopPluginEntityResignation(type, group, asset)">
      {{ $t("TRANSACTION.TYPE.DESKTOP_PLUGIN_ENTITY_RESIGNATION") }}
    </span>
    <span v-else-if="transaction_isDesktopPluginEntityUpdate(type, group, asset)">
      {{ $t("TRANSACTION.TYPE.DESKTOP_PLUGIN_ENTITY_UPDATE") }}
    </span>
    <span v-else-if="transaction_isDelegateEntityRegistration(type, group, asset)">
      {{ $t("TRANSACTION.TYPE.DELEGATE_ENTITY_REGISTRATION") }}
    </span>
    <span v-else-if="transaction_isDelegateEntityResignation(type, group, asset)">
      {{ $t("TRANSACTION.TYPE.DELEGATE_ENTITY_RESIGNATION") }}
    </span>
    <span v-else-if="transaction_isDelegateEntityUpdate(type, group, asset)">
      {{ $t("TRANSACTION.TYPE.DELEGATE_ENTITY_UPDATE") }}
    </span>
    <!-- Magistrate 1.0 -->
    <span v-else-if="transaction_isLegacyBusinessRegistration(type, group)">
      {{ $t("TRANSACTION.TYPE.LEGACY_BUSINESS_REGISTRATION") }}
    </span>
    <span v-else-if="transaction_isLegacyBusinessResignation(type, group)">
      {{ $t("TRANSACTION.TYPE.LEGACY_BUSINESS_RESIGNATION") }}
    </span>
    <span v-else-if="transaction_isLegacyBusinessUpdate(type, group)">
      {{ $t("TRANSACTION.TYPE.LEGACY_BUSINESS_UPDATE") }}
    </span>
    <span v-else-if="transaction_isLegacyBridgechainRegistration(type, group)">
      {{ $t("TRANSACTION.TYPE.LEGACY_BRIDGECHAIN_REGISTRATION") }}
    </span>
    <span v-else-if="transaction_isLegacyBridgechainResignation(type, group)">
      {{ $t("TRANSACTION.TYPE.LEGACY_BRIDGECHAIN_RESIGNATION") }}
    </span>
    <span v-else-if="transaction_isLegacyBridgechainUpdate(type, group)">
      {{ $t("TRANSACTION.TYPE.LEGACY_BRIDGECHAIN_UPDATE") }}
    </span>
    <span
      v-else
      v-tooltip="{
        content: address,
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
    >
      <a
        @click.stop="onClick"
        @mouseover="onMouseOver"
        @mouseout="onMouseOut"
      >
        <slot>
          {{ wallet_formatAddress(address, addressLength) }}
        </slot>
      </a>
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
    group: {
      type: Number,
      required: false,
      default: () => 1
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

  data: () => ({
    showTooltip: false
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
      const knownWallet = this.isKnownWallet()
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
      this.showTooltip = false
      this.$emit('click')
      this.openAddress()
    },

    onMouseOver () {
      this.showTooltip = true
    },

    onMouseOut () {
      this.showTooltip = false
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
  @apply .truncate;
  padding-right: 1px;
}

.WalletAddress a {
  @apply cursor-pointer
}
</style>
