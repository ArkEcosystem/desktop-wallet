<template>
	<button
		:class="{
			'ButtonSwitch--active': inputIsActive,
		}"
		:style="{
			'background-color': backgroundColor,
		}"
		:disabled="isDisabled"
		class="ButtonSwitch appearance-none rounded-full flex items-center relative cursor-pointer w-12 h-6 bg-theme-switch-button"
		type="button"
		@click="toggle"
	>
		<span
			:class="{
				'bg-theme-option-button-text': !inputIsActive,
				'bg-blue': inputIsActive,
			}"
			:style="{
				'border-color': backgroundColor,
			}"
			class="ButtonSwitch__circle transition rounded-full w-6 h-full absolute border-2 border-theme-button"
		/>
	</button>
</template>

<script lang="ts">
import { Component, Prop,Vue } from "vue-property-decorator";
@Component({
    name: "ButtonSwitch",

    model: {
		prop: "isActive",
		event: "change",
	},

    watch: {
		isActive(isActive) {
			this.inputIsActive = isActive;
		},
	}
})
export default class ButtonSwitch extends Vue {
    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    isActive;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    isDisabled;

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    backgroundColor;

    inputIsActive = vm.isActive;
    get TODO_model() {}

    toggle() {
        if (this.isDisabled) {
            return;
        }

        this.model = !this.model;
    }
}
</script>

<style scoped>
.ButtonSwitch__circle {
	transform: translateX(0%);
}

.ButtonSwitch--active .ButtonSwitch__circle {
	transform: translateX(100%);
}
</style>
