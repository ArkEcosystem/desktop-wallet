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
import { VueGoodTable } from 'vue-good-table';
import Loader from './Loader';
import i18n from '@/i18n';
export default {
    name: 'TableWrapper',
    props: {
        currentPage: {
            type: Number,
            required: false,
            default: 1
        },
        hasPagination: {
            type: Boolean,
            required: false,
            default: false
        },
        perPage: {
            type: Number,
            required: false,
            default: 10
        },
        perPageDropdown: {
            type: Array,
            required: false,
            default: function () { return [10, 20, 30, 40, 50]; }
        },
        isRemote: {
            type: Boolean,
            required: false,
            default: false
        },
        sortQuery: {
            type: Object,
            required: false,
            default: function () { return ({}); }
        },
        noDataMessage: {
            type: String,
            required: false,
            default: i18n.t('TABLE.NO_TRANSACTIONS')
        }
    },
    render: function (h) {
        var _this = this;
        return h(VueGoodTable, {
            props: __assign({ mode: this.isRemote ? 'remote' : 'local', sortOptions: {
                    enabled: !!this.sortQuery,
                    initialSortBy: this.sortQuery
                }, paginationOptions: {
                    enabled: this.hasPagination,
                    setCurrentPage: this.currentPage,
                    dropdownAllowAll: false,
                    perPage: this.perPage,
                    perPageDropdown: this.perPageDropdown,
                    nextLabel: this.$t('COMMON.NEXT'),
                    prevLabel: this.$t('COMMON.PREV'),
                    rowsPerPageLabel: this.$t('TABLE.ROWS_PER_PAGE'),
                    ofLabel: this.$t('COMMON.OF'),
                    pageLabel: this.$t('TABLE.PAGE'),
                    allLabel: this.$t('COMMON.ALL')
                } }, this.$attrs),
            scopedSlots: {
                'table-row': function (table) { return _this.$scopedSlots.default(__assign({}, table)); }
            },
            on: this.$listeners
        }, [
            h('div', {
                slot: 'emptystate',
                class: 'flex justify-center font-semibold'
            }, [
                h('span', {
                    class: 'text-theme-page-text-light'
                }, this.noDataMessage)
            ]),
            h('div', {
                slot: 'loadingContent',
                class: 'flex justify-center p-5'
            }, [
                h(Loader)
            ])
        ]);
    }
};
//# sourceMappingURL=TableWrapper.js.map