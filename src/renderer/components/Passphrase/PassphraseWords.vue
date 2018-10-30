<template>
  <div class="PassphraseWords h-full w-full flex flex-wrap">
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

<style lang="postcss">
.PassphraseWords .InputText {
  width: calc(config('width.1/4') - config('margin.2'));
  @apply mr-2
}

.PassphraseWords .InputText__input[disabled] {
  @apply .bg-transparent
}
</style>
