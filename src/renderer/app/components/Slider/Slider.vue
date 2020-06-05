<template>
	<div class="Slider">
		<swiper class="swiper" :options="swiperOptions">
			<swiper-slide v-for="(item, index) in items" :key="index">
				<slot name="item" :item="item"></slot>
			</swiper-slide>
                        <div v-if="pages > 1" class="swiper-pagination" slot="pagination"></div>
		</swiper>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import { Swiper, SwiperSlide, directive } from "vue-awesome-swiper";

	@Component({
		components: {
			Swiper,
			SwiperSlide,
		},
		directives: {
			swiper: directive,
		},
	})
	export default class Slider extends Vue {
		@Prop({ default: () => [] }) public items!: [];
		@Prop({ default: () => {} }) public options?: {};

		defaultOptions = {
			slidesPerView: 4,
			slidesPerColumn: 2,
			spaceBetween: 5,
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
		};

		get swiperOptions() {
			return { ...this.defaultOptions, ...this.options };
		}

		get pages() {
			const slidesPerView = this.swiperOptions.slidesPerView;
			const slidesPerColumn = this.swiperOptions.slidesPerColumn;
			return Math.ceil(this.items.length / (slidesPerView * slidesPerColumn));
		}
	}
</script>

<style src="swiper/css/swiper"></style>

<style lang="postcss">
	.Slider {
		.swiper {
			height: 100%;
			margin-left: auto;
			margin-right: auto;

			.swiper-slide {
				height: auto;
			}
		}
	}
</style>
