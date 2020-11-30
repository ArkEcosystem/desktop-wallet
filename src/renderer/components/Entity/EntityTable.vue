
<template>
  <div class="EntityTable w-full">
    <TableWrapper
      v-bind="$attrs"
      class="EntityTable__table"
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
            href="#"
            @click.stop
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
          <SvgIcon
            name="msq"
            view-box="0 0 23 23"
            class="text-blue"
          />
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

export default {
  name: 'EntityTable',

  components: {
    ButtonIconGeneric,
    MenuDropdown,
    SvgIcon,
    TableWrapper,
    WalletIdenticon
  },

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
          thClass: 'text-center'
        },
        {
          label: this.$t('ENTITY.WEBSITE'),
          field: 'website',
          thClass: 'text-center'
        },
        {
          label: 'MSQ',
          field: 'msq',
          thClass: 'text-center'
        },
        {
          label: '',
          field: 'action',
          thClass: 'flex items-end justify-end'
        }
      ]
    },

    actionOptions () {
      return {
        update: 'Update',
        resign: 'Resign'
      }
    }
  },

  methods: {
    formatAddress (address) {
      return this.wallet_formatAddress(address, 16)
    },

    emitDropdownClick () {
      this.$emit('dropdown-click')
    },

    emitSelect (key, row) {
      this.$emit(key, row)
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
