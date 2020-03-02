import { BridgechainResignationBuilder } from './bridgechain-resignation.builder'
import { BridgechainUpdateBuilder } from './bridgechain-update.builder'
import { BridgechainRegistrationBuilder } from './bridgechain-registration.builder'
import { BusinessResignationBuilder } from './business-resignation.builder'
import { BusinessUpdateBuilder } from './business-update.builder'
import { BusinessRegistrationBuilder } from './business-registration.builder'
import { DelegateResignationBuilder } from './delegate-resignation.builder'
import { MultiPaymentBuilder } from './multi-payment.builder'
import { IpfsBuilder } from './ipfs.builder'
import { MultiSignatureBuilder } from './multi-signature.builder'
import { SecondSignatureRegistrationBuilder } from './second-signature-registration.builder'
import { TransferBuilder } from './transfer.builder'
import { DelegateRegistrationBuilder } from './delegate-registration.builder'
import { VoteBuilder } from './vote.builder'

import './configure-magistrate-transactions'

export class TransactionBuilderService {
  async buildTransfer (data, isAdvancedFee = false, returnObject = false) {
    return TransferBuilder.build(data, isAdvancedFee, returnObject)
  }

  async buildSecondSignatureRegistration (
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

  async buildDelegateRegistration (
    data,
    isAdvancedFee = false,
    returnObject = false
  ) {
    return DelegateRegistrationBuilder.build(data, isAdvancedFee, returnObject)
  }

  async buildVote (data, isAdvancedFee = false, returnObject = false) {
    return VoteBuilder.build(data, isAdvancedFee, returnObject)
  }

  async buildMultiSignature (data, isAdvancedFee = false, returnObject = false) {
    return MultiSignatureBuilder.build(data, isAdvancedFee, returnObject)
  }

  async buildIpfs (data, isAdvancedFee = false, returnObject = false) {
    return IpfsBuilder.build(data, isAdvancedFee, returnObject)
  }

  async buildMultiPayment (data, isAdvancedFee = false, returnObject = false) {
    return MultiPaymentBuilder.build(data, isAdvancedFee, returnObject)
  }

  async buildDelegateResignation (
    data,
    isAdvancedFee = false,
    returnObject = false
  ) {
    return DelegateResignationBuilder.build(data, isAdvancedFee, returnObject)
  }

  async buildBusinessRegistration (
    data,
    isAdvancedFee = false,
    returnObject = false
  ) {
    return BusinessRegistrationBuilder.build(data, isAdvancedFee, returnObject)
  }

  async buildBusinessUpdate (data, isAdvancedFee = false, returnObject = false) {
    return BusinessUpdateBuilder.build(data, isAdvancedFee, returnObject)
  }

  async buildBusinessResignation (
    data,
    isAdvancedFee = false,
    returnObject = false
  ) {
    return BusinessResignationBuilder.build(data, isAdvancedFee, returnObject)
  }

  async buildBridgechainRegistration (
    data,
    isAdvancedFee = false,
    returnObject = false
  ) {
    return BridgechainRegistrationBuilder.build(
      data,
      isAdvancedFee,
      returnObject
    )
  }

  async buildBridgechainUpdate (
    data,
    isAdvancedFee = false,
    returnObject = false
  ) {
    return BridgechainUpdateBuilder.build(data, isAdvancedFee, returnObject)
  }

  async buildBridgechainResignation (
    data,
    isAdvancedFee = false,
    returnObject = false
  ) {
    return BridgechainResignationBuilder.build(
      data,
      isAdvancedFee,
      returnObject
    )
  }
}
