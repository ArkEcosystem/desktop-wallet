<template>
	<div class="relative">
		<div
			:style="{
				height: `${size}px`,
				width: `${size}px`,
				backgroundImage: `url('${assets_loadImage(imagePath)}')`,
			}"
			class="WalletIdenticonPlaceholder"
		/>
	</div>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({
	name: "WalletIdenticonPlaceholder",
})
export default class WalletIdenticonPlaceholder extends Vue {
	@Prop({
		type: Number,
		required: true,
	})
	size;

	get imagePath() {
		const theme = this.session_hasDarkTheme ? "dark" : "light";
		return `identicons/identicon-placeholder-${theme}.svg`;
	}
}
</script>

<style>
.WalletIdenticonPlaceholder {
	overflow: hidden;
	padding: 0px;
	margin: 0px;
	display: inline-block;
}
</style>
