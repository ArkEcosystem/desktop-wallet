<template>
  <div class="PassphraseWords h-full w-full">
    <InputText
      v-for="(word, index) in passphraseWords"
      :is-read-only="true"
      :key="index"
      :label="(index + 1).toString()"
      :name="`word-${index}`"
      :value="word"
    />
  </div>
</template>

<script>
import { InputText } from '@/components/Input'

export default {
  name: 'PassphraseWords',

  components: {
    InputText
  },

  props: {
    passphraseWords: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.PassphraseWords {
  display: grid;
  grid-template-columns: repeat(auto-fill, 5.5rem);
  grid-gap: 1rem;
}
</style>
