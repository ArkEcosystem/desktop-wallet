<template>
  <div class="ProfileAll relative bg-theme-feature rounded-lg m-r-4 p-10">
    <h3>{{ $t('PAGES.PROFILE_ALL.HEADER') }}</h3>

    <div class="ProfileAll__grid mt-10">
      <router-link
        :to="{ name: 'profile-new' }"
        class="ProfileAll__grid__profile flex flex-row w-full"
      >
        <div
          :style="`backgroundImage: url('${assets_loadImage(addProfileImagePath)}')`"
          title="$t('PAGES.PROFILE_ALL.ADD_PROFILE')"
          class="profile-avatar-xl background-image flex"
        />
        <div class="ProfileAll__grid__profile__name font-semibold flex">
          {{ $t('PAGES.PROFILE_ALL.ADD_PROFILE') }}
        </div>
      </router-link>

      <div
        v-for="profile in profiles"
        :key="profile.id"
        class="ProfileAll__grid__profile flex flex-row w-full"
      >
        <!-- TODO highlight current profile -->
        <!-- TODO select instead of edit -->
        <router-link
          :to="{ name: 'profile-edition', params: { profileId: profile.id } }"
        >
          <div
            :style="`backgroundImage: url('${assets_loadImage(profile.avatar)}')`"
            :title="profile.name"
            class="profile-avatar-xl background-image flex"
          />
        </router-link>

        <div class="flex flex-col pl-2">
          <div class="ProfileAll__grid__profile__name font-semibold flex text-lg my-8">
            {{ profile.name }}
          </div>
          <div class="ProfileAll__grid__profile__select font-semibold flex text-xs mb-2">
            {{ $t('PAGES.PROFILE_ALL.SELECT_PROFILE') }}
          </div>
          <router-link
            :to="{ name: 'profile-edition', params: { profileId: profile.id } }"
            class="ProfileAll__grid__profile__edition-link font-semibold flex text-xs"
          >
            {{ $t('PAGES.PROFILE_ALL.EDIT_PROFILE') }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProfileAll',

  computed: {
    ...mapGetters({ profiles: 'profile/all' }),
    addProfileImagePath () {
      return 'pages/new-profile-avatar.svg'
    }
  }
}
</script>

<style scope>
.ProfileAll__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, calc(var(--profile-avatar-xl) * 2 + 5px));
  grid-gap: 1rem;
}
.ProfileAll__grid__profile:hover .profile-avatar-xl {
  transition: 0.5s;
  opacity: 0.5;
}
.ProfileAll__grid__profile > .profile-avatar-xl {
  width: var(--profile-avatar-xl);
}
.ProfileAll__grid__profile__name {
  width: var(--profile-avatar-xl);
}
</style>
