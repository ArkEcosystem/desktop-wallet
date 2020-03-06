import { TRANSACTION_GROUPS, TRANSACTION_TYPES } from '@config'
import mixin from './mixin'
import { populateFormFromSchema } from '../utils'

export default {
  name: 'TransactionFormBusinessRegistration',

  transactionGroup: TRANSACTION_GROUPS.MAGISTRATE,

  transactionType: TRANSACTION_TYPES.GROUP_2.BUSINESS_REGISTRATION,

  mixins: [mixin],

  props: {
    schema: {
      type: Object,
      required: false,
      default: () => {}
    }
  },

  mounted () {
    this.populateSchema()
  },

  methods: {
    populateSchema () {
      populateFormFromSchema(this, { asset: this.schema.business })
    },

    async buildTransaction (
      transactionData,
      isAdvancedFee = false,
      returnObject = false
    ) {
      return this.$client.buildBusinessRegistration(
        transactionData,
        isAdvancedFee,
        returnObject
      )
    },

    transactionError () {
      this.$error(
        this.$t('TRANSACTION.ERROR.VALIDATION.BUSINESS_REGISTRATION')
      )
    }
  }
}
