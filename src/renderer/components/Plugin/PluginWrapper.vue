<script>
import { Wormhole } from "portal-vue";
import { Component, Vue } from "vue-property-decorator";
@Component({
	name: "PluginWrapper",
})
export default class PluginWrapper extends Vue {
	get footerSlot() {
		return this.$slots.footer;
	}

	mounted() {
		if (this.footerSlot) {
			this.$nextTick(() => {
				Wormhole.open({
					to: "plugin-footer",
					from: "plugin-wrapper",
					passengers: this.footerSlot,
				});
			});
		}
	}

	beforeDestroy() {
		if (this.footerSlot) {
			this.$nextTick(() => {
				Wormhole.close({
					to: "plugin-footer",
					from: "plugin-wrapper",
				});
			});
		}
	}

	render(h) {
		const children = this.$slots.default;
		return children ? h("div", children) : h();
	}
}
</script>
