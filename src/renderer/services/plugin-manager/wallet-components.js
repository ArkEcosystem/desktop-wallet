import * as ButtonComponents from '@/components/Button'
import * as CollapseComponents from '@/components/Collapse'
import * as InputComponents from '@/components/Input'
import * as ListDividedComponents from '@/components/ListDivided'
import * as MenuComponents from '@/components/Menu'
import Loader from '@/components/utils/Loader'
import TableWrapper from '@/components/utils/TableWrapper'
import WebFrame from '@/components/utils/WebFrame'

export default (permissions) => {
  let components = {}

  if (permissions.includes('UI_COMPONENTS')) {
    components = {
      Button: ButtonComponents,
      Collapse: CollapseComponents,
      Input: InputComponents,
      ListDivided: ListDividedComponents,
      Loader,
      Menu: MenuComponents,
      TableWrapper
    }
  }

  if (permissions.includes('WEBFRAME')) {
    components = { ...components, WebFrame }
  }

  return components
}
