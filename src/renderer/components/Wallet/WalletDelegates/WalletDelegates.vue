<template>
  <div class="WalletDelegates">

    <div
      v-if="!walletVote.publicKey && isExplanationDisplayed"
      class="WalletDelegates__explanation relative rounded-lg mt-2 mb-6 bg-theme-explanation-background text-theme-explanation-text flex flex-row items-center justify-between"
    >
      <button
        :class="{ 'WalletDelegates__explanation__text--truncated': isExplanationTruncated }"
        class="WalletDelegates__explanation__text flex text-lg cursor-pointer text-left text-inherit"
        @click="readMore"
      >
        <div class="py-4 pl-6">
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
      </button>

      <div class="flex py-4 px-6 z-10">
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

    <portal
      v-if="selected"
      to="modal"
    >
      <TransactionModal
        :title="getVoteTitle()"
        :type="3"
        :delegate="selected"
        :is-voter="selected.publicKey === walletVote.publicKey"
        @cancel="onCancel"
        @sent="onSent"
      />
    </portal>

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
      limit: 51,
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
      return 'https://blog.ark.io/how-to-vote-or-un-vote-an-ark-delegate-and-how-does-it-all-work-819c5439da68'
    }
  },

  mounted () {
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

    readMore () {
      this.isExplanationTruncated = false
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
.WalletDelegates__explanation__text--truncated > div {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 3rem;
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
