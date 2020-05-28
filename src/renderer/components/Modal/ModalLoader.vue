<template>
	<ModalWindow
		v-if="isVisible"
		:allow-close="showClose"
		class="ModalLoader"
		container-classes="max-w-md sm:w-md"
		portal-target="loading"
		@close="toggle"
	>
		<PluginLogo v-if="plugin" :plugin="plugin" class="mx-auto mb-5" />

		<h2 class="text-center">
			{{ message }}
		</h2>
		<div class="flex justify-center p-5">
			<Loader />
		</div>

		<div v-if="showClose" class="p-2 text-center border-t-2 text-theme-warn-text border-theme-warn">
			{{ closeWarningMessage || $t("MODAL_LOADER.CLOSE_WARNING") }}
		</div>
	</ModalWindow>
</template>

<script>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import PluginLogo from "@/components/PluginManager/PluginLogo";
import Loader from "@/components/utils/Loader";

import ModalWindow from "./ModalWindow";

@Component({
	name: "ModalLoader",

	components: {
		Loader,
		ModalWindow,
		PluginLogo,
	},
})
export default class ModalLoader extends Vue {
	@Prop({
		type: String,
		required: true,
	})
	message;

	@Prop({
		type: Object,
		required: false,
		default: null,
	})
	plugin;

	@Prop({
		type: Boolean,
		required: false,
		default: true,
	})
	visible;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	allowClose;

	@Prop({
		type: Number,
		required: false,
		default: 15000,
	})
	closeWarningDelay;

	@Prop({
		type: String,
		required: false,
		default: null,
	})
	closeWarningMessage;

	showClose = false;
	showCloseTimeout = null;
	isVisible = null;

	@Watch("visible")
	onVisibleChanged(value) {
		this.isVisible = value;
		if (value) {
			this.triggerShowClose();
		}
	}

	data(vm) {
		return {
			isVisible: vm.visible,
		};
	}

	mounted() {
		this.triggerShowClose();
	}

	toggle() {
		this.isVisible = !this.isVisible;

		if (!this.isVisible) {
			this.$emit("close");
		}
	}

	triggerShowClose() {
		if (this.allowClose) {
			if (this.showCloseTimeout || this.showClose) {
				clearInterval(this.showCloseTimeout);
				this.showClose = false;
			}
			this.showCloseTimeout = setTimeout(() => {
				this.showClose = true;
			}, this.closeWarningDelay);
		}
	}
}
</script>
