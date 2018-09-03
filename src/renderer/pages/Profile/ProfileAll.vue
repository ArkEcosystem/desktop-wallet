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

      <router-link
        v-for="profile in profiles"
        :key="profile.id"
        :to="{ name: 'profile-edition', params: { id: profile.id } }"
        class="ProfileAll__grid__profile flex flex-row w-full"
      >
        <div
          :style="`backgroundImage: url('${assets_loadImage(profile.avatar)}')`"
          :title="profile.name"
          class="profile-avatar-xl background-image flex"
        />
        <div class="ProfileAll__grid__profile__name font-semibold flex text-xs">
          {{ profile.name }}
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ProfileAll',

  computed: {
    ...mapGetters({ profiles: 'profiles/all' }),
    addProfileImagePath () {
      return 'avatars/human-new.svg'
    }
  }
}
</script>

<style scope>
.ProfileAll__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 200px);
  grid-gap: 1rem;
}
.ProfileAll__grid__profile:hover .profile-avatar-xl {
  transition: 0.5s;
  opacity: 0.5;
}
.ProfileAll__grid__profile__name {
  width: var(--profile-avatar-xl);
  margin-top: 30px;
}
</style>
