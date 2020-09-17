import { TRANSACTION_GROUPS, TRANSACTION_TYPES, TRANSACTION_TYPES_ENTITY } from '@config'

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
        asset.action === TRANSACTION_TYPES_ENTITY.ACTION.REGISTER
      )
    },

    transaction_isEntityResignation (type, typeGroup, asset) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.ENTITY &&
        asset &&
        asset.action === TRANSACTION_TYPES_ENTITY.ACTION.RESIGN
      )
    },

    transaction_isEntityUpdate (type, typeGroup, asset) {
      return (
        isMagistrateTypeGroup(typeGroup) &&
        type === TRANSACTION_TYPES.GROUP_2.ENTITY &&
        asset &&
        asset.action === TRANSACTION_TYPES_ENTITY.ACTION.UPDATE
      )
    },

    transaction_isBusinessEntityRegistration (type, typeGroup, asset) {
      return (
        this.transaction_isEntityRegistration(type, typeGroup, asset) &&
        asset.type === TRANSACTION_TYPES_ENTITY.TYPE.BUSINESS
        // asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isBusinessEntityResignation (type, typeGroup, asset) {
      return (
        this.transaction_isEntityResignation(type, typeGroup, asset) &&
        asset.type === TRANSACTION_TYPES_ENTITY.TYPE.BUSINESS
        // asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isBusinessEntityUpdate (type, typeGroup, asset) {
      return (
        this.transaction_isEntityUpdate(type, typeGroup, asset) &&
        asset.type === TRANSACTION_TYPES_ENTITY.TYPE.BUSINESS
        // asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isProductEntityRegistration (type, typeGroup, asset) {
      return (
        this.transaction_isEntityRegistration(type, typeGroup, asset) &&
        asset.type === TRANSACTION_TYPES_ENTITY.TYPE.PRODUCT
        // asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isProductEntityResignation (type, typeGroup, asset) {
      return (
        this.transaction_isEntityResignation(type, typeGroup, asset) &&
        asset.type === TRANSACTION_TYPES_ENTITY.TYPE.PRODUCT
        // asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isProductEntityUpdate (type, typeGroup, asset) {
      return (
        this.transaction_isEntityUpdate(type, typeGroup, asset) &&
        asset.type === TRANSACTION_TYPES_ENTITY.TYPE.PRODUCT
        // asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isPluginEntityRegistration (type, typeGroup, asset) {
      return (
        this.transaction_isEntityRegistration(type, typeGroup, asset) &&
        asset.type === TRANSACTION_TYPES_ENTITY.TYPE.PLUGIN
        // asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isPluginEntityResignation (type, typeGroup, asset) {
      return (
        this.transaction_isEntityResignation(type, typeGroup, asset) &&
        asset.type === TRANSACTION_TYPES_ENTITY.TYPE.PLUGIN
        // asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isPluginEntityUpdate (type, typeGroup, asset) {
      return (
        this.transaction_isEntityUpdate(type, typeGroup, asset) &&
        asset.type === TRANSACTION_TYPES_ENTITY.TYPE.PLUGIN
        // asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isModuleEntityRegistration (type, typeGroup, asset) {
      return (
        this.transaction_isEntityRegistration(type, typeGroup, asset) &&
        asset.type === TRANSACTION_TYPES_ENTITY.TYPE.MODULE
        // asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isModuleEntityResignation (type, typeGroup, asset) {
      return (
        this.transaction_isEntityResignation(type, typeGroup, asset) &&
        asset.type === TRANSACTION_TYPES_ENTITY.TYPE.MODULE
        // asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isModuleEntityUpdate (type, typeGroup, asset) {
      return (
        this.transaction_isEntityUpdate(type, typeGroup, asset) &&
        asset.type === TRANSACTION_TYPES_ENTITY.TYPE.MODULE
        // asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isDelegateEntityRegistration (type, typeGroup, asset) {
      return (
        this.transaction_isEntityRegistration(type, typeGroup, asset) &&
        asset.type === TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE
        // asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isDelegateEntityResignation (type, typeGroup, asset) {
      return (
        this.transaction_isEntityResignation(type, typeGroup, asset) &&
        asset.type === TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE
        // asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
      )
    },

    transaction_isDelegateEntityUpdate (type, typeGroup, asset) {
      return (
        this.transaction_isEntityUpdate(type, typeGroup, asset) &&
        asset.type === TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE
        // asset.subType === TRANSACTION_TYPES_ENTITY.SUBTYPE.NONE
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
    },

    // Unknown type

    transaction_isUndefinedRegistration (type, typeGroup, asset) {
      return (
        this.transaction_isEntityRegistration(type, typeGroup, asset) &&
        !Object.values(TRANSACTION_TYPES_ENTITY.TYPE).includes(
          asset.type
        )
      )
    },

    transaction_isUndefinedResignation (type, typeGroup, asset) {
      return (
        this.transaction_isEntityResignation(type, typeGroup, asset) &&
        !Object.values(TRANSACTION_TYPES_ENTITY.TYPE).includes(
          asset.type
        )
      )
    },

    transaction_isUndefinedUpdate (type, typeGroup, asset) {
      return (
        this.transaction_isEntityUpdate(type, typeGroup, asset) &&
        !Object.values(TRANSACTION_TYPES_ENTITY.TYPE).includes(
          asset.type
        )
      )
    }
  }
}
