<script lang="ts">
	import { defineComponent } from "vue";

	export default defineComponent({
		props: {
			errors: {
				type: Array,
				required: false,
				default: () => [],
			},
		},
	});
</script>

<template>
	<div v-if="errors">
		<span class="inline-block mt-1 text-red-500">{{ errors[0] }}</span>
	</div>
</template>
