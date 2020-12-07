<template>
  <ModalWindow
    :title="$t('ENTITY.HISTORY')"
    container-classes="EntityHistoryModal"
    @close="emitClose"
  >
    <TableWrapper
      :rows="transactions"
      :columns="columns"
      :is-loading="isLoading"
      :is-remote="true"
    >
      <template
        slot-scope="data"
      >
        <div v-if="data.column.field === 'action'">
          <a
            href="#"
            class="flex items-center"
            @click.stop="network_openExplorer('transaction', data.row.id)"
          >
            <SvgIcon
              name="link"
              view-box="0 0 16 16"
            />
            <span class="ml-2 font-medium">{{ $t('ENTITY.VIEW' ) }}</span>
          </a>
        </div>
      </template>
    </TableWrapper>
  </ModalWindow>
</template>

<script>
import { TRANSACTION_TYPES_ENTITY } from '@config'
import { ModalWindow } from '@/components/Modal'
import TableWrapper from '@/components/utils/TableWrapper'
import SvgIcon from '@/components/SvgIcon'

export default {
  components: {
    ModalWindow,
    SvgIcon,
    TableWrapper
  },

  props: {
    registrationId: {
      type: String,
      required: true
    }
  },

  data: () => ({
    isLoading: true,
    transactions: []
  }),

  computed: {
    columns () {
      return [
        {
          label: this.$t('ENTITY.TYPE'),
          field: 'asset.action',
          formatFn: this.formatAction,
          tdClass: 'font-medium'
        },
        {
          label: this.$t('COMMON.DATE'),
          field: 'timestamp',
          type: 'date',
          formatFn: this.formatDate,
          tdClass: 'font-medium text-center',
          thClass: 'text-center'
        },
        {
          label: '',
          sortable: false,
          thClass: 'no-sort text-right',
          field: 'action'
        }
      ]
    }
  },

  mounted () {
    this.fetchHistory()
  },

  methods: {
    async fetchHistory () {
      try {
        this.transactions = await this.$store.dispatch('entity/fetchTransactionsHistory', this.registrationId)
      } catch (error) {
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'transactions',
          msg: error.message
        }))
        this.transactions = []
      }
      this.isLoading = false
    },

    emitClose () {
      this.$emit('close')
    },

    formatDate (value) {
      return this.formatter_date(value)
    },

    formatAction (value) {
      return {
        [TRANSACTION_TYPES_ENTITY.ACTION.REGISTER]: this.$t('ENTITY.ACTIONS.REGISTER'),
        [TRANSACTION_TYPES_ENTITY.ACTION.UPDATE]: this.$t('ENTITY.ACTIONS.UPDATE'),
        [TRANSACTION_TYPES_ENTITY.ACTION.RESIGN]: this.$t('ENTITY.ACTIONS.RESIGN')
      }[+value]
    }
  }
}
</script>

<style lang="postcss">
.EntityHistoryModal {
  min-width: 30rem;
  max-width: 38rem;
  min-height: 30rem;
  max-height: 60vh;
}

.EntityHistoryModal .vgt-wrap__footer {
  @apply justify-center
}
.EntityHistoryModal .footer__row-count {
  @apply hidden;
}
</style>
