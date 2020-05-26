<template>
	<Identicon
		:value="value"
		:size="size"
		:shape="shape"
		:shape-count="shapeCount"
		:is-dark="isDark"
		:show-network-symbol="showNetworkSymbol"
	/>
</template>

<script>
import { Component, Prop,Vue } from "vue-property-decorator";

import Identicon from "@/components/utils/Identicon";

@Component({
    name: "WalletIdenticon",

    components: {
		Identicon,
	}
})
export default class WalletIdenticon extends Vue {
    @Prop({
        type: String,
        required: true,
    })
    value;

    @Prop({
        type: Number,
        required: true,
    })
    size;

    @Prop({
        type: String,
        required: false,
        default: () => "circle",
    })
    shape;

    @Prop({
        type: Number,
        required: false,
        default: 3,
    })
    shapeCount;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    isDark;

    @Prop({
        type: Boolean,
        required: false,
        default: true,
    })
    showNetworkSymbol;
}
</script>
