<template>
  <div class="ContactAll relative bg-theme-feature rounded-lg m-r-4 p-10">
    <div class="block h-full">
      <div class="ContactAll__header">
        <h3>{{ $t('PAGES.CONTACT_ALL.HEADER') }}</h3>

        <div class="flex items-center">
          <button
            v-if="!hasWalletGridLayout"
            class="ContactAll__CreateButton"
            @click="createContact"
          >
            <span class="ContactAll__CreateButton__icon">
              <SvgIcon
                name="plus"
                view-box="0 0 9 9"
                class="text-center"
              />
            </span>

            <span class="flex items-center h-10 px-4">
              {{ $t('PAGES.CONTACT_ALL.CREATE_CONTACT') }}
            </span>
          </button>

          <ButtonLayout
            :grid-layout="hasWalletGridLayout"
            @click="toggleWalletLayout()"
          />
        </div>
      </div>

      <div
        v-if="isLoading"
        class="h-full flex items-center"
      >
        <div class="m-auto">
          <Loader />
        </div>
      </div>

      <div
        v-if="hasWalletGridLayout && !isLoading"
      >
        <div class="ContactAll__grid mt-10 justify-center">
          <div class="ContactAll__grid__contact w-full overflow-hidden bg-theme-feature lg:bg-transparent rounded-lg border-theme-wallet-overview-border border-b border-r mb-3">
            <div class="flex flex-row items-center">
              <RouterLink :to="{ name: 'contact-new' }">
                <WalletIdenticonPlaceholder
                  :size="60"
                  class="identicon opacity-50"
                />
              </RouterLink>
              <div class="flex flex-col justify-center overflow-hidden pl-4 font-semibold">
                <RouterLink :to="{ name: 'contact-new' }">
                  {{ $t('PAGES.CONTACT_ALL.CREATE_CONTACT') }}
                </RouterLink>
                <span class="font-bold mt-2 opacity-50 text-lg">
                  {{ formatter_networkCurrency(0, 2) }}
                </span>
              </div>
            </div>
          </div>

          <div
            v-for="contact in selectableContacts"
            :key="contact.id"
            class="ContactAll__grid__contact w-full overflow-hidden bg-theme-feature lg:bg-transparent rounded-lg border-theme-wallet-overview-border border-b border-r mb-3"
          >
            <div class="flex flex-row items-center">
              <RouterLink
                :to="{ name: 'wallet-show', params: { address: contact.id } }"
                class="flex flex-row"
              >
                <WalletIdenticon
                  :value="contact.address"
                  :size="60"
                  class="identicon cursor-pointer"
                />
              </RouterLink>
              <div class="flex flex-col justify-center overflow-hidden pl-4">
                <div class="ContactAll__grid__contact__name font-semibold text-base truncate block">
                  <RouterLink :to="{ name: 'wallet-show', params: { address: contact.id } }">
                    {{ wallet_nameOnContact(contact.address) || wallet_truncate(contact.address) }}
                  </RouterLink>
                </div>
                <span class="font-bold mt-2 text-lg">
                  {{ formatter_networkCurrency(contact.balance, 2) }}
                </span>
              </div>
            </div>
            <div class="flex flex-row w-full justify-end">
              <button
                class="ContactAll__grid__contact__select font-semibold flex text-xs cursor-pointer hover:underline hover:text-red text-theme-page-text-light mt-4"
                @click="openRemovalConfirmation(contact)"
              >
                {{ $t('PAGES.CONTACT_ALL.DELETE_CONTACT') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else-if="!hasWalletGridLayout && !isLoading"
        class="ContactAll__tabular mt-10"
      >
        <WalletTable
          :has-pagination="false"
          :is-loading="false"
          :is-contacts-table="true"
          :show-voted-delegates="showVotedDelegates"
          :rows="selectableContacts"
          :total-rows="selectableContacts.length"
          :sort-query="sortParams"
          :no-data-message="$t('TABLE.NO_CONTACTS')"
          @remove-row="onRemoveContact"
        />
      </div>
    </div>

    <ContactRemovalConfirmation
      v-if="contactToRemove"
      :contact="contactToRemove"
      @cancel="hideRemovalConfirmation"
      @removed="removeContact(contactToRemove)"
    />
  </div>
</template>

<script>
import { clone, some, sortBy } from 'lodash'
import { ButtonLayout } from '@/components/Button'
import Loader from '@/components/utils/Loader'
import { ContactRemovalConfirmation } from '@/components/Contact'
import { WalletIdenticon, WalletIdenticonPlaceholder } from '@/components/Wallet'
import WalletTable from '@/components/Wallet/WalletTable'
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'ContactAll',

  components: {
    ButtonLayout,
    Loader,
    ContactRemovalConfirmation,
    WalletIdenticon,
    WalletIdenticonPlaceholder,
    WalletTable,
    SvgIcon
  },

  data: () => ({
    selectableContacts: [],
    contactToRemove: null,
    isLoading: false,
    sortParams: {
      field: 'name',
      type: 'asc'
    }
  }),

  computed: {
    contacts () {
      const contacts = this.$store.getters['wallet/contactsByProfileId'](this.session_profile.id)
      return sortBy(contacts, ['name', 'address'])
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
        const profile = clone(this.session_profile)
        profile.walletLayout = layout
        this.$store.dispatch('profile/update', profile)
      }
    },

    showVotedDelegates () {
      return some(this.selectableContacts, contact => contact.hasOwnProperty('votedDelegate'))
    }
  },

  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.$synchronizer.focus('contacts')
    })
  },

  async created () {
    this.isLoading = true

    this.selectableContacts = this.contacts

    this.isLoading = false
  },

  methods: {
    hideRemovalConfirmation () {
      this.contactToRemove = null
    },

    openRemovalConfirmation (contact) {
      this.contactToRemove = contact
    },

    removeContact (contact) {
      this.hideRemovalConfirmation()
      this.selectableContacts = this.selectableContacts.filter(c => {
        return c.id !== contact.id
      })
    },

    toggleWalletLayout () {
      this.walletLayout = this.walletLayout === 'grid' ? 'tabular' : 'grid'
    },

    onRemoveContact (contact) {
      this.openRemovalConfirmation(contact)
    },

    createContact () {
      this.$router.push({ name: 'contact-new' })
    }
  }
}
</script>

<style lang="postcss" scoped>
.ContactAll__header {
  @apply .flex .items-center .justify-between .h-8;
}
.ContactAll__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, calc(var(--contact-identicon-lg) * 3));
  grid-gap: 1rem;
}
.ContactAll__grid__contact {
  @apply .p-6
}
.ContactAll__grid__contact:hover .identicon {
  transition: 0.5s;
  opacity: 0.5;
}
.ContactAll__grid__contact .identicon {
  transition: 0.5s;
}
.ContactAll__CreateButton {
  transition: all .1s ease-in;
  @apply .flex .items-center .mx-auto .font-semibold .bg-theme-button .rounded .cursor-pointer .text-theme-option-button-text .mr-6;
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
@screen lg {
  .ContactAll__grid__contact {
    @apply .p-4
  }
}
</style>
