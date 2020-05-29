<template>
  <div class="bg-white w-full h-full">
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="flex items-center h-20 md:h-24">
        <div class="flex rounded-lg p-2 bg-red">
          <img src="@/assets/images/ark-logo.png" class="h-6 md:h-8 lg:h-10" />
        </div>
      </div>
    </div>

    <div class="container mx-auto">
      <div class="mx-auto my-8 md:w-3/4 lg:w-3/5 xl:w-1/2">
        <h1 class="mx-4 text-2xl font-bold md:text-4xl md:mx-8 xl:mx-16">
          Create Profile
        </h1>
        <div class="mx-4 mt-2 text-gray-700 md:mx-8 xl:mx-16">
          Create a new Profile or login with your MarketSquare account to get
          started.
        </div>

        <div class="mx-4 mt-5 md:mx-8 xl:mx-16">
          <button class="button-primary w-full">Sign in to MarketSquare</button>
          <div class="pt-4 mt-8 border-t border-gray-200"></div>
        </div>

        <div class="mx-4 mt-5 md:mx-8 xl:mx-16">
          <div class="mb-4">
            <div class="flex flex-1">
              <div class="w-full">
                <div class="input-group">
                  <label for="name" class="input-label">Name</label>
                  <div class="input-wrapper">
                    <input type="text" class="input-text" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <div class="flex flex-1">
              <div class="w-full">
                <div class="input-group">
                  <label for="default-price-provider" class="input-label"
                    >Default Price Provider</label
                  >
                  <div class="input-wrapper">
                    <select
                      name="default-price-provider"
                      class="form-select block w-full pl-4 pr-8 py-3"
                    >
                      <option value="">CoinGecko</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <div class="flex flex-1">
              <div class="w-full">
                <div class="input-group">
                  <label for="name" class="input-label">Default Currency</label>
                  <div class="input-wrapper">
                    <select
                      name="default-price-provider"
                      class="form-select block w-full pl-4 pr-8 py-3"
                    >
                      <option value="">USD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mx-4 mt-5 mb-10 md:mx-8 xl:mx-16">
          <div class="pt-4 mb-4 border-t border-dashed border-gray-200"></div>
          <button class="button-secondary mr-2">Back</button>
          <button class="button-primary">Complete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class ProfileNew extends Vue {}
</script>
