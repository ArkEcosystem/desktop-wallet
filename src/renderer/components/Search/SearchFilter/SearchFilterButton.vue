<template>
	<div class="SearchFilter">
		<button class="SearchFilter__button action-button flex items-center" @click="emitClick">
			<SvgIcon name="filter" view-box="0 0 14 13" class="mr-2" />
			{{ $t("SEARCH.FILTER") }}
		</button>
		<slot />
	</div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import SvgIcon from "@/components/SvgIcon";

@Component({
    name: "SearchFilterButton",

    components: {
		SvgIcon,
	}
})
export default class SearchFilterButton extends Vue {
    emitClick() {
        this.$emit("click");
    }
}
</script>
