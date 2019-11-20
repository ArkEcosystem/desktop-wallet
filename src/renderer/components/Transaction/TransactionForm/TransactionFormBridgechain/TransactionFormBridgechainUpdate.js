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
    this.form.asset.bridgechainId = this.bridgechain.bridgechainId
    this.form.asset.seedNodes = this.bridgechain.seedNodes
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
