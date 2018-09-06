<template>
  <div class="PassphraseVerification flex flex-col h-full w-full justify-around">
    <div class="PassphraseVerification__inputs">
      <InputText
        v-for="(input, position) in inputs"
        :is-disabled="isAccepted(position, input)"
        :key="position"
        :label="$t('PASSPHRASE_VERIFICATION.WORD_LABEL', { position })"
        :name="`input-${position}`"
        :ref="`input-${position}`"
        :title="$t('PASSPHRASE_VERIFICATION.WORD_LABEL', { position })"
        :value="input"
        @focus="showSuggestions(position)"
        @input="updateCurrentWord($event)"
      />
    </div>

    <div class="PassphraseVerification__suggestions">
      <span
        v-for="suggestion in suggestions"
        :key="suggestion"
        :class="acceptedWords[currentPosition] === suggestion
          ? 'bg-green rounded p4 text-white font-semibold'
          : 'hover:text-theme-button-text'
        "
        :title="suggestion"
        class="cursor-pointer py-2 px-4 text-center"
        @click="updateCurrentWord(suggestion)"
      >
        {{ suggestion }}
      </span>
    </div>
  </div>
</template>

<script>
import { isEqual, isString, shuffle, uniq } from 'lodash'
import InputText from '@/components/InputText'

export default {
  name: 'PassphraseVerification',

  components: {
    InputText
  },

  props: {
    passphrase: {
      type: [String, Array],
      required: true
    },
    /**
     * Positions of the words to verify (starting from 1)
     */
    wordPositions: {
      type: Array,
      required: false,
      default: () => [3, 6, 9]
    },
    additionalSuggestions: {
      type: Array,
      required: false,
      default: () => []
    },
    suggestionsPerWord: {
      type: Number,
      required: false,
      default: 9
    }
  },

  data () {
    return this.resetData({})
  },

  computed: {
    allVerified () {
      return this.positions.every(position => {
        return this.isAccepted(position, this.acceptedWords[position])
      })
    },

    availableSuggestions () {
      return this.additionalSuggestions.length >= (this.suggestionsPerWord - 1)
        ? this.additionalSuggestions
        : this.additionalSuggestions.concat(this.passphraseWords)
    },
    /**
     * Return the suggested words per each position
     * @return {Object}
     */
    suggestedPerPosition () {
      return this.positions.reduce((acc, position) => {
        const passphraseWord = this.words[position]

        let suggestions = [passphraseWord].concat(shuffle(this.availableSuggestions))
        suggestions = shuffle(uniq(suggestions).slice(0, this.suggestionsPerWord))

        acc[position] = suggestions
        return acc
      }, {})
    },

    /**
     * @return {Array}
     */
    passphraseWords () {
      return Array.isArray(this.passphrase) ? this.passphrase : this.passphrase.split(' ')
    },
    positions () {
      return this.wordPositions.map(p => p.toString())
    },
    /**
     * @return {Object}
     */
    words () {
      return this.passphraseWords.reduce((acc, word, i) => {
        acc[(i + 1).toString()] = word
        return acc
      }, {})
    }
  },

  watch: {
    /**
     * Reset the accepted words if the passphrase changes
     */
    passphrase () {
      this.resetData(this.$data)
    },
    wordPositions () {
      this.resetData(this.$data)
    }
  },

  methods: {
    acceptWord (word) {
      if (isEqual(word, this.words[this.currentPosition])) {
        this.acceptedWords[this.currentPosition] = word
      } else {
        throw new Error(`The word "${word}" should not be accepted`)
      }

      setTimeout(() => {
        if (this.allVerified) {
          this.hideSuggestions()
          this.$emit('verified')
        } else {
          this.toNextWord()
        }
      }, 600)
    },
    /**
     * @param {String} position
     * @param {String} word
     */
    isAccepted (position, word) {
      return isString(word) && word !== '' && isEqual(this.acceptedWords[position], word)
    },

    resetData (data) {
      // The position 0 is not used, but it's not `null`, so it avoids checking the value
      data.currentPosition = 0
      data.currentWord = null
      // Map is not reactive yet in Vue, so we need to use an Object
      data.inputs = {}
      data.acceptedWords = {}
      data.suggestions = []

      this.wordPositions.forEach(wordPosition => {
        const position = wordPosition.toString()
        data.acceptedWords[position] = null
        data.inputs[position] = ''
      })

      return data
    },

    /**
     * @param {String} position
     */
    showSuggestions (position) {
      this.currentPosition = position
      this.suggestions = this.suggestedPerPosition[position]
    },
    hideSuggestions () {
      this.suggestions = []
    },

    toNextWord () {
      const index = this.positions.indexOf(this.currentPosition)

      let nextPosition = this.positions[index + 1]
      if (!nextPosition) {
        nextPosition = this.positions[0]
      }

      this.showSuggestions(nextPosition)

      const textInput = this.$refs[`input-${nextPosition}`][0]
      textInput.focus()
    },

    updateCurrentWord (text) {
      this.currentWord = text
      this.$set(this.inputs, this.currentPosition, this.currentWord)

      const expected = this.words[this.currentPosition]
      if (this.currentWord === expected) {
        // Ensure that the suggestion is using the same word
        this.suggestion = this.currentWord

        this.acceptWord(this.currentWord)
      }
    }
  }
}
</script>

<style scoped>
.PassphraseVerification__inputs, .PassphraseVerification__suggestions {
  display: grid;
  grid-template-columns: repeat(3, 7rem);
  grid-gap: 0.5rem;
}
</style>
