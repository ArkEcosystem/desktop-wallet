import * as FontAwesomeIcons from '@fortawesome/free-solid-svg-icons';
export function create(walletApi) {
    return function () {
        walletApi.fontAwesomeIcons = FontAwesomeIcons;
    };
}
//# sourceMappingURL=font-awesome-sandbox.js.map