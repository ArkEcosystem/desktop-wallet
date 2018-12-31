<template>
  <div class="ContactAll relative lg:bg-theme-feature rounded-lg m-r-4 p-10">
    <div class="ContactAll__header flex justify-between">
      <h3>{{ $t('PAGES.CONTACT_ALL.HEADER') }}</h3>

      <ButtonLayout
        :grid-layout="hasGridLayout"
        @click="toggleLayout()"
      />
    </div>

    <div
      v-if="hasGridLayout"
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
          v-for="contact in contacts"
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
      v-else
      class="ContactAll__tabular mt-10"
    >
      <WalletTable
        :has-pagination="false"
        :is-loading="false"
        :is-contacts-table="true"
        :rows="contacts"
        :total-rows="contacts.length"
        :sort-query="sortParams"
        :no-data-message="$t('TABLE.NO_CONTACTS')"
        @remove-row="onRemoveContact"
      />
    </div>

    <ContactRemovalConfirmation
      v-if="contactToRemove"
      :contact="contactToRemove"
      @cancel="hideRemovalConfirmation"
      @removed="hideRemovalConfirmation"
    />
  </div>
</template>

<script>
import ButtonLayout from '@/components/Button/ButtonLayout'
import { ContactRemovalConfirmation } from '@/components/Contact'
import { clone, sortBy } from 'lodash'
import { WalletIdenticon, WalletIdenticonPlaceholder } from '@/components/Wallet'
import WalletTable from '@/components/Wallet/WalletTable'

export default {
  name: 'ContactAll',

  components: {
    ButtonLayout,
    ContactRemovalConfirmation,
    WalletIdenticon,
    WalletIdenticonPlaceholder,
    WalletTable
  },

  data: () => ({
    contactToRemove: null,
    sortParams: {
      field: 'name',
      type: 'asc'
    }
  }),

  computed: {
    contacts () {
      const contacts = this.$store.getters['wallet/contactsByProfileId'](this.session_profile.id)
      return sortBy(contacts, 'name')
    },

    hasGridLayout () {
      return this.$store.getters['session/hasGridLayout']
    },

    sessionLayout: {
      get () {
        return this.$store.getters['session/layout']
      },
      set (layout) {
        this.$store.dispatch('session/setLayout', layout)
        const profile = clone(this.session_profile)
        profile.layout = layout
        this.$store.dispatch('profile/update', profile)
      }
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

    openRemovalConfirmation (contact) {
      this.contactToRemove = contact
    },

    toggleLayout () {
      this.sessionLayout = this.sessionLayout === 'grid' ? 'tabular' : 'grid'
    },

    onRemoveContact (contact) {
      this.openRemovalConfirmation(contact)
    }
  }
}
</script>

<style lang="postcss" scoped>
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
@screen lg {
  .ContactAll__grid__contact {
    @apply .p-4
  }
}
</style>
