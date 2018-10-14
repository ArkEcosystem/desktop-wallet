<template>
  <div class="ContactAll relative bg-theme-feature rounded-lg m-r-4 p-10">
    <h3>{{ $t('PAGES.CONTACT_ALL.HEADER') }}</h3>

    <div class="ContactAll__grid mt-10 justify-center">
      <div class="ContactAll__grid__contact flex flex-row w-full overflow-hidden">
        <router-link :to="{ name: 'contact-new' }" >
          <!-- TODO default identicon -->
          <div
            :style="`backgroundImage: url('https://api.adorable.io/avatars/285/abott@adorable.png');`"
            :title="$t('PAGES.CONTACT_ALL.CREATE_CONTACT')"
            class="contact-identicon-lg background-image flex cursor-pointer bg-contain opacity-50"
          />
        </router-link>
        <div class="flex flex-col justify-center overflow-hidden pl-4">
          <router-link :to="{ name: 'contact-new' }" >
            {{ $t('PAGES.CONTACT_ALL.CREATE_CONTACT') }}
          </router-link>
          <span class="font-bold mt-2 opacity-50">
            {{ formatter_networkCurrency(0, 2) }}
          </span>
        </div>
      </div>

      <div
        v-for="contact in contacts"
        :key="contact.id"
        class="ContactAll__grid__contact flex flex-row w-full overflow-hidden"
      >
        <router-link
          :to="{ name: 'wallet-show', params: { address: contact.id } }"
          class="flex flex-row"
        >
          <!-- TODO wallet identicon -->
          <div
            :style="`backgroundImage: url('https://api.adorable.io/avatars/285/abott@adorable.png')`"
            :title="contact.name"
            class="contact-identicon-lg background-image flex cursor-pointer bg-contain"
          />
        </router-link>
        <div class="flex flex-col justify-center overflow-hidden pl-4">
          <div class="ContactAll__grid__contact__name font-semibold text-lg truncate block">
            {{ trimName(contact.name) }}
          </div>
          <span class="font-bold mt-2">
            {{ formatter_networkCurrency(contact.balance, 2) }}
          </span>
          <div
            class="ContactAll__grid__contact__select font-semibold flex text-xs cursor-pointer hover:underline hover:text-red text-theme-page-text-light mt-4"
            @click="openRemovalConfirmation(contact)"
          >
            {{ $t('PAGES.CONTACT_ALL.DELETE_CONTACT') }}
          </div>
        </div>
      </div>
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
import { ContactRemovalConfirmation } from '@/components/Contact'
import WalletService from '@/services/wallet'

export default {
  name: 'ContactAll',

  components: {
    ContactRemovalConfirmation
  },

  data: () => ({
    contactToRemove: null
  }),

  computed: {
    contacts () {
      console.log(this.$store.getters['wallet/contactsByProfileId'](this.session_profile.id))
      return this.$store.getters['wallet/contactsByProfileId'](this.session_profile.id)
    }
  },

  methods: {
    hideRemovalConfirmation () {
      this.contactToRemove = null
    },

    openRemovalConfirmation (contact) {
      this.contactToRemove = contact
    },

    isAddress (value) {
      return WalletService.validateAddress(value, this.session_network.version)
    },

    trimName (name) {
      // If it's an address, use truncate middle
      if (this.isAddress(name)) {
        return this.wallet_truncateAddress(name)
      }

      // Else it's a name, simply use ellipses at the end (is handled by a class)
      return name
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
  @apply .p-4
}
.ContactAll__grid__contact:hover .contact-identicon-lg {
  transition: 0.5s;
  opacity: 0.5;
}
</style>
