<template>
	<button class="ButtonGeneric" :class="isSmall ? 'blue-small-button' : 'blue-button'" @click="emitClick">
		<span class="font-semibold whitespace-no-wrap">
			{{ label }}
		</span>
	</button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({
	name: "ButtonGeneric",
})
export default class ButtonGeneric extends Vue {
	@Prop({
		type: String,
		required: true,
	})
	label;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isSmall;

	emitClick() {
		this.$emit("click");
	}
}
</script>
