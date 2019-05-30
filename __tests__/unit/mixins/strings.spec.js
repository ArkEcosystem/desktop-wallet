import { createLocalVue, shallowMount } from '@vue/test-utils'
import StringsMixin from '@/mixins/strings'

describe('Mixins > Strings', () => {
  let wrapper

  beforeEach(() => {
    const localVue = createLocalVue()

    const TestComponent = {
      name: 'TestComponent',
      template: '<div/>'
    }

    wrapper = shallowMount(TestComponent, {
      localVue,
      mixins: [StringsMixin]
    })
  })

  describe('strings_snakeCase', () => {
    it('should return it as snake-cased string', () => {
      const result = 'foo_bar'

      expect(wrapper.vm.strings_snakeCase('Foo Bar')).toEqual(result)
      expect(wrapper.vm.strings_snakeCase('fooBar')).toEqual(result)
      expect(wrapper.vm.strings_snakeCase('--Foo-Bar--')).toEqual(result)
    })
  })
})
