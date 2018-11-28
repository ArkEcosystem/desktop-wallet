<template>
  <div class="WalletDelegates">

    <div
      v-if="!walletVote.publicKey && isExplanationDisplayed"
      class="WalletDelegates__explanation relative rounded-lg mt-2 mb-6 bg-theme-explanation-background text-theme-explanation-text flex flex-row items-center justify-between"
    >
      <div class="WalletDelegates__explanation__text flex text-left text-inherit py-4 pl-6">
        <span>
          {{ $t('WALLET_DELEGATES.EXPLANATION') }}
          <a
            :title="$t('WALLET_DELEGATES.BLOG')"
            class="cursor-pointer inline"
            @click="electron_openExternal(votingUrl)"
          >
            {{ $t('WALLET_DELEGATES.BLOG') }}
          </a>
        </span>
      </div>

      <div class="WalletDelegates__explanation__close flex py-4 px-6 z-10">
        <ButtonClose
          class="cursor-pointer select-none"
          @click="dismissExplanation"
        />
      </div>
    </div>

    <TableWrapper
      :columns="columns"
      :has-pagination="true"
      :is-loading="isLoading"
      :is-remote="true"
      :rows="delegates"
      :sort-query="queryParams.sort"
      :total-rows="totalCount"
      :no-data-message="$t('TABLE.NO_DELEGATES')"
      :per-page="queryParams.limit"
      :per-page-dropdown="[25, 51]"
      class="WalletDelegates__table"
      @on-row-click="onRowClick"
      @on-per-page-change="onPerPageChange"
      @on-page-change="onPageChange"
      @on-sort-change="onSortChange"
    >
      <template
        slot-scope="data"
      >
        <div
          v-if="data.column.field === 'username'"
        >
          <div class="flex items-center">
            <span>{{ data.formattedRow['username'] }}</span>
            <span
              v-if="data.row.publicKey === walletVote.publicKey"
              class="WalletDelegates__vote-badge bg-red-light text-white p-1 text-xs font-bold rounded pointer-events-none ml-3"
            >
              {{ $t('WALLET_DELEGATES.VOTE') }}
            </span>
          </div>
        </div>

        <span v-else>
          {{ data.formattedRow[data.column.field] }}
        </span>
      </template>
    </TableWrapper>

    <TransactionModal
      v-if="!!selected"
      :title="getVoteTitle()"
      :type="3"
      :delegate="selected"
      :is-voter="selected.publicKey === walletVote.publicKey"
      :has-voted="!!walletVote.publicKey"
      @cancel="onCancel"
      @sent="onSent"
    />

  </div>
</template>

<script>
import { ButtonClose } from '@/components/Button'
import { TransactionModal } from '@/components/Transaction'
import TableWrapper from '@/components/utils/TableWrapper'
import { orderBy } from 'lodash'

export default {
  name: 'WalletDelegates',

  inject: ['walletVote'],

  components: {
    ButtonClose,
    TableWrapper,
    TransactionModal
  },

  data: () => ({
    currentPage: 1,
    delegates: [],
    isExplanationTruncated: true,
    isLoading: false,
    selected: null,
    totalCount: 0,
    queryParams: {
      page: 1,
      limit: 1,
      sort: {
        field: 'rank',
        type: 'asc'
      }
    }
  }),

  computed: {
    columns () {
      return [
        {
          label: this.$t('WALLET_DELEGATES.RANK'),
          field: 'rank',
          type: 'number',
          thClass: 'text-center',
          tdClass: 'text-center'
        },
        {
          label: this.$t('WALLET_DELEGATES.USERNAME'),
          field: 'username',
          tdClass: 'w-2/3'
        },
        {
          label: this.$t('WALLET_DELEGATES.PRODUCTIVITY'),
          field: 'production.productivity',
          type: 'percentage',
          formatFn: this.formatPercentage
        },
        {
          label: this.$t('WALLET_DELEGATES.APPROVAL'),
          field: 'production.approval',
          type: 'percentage',
          formatFn: this.formatPercentage
        }
      ]
    },
    isExplanationDisplayed () {
      return this.$store.getters['app/showVotingExplanation']
    },
    votingUrl () {
      return 'https://docs.ark.io/cookbook/usage-guides/how-to-vote-in-the-ark-desktop-wallet.html'
    }
  },

  mounted () {
    this.queryParams.limit = this.session_network.constants.activeDelegates || 51 // Set default limit to amount of active delegates
    this.fetchDelegates()
  },

  methods: {
    dismissExplanation () {
      this.$store.dispatch('app/setVotingExplanation', false)
    },

    getVoteTitle () {
      if (this.selected.publicKey === this.walletVote.publicKey) {
        return this.$t('WALLET_DELEGATES.UNVOTE_DELEGATE', { delegate: this.selected.username })
      }
      return this.$t('WALLET_DELEGATES.VOTE_DELEGATE', { delegate: this.selected.username })
    },

    async fetchDelegates () {
      if (this.isLoading) return

      try {
        this.isLoading = true
        const { delegates, totalCount } = await this.$client.fetchDelegates({
          page: this.queryParams.page,
          limit: this.queryParams.limit
        })
        this.delegates = this.__sortDelegates(delegates)
        this.totalCount = totalCount
      } catch (error) {
        this.$logger.error(error)
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'delegates',
          msg: error.message
        }))
        this.delegates = []
      } finally {
        this.isLoading = false
      }
    },

    formatPercentage (value) {
      return this.formatter_percentage(value)
    },

    onRowClick ({ row }) {
      this.selected = row
    },

    onSent () {
      this.walletVote.publicKey = null
      this.selected = null
    },

    onCancel () {
      this.selected = null
    },

    onPageChange ({ currentPage }) {
      this.currentPage = currentPage
      this.__updateParams({ page: currentPage })
      this.fetchDelegates()
    },

    onPerPageChange ({ currentPerPage }) {
      this.__updateParams({ limit: currentPerPage, page: 1 })
      this.fetchDelegates()
    },

    onSortChange ({ columnIndex, sortType }) {
      const columnName = this.columns[columnIndex].field
      this.__updateParams({
        sort: {
          type: sortType,
          field: columnName
        },
        page: 1
      })
      this.fetchDelegates()
    },

    reset () {
      this.currentPage = 1
      this.queryParams.page = 1
      this.totalCount = 0
      this.delegates = []
    },

    __sortDelegates (delegates = this.delegates) {
      return orderBy(delegates, [this.queryParams.sort.field], [this.queryParams.sort.type])
    },

    __updateParams (newProps) {
      this.queryParams = Object.assign({}, this.queryParams, newProps)
    }
  }
}
</script>

<style scoped>
.WalletDelegates__explanation__close {
  top: 0;
  margin-bottom: auto;
  margin-top: 5px;
}
.WalletDelegates__vote-badge {
  opacity: 0.85
}
</style>

<style>
.WalletDelegates .ButtonClose__cross {
  color: var(--theme-explanation-text)
}
</style>
