<template>
	<svg
		v-bind="styles"
		:viewBox="viewBox"
		version="1.1"
		xmlns="http://www.w3.org/2000/svg"
		xmlns:xlink="http://www.w3.org/1999/xlink"
		class="SvgIcon fill-current inline-block"
	>
		<use :xlink:href="'#' + name" />
	</svg>
</template>

<script>
import { Component, Prop,Vue } from "vue-property-decorator";
@Component({
    name: "SvgIcon"
})
export default class SvgIcon extends Vue {
    @Prop({
        type: String,
        required: true,
    })
    name;

    @Prop({
        type: [Array, String],
        required: false,
        default: "0 0 50 50",
    })
    viewBox;

    get styles() {
        const size = Array.isArray(this.viewBox) ? this.viewBox : this.viewBox.split(" ");
        const [x, y, width, height] = size.map((i) => i + "px");

        return { x, y, width, height };
    }
}
</script>
