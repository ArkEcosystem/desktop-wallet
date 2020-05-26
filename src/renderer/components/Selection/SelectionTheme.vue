<template>
	<div class="flex flex-grow-0 items-center">
		<SvgIcon name="sun" view-box="0 0 20 20" class="transition text-yellow" />
		<div>
			<ButtonSwitch :is-active="status" class="mx-2" @change="emitInput" />
		</div>
		<SvgIcon name="moon" view-box="0 0 18 18" class="transition text-blue-dark" />
	</div>
</template>

<script>
import { Component, Prop,Vue } from "vue-property-decorator";

import { ButtonSwitch } from "@/components/Button";
import { SvgIcon } from "@/components/SvgIcon";

@Component({
    name: "SelectionTheme",

    components: {
		ButtonSwitch,
		SvgIcon,
	}
})
export default class SelectionTheme extends Vue {
    themes = {
		light: false,
		dark: true,
	};

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    value;

    get status() {
        return this.$options.themes[this.value];
    }

    emitInput(status) {
        const theme = Object.keys(this.$options.themes).find((theme) => this.$options.themes[theme] === status);
        this.$emit("input", theme);
    }
}
</script>
