<template>
  <div class="WalletButton__create">
    <RouterLink
      :to="{ name: 'wallet-new' }"
      class="font-bold text-center"
    >
      <span class="rounded-full bg-theme-button h-8 w-8 mb-3 mx-auto flex items-center justify-center">
        <SvgIcon
          name="plus"
          class="text-center"
          view-box="0 0 9 9"
        />
      </span>

      {{ $t('PAGES.WALLET_ALL.CREATE_WALLET') }}
    </RouterLink>
  </div>
</template>

<script>
import SvgIcon from '@/components/SvgIcon'

export default {
  name: 'WalletButtonCreate',

  components: {
    SvgIcon
  }
}
</script>

<style lang="postcss" scoped>
.WalletButton__create {
  @apply .appearance-none .font-semibold .flex .flex-col .items-center .border-r .border-theme-feature-item-alternative
}
.WalletButton__create > span {
  @apply .w-full .text-center
}
.WalletButton__create > a > .rounded-full {
  @apply .cursor-pointer .fill-current .text-theme-option-button-text;
  transition: opacity 0.4s;
}
.WalletButton__create > a:hover > .rounded-full {
  opacity: 0.5;
}

.WalletButton__create > span {
  border-right: 0.04rem solid var(--theme-feature-item-alternative);
  align-self: center;
}
.WalletButton__create:hover > span {
  border-right: 0px;
}
</style>
