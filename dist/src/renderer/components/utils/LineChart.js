import Chart from 'chart.js';
import { Line, mixins } from 'vue-chartjs';
import tailwindConfig from '@tailwind';
Chart.defaults.global.defaultFontFamily = tailwindConfig.fonts.sans.join(',');
// TODO: Add theme colors
export default {
    extends: Line,
    mixins: [mixins.reactiveProp],
    props: {
        chartData: {
            type: Object,
            required: true
        },
        options: {
            type: Object,
            required: true
        }
    },
    mounted: function () {
        var _this = this;
        this.$on('chart:render', function () {
            _this.$emit('ready');
        });
        this.render();
    },
    watch: {
        options: function () {
            this.destroy();
            this.render();
        }
    },
    methods: {
        getCanvas: function () {
            return this.$refs.canvas;
        },
        destroy: function () {
            this.$data._chart.destroy();
        },
        render: function () {
            this.renderChart(this.chartData, this.options);
        },
        update: function () {
            this.$data._chart.update();
        }
    }
};
//# sourceMappingURL=LineChart.js.map