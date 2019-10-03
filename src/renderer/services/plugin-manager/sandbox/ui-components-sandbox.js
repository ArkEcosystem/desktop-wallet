import * as ButtonComponents from '@/components/Button'
import * as CollapseComponents from '@/components/Collapse'
import * as InputComponents from '@/components/Input'
import * as ListDividedComponents from '@/components/ListDivided'
import * as MenuComponents from '@/components/Menu'
import Loader from '@/components/utils/Loader'
import TableWrapper from '@/components/utils/TableWrapper'

export function createUiComponentsSandbox (walletApi) {
  return () => {
    if (!walletApi.components) {
      walletApi.components = {}
    }

    const components = {
      Button: ButtonComponents,
      Collapse: CollapseComponents,
      Input: InputComponents,
      ListDivided: ListDividedComponents,
      Loader,
      Menu: MenuComponents,
      TableWrapper
    }

    walletApi.components = {
      ...walletApi.components,
      ...components
    }
  }
}
