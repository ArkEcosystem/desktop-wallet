<template>
	<span class="InputToggle">
		<InputToggleChoice
			v-for="(choice, index) in choices"
			:key="index"
			:choice="choice"
			:selected-choice="selectedChoice"
			:index="index"
			:length="choices.length"
			@select="emitSelect(choice)"
		/>
	</span>
</template>

<script lang="ts">
import { Component, Model, Prop, Vue } from "vue-property-decorator";

import InputToggleChoice from "./InputToggleChoice";

@Component({
	name: "InputToggle",

	components: {
		InputToggleChoice,
	},
})
export default class InputToggle extends Vue {
	@Model("choice-select", {
		type: String,
		required: true,
	})
	selectedChoice;

	@Prop({
		type: Array,
		required: true,
	})
	choices;

	emitSelect(choice) {
		// @ts-ignore
		this.$emit("select", choice);
	}
}
</script>
