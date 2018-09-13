<template>
  <div id="wrapper">
    <main>
      Wallets
      <p>
        <router-link
          :to="{ name: 'wallet-new' }"
        >
          New wallet
        </router-link>
      </p>
    </main>
  </div>
</template>

<script>
export default {
}
</script>

<style>
</style>
