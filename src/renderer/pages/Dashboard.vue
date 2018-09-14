<template>
  <div class="Dashboard relative flex flex-row h-full w-full">
    <main class="bg-theme-feature rounded-lg mr-4 w-2/3">
      Chart
    </main>

    <div class="Dashboard__wallets relative bg-theme-feature rounded-lg w-1/3 flex flex-col">
      <nav class="flex flex-row text-theme-feature-item-alternative-text">
        <router-link
          :to="{ name: 'wallet-new' }"
          class="Dashboard__wallets__create hover:bg-theme-button-text hover:text-theme-feature hover:no-underline rounded-tl-lg"
        >
          <span>
            {{ $t('PAGES.DASHBOARD.CREATE_WALLET') }}
          </span>
        </router-link>

        <router-link
          :to="{ name: 'wallet-import' }"
          class="Dashboard__wallets__import hover:bg-theme-button-text hover:text-theme-feature hover:no-underline rounded-tr-lg"
        >
          <span>
            {{ $t('PAGES.DASHBOARD.IMPORT_WALLET') }}
          </span>
        </router-link>
      </nav>

      <div class="Dashboard__wallets__list py-6 mx-8">
        <h3>{{ $t('PAGES.DASHBOARD.ALL_WALLETS') }}</h3>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',

  components: {
  },

  methods: {
  }
}
</script>

<style lang="postcss" scoped>
.Dashboard__wallets__create,
.Dashboard__wallets__import {
  @apply .w-1/2 .appearance-none .font-semibold .pt-12 .pb-4 .flex .justify-center .items-center
}
.Dashboard__wallets__create > span,
.Dashboard__wallets__import > span {
  @apply .py-2 .w-full .text-center
}

.Dashboard__wallets__create > span {
  border-right: 0.04rem solid var(--theme-feature-item-alternative);
}
.Dashboard__wallets__import > span {
  border-left: 0.04rem solid var(--theme-feature-item-alternative);
}
.Dashboard__wallets__create:hover > span {
  border-right: 0px;
}
.Dashboard__wallets__import:hover > span {
  border-left: 0px;
}

.Dashboard__wallets__list {
  border-top: 0.08rem solid var(--theme-feature-item-alternative);
}
</style>
