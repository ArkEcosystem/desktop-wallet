import { TRANSACTION_GROUPS, TRANSACTION_TYPES, TRANSACTION_ENTITY } from '@config'

const isStandardTypeGroup = typeGroup => {
  return typeGroup === TRANSACTION_GROUPS.STANDARD
}

const isMagistrateTypeGroup = typeGroup => {
  return typeGroup === TRANSACTION_GROUPS.MAGISTRATE
}

export default {
  methods: {
    transaction_isTransfer (type, typeGroup) {
      return isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.TRANSFER
    },

    transaction_isSecondSignature (type, typeGroup) {
      return (
        isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.SECOND_SIGNATURE
      )
    },

    transaction_isDelegateRegistration (type, typeGroup) {
      return (
        isStandardTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_1.DELEGATE_REGISTRATION
      )
    },

    transaction_isVote (type, typeGroup) {
      return isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.VOTE
    },

    transaction_isMultiSignature (type, typeGroup) {
      return (
        isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE
      )
    },

    transaction_isIpfs (type, typeGroup) {
      return isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.IPFS
    },

    transaction_isMultiPayment (type, typeGroup) {
      return (
        isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.MULTI_PAYMENT
      )
    },

    transaction_isDelegateResignation (type, typeGroup) {
      return (
        isStandardTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_1.DELEGATE_RESIGNATION
      )
    },

    transaction_isTimelock (type, typeGroup) {
      return isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.HTLC_LOCK
    },

    transaction_isTimelockClaim (type, typeGroup) {
      return (
        isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.HTLC_CLAIM
      )
    },

    transaction_isTimelockRefund (type, typeGroup) {
      return (
        isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.HTLC_REFUND
      )
    },

    // Magistrate 2.0

    transaction_isEntityRegistration (type, typeGroup, asset) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.ENTITY &&
        asset &&
        asset.action === TRANSACTION_ENTITY.ACTION.REGISTER
      )
    },

    transaction_isEntityResignation (type, typeGroup, asset) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.ENTITY &&
        asset &&
        asset.action === TRANSACTION_ENTITY.ACTION.RESIGN
      )
    },

    transaction_isEntityUpdate (type, typeGroup, asset) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.ENTITY &&
        asset &&
        asset.action === TRANSACTION_ENTITY.ACTION.UPDATE
      )
    },

    transaction_isBusinessEntityRegistration (type, typeGroup, asset) {
      return (
        this.transaction_isEntityRegistration(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.BUSINESS &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isBusinessEntityResignation (type, typeGroup, asset) {
      return (
        this.transaction_isEntityResignation(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.BUSINESS &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isBusinessEntityUpdate (type, typeGroup, asset) {
      return (
        this.transaction_isEntityUpdate(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.BUSINESS &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isDeveloperEntityRegistration (type, typeGroup, asset) {
      return (
        this.transaction_isEntityRegistration(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.DEVELOPER &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isDeveloperEntityResignation (type, typeGroup, asset) {
      return (
        this.transaction_isEntityResignation(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.DEVELOPER &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isDeveloperEntityUpdate (type, typeGroup, asset) {
      return (
        this.transaction_isEntityUpdate(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.DEVELOPER &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isCorePluginEntityRegistration (type, typeGroup, asset) {
      return (
        this.transaction_isEntityRegistration(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.PLUGIN &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.PLUGIN_CORE
      )
    },

    transaction_isCorePluginEntityResignation (type, typeGroup, asset) {
      return (
        this.transaction_isEntityResignation(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.PLUGIN &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.PLUGIN_CORE
      )
    },

    transaction_isCorePluginEntityUpdate (type, typeGroup, asset) {
      return (
        this.transaction_isEntityUpdate(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.PLUGIN &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.PLUGIN_CORE
      )
    },

    transaction_isDesktopPluginEntityRegistration (type, typeGroup, asset) {
      return (
        this.transaction_isEntityRegistration(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.PLUGIN &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.PLUGIN_DESKTOP
      )
    },

    transaction_isDesktopPluginEntityResignation (type, typeGroup, asset) {
      return (
        this.transaction_isEntityResignation(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.PLUGIN &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.PLUGIN_DESKTOP
      )
    },

    transaction_isDesktopPluginEntityUpdate (type, typeGroup, asset) {
      return (
        this.transaction_isEntityUpdate(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.PLUGIN &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.PLUGIN_DESKTOP
      )
    },

    transaction_isDelegateEntityRegistration (type, typeGroup, asset) {
      return (
        this.transaction_isEntityRegistration(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.DELEGATE &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isDelegateEntityResignation (type, typeGroup, asset) {
      return (
        this.transaction_isEntityResignation(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.DELEGATE &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isDelegateEntityUpdate (type, typeGroup, asset) {
      return (
        this.transaction_isEntityUpdate(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.DELEGATE &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    // Magistrate 1.0

    transaction_isLegacyBusinessRegistration (type, typeGroup) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.BUSINESS_REGISTRATION
      )
    },

    transaction_isLegacyBusinessResignation (type, typeGroup) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.BUSINESS_RESIGNATION
      )
    },

    transaction_isLegacyBusinessUpdate (type, typeGroup) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.BUSINESS_UPDATE
      )
    },

    transaction_isLegacyBridgechainRegistration (type, typeGroup) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_REGISTRATION
      )
    },

    transaction_isLegacyBridgechainResignation (type, typeGroup) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_RESIGNATION
      )
    },

    transaction_isLegacyBridgechainUpdate (type, typeGroup) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_UPDATE
      )
    }
  }
}
