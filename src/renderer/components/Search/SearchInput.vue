<template>
	<InputText :label="$t('SEARCH.DEFAULT_PLACEHOLDER')" name="search" class="SearchInput w-full">
		<SvgIcon slot="left" name="search" view-box="0 0 18 18" class="mr-2 text-theme-page-text-light" />
	</InputText>
</template>

<script>
import { Component,Vue } from "vue-property-decorator";

import { InputText } from "@/components/Input";
import SvgIcon from "@/components/SvgIcon";

@Component({
    name: "SearchInput",

    components: {
		InputText,
		SvgIcon,
	}
})
export default class SearchInput extends Vue {}
</script>

<style lang="postcss">
.SearchInput .InputField__label {
	left: calc(20px + theme("margin.2"));
}
</style>
