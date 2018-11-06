<template>
  <div class="SelectionNetwork">
    <InputGrid
      :items="images"
      :max-visible-items="maxVisibleItems"
      :item-attrs="['id', 'textContent', 'title', 'svg']"
      :selected="selectedItem"
      item-key="id"
      @input="select"
    >
      <template
        slot="item"
        slot-scope="{ id, textContent, title, svg }"
      >
        <div
          :title="title"
          :class="{
            'svg-button--selected': selectedItem && selectedItem.id === id,
            'rounded-l-lg': first.id === id,
            'rounded-r-lg': last.id === id,
          }"
          class="svg-button w-30 h-30 text-center text-grey"
        >
          <!-- eslint-disable vue/no-v-html -->
          <div
            class="w-14 h-14 mx-6 mt-4"
            v-html="assets_loadImage(svg)"
          />
          <span class="text-black font-semibold">{{ textContent }}</span>
        </div>
      </template>
    </InputGrid>
  </div>
</template>

<script>
import { NETWORKS } from '@config'
import selectionMixin from './mixin-selection'
import selectionSvgMixin from './mixin-selection-svg'

export default {
  name: 'SelectionNetwork',

  mixins: [selectionMixin, selectionSvgMixin],

  computed: {
    /**
     * Network images
     */
    images () {
      return NETWORKS.map(network => {
        return {
          id: network.id,
          title: network.description,
          textContent: network.title,
          svg: `network.${network.id}`
        }
      })
    },
    first () {
      return this.images[0]
    },
    last () {
      return this.images[this.images.length - 1]
    }
  }
}
</script>

<style>
/* In this case it is necessary to modify the inner component style */
.SelectionNetwork .InputGrid__container {
  display: grid;
  /* Maximum 3 columns */
  grid-template-columns: repeat(2, 7rem);
  grid-gap: 0rem;
}
.SelectionNetwork .InputGrid__container .svg-button--selected > span {
  color: white;
}
</style>
