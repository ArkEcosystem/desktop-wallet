
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
        <slot :data="data" />

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
          <Loader
            v-if="isIpfsLoading(data.row.id)"
            size="8px"
          />
          <a
            v-else-if="getIpfsDataProperty(data.row.id, 'meta.website')"
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
          <span v-else-if="hasIpfsFailed(data.row.id)">
            <ButtonReload
              :title="$t('ENTITY.FAILED_FETCH_IPFS')"
              :is-refresh="isIpfsLoading(data.row.id)"
              view-box="0 0 18 17"
              @click="onReloadIpfs(data.row)"
            />
          </span>
          <span v-else>N/A</span>
        </div>

        <div
          v-if="data.column.field === 'history'"
          class="flex items-center justify-center"
        >
          <ButtonModal
            :label="$t('ENTITY.VIEW')"
            class="text-blue hover:text-blue-dark"
          >
            <template slot-scope="{ toggle, isOpen }">
              <EntityHistoryModal
                v-if="isOpen"
                :registration-id="data.row.id"
                @close="toggle"
              />
            </template>
          </ButtonModal>
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
          class="flex items-end justify-end"
        >
          <div
            v-tooltip="{
              content: $t('ENTITY.RESIGNED'),
              trigger: isEntityResigned(data.row) ? 'hover' : 'manual'
            }"
          >
            <MenuDropdown
              :ref="`dropdown.${data.row.id || data.row.username}`"
              :items="getActionOptions(data.row.address)"
              :is-highlighting="false"
              :is-disabled="isEntityResigned(data.row)"
              :pin-above="pinAbove"
              @select="emitSelect($event, data.row)"
            >
              <ButtonIconGeneric
                slot="handler"
                :disabled="isEntityResigned(data.row)"
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
import { TRANSACTION_TYPES_ENTITY } from '@config'
import { ButtonIconGeneric, ButtonModal, ButtonReload } from '@/components/Button'
import WalletIdenticon from '@/components/Wallet/WalletIdenticon'
import { MenuDropdown } from '@/components/Menu'
import TableWrapper from '@/components/utils/TableWrapper'
import SvgIcon from '@/components/SvgIcon'
import Loader from '@/components/utils/Loader'
import { get } from '@arkecosystem/utils'
import EntityHistoryModal from './EntityHistoryModal'

export default {
  name: 'EntityTable',

  components: {
    ButtonIconGeneric,
    ButtonModal,
    ButtonReload,
    EntityHistoryModal,
    Loader,
    MenuDropdown,
    SvgIcon,
    TableWrapper,
    WalletIdenticon
  },

  props: {
    entityType: {
      type: Number,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    rows: {
      type: Array,
      required: true
    },
    pinAbove: {
      type: Boolean,
      required: false,
      default: false
    }
  },

  data: () => ({
    loading: {},
    failed: {}
  }),

  computed: {
    isDelegateEntityType () {
      return TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE === this.entityType
    }
  },

  methods: {
    getIpfsDataProperty (id, path) {
      return get(this.$store.getters['entity/ipfsContentByRegistrationId'](id), path)
    },

    getDelegateEntity (address) {
      const entities = Object.values(this.$store.getters['entity/bySessionProfile'])
      return entities.find(transaction => transaction.type === TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE && transaction.address === address)
    },

    isIpfsLoading (id) {
      return this.$store.getters['entity/isIpfsContentLoading'](id)
    },

    hasIpfsFailed (id) {
      return !!this.$store.getters['entity/ipfsContentFailedMessage'](id)
    },

    isEntityResigned (row) {
      if (!this.isDelegateEntityType) {
        return row.isResigned
      }

      const entity = this.getDelegateEntity(row.address)
      if (entity) {
        return entity.isResigned
      }

      return false
    },

    onReloadIpfs (row) {
      this.$store.dispatch('entity/fetchIpfsContent', { registrationId: row.id, ipfsHash: row.data.ipfsData })
    },

    getActionOptions (address) {
      const options = {
        update: this.$t('ENTITY.UPDATE'),
        resign: this.$t('ENTITY.RESIGN')
      }

      if (this.isDelegateEntityType && !this.getDelegateEntity(address)) {
        delete options.resign
      }

      return options
    },

    formatAddress (address) {
      return this.wallet_formatAddress(address, 16)
    },

    emitDropdownClick () {
      this.$emit('dropdown-click')
    },

    emitSelect (key, row) {
      let entity = row

      if (this.isDelegateEntityType) {
        entity = this.getDelegateEntity(row.address)
      }

      this.$emit(key, { entity, row })
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
