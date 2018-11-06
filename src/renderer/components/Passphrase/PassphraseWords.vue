<template>
  <div class="PassphraseWords h-full w-full flex flex-wrap">
    <InputText
      v-for="(word, index) in passphraseWords"
      :key="index"
      :is-read-only="true"
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
