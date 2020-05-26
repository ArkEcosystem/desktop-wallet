<template>
	<Component
		:is="tag"
		v-bind="$attrs"
		:class="`SelectionNetworkButton--${size}`"
		class="SelectionNetworkButton"
		v-on="$listeners"
	>
		<slot>
			<div class="flex flex-col items-center justify-center p-1 h-full">
				<img :src="image" :class="isCustom ? 'p-2' : null" class="w-16 h-16" />
				<span v-if="showTitle" class="w-full block text-theme-page-text font-semibold truncate">
					{{ network.title }}
				</span>
			</div>
		</slot>
	</Component>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({
	name: "SelectionNetworkButton",
})
export default class SelectionNetworkButton extends Vue {
	@Prop({
		type: String,
		required: false,
		default: "button",
		validator: (value) => ["button", "div"].includes(value),
	})
	tag;

	@Prop({
		type: Object,
		required: false,
		default: () => ({}),
	})
	network;

	@Prop({
		type: String,
		required: false,
		default: "default",
		validator: (value) => ["small", "default"].includes(value),
	})
	size;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isCustom;

	@Prop({
		type: Boolean,
		required: false,
		default: true,
	})
	showTitle;

	@Prop({
		type: String,
		required: false,
		default: null,
	})
	networkImage;

	get image() {
		if (this.networkImage) {
			return this.assets_loadImage(this.networkImage);
		} else if (this.isCustom) {
			return this.assets_loadImage("networks/default.svg");
		} else {
			return this.assets_loadImage(`networks/${this.network.id}.svg`);
		}
	}
}
</script>

<style lang="postcss" scoped>
.SelectionNetworkButton {
	@apply text-theme-page-text border-2 border-theme-line-separator mr-2 rounded-xl cursor-pointer overflow-hidden;
}
.SelectionNetworkButton--default {
	@apply h-30 w-30;
}
.SelectionNetworkButton--small {
	@apply h-24 w-24;
}
</style>
