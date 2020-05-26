<template>
	<div
		:style="imagePath ? `backgroundImage: url('${assets_loadImage(imagePath)}')` : ''"
		:class="{ 'InputGridItem--selected': isSelected }"
		class="InputGridItem relative bg-cover bg-no-repeat bg-center rounded-full w-16 h-16 cursor-pointer transition text-center hover:opacity-75"
	>
		<span v-if="textContent && !onlyLetter" class="InputGridItem__text">
			{{ textContent }}
		</span>
		<div
			v-else-if="onlyLetter"
			:class="{
				'pt-5 pb-0': isForModal,
			}"
			class="flex h-full flex-col items-center justify-between"
		>
			<span v-if="isForModal" class="font-semibold text-theme-button-text">
				{{ title }}
			</span>
			<ButtonLetter
				:value="label"
				:size="isForModal ? null : '2xl'"
				:class="{
					'w-24 h-24 text-5xl': isForModal,
				}"
				tag="div"
			/>
		</div>
		<div
			v-else-if="component"
			:class="{
				'pt-5 pb-0': isForModal,
			}"
			class="flex h-full flex-col items-center justify-between"
		>
			<Component :is="component" />
		</div>

		<span
			v-if="isSelected"
			class="InputGridItem__check rounded-full p-1 flex items-center justify-center absolute bottom-0 right-0 w-6 h-6 bg-green border-2 border-theme-feature text-white"
		>
			<SvgIcon name="checkmark" view-box="0 0 10 9" />
		</span>
	</div>
</template>

<script lang="ts">
import { Component, Prop,Vue } from "vue-property-decorator";

import { ButtonLetter } from "@/components/Button";
import { SvgIcon } from "@/components/SvgIcon";

@Component({
    name: "InputGridItem",

    components: {
		ButtonLetter,
		SvgIcon,
	}
})
export default class InputGridItem extends Vue {
    @Prop({
        type: [String, Boolean],
        required: false,
        default: null,
    })
    imagePath;

    @Prop({
        type: String,
        default: null,
    })
    textContent;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    onlyLetter;

    @Prop({
        type: [Object, Function],
        required: false,
        default: () => {},
    })
    component;

    @Prop({
        type: Boolean,
        required: false,
        default: true,
    })
    isForModal;

    @Prop({
        type: Boolean,
        required: true,
    })
    isSelected;

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    title;

    get currentNetwork() {
        // To avoid failing after removing the current and last profile
        return this.$store.getters["session/profile"] ? this.session_network : null;
    }

    get label() {
        const symbol = this.currentNetwork ? this.currentNetwork.symbol : null;
        return this.textContent || symbol;
    }
}
</script>
