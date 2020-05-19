import { snakeCase } from 'lodash';
export default {
    methods: {
        strings_snakeCase: function (value) {
            return snakeCase(value);
        },
        strings_capitalizeFirst: function (value) {
            return value.charAt(0).toUpperCase() + value.slice(1);
        }
    }
};
//# sourceMappingURL=strings.js.map