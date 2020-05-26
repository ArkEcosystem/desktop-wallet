<template>
	<ModalWindow v-if="imageIndex !== null" modal-classes="SliderImageModal" @close="emitClose">
		<SliderImage
			:images="images"
			:image-index="imageIndex"
			:show-navigation="showNavigation"
			:show-pagination="showPagination"
		/>
	</ModalWindow>
</template>

<script>
import { Component, Prop,Vue } from "vue-property-decorator";

import { ModalWindow } from "@/components/Modal";

import SliderImage from "./SliderImage";

@Component({
    name: "SliderImageModal",

    components: {
		ModalWindow,
		SliderImage,
	}
})
export default class SliderImageModal extends Vue {
    @Prop({
        type: Array,
        required: true,
        default: null,
    })
    images;

    @Prop({
        type: Number,
        required: false,
        default: 0,
    })
    imageIndex;

    @Prop({
        type: Boolean,
        required: false,
        default: true,
    })
    showNavigation;

    @Prop({
        type: Boolean,
        required: false,
        default: true,
    })
    showPagination;

    @Prop({
        type: Function,
        required: true,
        default: null,
    })
    closeImage;

    emitClose() {
        this.closeImage();
        this.$emit("close");
    }
}
</script>

<style>
.SliderImageModal .ModalWindow__container__content {
	@apply .p-4;
}
.SliderImageModal article {
	@apply .flex .mt-0;
}
</style>
