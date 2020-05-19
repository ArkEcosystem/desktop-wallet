var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import * as ButtonComponents from '@/components/Button';
import * as CollapseComponents from '@/components/Collapse';
import * as InputComponents from '@/components/Input';
import * as ListDividedComponents from '@/components/ListDivided';
import * as MenuComponents from '@/components/Menu';
import ModalCloseConfirmation from '@/components/Modal/ModalCloseConfirmation';
import ModalConfirmation from '@/components/Modal/ModalConfirmation';
import ModalWindow from '@/components/Modal/ModalWindow';
import Loader from '@/components/utils/Loader';
import SvgIcon from '@/components/SvgIcon/SvgIcon';
import TableWrapper from '@/components/utils/TableWrapper';
import WalletIdenticon from '@/components/Wallet/WalletIdenticon';
export function create(plugin) {
    return function () {
        var components = __assign(__assign(__assign(__assign(__assign(__assign({}, ButtonComponents), CollapseComponents), InputComponents), ListDividedComponents), MenuComponents), { ModalCloseConfirmation: ModalCloseConfirmation,
            ModalConfirmation: ModalConfirmation,
            ModalWindow: ModalWindow,
            Loader: Loader,
            SvgIcon: SvgIcon,
            TableWrapper: TableWrapper,
            WalletIdenticon: WalletIdenticon });
        plugin.globalComponents = __assign(__assign({}, plugin.globalComponents), components);
    };
}
//# sourceMappingURL=ui-components-setup.js.map