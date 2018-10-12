<template>
  <div class="ContactAll relative bg-theme-feature rounded-lg m-r-4 p-10">
    <h3>{{ $t('PAGES.CONTACT_ALL.HEADER') }}</h3>

    <div class="ContactAll__grid mt-10">
      <div class="ContactAll__grid__wallet flex flex-row w-full">
        <div class="w-full font-semibold flex flex-col text-xl justify-around items-center" >
          <router-link :to="{ name: 'contact-new' }" >
            {{ $t('PAGES.CONTACT_ALL.CREATE_CONTACT') }}
          </router-link>
        </div>
      </div>

      <div
        v-for="contact in contacts"
        :key="contact.id"
        class="ContactAll__grid__contact flex flex-row w-full"
      >
        <router-link :to="{ name: 'wallet-show', params: { address: contact.id } }">
          <div
            :style="`backgroundImage: url('https://api.adorable.io/avatars/285/abott@adorable.png')`"
            :title="contact.name"
            class="contact-identicon-xl background-image flex cursor-pointer"
          />
        </router-link>

        <div class="flex flex-col">
          <div class="ContactAll__grid__contact__name font-semibold flex text-lg pl-4 mt-8">
            {{ contact.name }}
          </div>

          <router-link
            :to="{ name: 'wallet-show', params: { address: contact.id } }"
            class="ContactAll__grid__contact__edition-link font-semibold flex text-xs pl-4 mt-2 mb-6"
          >
            {{ $t('PAGES.CONTACT_ALL.SHOW_CONTACT') }}
          </router-link>

          <div
            class="ContactAll__grid__contact__select font-semibold flex text-xs cursor-pointer pl-4 hover:underline hover:text-red"
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
      return this.$store.getters['wallet/contactsByProfileId'](this.session_profile.id)
    }
  },

  methods: {
    hideRemovalConfirmation () {
      this.contactToRemove = null
    },

    openRemovalConfirmation (contact) {
      this.contactToRemove = contact
    }
  }
}
</script>

<style lang="postcss" scoped>
.ContactAll__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, calc(var(--contact-identicon-xl) * 2));
  grid-gap: 1rem;
}
.ContactAll__grid__contact {
  @apply .p-4
}
.ContactAll__grid__contact:hover .contact-identicon-xl {
  transition: 0.5s;
  opacity: 0.5;
}
.ContactAll__grid__contact__name {
  width: var(--contact-identicon-xl);
}
</style>
