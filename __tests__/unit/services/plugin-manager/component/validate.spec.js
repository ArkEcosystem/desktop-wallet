import { validateComponent } from '@/services/plugin-manager/component/validate'

describe('Validate component', () => {
  const plugin = {
    config: {
      id: 1
    }
  }

  it('should have template field', () => {
    expect(validateComponent({ plugin, component: {} })).toBe(false)
    expect(validateComponent({ plugin, component: { template: '' } })).toBe(true)
  })

  it('should not have unauthorized fields', () => {
    const component = {
      render: () => {}
    }
    expect(validateComponent({ plugin, component })).toBe(false)
  })

  it('should not have v-html', () => {
    const component = {
      template: '<div v-html=""></div>'
    }
    expect(validateComponent({ plugin, component })).toBe(false)
  })

  it('should not have javascript inline script', () => {
    const component = {
      template: '<form action="javascript:alert()"></form>'
    }
    expect(validateComponent({ plugin, component })).toBe(false)
  })

  it('should not have iframe tag', () => {
    const component = {
      template: '<iframe src="ark.io"></iframe>'
    }
    expect(validateComponent({ plugin, component })).toBe(false)
  })

  it('should not have webview tag', () => {
    const component = {
      template: '<webview src="ark.io"></webview>'
    }
    expect(validateComponent({ plugin, component })).toBe(false)
  })

  it('should not have script tag', () => {
    const component = {
      template: '<script type="text/javascript">alert()</script>'
    }
    expect(validateComponent({ plugin, component })).toBe(false)
  })

  it('should not have eval', () => {
    const component = {
      template: '<input name="eval()" />'
    }
    expect(validateComponent({ plugin, component })).toBe(false)
  })

  it('should not have inline events', () => {
    expect(validateComponent({ plugin, component: { template: '<input onchange="alert()" />' } })).toBe(false)
    expect(validateComponent({ plugin, component: { template: '<input onclick="alert()" />' } })).toBe(false)
    expect(validateComponent({ plugin, component: { template: '<input onfocus="alert()" />' } })).toBe(false)
  })
})
