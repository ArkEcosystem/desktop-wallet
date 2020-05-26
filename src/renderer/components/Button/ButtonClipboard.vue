<template>
	<button v-tooltip="getTooltip()" :disabled="!isCopySupported" class="ButtonClipboard" @click="copy">
		<div :class="{ 'animate__animated animate__wobble': isCopying }" class="fill-current flex items-center">
			<SvgIcon :view-box="viewBox" name="copy" />
		</div>
	</button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import SvgIcon from "@/components/SvgIcon";

@Component({
	name: "ButtonClipboard",

	components: {
		SvgIcon,
	},
})
export default class ButtonClipboard extends Vue {
	@Prop({
		type: String,
		required: true,
	})
	value;

	@Prop({
		type: String,
		required: false,
		default: "0 0 12 16",
	})
	viewBox;

	@Prop({
		type: String,
		required: false,
		default: "",
	})
	subject;

	isCopying = false;
	isCopySupported = true;
	copyText = "";
	timeout = null;

	mounted() {
		// When opening the `TransactionShow` modal the clipboard buttons have i18n,
		// but, when closing, its value has been lost. This problem is produced only
		// when using portals. Probably is this bug:
		// https://github.com/LinusBorg/portal-vue/issues/159
		if (this.$i18n) {
			this.copyText = this.$t("BUTTON_CLIPBOARD.COPY_TO_CLIPBOARD", [this.subject]);
		}
	}

	beforeDestroy() {
		clearTimeout(this.timeout);
	}

	copy() {
		const textArea = document.createElement("textarea");
		textArea.value = this.value;
		textArea.style.cssText = "position:absolute;top:0;left:0;z-index:-9999;opacity:0;";

		document.body.appendChild(textArea);
		textArea.select();

		this.isCopying = true;
		this.timeout = setTimeout(() => (this.isCopying = false), 1000);
		this.timeout = setTimeout(
			() => (this.copyText = this.$t("BUTTON_CLIPBOARD.COPY_TO_CLIPBOARD", [this.subject])),
			1500,
		);

		try {
			document.execCommand("copy");
		} catch (err) {
			this.isCopySupported = false;
			this.$logger.error("Clipboard not supported!");
		}

		document.body.removeChild(textArea);
	}

	getTooltip() {
		const tooltip = {
			content: this.copyText,
			trigger: "hover",
			show: this.isCopying,
			hideOnTargetClick: this.isCopying,
		};

		if (this.isCopying) {
			tooltip.delay = { show: 0, hide: 1000 };

			if (this.isCopySupported) {
				this.copyText = this.$t("BUTTON_CLIPBOARD.DONE");
				tooltip.classes = "success";
			} else {
				this.copyText = this.$t("BUTTON_CLIPBOARD.NOT_SUPPORTED");
				tooltip.classes = "error";
			}
		}

		return tooltip;
	}
}
</script>
