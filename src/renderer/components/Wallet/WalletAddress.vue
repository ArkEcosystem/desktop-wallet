<template>
  <span class="WalletAddress flex items-center">
    <span
      v-if="transaction_isSecondSignature(type, group)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.SECOND_SIGNATURE'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.SECOND_SIGNATURE") }}
    </span>
    <span
      v-else-if="transaction_isDelegateRegistration(type, group)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.DELEGATE_REGISTRATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
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
    <span
      v-else-if="transaction_isMultiSignature(type, group)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.MULTI_SIGNATURE'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.MULTI_SIGNATURE") }}
    </span>
    <span
      v-else-if="transaction_isIpfs(type, group)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.IPFS'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.IPFS") }}
    </span>
    <span
      v-else-if="transaction_isMultiPayment(type, group)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.MULTI_PAYMENT'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.MULTI_PAYMENT") }}
    </span>
    <span
      v-else-if="transaction_isDelegateResignation(type, group)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.DELEGATE_RESIGNATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.DELEGATE_RESIGNATION") }}
    </span>
    <span
      v-else-if="transaction_isTimelock(type, group)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.HTLC_LOCK'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.HTLC_LOCK") }}
    </span>
    <span
      v-else-if="transaction_isTimelockClaim(type, group)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.HTLC_CLAIM'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.HTLC_CLAIM") }}
    </span>
    <span
      v-else-if="transaction_isTimelockRefund(type, group)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.HTLC_REFUND'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.HTLC_REFUND") }}
    </span>
    <!-- Magistrate 2.0 -->
    <span
      v-else-if="transaction_isBusinessEntityRegistration(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.BUSINESS_ENTITY_REGISTRATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.BUSINESS_ENTITY_REGISTRATION") }}
    </span>
    <span
      v-else-if="transaction_isBusinessEntityResignation(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.BUSINESS_ENTITY_RESIGNATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.BUSINESS_ENTITY_RESIGNATION") }}
    </span>
    <span
      v-else-if="transaction_isBusinessEntityUpdate(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.BUSINESS_ENTITY_UPDATE'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.BUSINESS_ENTITY_UPDATE") }}
    </span>
    <span
      v-else-if="transaction_isProductEntityRegistration(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.PRODUCT_ENTITY_REGISTRATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.PRODUCT_ENTITY_REGISTRATION") }}
    </span>
    <span
      v-else-if="transaction_isProductEntityResignation(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.PRODUCT_ENTITY_RESIGNATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.PRODUCT_ENTITY_RESIGNATION") }}
    </span>
    <span
      v-else-if="transaction_isProductEntityUpdate(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.PRODUCT_ENTITY_UPDATE'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.PRODUCT_ENTITY_UPDATE") }}
    </span>
    <span
      v-else-if="transaction_isPluginEntityRegistration(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.PLUGIN_ENTITY_REGISTRATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.PLUGIN_ENTITY_REGISTRATION") }}
    </span>
    <span
      v-else-if="transaction_isPluginEntityResignation(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.PLUGIN_ENTITY_RESIGNATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.PLUGIN_ENTITY_RESIGNATION") }}
    </span>
    <span
      v-else-if="transaction_isPluginEntityUpdate(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.PLUGIN_ENTITY_UPDATE'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.PLUGIN_ENTITY_UPDATE") }}
    </span>
    <span
      v-else-if="transaction_isModuleEntityRegistration(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.MODULE_ENTITY_REGISTRATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.MODULE_ENTITY_REGISTRATION") }}
    </span>
    <span
      v-else-if="transaction_isModuleEntityResignation(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.MODULE_ENTITY_RESIGNATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.MODULE_ENTITY_RESIGNATION") }}
    </span>
    <span
      v-else-if="transaction_isModuleEntityUpdate(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.MODULE_ENTITY_UPDATE'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.MODULE_ENTITY_UPDATE") }}
    </span>
    <span
      v-else-if="transaction_isDelegateEntityRegistration(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.DELEGATE_ENTITY_REGISTRATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.DELEGATE_ENTITY_REGISTRATION") }}
    </span>
    <span
      v-else-if="transaction_isDelegateEntityResignation(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.DELEGATE_ENTITY_RESIGNATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.DELEGATE_ENTITY_RESIGNATION") }}
    </span>
    <span
      v-else-if="transaction_isDelegateEntityUpdate(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.DELEGATE_ENTITY_UPDATE'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.DELEGATE_ENTITY_UPDATE") }}
    </span>
    <!-- Magistrate 1.0 -->
    <span
      v-else-if="transaction_isLegacyBusinessRegistration(type, group)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.LEGACY_BUSINESS_REGISTRATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.LEGACY_BUSINESS_REGISTRATION") }}
    </span>
    <span
      v-else-if="transaction_isLegacyBusinessResignation(type, group)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.LEGACY_BUSINESS_RESIGNATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.LEGACY_BUSINESS_RESIGNATION") }}
    </span>
    <span
      v-else-if="transaction_isLegacyBusinessUpdate(type, group)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.LEGACY_BUSINESS_UPDATE'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.LEGACY_BUSINESS_UPDATE") }}
    </span>
    <span
      v-else-if="transaction_isLegacyBridgechainRegistration(type, group)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.LEGACY_BRIDGECHAIN_REGISTRATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.LEGACY_BRIDGECHAIN_REGISTRATION") }}
    </span>
    <span
      v-else-if="transaction_isLegacyBridgechainResignation(type, group)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.LEGACY_BRIDGECHAIN_RESIGNATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.LEGACY_BRIDGECHAIN_RESIGNATION") }}
    </span>
    <span
      v-else-if="transaction_isLegacyBridgechainUpdate(type, group)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.LEGACY_BRIDGECHAIN_UPDATE'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.LEGACY_BRIDGECHAIN_UPDATE") }}
    </span>
    <!-- Unknown type -->
    <span
      v-else-if="transaction_isUndefinedRegistration(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.UNDEFINED_REGISTRATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.UNDEFINED_REGISTRATION") }}
    </span>
    <span
      v-else-if="transaction_isUndefinedResignation(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.UNDEFINED_RESIGNATION'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.UNDEFINED_RESIGNATION") }}
    </span>
    <span
      v-else-if="transaction_isUndefinedUpdate(type, group, asset)"
      v-tooltip="{
        content: $t('TRANSACTION.TYPE.UNDEFINED_UPDATE'),
        container: tooltipContainer,
        delay: { show: 300, hide: 0 },
        show: showTooltip,
        trigger: 'manual'
      }"
      @mouseover="onMouseOver"
      @mouseout="onMouseOut"
    >
      {{ $t("TRANSACTION.TYPE.UNDEFINED_UPDATE") }}
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
