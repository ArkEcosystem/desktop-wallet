import * as ButtonComponents from '@/components/Button'
import * as CollapseComponents from '@/components/Collapse'
import * as InputComponents from '@/components/Input'
import * as ListDividedComponents from '@/components/ListDivided'
import * as MenuComponents from '@/components/Menu'
import Loader from '@/components/utils/Loader'
import TableWrapper from '@/components/utils/TableWrapper'

export function create (plugin) {
  return () => {
    const components = {
      ...ButtonComponents,
      ...CollapseComponents,
      ...InputComponents,
      ...ListDividedComponents,
      ...MenuComponents,
      Loader,
      TableWrapper
    }

    plugin.globalComponents = {
      ...plugin.globalComponents,
      ...components
    }
  }
}
