<template>
  <div class="WalletDelegates">

    <div
      v-if="!walletVote.publicKey && isExplanationDisplayed"
      class="WalletDelegates__explanation relative rounded-lg mt-4 mb-8 bg-theme-explanation-background text-theme-explanation-text flex flex-row items-center justify-between"
    >
      <div
        :class="{ 'WalletDelegates__explanation__text--truncated': isExplanationTruncated }"
        class="WalletDelegates__explanation__text flex text-lg cursor-pointer"
        @click="readMore"
      >
        <div class="pt-6 pb-6 pl-6">
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
      </div>

      <div class="flex p-6 z-10">
        <ButtonClose
          class="cursor-pointer select-none"
          @click="dismissExplanation"
        />
      </div>
    </div>

    <vue-good-table
      :columns="columns"
      :rows="delegates"
      class="WalletDelegates"
      @on-row-click="onRowClick"
    >
      <template
        slot="table-row"
        slot-scope="table"
      >
        <div
          v-if="table.column.field === 'username'"
        >
          <div class="flex items-center">
            <span>{{ table.formattedRow['username'] }}</span>
            <span
              v-if="table.row.publicKey === walletVote.publicKey"
              class="WalletDelegates__vote-badge bg-red-light text-white p-1 text-xs rounded pointer-events-none ml-3"
            >
              {{ $t('WALLET_DELEGATES.VOTE') }}
            </span>
          </div>
        </div>

        <span v-else>
          {{ table.formattedRow[table.column.field] }}
        </span>
      </template>
    </vue-good-table>
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

export default {
  name: 'WalletDelegates',

  inject: ['walletVote'],

  components: {
    ButtonClose,
    TransactionModal
  },

  data: () => ({
    delegates: [],
    isExplanationTruncated: true,
    selected: null
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
      try {
        this.delegates = await this.$client.fetchDelegates()
      } catch (error) {
        this.$logger.error(error)
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'delegates',
          msg: error.message
        }))
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
