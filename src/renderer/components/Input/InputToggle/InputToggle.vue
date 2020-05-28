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
import { Component, Prop, Vue } from "vue-property-decorator";

import InputToggleChoice from "./InputToggleChoice";

@Component({
	name: "InputToggle",

	components: {
		InputToggleChoice,
	},

	// @TODO
	// model: {
	// 	prop: "selectedChoice",
	// 	event: "choice-select",
	// },
})
export default class InputToggle extends Vue {
	@Prop({
		type: Array,
		required: true,
	})
	choices;

	@Prop({
		type: String,
		required: true,
	})
	selectedChoice;

	emitSelect(choice) {
		// @ts-ignore
		this.$emit("select", choice);
	}
}
</script>
