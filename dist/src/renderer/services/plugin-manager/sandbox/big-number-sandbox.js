import BigNumber from '@/plugins/bignumber';
export function create(walletApi) {
    return function () {
        if (!walletApi.utils) {
            walletApi.utils = {};
        }
        walletApi.utils.bigNumber = BigNumber;
    };
}
//# sourceMappingURL=big-number-sandbox.js.map