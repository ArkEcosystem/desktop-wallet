import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
export function create(plugin) {
    return function () {
        plugin.globalComponents[FontAwesomeIcon.name] = FontAwesomeIcon;
    };
}
//# sourceMappingURL=font-awesome-setup.js.map