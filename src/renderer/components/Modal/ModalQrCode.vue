<template>
	<ModalWindow @close="emitClose">
		<section class="flex flex-col items-center">
			<h2 class="mb-1">
				{{ $t("MODAL_QR_CODE.TITLE") }}
			</h2>
			<p class="mb-5">
				{{ $t("MODAL_QR_CODE.SUBTITLE") }}
			</p>
			<VueQrcode v-bind="$props" />
		</section>
	</ModalWindow>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
import VueQrcode from "@/components/utils/QRCode";

import ModalWindow from "./ModalWindow";

@Component({
    name: "ModalQrCode",

    components: {
		ModalWindow,
		VueQrcode,
	}
})
export default class ModalQrCode extends Vue {
    @Prop({
        type: String,
        required: true,
        default: "",
    })
    value;

    @Prop({
        type: Object,
        required: false,
        default: () => ({
            size: 160,
        }),
    })
    options;

    @Prop({
        type: String,
        required: false,
        default: "canvas",
    })
    tag;

    emitClose() {
        this.$emit("close");
    }
}
</script>
