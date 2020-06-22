<template>
  <div class="SplashScreen bg-default-background absolute h-full w-full flex flex-col text-center select-none">
    <div class="flex flex-1 justify-center">
      <div class="flex rounded-lg mb-3 p-5 bg-red m-auto">
        <img
          src="@/assets/images/ark-logo.png"
          class="h-12"
        >
      </div>
    </div>

    <div class="flex-inline">
      <div class="text-4xl mb-4">
        <span class="font-semibold">{{ $t('COMMON.ARK') }}</span>
        {{ $t('COMMON.DESKTOP_WALLET') }}
      </div>

      <div class="text-sm mb-2">
        {{ loadingMessage }}
      </div>
    </div>

    <div class="flex-1">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        x="0px"
        y="0px"
        width="80px"
        height="80px"
        viewBox="0 0 40 40"
        enable-background="new 0 0 40 40"
        xml:space="preserve"
      >
        <path
          fill="#e5f0f8"
          d="M20.201,5.169c-8.254,0-14.946,6.692-14.946,14.946c0,8.255,6.692,14.946,14.946,14.946
          s14.946-6.691,14.946-14.946C35.146,11.861,28.455,5.169,20.201,5.169z M20.201,31.749c-6.425,0-11.634-5.208-11.634-11.634
          c0-6.425,5.209-11.634,11.634-11.634c6.425,0,11.633,5.209,11.633,11.634C31.834,26.541,26.626,31.749,20.201,31.749z"
        />

        <path
          fill="#007dff"
          d="M26.013,10.047l1.654-2.866c-2.198-1.272-4.743-2.012-7.466-2.012h0v3.312h0
          C22.32,8.481,24.301,9.057,26.013,10.047z"
        >
          <animateTransform
            attributeType="xml"
            attributeName="transform"
            type="rotate"
            from="0 20 20"
            to="360 20 20"
            dur="0.8s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>

    <div class="flex-inline text-sm pb-4">
      {{ `${$t('COMMON.VERSION')} ${version}` }}
    </div>
  </div>
</template>

<script>
import '@/styles/style.css'
import packageJson from '../../package.json'

export default {
  name: 'SplashScreen',

  computed: {
    version () {
      return packageJson.version
    },
    loadingMessage () {
      if (window.navigator.onLine) {
        return this.$t('COMMON.INITIALIZING')
      }

      return this.$t('COMMON.NO_INTERNET_CONNECTION')
    }
  }
}
</script>

<style scoped>
.SplashScreen {
  color: #3c4249;
}
</style>
