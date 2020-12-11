<template>
  <section class="Registrations flex flex-col">
    <div class="bg-theme-feature rounded-lg w-full px-10 py-5 mb-3 flex items-center justify-between">
      <h2>{{ $t('ENTITY.MY_REGISTRATIONS') }}</h2>
      <ButtonModal
        :disabled="!wallets.length"
        :label="$t('ENTITY.NEW_REGISTRATION')"
        class="Registrations__new-button m-0 ButtonGeneric blue-button"
      >
        <template slot-scope="{ toggle, isOpen }">
          <TransactionModal
            v-if="isOpen"
            :type="6"
            :group="2"
            :entity-action="0"
            :confirmation-title="$t('ENTITY.TRANSACTION_REVIEW')"
            title=""
            @cancel="toggle"
            @sent="onSentRegistration(toggle)"
          />
        </template>
      </ButtonModal>
    </div>

    <div
      class="bg-theme-feature rounded-lg w-full h-full p-10 flex flex-col overflow-y-auto"
    >
      <div v-if="isLoading">
        <Loader />
      </div>

      <div v-else-if="!isLoading && !registrations.length && !hasDelegatesWallets">
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
          <EntityTableDelegate
            v-if="item.icon === 'delegate'"
            ref="tableWrapper"
            class="mt-5 border-b"
            @resign="openModal($event, 'resign')"
            @update="openModal($event, 'update')"
            @dropdown-click="onDropdownClick"
          />
          <EntityTableCommon
            v-else
            ref="tableWrapper"
            :entity-type="item.type"
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
      :registration-id="selectedEntity.entity.id"
      :confirmation-title="$t('ENTITY.TRANSACTION_REVIEW')"
      title=""
      @cancel="closeModal"
      @sent="onSent"
    />

    <TransactionModal
      v-if="isUpdateModalOpen"
      :type="6"
      :group="2"
      :entity-action="1"
      :delegate="selectedEntity.delegate"
      :entity="selectedEntity.entity"
      :confirmation-title="$t('ENTITY.TRANSACTION_REVIEW')"
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
import { EntityTableCommon, EntityTableDelegate } from '@/components/Entity'
import SvgIcon from '@/components/SvgIcon'
import Loader from '@/components/utils/Loader'

export default {
  name: 'Registrations',

  components: {
    ButtonModal,
    EntityTableCommon,
    EntityTableDelegate,
    Loader,
    TransactionModal,
    SvgIcon
  },

  data: () => ({
    isLoading: true,
    modalAction: undefined,
    selectedEntity: undefined
  }),

  computed: {
    wallets () {
      return this.$store.getters['wallet/byProfileId'](this.session_profile.id)
    },

    hasDelegatesWallets () {
      return this.wallets.some(wallet => wallet.isDelegate)
    },

    registrations () {
      return Object.values(this.$store.getters['entity/bySessionProfile'])
    },

    registrationOptions () {
      const types = this.registrations.map(item => item.type)

      if (this.hasDelegatesWallets) {
        types.push(TRANSACTION_TYPES_ENTITY.TYPE.DELEGATE)
      }

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
    if (!this.wallets.length) {
      this.isLoading = false
    } else {
      this.loadRegistrations()
    }
  },

  methods: {
    async loadRegistrations () {
      try {
        await this.$store.dispatch('entity/loadRecent')
      } catch (error) {
        this.$error(this.$t('COMMON.FAILED_FETCH', {
          name: 'entities',
          msg: error.message
        }))
      }
      this.isLoading = false
    },

    onDropdownClick () {
      for (const wrapper of this.$refs.tableWrapper) {
        wrapper.$refs.table.closeDropdowns()
      }
    },

    openModal ({ entity, row: delegate }, action) {
      this.modalAction = action
      this.selectedEntity = { entity, delegate }
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
    }
  }
}
</script>

<style lang="postcss">
.Registrations__item:first-child {
  @apply mt-0;
}
.Registrations__new-button {
  padding-top: .95rem;
  padding-bottom: .95rem;
}
.TransactionModalEntity.TransactionModal--form  .ModalWindow__container__content {
  overflow-y: unset;
  @apply p-0;
}
.TransactionEntity__container {
  @apply p-16 overflow-y-auto;
  max-height: 48rem;
}

</style>
