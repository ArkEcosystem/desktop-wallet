<template>
	<div v-if="errors">
		<span class="inline-block mt-1 text-red-500">{{ errors[0] }}</span>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	@Component({ name: "FormError" })
	export default class FormError extends Vue {
		@Prop() public errors: string[] | undefined;
	}
</script>
