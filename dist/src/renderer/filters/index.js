import truncate from './truncate';
import truncateMiddle from './truncate-middle';
export default {
    install: function (Vue) {
        Vue.filter('truncate', truncate);
        Vue.filter('truncateMiddle', truncateMiddle);
    }
};
//# sourceMappingURL=index.js.map