<template>
  <section class="Registrations flex flex-col">
    <div class="bg-theme-feature rounded-lg w-full px-10 py-6 flex items-center justify-between">
      <h2>{{ $t('ENTITY.MY_REGISTRATIONS') }}</h2>
      <ButtonModal
        :label="$t('ENTITY.NEW_REGISTRATION')"
        class="m-0 ButtonGeneric blue-button"
      >
        <template slot-scope="{ toggle, isOpen }">
          <TransactionModal
            v-if="isOpen"
            :type="6"
            :group="2"
            :entity-action="0"
            title=""
            @cancel="toggle"
            @sent="onSentRegistration(toggle)"
          />
        </template>
      </ButtonModal>
    </div>

    <div
      class="mt-6 bg-theme-feature rounded-lg w-full p-10 flex flex-col overflow-y-auto"
    >
      <div v-if="loading">
        <Loader />
      </div>

      <div v-if="!loading && !registrations.length">
        <p class="font-semibold text-theme-page-text-light text-center w-full">
          {{ $t('ENTITY.NO_ENTITIES_FOUND') }}
        </p>
      </div>

      <div v-else>
        <div
          v-for="item of registrationOptions"
          :key="item.label"
          class="mt-10 Registrations__item"
        >
          <h2 class="flex items-center">
            <SvgIcon
              :name="item.icon"
              view-box="0 0 22 22"
            />
            <span class="ml-2">{{ item.label }}</span>
          </h2>
          <EntityTable
            ref="table"
            :rows="getRegistrationsByType(item.type)"
            class="mt-5 border-b"
            @resign="openModal($event, 'resign')"
            @update="openModal($event, 'update')"
            @dropdown-click="onDropdownClick"
          />
        </div>
      </div>
    </div>

    <TransactionModal
      v-if="isResignModalOpen"
      :type="6"
      :group="2"
      :entity-action="2"
      :entity-transaction="selectedEntity.transaction"
      title=""
      @cancel="closeModal"
      @sent="onSent"
    />

    <TransactionModal
      v-if="isUpdateModalOpen"
      :type="6"
      :group="2"
      :entity-action="1"
      :entity-transaction="selectedEntity.transaction"
      :ipfs-data-object="selectedEntity.ipfsDataObject"
      title=""
      @cancel="closeModal"
      @sent="onSent"
    />
  </section>
</template>

<script>
import { TRANSACTION_TYPES_ENTITY } from '@config'
import { ButtonModal } from '@/components/Button'
import { TransactionModal } from '@/components/Transaction'
import { EntityTable } from '@/components/Entity'
import SvgIcon from '@/components/SvgIcon'
import Loader from '@/components/utils/Loader'

export default {
  name: 'Registrations',

  components: {
    ButtonModal,
    EntityTable,
    Loader,
    TransactionModal,
    SvgIcon
  },

  data: () => ({
    loading: true,
    registrations: [],
    modalAction: undefined,
    selectedEntity: undefined
  }),

  computed: {
    wallets () {
      return this.$store.getters['wallet/byProfileId'](this.session_profile.id)
    },

    registrationOptions () {
      const types = this.registrations.map(item => item.type)
      const options = [
        { label: this.$tc('ENTITY.TYPES.BUSINESS', 2), icon: 'business', type: TRANSACTION_TYPES_ENTITY.TYPE.BUSINESS },
        { label: this.$tc('ENTITY.TYPES.PRODUCT', 2), icon: 'product', type: TRANSACTION_TYPES_ENTITY.TYPE.PRODUCT },
        { label: this.$tc('ENTITY.TYPES.PLUGIN', 2), icon: 'plugin', type: TRANSACTION_TYPES_ENTITY.TYPE.PLUGIN },
        { label: this.$tc('ENTITY.TYPES.MODULE', 2), icon: 'module', type: TRANSACTION_TYPES_ENTITY.TYPE.MODULE },
        { label: this.$tc('ENTITY.TYPES.DELEGATE', 2), icon: 'delegate', type: TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE }
      ]
      return options.filter(item => types.includes(item.type))
    },

    isResignModalOpen () {
      return !!this.selectedEntity && this.modalAction === 'resign'
    },

    isUpdateModalOpen () {
      return !!this.selectedEntity && this.modalAction === 'update'
    }
  },

  mounted () {
    this.searchRegistrations()
  },

  methods: {
    async searchRegistrations () {
      this.loading = true
      const addresses = this.wallets.map(wallet => wallet.address)

      try {
        const result = await this.$client.fetchEntities(addresses)
        this.registrations = result
      } catch (e) {
        this.$error('Failed to fetch entities registrations.')
      }
      this.loading = false
    },

    getRegistrationsByType (type) {
      return this.registrations.filter(item => item.type === type)
    },

    onDropdownClick () {
      for (const table of this.$refs.table) {
        table.closeDropdowns()
      }
    },

    openModal ({ transaction, ipfsDataObject }, action) {
      this.modalAction = action
      this.selectedEntity = { transaction, ipfsDataObject }
    },

    closeModal () {
      this.modalAction = undefined
      this.selectedEntity = undefined
    },

    onSentRegistration (toggleModal) {
      toggleModal()
      this.onSent()
    },

    onSent () {
      this.closeModal()
      this.searchRegistrations()
    }
  }
}
</script>

<style lang="postcss" scoped>
.Registrations__item:first-child {
  @apply mt-0;
}
</style>
