<template>
	<li class="SearchFilterItem flex flex-col">
		<span v-if="label" class="text-grey-dark text-sm display-block mb-1">
			{{ label }}
		</span>
		<slot />
	</li>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({
    name: "SearchFilterItem"
})
export default class SearchFilterItem extends Vue {
    @Prop({
        type: String,
        required: false,
        default: null,
    })
    label;
}
</script>

<style lang="postcss" scoped>
.SearchFilterItem {
	@apply .px-5 .border-l .border-theme-settings-border;
}
</style>
