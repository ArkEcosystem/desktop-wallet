<template>
	<Collapse
		:id="step"
		ref="collapse"
		:is-disabled="isDisabled"
		:class="{
			'pt-2': !isFirstItem,
			'pb-2 border-b': !isLastItem,
		}"
		class="MenuStepItem border-theme-line-separator"
		@open="emitOpen"
		@close="emitClose"
	>
		<header
			slot="handler"
			slot-scope="{ isOpen }"
			:class="{
				'text-xl font-bold text-theme-page-text': isOpen,
				'text-sm font-semibold text-theme-page-text-light': !isOpen,
			}"
			class="MenuStepItem__header capitalize py-2 flex-shrink-0"
		>
			<slot :title="title" name="header">
				{{ title }}
			</slot>
		</header>
		<section class="MenuStepItem__content flex flex-col h-full mt-2 relative">
			<div class="flex-1">
				<slot />
			</div>

			<footer class="MenuStepItem__footer mt-3 py-4">
				<button
					v-if="!isFirstItem && isBackVisible"
					class="MenuStepItem__footer__back-button blue-button mr-1"
					@click="emitBack"
				>
					{{ $t("COMMON.BACK") }}
				</button>

				<button
					v-if="isNextVisible || isNextEnabled"
					:disabled="!isNextEnabled || isLastItemClicked"
					class="MenuStepItem__footer__next-button blue-button"
					@click="emitNext(isLastItem)"
				>
					{{ isLastItem ? $t("COMMON.DONE") : $t("COMMON.NEXT") }}
				</button>
			</footer>
		</section>
	</Collapse>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
import Collapse from "@/components/Collapse";

@Component({
    name: "MenuStepItem",

    components: {
		Collapse,
	}
})
export default class MenuStepItem extends Vue {
    @Prop({
        type: String,
        required: true,
    })
    title;

    @Prop({
        type: [Number, String],
        required: true,
    })
    step;

    @Prop({
        type: Boolean,
        required: false,
        default: true,
    })
    isBackVisible;

    @Prop({
        type: Boolean,
        required: false,
        default: true,
    })
    isNextVisible;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    isNextEnabled;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    isDisabled;

    isFirstItem = false;
    isLastItem = false;
    isLastItemClicked = false;

    emitBack() {
        this.$emit("back");
    }

    emitNext(isLastItem) {
        if (!this.isLastItemClicked) {
            this.$emit("next");
        }
        if (isLastItem) {
            this.isLastItemClicked = true;
        }
    }

    emitOpen() {
        this.$emit("open");
    }

    emitClose() {
        this.$emit("close");
    }
}
</script>
