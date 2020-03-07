<template>
  <div class="PassphraseVerification flex flex-col h-full w-full justify-around">
    <div class="PassphraseVerification__inputs">
      <InputText
        v-for="(input, position) in inputs"
        :key="position"
        :ref="`input-${position}`"
        :is-disabled="isAccepted(position, input)"
        :label="$t(`PASSPHRASE_VERIFICATION.WORD_LABEL_${position}`)"
        :name="`input-${position}`"
        :title="$t(`PASSPHRASE_VERIFICATION.WORD_LABEL_${position}`)"
        :value="input"
        class="PassphraseVerification__inputs__input"
        @focus="showSuggestions(position)"
        @input="updateCurrentWord($event)"
      />
    </div>

    <div class="PassphraseVerification__suggestions">
      <button
        v-for="suggestion in suggestions"
        :key="suggestion"
        :class="acceptedWords[currentPosition] === suggestion
          ? 'bg-green rounded p4 text-white font-semibold'
          : 'hover:text-theme-button-text'
        "
        :title="suggestion"
        class="PassphraseVerification__suggestions__input cursor-pointer py-2 px-1 text-center text-theme-page-text"
        @click="updateCurrentWord(suggestion)"
      >
        {{ suggestion }}
      </button>
    </div>
  </div>
</template>

<script>
import { isEqual, shuffle, uniq } from 'lodash'
import { InputText } from '@/components/Input'

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
        this.$set(this.acceptedWords, this.currentPosition, word)
      } else {
        throw new Error(`The word "${word}" should not be accepted`)
      }

      this.$nextTick(() => {
        setTimeout(() => {
          if (this.allVerified) {
            this.hideSuggestions()
            this.$emit('verified')
          } else {
            this.toNextWord()
          }
        }, 600)
      })
    },
    /**
     * @param {String} position
     * @param {String} word
     */
    isAccepted (position, word) {
      return typeof word === 'string' && word !== '' && isEqual(this.acceptedWords[position], word)
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
        this.$set(data.acceptedWords, position, null)
        this.$set(data.inputs, position, '')
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
      if (!this.allVerified) {
        let index = this.positions.indexOf(this.currentPosition)

        let nextEmptyPosition = null
        while (!nextEmptyPosition) {
          // After reaching the last position, move to the first
          if (!this.positions[++index]) {
            index = 0
          }

          // Ignore already accepted words
          const nextPosition = this.positions[index]
          if (!this.acceptedWords[nextPosition]) {
            nextEmptyPosition = nextPosition
            break
          }
        }

        this.showSuggestions(nextEmptyPosition)

        const textInput = this.$refs[`input-${nextEmptyPosition}`][0]
        textInput.focus()
      }
    },

    updateCurrentWord (text) {
      this.currentWord = text
      this.$set(this.inputs, this.currentPosition.toString(), this.currentWord)

      const expected = this.words[this.currentPosition]
      if (this.currentWord === expected) {
        // Ensure that the suggestion is using the same word
        this.suggestion = this.currentWord

        this.acceptWord(this.currentWord)
      }
    },

    async focusFirst () {
      await this.$nextTick
      const first = this.wordPositions[0]
      // NOTE: v-for refs do not guarantee the same order as the source Array.
      this.$el.querySelector(`[name=input-${first}]`).focus()
    }
  }
}
</script>

<style lang="postcss" scoped>
.PassphraseVerification__inputs, .PassphraseVerification__suggestions {
  @apply flex flex-wrap
},

.PassphraseVerification__inputs__input, .PassphraseVerification__suggestions__input {
  width: calc(config('width.1/3') - config('margin.2'));
  @apply mr-2
}
</style>
