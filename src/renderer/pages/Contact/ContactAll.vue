<template>
  <div class="ContactAll">
    <div class="ContactAll__heading px-10 py-5 mb-3">
      <div>
        <WalletIdenticonPlaceholder
          :size="60"
          class="identicon opacity-50"
        />
        <span
          class="rounded-full flex items-center justify-center absolute ml-8 -mt-8 w-8 h-8 bg-theme-feature text-theme-page-text-light font-black select-none"
        >
          i
        </span>
      </div>

      <div class="ml-8 p-2 hidden md:flex">
        {{ $t('PAGES.CONTACT_ALL.INSTRUCTIONS') }}
      </div>

      <button
        class="ContactAll__CreateButton ml-12 justify-end"
        @click="createContact"
      >
        <span class="ContactAll__CreateButton__icon">
          <SvgIcon
            name="plus"
            view-box="0 0 9 9"
            class="text-center"
          />
        </span>

        <span class="flex items-center h-10 px-4 whitespace-no-wrap">
          {{ $t('PAGES.CONTACT_ALL.CREATE_CONTACT') }}
        </span>
      </button>
    </div>

    <div class="flex flex-1 flex-col bg-theme-feature rounded-lg p-10 overflow-y-auto">
      <div class="block w-full">
        <div class="ContactAll__header">
          <h3 class=" items-center">
            {{ $t('PAGES.CONTACT_ALL.HEADER') }}
          </h3>

          <ButtonLayout
            :grid-layout="hasWalletGridLayout"
            @click="toggleWalletLayout"
          />
        </div>
      </div>

      <WalletGrid
        v-if="hasWalletGridLayout"
        :wallets="contacts"
        @show="showContact"
        @rename="openRenameModal"
        @remove="openRemovalConfirmation"
      />

      <div
        v-else-if="!hasWalletGridLayout"
        class="ContactAll__tabular mt-10"
      >
        <WalletTable
          :has-pagination="false"
          :is-loading="false"
          :is-contacts-table="true"
          :show-voted-delegates="showVotedDelegates"
          :rows="contacts"
          :total-rows="contacts.length"
          :sort-query="{
            field: sortParams.field,
            type: sortParams.type
          }"
          :no-data-message="$t('TABLE.NO_CONTACTS')"
          @remove-row="onRemoveContact"
          @rename-row="onRenameContact"
          @on-sort-change="onSortChange"
        />
      </div>
    </div>

    <ContactRemovalConfirmation
      v-if="contactToRemove"
      :contact="contactToRemove"
      @cancel="hideRemovalConfirmation"
      @removed="removeContact(contactToRemove)"
    />

    <ContactRenameModal
      v-if="contactToRename"
      :wallet="contactToRename"
      @cancel="hideRenameModal"
      @renamed="onContactRenamed"
    />
  </div>
</template>

<script>
import { isEqual } from 'lodash'
import { ButtonLayout } from '@/components/Button'
import { ContactRemovalConfirmation, ContactRenameModal } from '@/components/Contact'
import { WalletGrid, WalletIdenticonPlaceholder } from '@/components/Wallet'
import WalletTable from '@/components/Wallet/WalletTable'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'ContactAll',

  components: {
    ButtonLayout,
    ContactRemovalConfirmation,
    ContactRenameModal,
    WalletGrid,
    WalletIdenticonPlaceholder,
    WalletTable,
    SvgIcon
  },

  data: () => ({
    contactToRemove: null,
    contactToRename: null
  }),

  computed: {
    contacts () {
      const contacts = this.$store.getters['wallet/contactsByProfileId'](this.session_profile.id)
      return this.wallet_sortByName(contacts)
    },

    hasWalletGridLayout () {
      return this.$store.getters['session/hasWalletGridLayout']
    },

    walletLayout: {
      get () {
        return this.$store.getters['session/walletLayout']
      },
      set (layout) {
        this.$store.dispatch('session/setWalletLayout', layout)

        this.$store.dispatch('profile/update', {
          ...this.session_profile,
          walletLayout: layout
        })
      }
    },

    sortParams: {
      get () {
        return this.$store.getters['session/contactSortParams']
      },
      set (sortParams) {
        this.$store.dispatch('session/setContactSortParams', sortParams)

        this.$store.dispatch('profile/update', {
          ...this.session_profile,
          contactSortParams: sortParams
        })
      }
    },

    showVotedDelegates () {
      return this.contacts.some(contact => Object.prototype.hasOwnProperty.call(contact, 'vote'))
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$synchronizer.focus('contacts')
    })
  },

  methods: {
    hideRemovalConfirmation () {
      this.contactToRemove = null
    },

    hideRenameModal () {
      this.contactToRename = null
    },

    openRemovalConfirmation (contact) {
      this.contactToRemove = contact
    },

    openRenameModal (contact) {
      this.contactToRename = contact
    },

    removeContact () {
      this.hideRemovalConfirmation()
    },

    toggleWalletLayout () {
      this.walletLayout = this.walletLayout === 'grid' ? 'tabular' : 'grid'
    },

    onRemoveContact (contact) {
      this.openRemovalConfirmation(contact)
    },

    onRenameContact (contact) {
      this.openRenameModal(contact)
    },

    onContactRenamed () {
      this.hideRenameModal()
    },

    createContact () {
      this.$router.push({ name: 'contact-new' })
    },

    onSortChange (sortParams) {
      if (!isEqual(sortParams, this.sortParams)) {
        this.sortParams = sortParams
      }
    },

    showContact (contactId) {
      this.$router.push({ name: 'wallet-show', params: { address: contactId } })
    }
  }
}
</script>

<style lang="postcss" scoped>
.ContactAll {
  @apply .flex .flex-col .overflow-y-hidden .rounded-lg;
}
.ContactAll__heading {
  @apply .flex .items-center .justify-between .bg-theme-feature .rounded-lg;
}
.ContactAll__header {
  @apply .flex .items-center .justify-between .h-8;
}
.ContactAll__CreateButton {
  transition: all .1s ease-in;
  @apply .flex .items-center .font-semibold .bg-theme-button .rounded .cursor-pointer .text-theme-button-text;
}
.ContactAll__CreateButton:hover {
  @apply .bg-blue .text-white;
}
.ContactAll__CreateButton__icon {
  transition: all .1s ease-in;
  @apply .flex .items-center .justify-center .h-10 .w-10 .rounded-l .bg-theme-button-inner-box;
}
.ContactAll__CreateButton:hover .ContactAll__CreateButton__icon {
  background-color: #0169f4;
  @apply .text-white;
}
</style>
