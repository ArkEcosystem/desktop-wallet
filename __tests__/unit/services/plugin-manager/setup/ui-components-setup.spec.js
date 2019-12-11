import { Plugin } from '@/services/plugin-manager/plugin'
import { create as createUiComponentsSetup } from '@/services/plugin-manager/setup/ui-components-setup'

const plugin = new Plugin({
  config: {
    id: 1
  }
})

const uiComponentsSetup = createUiComponentsSetup(plugin)
uiComponentsSetup()

describe('UI Components Setup', () => {
  it('should populate the globalComponents field', () => {
    expect(Object.keys(plugin.globalComponents).length).toBeGreaterThan(0)
  })
})
