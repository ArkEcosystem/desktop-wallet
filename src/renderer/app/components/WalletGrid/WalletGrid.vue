<template>
	<div class="WalletGrid">
		<Slider :items="wallets" :options="sliderOptions" :style="{ height }">
			<template v-slot:item="{ item }">
				<WalletCard
					class="mr-4 mb-4"
					:isBlank="item.isBlank"
					:data="item.data"
					:options="item.options"
				></WalletCard>
			</template>
		</Slider>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import { Slider } from "@/app/components/Slider";

	import { WalletCard } from "@/app/components/WalletCard";

	@Component({
		components: {
			Slider,
			WalletCard,
		},
	})
	export default class Dropdown extends Vue {
		@Prop({ default: () => [] }) public wallets!: object[];

		get sliderOptions() {
			return {
				slidesPerView: 4,
				slidesPerColumn: this.wallets.length <= 8 ? 1 : 2,
				spaceBetween: 5,
			};
		}
		get height() {
			return this.sliderOptions.slidesPerColumn === 2 ? "440px" : "240px";
		}
	}
</script>

<style src="swiper/css/swiper"></style>

<style lang="postcss">
	.WalletGrid {
	}
</style>
