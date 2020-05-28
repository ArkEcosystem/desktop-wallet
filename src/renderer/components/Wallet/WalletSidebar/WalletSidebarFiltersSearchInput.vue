<template>
	<div class="flex flex-row WalletSidebarFiltersSearchInput">
		<div class="mr-4 cursor-pointer text-theme-settings-text" @click="focus">
			<SvgIcon name="search" view-box="0 0 17 16" />
		</div>

		<input
			ref="input"
			:placeholder="placeholder"
			:value="inputValue"
			class="flex flex-grow font-semibold bg-transparent WalletSidebarFiltersSearchInput____input text-theme-settings-text"
			name="wallet-sidebar-filters-search"
			type="text"
			@input="updateInput"
		/>
	</div>
</template>

<script>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import SvgIcon from "@/components/SvgIcon";

@Component({
	name: "WalletSidebarFiltersInputSearch",

	components: {
		SvgIcon,
	},
})
export default class WalletSidebarFiltersInputSearch extends Vue {
	@Prop({
		type: String,
		required: false,
		default: "",
	})
	placeholder;

	@Prop({
		type: String,
		required: true,
		default: "",
	})
	value;

	inputValue = undefined;

	@Watch("value")
	onValueChanged(value) {
		this.inputValue = value;
	}

	data() {
		return {
			inputValue: this.value,
		};
	}

	emitInput() {
		this.$emit("input", this.inputValue);
	}

	updateInput(event) {
		this.inputValue = event.target.value;
		this.emitInput();
	}

	focus() {
		this.$refs.input.focus();
	}
}
</script>
