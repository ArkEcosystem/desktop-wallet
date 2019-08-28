import { pull } from 'lodash'
import { mount } from '@vue/test-utils'
import Vue from 'vue'
import Vuelidate from 'vuelidate'
import { useI18nGlobally } from '../../__utils__/i18n'
import { PassphraseVerification } from '@/components/Passphrase'

const i18n = useI18nGlobally()

Vue.use(Vuelidate)

describe('PassphraseVerification', () => {
  const passphrase = 'one two three four five six seven eight nine ten eleven twelve'
  const wordArray = passphrase.split(' ')
  const words = wordArray.reduce((acc, word, index) => {
    acc[(index + 1).toString()] = word
    return acc
  }, {})

  let wrapper

  beforeEach(() => {
    wrapper = mount(PassphraseVerification, {
      i18n,
      propsData: {
        passphrase
      }
    })
  })

  it('should render', () => {
    expect(wrapper.contains('.PassphraseVerification')).toBeTruthy()
  })

  it('should display an `InputText` per position', () => {
    const inputs = wrapper.findAll('.InputText')
    expect(inputs).toHaveLength(wrapper.vm.wordPositions.length)
  })

  describe('computed passpharseWords', () => {
    describe('when receiving a String as the `passphrase` props', () => {
      it('should return it as an Array', () => {
        expect(wrapper.vm.passphraseWords).toEqual(wordArray)
      })
    })

    describe('when receiving an Array as the `passphrase` props', () => {
      it('should return it as an Array', () => {
        wrapper.setProps({ passphrase: wordArray })
        expect(wrapper.vm.passphraseWords).toEqual(wordArray)
      })
    })
  })

  describe('computed words', () => {
    describe('when receiving a String as the `passphrase` props', () => {
      it('should return it as an Object', () => {
        expect(wrapper.vm.words).toEqual(words)
      })
    })

    describe('when receiving an Array as the `passphrase` props', () => {
      it('should return it as an Object', () => {
        wrapper.setProps({ passphrase: wordArray })
        expect(wrapper.vm.words).toEqual(words)
      })
    })
  })

  describe('suggestedPerPosition', () => {
    it('should return `suggestionsPerWord` suggestions', () => {
      let suggested = wrapper.vm.suggestedPerPosition

      const defaultNumber = 9
      ;[3, 6, 9].forEach(position => {
        expect(suggested).toBeInstanceOf(Object)
        expect(suggested[position.toString()]).toBeArray()
        expect(suggested[position.toString()]).toHaveLength(defaultNumber)
      })

      wrapper.setProps({
        suggestionsPerWord: 4,
        wordPositions: [3, 2, 1]
      })
      suggested = wrapper.vm.suggestedPerPosition

      ;[3, 2, 1].forEach(position => {
        expect(suggested).toBeInstanceOf(Object)
        expect(suggested[position.toString()]).toBeArray()
        expect(suggested[position.toString()]).toHaveLength(4)
      })
    })

    describe('when there are not `additionalSuggestions`', () => {
      it('should include the passphrase word into the suggestions', () => {
        const suggested = wrapper.vm.suggestedPerPosition

        ;[3, 6, 9].forEach(position => {
          const passphraseWord = words[position.toString()]
          expect(suggested).toBeInstanceOf(Object)
          expect(suggested[position.toString()]).toContain(passphraseWord)
        })
      })

      it('should include passphrase words only in the suggestions', () => {
        const suggested = wrapper.vm.suggestedPerPosition

        ;[3, 6, 9].forEach(position => {
          expect(wordArray).toIncludeAllMembers(suggested[position.toString()])
        })
      })
    })

    describe('when there are more `additionalSuggestions` than `suggestionPerWord`', () => {
      const additionalSuggestions = ['word A', 'word B', 'word C']
      let suggested

      beforeEach(() => {
        wrapper.setProps({
          suggestionsPerWord: wordArray.length + 3,
          additionalSuggestions
        })

        suggested = wrapper.vm.suggestedPerPosition
      })

      it('should include the passphrase word into the suggestions', () => {
        ;[3, 6, 9].forEach(position => {
          const passphraseWord = words[position.toString()]
          expect(suggested).toBeInstanceOf(Object)
          expect(suggested[position.toString()]).toContain(passphraseWord)
        })
      })

      it('should include several passphrase words and additional suggestions', () => {
        ;[3, 6, 9].forEach(position => {
          expect(suggested[position.toString()]).toIncludeAnyMembers(additionalSuggestions)
          expect(suggested[position.toString()]).toIncludeAnyMembers(wordArray)
        })
      })
    })

    describe('when there are less `additionalSuggestions` than `suggestionPerWord`', () => {
      const additionalSuggestions = ['word A', 'word B', 'word C', 'word D', 'word E']
      let suggested

      beforeEach(() => {
        wrapper.setProps({
          suggestionsPerWord: additionalSuggestions.length + 1,
          additionalSuggestions
        })

        suggested = wrapper.vm.suggestedPerPosition
      })

      it('should include the passphrase word into the suggestions', () => {
        ;[3, 6, 9].forEach(position => {
          const passphraseWord = words[position.toString()]
          expect(suggested).toBeInstanceOf(Object)
          expect(suggested[position.toString()]).toContain(passphraseWord)
        })
      })

      it('should include the passphrase word with the additional suggestions only', () => {
        ;[3, 6, 9].forEach(position => {
          const passphraseWord = words[position.toString()]
          const withoutPassphraseWord = pull(suggested[position.toString()], passphraseWord)

          expect(suggested[position.toString()]).toIncludeAnyMembers(additionalSuggestions)
          expect(withoutPassphraseWord).not.toIncludeAnyMembers(wordArray)
        })
      })
    })
  })

  describe('acceptWord', () => {
    describe('when all words have been verified', () => {
      it('emits the `verified` event', async () => {
        wrapper = mount(PassphraseVerification, {
          i18n,
          propsData: {
            passphrase
          },
          computed: {
            allVerified: () => true
          }
        })

        wrapper.vm.acceptWord()

        // The method waits some milliseconds before emitting the event
        await setTimeout(() => {
          expect(wrapper.emitted('verified')).toBeTruthy()
        }, 1000)
      })
    })
  })

  describe('toNextWord', () => {
    it('should show the suggetions of the next position', () => {
      jest.spyOn(wrapper.vm, 'showSuggestions')

      let nextPosition = '9'
      wrapper.setData({ currentPosition: '6' })
      wrapper.vm.toNextWord()

      expect(wrapper.vm.showSuggestions).toHaveBeenCalledWith(nextPosition)

      nextPosition = '3'
      wrapper.vm.toNextWord()

      expect(wrapper.vm.showSuggestions).toHaveBeenCalledWith(nextPosition)
    })

    it('should focus on the next input', () => {
      const nextPosition = '6'
      const textInput = wrapper.vm.$refs[`input-${nextPosition}`][0]

      jest.spyOn(textInput, 'focus')
      wrapper.setData({ currentPosition: '3' })

      wrapper.vm.toNextWord()

      expect(textInput.focus).toHaveBeenCalled()
    })

    describe('when the next position is already accepted', () => {
      it('should move to the subsequent position', () => {
        jest.spyOn(wrapper.vm, 'showSuggestions')

        let subsequentPosition = '7'
        wrapper.setProps({
          wordPositions: [1, 3, 5, 7, 9, 11]
        })
        wrapper.setData({
          currentPosition: '3',
          acceptedWords: {
            1: 'former',
            3: '',
            5: 'other',
            7: '',
            9: 'example',
            11: 'random'
          }
        })
        wrapper.vm.toNextWord()

        expect(wrapper.vm.showSuggestions).toHaveBeenCalledWith(subsequentPosition)

        subsequentPosition = '2'
        wrapper.setProps({
          wordPositions: [1, 2, 3, 4, 5, 6]
        })
        wrapper.setData({
          currentPosition: '3',
          acceptedWords: {
            1: 'former',
            2: '',
            3: '',
            4: 'random',
            5: 'other',
            6: 'example'
          }
        })
        wrapper.vm.toNextWord()

        expect(wrapper.vm.showSuggestions).toHaveBeenCalledWith(subsequentPosition)
      })
    })
  })
})
