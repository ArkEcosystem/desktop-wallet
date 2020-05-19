import { InputGrid } from '@/components/Input';
export default {
    components: {
        InputGrid: InputGrid
    },
    props: {
        selected: {
            type: [String, Object],
            required: false,
            default: null
        }
    }
};
//# sourceMappingURL=mixin-selection.js.map