import { TRANSACTION_GROUPS, TRANSACTION_TYPES, TRANSACTION_ENTITY } from '@config'

const isStandardTypeGroup = typeGroup => {
  return typeGroup === TRANSACTION_GROUPS.STANDARD
}

const isMagistrateTypeGroup = typeGroup => {
  return typeGroup === TRANSACTION_GROUPS.MAGISTRATE
}

export default {
  methods: {
    isTransfer (type, typeGroup, asset) {
      return isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.TRANSFER
    },

    isSecondSignature (type, typeGroup, asset) {
      return (
        isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.SECOND_SIGNATURE
      )
    },

    isDelegateRegistration (type, typeGroup, asset) {
      return (
        isStandardTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_1.DELEGATE_REGISTRATION
      )
    },

    isVote (type, typeGroup, asset) {
      return isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.VOTE
    },

    isMultiSignature (type, typeGroup, asset) {
      return (
        isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.MULTI_SIGNATURE
      )
    },

    isIpfs (type, typeGroup, asset) {
      return isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.IPFS
    },

    isMultiPayment (type, typeGroup, asset) {
      return (
        isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.MULTI_PAYMENT
      )
    },

    isDelegateResignation (type, typeGroup, asset) {
      return (
        isStandardTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_1.DELEGATE_RESIGNATION
      )
    },

    isTimelock (type, typeGroup, asset) {
      return isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.HTLC_LOCK
    },

    isTimelockClaim (type, typeGroup, asset) {
      return (
        isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.HTLC_CLAIM
      )
    },

    isTimelockRefund (type, typeGroup, asset) {
      return (
        isStandardTypeGroup(typeGroup) && type === TRANSACTION_TYPES.GROUP_1.HTLC_REFUND
      )
    },

    // Magistrate 2.0

    isEntityRegistration (type, typeGroup, asset) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.ENTITY &&
        asset &&
        asset.action === TRANSACTION_ENTITY.ACTION.REGISTER
      )
    },

    isEntityResignation (type, typeGroup, asset) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.ENTITY &&
        asset &&
        asset.action === TRANSACTION_ENTITY.ACTION.RESIGN
      )
    },

    isEntityUpdate (type, typeGroup, asset) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.ENTITY &&
        asset &&
        asset.action === TRANSACTION_ENTITY.ACTION.UPDATE
      )
    },

    isBusinessEntityRegistration (type, typeGroup, asset) {
      return (
        this.isEntityRegistration(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.BUSINESS &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    isBusinessEntityResignation (type, typeGroup, asset) {
      return (
        this.isEntityResignation(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.BUSINESS &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    isBusinessEntityUpdate (type, typeGroup, asset) {
      return (
        this.isEntityUpdate(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.BUSINESS &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    isDeveloperEntityRegistration (type, typeGroup, asset) {
      return (
        this.isEntityRegistration(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.DEVELOPER &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    isDeveloperEntityResignation (type, typeGroup, asset) {
      return (
        this.isEntityResignation(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.DEVELOPER &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    isDeveloperEntityUpdate (type, typeGroup, asset) {
      return (
        this.isEntityUpdate(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.DEVELOPER &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    isCorePluginEntityRegistration (type, typeGroup, asset) {
      return (
        this.isEntityRegistration(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.PLUGIN &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.PLUGIN_CORE
      )
    },

    isCorePluginEntityResignation (type, typeGroup, asset) {
      return (
        this.isEntityResignation(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.PLUGIN &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.PLUGIN_CORE
      )
    },

    isCorePluginEntityUpdate (type, typeGroup, asset) {
      return (
        this.isEntityUpdate(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.PLUGIN &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.PLUGIN_CORE
      )
    },

    isDesktopPluginEntityRegistration (type, typeGroup, asset) {
      return (
        this.isEntityRegistration(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.PLUGIN &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.PLUGIN_DESKTOP
      )
    },

    isDesktopPluginEntityResignation (type, typeGroup, asset) {
      return (
        this.isEntityResignation(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.PLUGIN &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.PLUGIN_DESKTOP
      )
    },

    isDesktopPluginEntityUpdate (type, typeGroup, asset) {
      return (
        this.isEntityUpdate(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.PLUGIN &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.PLUGIN_DESKTOP
      )
    },

    isDelegateEntityRegistration (type, typeGroup, asset) {
      return (
        this.isEntityRegistration(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.DELEGATE &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    isDelegateEntityResignation (type, typeGroup, asset) {
      return (
        this.isEntityResignation(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.DELEGATE &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    isDelegateEntityUpdate (type, typeGroup, asset) {
      return (
        this.isEntityUpdate(type, typeGroup, asset) &&
        asset.type === TRANSACTION_ENTITY.TYPE.DELEGATE &&
        asset.subType === TRANSACTION_ENTITY.SUBTYPE.NONE
      )
    },

    // Magistrate 1.0

    isLegacyBusinessRegistration (type, typeGroup, asset) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.BUSINESS_REGISTRATION
      )
    },

    isLegacyBusinessResignation (type, typeGroup, asset) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.BUSINESS_RESIGNATION
      )
    },

    isLegacyBusinessUpdate (type, typeGroup, asset) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.BUSINESS_UPDATE
      )
    },
    isLegacyBridgechainRegistration (type, typeGroup, asset) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_REGISTRATION
      )
    },

    isLegacyBridgechainResignation (type, typeGroup, asset) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_RESIGNATION
      )
    },

    isLegacyBridgechainUpdate (type, typeGroup, asset) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_UPDATE
      )
    }
  }
}
