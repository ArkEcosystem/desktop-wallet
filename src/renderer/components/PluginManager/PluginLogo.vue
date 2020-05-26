<template>
	<div class="PluginLogo" :style="{ height: `${size}px`, width: `${size}px` }">
		<img v-if="plugin.logo" class="PluginLogo__image" :src="`data:image/png;base64,${plugin.logo}`" />

		<PluginIdenticon v-else :value="plugin.id" :size="size" />
	</div>
</template>

<script>
import { Component, Prop,Vue } from "vue-property-decorator";

import PluginIdenticon from "@/components/PluginManager/PluginIdenticon";

@Component({
    name: "PluginLogo",

    components: {
		PluginIdenticon,
	}
})
export default class PluginLogo extends Vue {
    @Prop({
        type: Object,
        required: true,
    })
    plugin;

    @Prop({
        type: Number,
        required: false,
        default: 80,
    })
    size;
}
</script>

<style lang="postcss" scoped>
.PluginLogo {
	@apply rounded-lg overflow-hidden;
}

.PluginLogo__image {
	@apply w-full h-full;
	object-fit: cover;
}
</style>
