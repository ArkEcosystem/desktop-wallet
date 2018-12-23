<template>
  <div class="WalletTable w-full">
    <TableWrapper
      v-bind="$attrs"
      class="WalletAll__table"
      :columns="columns"
      v-on="$listeners"
    >
      <template
        slot-scope="data"
      >
        <div
          v-if="data.column.field === 'address'"
          class="flex items-center"
        >
          <RouterLink
            :to="{ name: 'wallet-show', params: { address: data.row.address } }"
            class="flex flex-row mr-4"
          >
            <WalletIdenticon
              :value="data.row.address"
              :size="40"
              class="identicon cursor-pointer"
            />
          </RouterLink>

          <RouterLink :to="{ name: 'wallet-show', params: { address: data.row.address } }">
            {{ data.formattedRow['address'] }}
          </RouterLink>
        </div>

        <span
          v-else-if="data.column.field === 'name'"
        >
          {{ wallet_name(data.row.address) || wallet_truncate(data.row.address) }}
        </span>

        <span
          v-else-if="data.column.field === 'balance'"
        >
          {{ formatter_networkCurrency(data.row.balance) }}
        </span>

        <div
          v-else-if="data.column.field === 'delete'"
          class="flex items-center justify-center"
        >
          <button
            :disabled="data.row.isLedger"
            class="font-semibold flex text-xs cursor-pointer hover:text-red text-theme-page-text-light p-1"
            @click="removeWallet(data.row)"
          >
            <SvgIcon
              name="delete-wallet"
              view-box="0 0 16 16"
            />
          </button>
        </div>

        <span
          v-else
        >
          {{ data.formattedRow[data.column.field] }}
        </span>
      </template>
    </TableWrapper>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'
import TableWrapper from '@/components/utils/TableWrapper'
import { WalletIdenticon } from '@/components/Wallet'

export default {
  name: 'WalletTable',

  components: {
    SvgIcon,
    TableWrapper,
    WalletIdenticon
  },

  computed: {
    columns () {
      return [
        {
          // label: this.$t('WALLET_DELEGATES.RANK'),
          label: this.$t('PAGES.WALLET_ALL.ADDRESS'),
          field: 'address'
        },
        {
          label: this.$t('PAGES.WALLET_ALL.NAME'),
          field: 'name',
          tdClass: 'w-2/3'
        },
        {
          label: this.$t('PAGES.WALLET_ALL.BALANCE'),
          field: 'balance',
          type: 'number',
          thClass: 'text-right',
          tdClass: 'text-right font-bold'
        },
        {
          label: this.$t('PAGES.WALLET_ALL.DELETE'),
          field: 'delete',
          sortable: false,
          thClass: 'text-center'
        }
      ]
    }
  },

  methods: {
    removeWallet (wallet) {
      // this.$parent.openRemovalConfirmation(wallet)
      this.$emit('remove-wallet', wallet)
    }
  }
}
</script>

<style>
.WalletTable tr:hover {

}
.WalletTable tr:hover .identicon {
  transition: 0.5s;
  opacity: 0.5;
}
.WalletTable .identicon {
  transition: 0.5s;
}
</style>
