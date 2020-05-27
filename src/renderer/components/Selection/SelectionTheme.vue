<template>
	<div class="flex flex-grow-0 items-center">
		<SvgIcon name="sun" view-box="0 0 20 20" class="transition text-yellow" />
		<div>
			<ButtonSwitch :is-active="status" class="mx-2" @change="emitInput" />
		</div>
		<SvgIcon name="moon" view-box="0 0 18 18" class="transition text-blue-dark" />
	</div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from "vue-property-decorator";

import { ButtonSwitch } from "@/components/Button";
import { SvgIcon } from "@/components/SvgIcon";

@Component({
	components: {
		ButtonSwitch,
		SvgIcon,
	},
})
export default class SelectionTheme extends Vue {
	@Prop({ default: null }) public value!: string | null;

	private themes: object = {
		light: false,
		dark: true,
	};

	get status() {
		if (this.value) {
			return this.themes[this.value];
		}

		return false;
	}

	@Emit("input")
	emitInput(status) {
		const theme = Object.keys(this.themes).find((theme) => this.themes[theme] === status);
		return theme;
	}
}
</script>
