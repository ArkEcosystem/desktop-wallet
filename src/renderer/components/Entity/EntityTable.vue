
<template>
  <div class="EntityTable w-full">
    <TableWrapper
      class="EntityTable__table"
      :rows="rows"
      :columns="columns"
    >
      <template
        slot-scope="data"
      >
        <div
          v-if="data.column.field === 'address'"
          class="flex items-center"
        >
          <WalletIdenticon
            :value="data.row.address"
            :size="35"
            class="mr-4 identicon cursor-pointer"
          />

          <RouterLink :to="{ name: 'wallet-show', params: { address: data.row.address } }">
            {{ data.formattedRow['address'] }}
          </RouterLink>
        </div>

        <div v-if="data.column.field === 'data.name'">
          <span>{{ data.formattedRow['data.name'] }}</span>
        </div>

        <div
          v-if="data.column.field === 'website'"
          class="flex items-center justify-center"
        >
          <a
            v-tooltip="{
              content: getIpfsDataProperty(data.row.id, 'meta.website')
            }"
            href="#"
            @click.stop="electron_openExternal(getIpfsDataProperty(data.row.id, 'meta.website'))"
          >
            <SvgIcon
              name="link"
              view-box="0 0 18 18"
            />
          </a>
        </div>

        <div
          v-if="data.column.field === 'history'"
          class="flex items-center justify-center"
        >
          <a
            href="#"
            class="font-medium"
            @click.prevent
          >
            {{ $t('ENTITY.VIEW') }}
          </a>
        </div>

        <div
          v-if="data.column.field === 'msq'"
          class="flex items-center justify-center"
        >
          <a
            v-tooltip="{
              content: $t('ENTITY.OPEN_MSQ')
            }"
            href="#"
            @click.stop="electron_openExternal('https://marketsquare.io')"
          >
            <SvgIcon
              name="msq"
              view-box="0 0 20 20"
            />
          </a>
        </div>

        <div
          v-if="data.column.field === 'action'"
          class="flex items-center justify-center"
        >
          <div
            v-tooltip="{
              content: $t('ENTITY.RESIGNED'),
              trigger: data.row.isResigned ? 'hover' : 'manual'
            }"
          >
            <MenuDropdown
              :ref="`dropdown.${data.row.id}`"
              :items="actionOptions"
              :is-highlighting="false"
              :is-disabled="data.row.isResigned"
              @select="emitSelect($event, data.row)"
            >
              <ButtonIconGeneric
                slot="handler"
                :disabled="data.row.isResigned"
                :is-small="true"
                svg-class="rotate-90"
                icon="more"
                view-box="0 0 25 25"
                class="EntityTable__action-button"
                @click="emitDropdownClick"
              />
            </MenuDropdown>
          </div>
        </div>
      </template>
    </TableWrapper>
  </div>
</template>

<script>
import { ButtonIconGeneric } from '@/components/Button'
import WalletIdenticon from '@/components/Wallet/WalletIdenticon'
import { MenuDropdown } from '@/components/Menu'
import TableWrapper from '@/components/utils/TableWrapper'
import SvgIcon from '@/components/SvgIcon'
import { File } from '@arkecosystem/platform-sdk-ipfs'
import { Request } from '@arkecosystem/platform-sdk-http-got'
import { get } from '@arkecosystem/utils'

export default {
  name: 'EntityTable',

  components: {
    ButtonIconGeneric,
    MenuDropdown,
    SvgIcon,
    TableWrapper,
    WalletIdenticon
  },

  props: {
    rows: {
      type: Array,
      required: true
    }
  },

  data: () => ({
    ipfsDataObject: {},
    loading: {},
    failed: {}
  }),

  computed: {
    columns () {
      return [
        {
          label: this.$t('COMMON.ADDRESS'),
          field: 'address',
          formatFn: this.formatAddress,
          thClass: ''
        },
        {
          label: this.$t('ENTITY.NAME'),
          field: 'data.name',
          tdClass: 'md:w-2/5'
        },
        {
          label: this.$t('ENTITY.HISTORY'),
          field: 'history',
          thClass: 'text-center no-sort',
          sortable: false
        },
        {
          label: this.$t('ENTITY.WEBSITE'),
          field: 'website',
          thClass: 'text-center no-sort',
          sortable: false
        },
        {
          label: 'MSQ',
          field: 'msq',
          thClass: 'text-center no-sort',
          sortable: false
        },
        {
          label: '',
          field: 'action',
          thClass: 'flex items-end justify-end no-sort',
          sortable: false
        }
      ]
    },

    actionOptions () {
      return {
        update: this.$t('ENTITY.UPDATE'),
        resign: this.$t('ENTITY.RESIGN')
      }
    }
  },

  mounted () {
    this.fetchAllIpfsData()
  },

  methods: {
    async fetchIpfsData (row) {
      const request = new Request()
      this.$set(this.loading, row.id, true)
      try {
        const result = await new File(request).get(row.data.ipfsData)
        this.$set(this.ipfsDataObject, row.id, result)
        this.$set(this.failed, row.id, false)
      } catch {
        this.$set(this.failed, row.id, true)
      }
      this.$set(this.loading, row.id, false)
    },

    async fetchAllIpfsData () {
      const promises = this.rows.map(this.fetchIpfsData)
      await Promise.allSettled(promises)
    },

    getIpfsDataProperty (id, path) {
      return get(this.ipfsDataObject, `${id}.${path}`)
    },

    formatAddress (address) {
      return this.wallet_formatAddress(address, 16)
    },

    emitDropdownClick () {
      this.$emit('dropdown-click')
    },

    emitSelect (key, row) {
      this.$emit(key, { transaction: row, ipfsDataObject: this.ipfsDataObject[row.id] })
    },

    closeDropdowns () {
      for (const [key, ref] of Object.entries(this.$refs)) {
        if (key.startsWith('dropdown')) {
          ref.close()
        }
      }
    }
  }
}
</script>

<style lang="postcss" scoped>
.EntityTable__action-button {
  @apply px-4 py-1 m-0 !important;
}
.EntityTable__table .vgt-responsive {
  overflow-x: unset;
}
</style>
