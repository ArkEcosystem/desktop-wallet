<template>
  <InputGrid
    :items="images"
    :max-visible-items="maxVisibleItems"
    :item-attrs="['id', 'title', 'svg']"
    :selected="selectedItem"
    item-key="id"
    @input="select"
  >
    <template
      slot="item"
      slot-scope="{ id, title, svg }"
    >
      <div
        :title="title"
        :class="{ 'svg-button--selected': selectedItem && selectedItem.id === id }"
        class="svg-button w-18 h-18 p-4 rounded-lg text-center bg-theme-button"
        v-html="assets_loadImage(svg)"
      />
    </template>
  </InputGrid>
</template>

<script>
import { THEMES } from '@config'
import selectionMixin from './mixin-selection'
import selectionSvgMixin from './mixin-selection-svg'

export default {
  name: 'SelectionTheme',

  mixins: [selectionMixin, selectionSvgMixin],

  computed: {
    /**
     * Theme images
     */
    images () {
      return THEMES.map(theme => {
        return {
          id: theme.id,
          title: theme.title,
          svg: `theme.${theme.id}`
        }
      })
    }
  }
}
</script>
