<template>
	<div v-click-outside="hide" class="Dropdown">
		<div @click="toggleDropdown" class="Dropdown__toggle">
			<slot name="toggle">
				<!-- Toggle Fallback button if not provided  -->
				<button class="inline-block h-8 w-8 overflow-hidden focus:outline-none focus:border-white text--lg">
					<!-- TODO: Add svgicon-->
					⋮
				</button>
			</slot>
		</div>

		<!-- Dropdown options. will be rendered as fallback (if not slot content is added) & when options array is provided-->
		<div class="Dropdown__content" v-if="isOpen">
			<slot>
				<a
					v-for="(option, index) in options"
					:key="index"
					:title="option"
					class="block cursor-pointer px-8 py-4 text-gray-800 hover:bg-gray-100 hover:text-blue-600 text-sm font-bold"
					@click.prevent="select"
				>
					{{ option }}
				</a>
			</slot>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";
	import ClickOutside from "vue-click-outside";

	@Component({
		directives: {
			ClickOutside,
		},
	})
	export default class Dropdown extends Vue {
		@Prop({ default: null }) public options!: string[];

		isOpen = false;

		toggleDropdown() {
			this.isOpen = !this.isOpen;
		}

		hide() {
			this.isOpen = false;
		}

		select() {
			this.hide();
			this.$emit("select");
		}
	}
</script>
<style lang="postcss" scoped>
	.Dropdown {
		@apply relative;

		&__content {
			@apply mt-1 py-3 w-48 bg-white rounded-lg shadow-lg absolute right-0 z-10 border-gray-200;
		}
	}
</style>
