import { DelegateResignationBuilder } from './delegate-resignation.builder'
import { EntityBuilder } from './entity.builder'
import { MultiPaymentBuilder } from './multi-payment.builder'
import { IpfsBuilder } from './ipfs.builder'
import { MultiSignatureBuilder } from './multi-signature.builder'
import { SecondSignatureRegistrationBuilder } from './second-signature-registration.builder'
import { TransferBuilder } from './transfer.builder'
import { DelegateRegistrationBuilder } from './delegate-registration.builder'
import { VoteBuilder } from './vote.builder'

import './configure-magistrate-transactions'

export class TransactionBuilderService {
  static async buildTransfer (data, isAdvancedFee = false, returnObject = false) {
    return TransferBuilder.build(data, isAdvancedFee, returnObject)
  }

  static async buildSecondSignatureRegistration (
    data,
    isAdvancedFee = false,
    returnObject = false
  ) {
    return SecondSignatureRegistrationBuilder.build(
      data,
      isAdvancedFee,
      returnObject
    )
  }

  static async buildDelegateRegistration (
    data,
    isAdvancedFee = false,
    returnObject = false
  ) {
    return DelegateRegistrationBuilder.build(data, isAdvancedFee, returnObject)
  }

  static async buildVote (data, isAdvancedFee = false, returnObject = false) {
    return VoteBuilder.build(data, isAdvancedFee, returnObject)
  }

  static async buildMultiSignature (data, isAdvancedFee = false, returnObject = false) {
    return MultiSignatureBuilder.build(data, isAdvancedFee, returnObject)
  }

  static async buildIpfs (data, isAdvancedFee = false, returnObject = false) {
    return IpfsBuilder.build(data, isAdvancedFee, returnObject)
  }

  static async buildMultiPayment (data, isAdvancedFee = false, returnObject = false) {
    return MultiPaymentBuilder.build(data, isAdvancedFee, returnObject)
  }

  static async buildDelegateResignation (
    data,
    isAdvancedFee = false,
    returnObject = false
  ) {
    return DelegateResignationBuilder.build(data, isAdvancedFee, returnObject)
  }

  static async buildEntity (
    data,
    isAdvancedFee = false,
    returnObject = false
  ) {
    return EntityBuilder.build(data, isAdvancedFee, returnObject)
  }
}
