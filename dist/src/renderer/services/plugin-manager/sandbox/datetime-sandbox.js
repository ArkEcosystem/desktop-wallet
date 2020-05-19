import { dayjs } from '@/services/datetime';
export function create(walletApi) {
    return function () {
        if (!walletApi.utils) {
            walletApi.utils = {};
        }
        walletApi.utils.datetime = dayjs;
    };
}
//# sourceMappingURL=datetime-sandbox.js.map