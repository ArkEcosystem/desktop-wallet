<template>
	<div class="WalletSidebarFiltersSearchInput flex flex-row">
		<div class="cursor-pointer mr-4 text-theme-settings-text" @click="focus">
			<SvgIcon name="search" view-box="0 0 17 16" />
		</div>

		<input
			ref="input"
			:placeholder="placeholder"
			:value="inputValue"
			class="WalletSidebarFiltersSearchInput____input flex flex-grow bg-transparent text-theme-settings-text font-semibold"
			name="wallet-sidebar-filters-search"
			type="text"
			@input="updateInput"
		/>
	</div>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
import SvgIcon from "@/components/SvgIcon";

@Component({
    name: "WalletSidebarFiltersInputSearch",

    components: {
		SvgIcon,
	},

    watch: {
		value(value) {
			this.inputValue = value;
		},
	}
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

    // vue-convert: This property will initialized in data() method, with `this` reference.
    inputValue = undefined;

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
