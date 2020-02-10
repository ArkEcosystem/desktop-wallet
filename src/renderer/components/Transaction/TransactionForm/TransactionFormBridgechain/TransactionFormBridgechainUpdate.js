import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config'
import mixin from './mixin'

export default {
  name: 'TransactionFormBridgechainUpdate',

  transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,

  transactionType: TRANSACTION_TYPES.GROUP_2.BRIDGECHAIN_UPDATE,

  mixins: [mixin],

  props: {
    bridgechain: {
      type: Object,
      required: true
    }
  },

  mounted () {
    this.form.asset.genesisHash = this.bridgechain.genesisHash
    this.form.asset.bridgechainRepository = this.bridgechain.bridgechainRepository
    this.form.asset.bridgechainAssetRepository = this.bridgechain.bridgechainAssetRepository

    this.form.seedNodes = this.bridgechain.seedNodes.map(ip => ({
      ip,
      isInvalid: false
    }))

    if (this.bridgechain.ports['@arkecosystem/core-api']) {
      this.form.apiPort = this.bridgechain.ports['@arkecosystem/core-api']
    }
  },

  methods: {
    async buildTransaction (transactionData, isAdvancedFee = false, returnObject = false) {
      return this.$client.buildBridgechainUpdate(transactionData, isAdvancedFee, returnObject)
    },

    transactionError () {
      this.$error(this.$t('TRANSACTION.ERROR.VALIDATION.BRIDGECHAIN_UPDATE'))
    }
  }
}
