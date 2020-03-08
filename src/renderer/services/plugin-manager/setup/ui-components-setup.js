import * as ButtonComponents from '@/components/Button'
import * as CollapseComponents from '@/components/Collapse'
import * as InputComponents from '@/components/Input'
import * as ListDividedComponents from '@/components/ListDivided'
import * as MenuComponents from '@/components/Menu'
import ModalCloseConfirmation from '@/components/Modal/ModalCloseConfirmation'
import ModalConfirmation from '@/components/Modal/ModalConfirmation'
import ModalWindow from '@/components/Modal/ModalWindow'
import Loader from '@/components/utils/Loader'
import SvgIcon from '@/components/SvgIcon/SvgIcon'
import TableWrapper from '@/components/utils/TableWrapper'
import WalletIdenticon from '@/components/Wallet/WalletIdenticon'

export function create (plugin) {
  return () => {
    const components = {
      ...ButtonComponents,
      ...CollapseComponents,
      ...InputComponents,
      ...ListDividedComponents,
      ...MenuComponents,
      ModalCloseConfirmation,
      ModalConfirmation,
      ModalWindow,
      Loader,
      SvgIcon,
      TableWrapper,
      WalletIdenticon
    }

    plugin.globalComponents = {
      ...plugin.globalComponents,
      ...components
    }
  }
}
