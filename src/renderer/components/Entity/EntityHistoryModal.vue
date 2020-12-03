<template>
  <ModalWindow
    :title="$t('ENTITY.HISTORY')"
    container-classes="EntityHistoryModal"
    @close="emitClose"
  >
    <TableWrapper
      :rows="transactions"
      :columns="columns"
      :is-remote="true"
      :is-loading="isLoading"
      :has-pagination="totalCount > transactions.length"
      :current-page="page"
      :per-page="limit"
      :total-rows="totalCount"
      @on-page-change="onPageChange"
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
    page: 1,
    limit: 100,
    totalCount: 0,
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
        const { transactions: registrationTransactions } = await this.$client.fetchTransactions({ id: this.registrationId })
        const { transactions, totalCount } = await this.$client.fetchTransactions({ 'asset.registrationId': this.registrationId, page: this.page, limit: this.limit })
        this.transactions = [...transactions, registrationTransactions[0]]
        this.totalCount = transactions.length ? totalCount + 1 : 0
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
    },

    onPageChange ({ currentPage }) {
      if (currentPage && currentPage !== this.page) {
        this.page = currentPage
        this.fetchHistory()
      }
    }
  }
}
</script>

<style lang="postcss">
.EntityHistoryModal {
  min-width: 30rem;
  max-width: 38rem;
  min-height: 30rem;
}

.EntityHistoryModal .vgt-wrap__footer {
  @apply justify-center
}
.EntityHistoryModal .footer__row-count {
  @apply hidden;
}
</style>
