<template>
	<button
		:class="[
			value ? '' : 'text-theme-page-text-light hover:text-theme-page-text',
			'MenuDropdownHandler cursor-pointer transition flex justify-between items-center text-inherit',
		]"
		@blur="emitBlur"
		@click="emitClick"
	>
		<span>
			<slot>
				<span v-if="prefix.length">
					{{ prefix }}
				</span>
				<span>{{ item || placeholder }}</span>
			</slot>
		</span>

		<span class="flex pl-2 pr-1">
			<SvgIcon :class="{ 'opacity-25': iconDisabled }" name="arrow-dropdown" view-box="0 0 10 10" />
		</span>
	</button>
</template>

<script>
import { Component, Prop,Vue } from "vue-property-decorator";

import SvgIcon from "@/components/SvgIcon";

@Component({
    name: "MenuDropdownHandler",

    components: {
		SvgIcon,
	}
})
export default class MenuDropdownHandler extends Vue {
    @Prop({
        type: String,
        required: false,
        default: null,
    })
    value;

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    item;

    @Prop({
        type: String,
        required: false,
        default: "Select",
    })
    placeholder;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    iconDisabled;

    @Prop({
        type: String,
        required: false,
        default: "",
    })
    prefix;

    emitBlur(event) {
        this.$emit("blur", event);
    }

    emitClick() {
        this.$emit("click");
    }
}
</script>
