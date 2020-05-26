<template>
	<div class="Pagination">
		<div
			v-for="page in pageCount"
			:key="page"
			class="Pagination__page"
			:class="{
				'bg-theme-button': currentIndex + 1 !== page,
				'bg-theme-button-active': currentIndex + 1 === page,
			}"
			@click="goToPage(page)"
		/>
	</div>
</template>

<script>
import { Component, Prop,Vue } from "vue-property-decorator";
@Component({
    name: "Pagination"
})
export default class Pagination extends Vue {
    @Prop({
        type: Number,
        required: true,
    })
    currentIndex;

    @Prop({
        type: Number,
        required: true,
    })
    pageCount;

    goToPage(page) {
        this.$emit("paginationclick", page);
    }
}
</script>

<style scoped>
.Pagination {
	@apply .flex .mt-4 .justify-center;
}

.Pagination__page {
	@apply .rounded-full .p-1 .mx-1 .cursor-pointer;
}
</style>
