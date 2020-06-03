<script lang="ts">
	import { defineComponent } from "vue";

	export default defineComponent({});
</script>

<template>
	<div class="inline-flex items-stretch justify-start px-3 bg-gray-200 rounded TabList">
		<slot></slot>
	</div>
</template>

<style lang="postcss" scoped>
	.TabList > .Tab {
		@apply px-5 py-4 border-b-3 font-semibold text-gray-800 text-opacity-75 relative transition-colors ease-in-out duration-300;

		&--active {
			@apply border-blue-600 text-opacity-100;
		}

		&:hover,
		&:focus {
			@apply text-opacity-100;
		}

		& + .Tab {
			&:after {
				content: "";
				width: 1px;
				@apply h-4 bg-gray-300 absolute left-0 top-1/2 transform -translate-y-1/2 block;
			}
		}
	}
</style>
