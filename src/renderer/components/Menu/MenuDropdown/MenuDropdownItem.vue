<template>
	<li class="MenuDropdownItem">
		<button
			:class="
				isActive
					? 'MenuDropdownItem--active bg-theme-feature-item-hover text-theme-feature-item-selected-text'
					: 'text-grey-dark hover:bg-theme-feature-item-alternative border-grey-light'
			"
			class="w-full cursor-pointer MenuDropdownItem__button bg-theme-feature"
			@click.capture.stop="emitClick"
		>
			<div
				class="px-5 py-4 mx-8 text-center break-words transition border-b MenuDropdownItem__container border-theme-line-separator"
			>
				<slot>
					<span class="font-semibold">
						{{ item }}
					</span>
				</slot>
			</div>
		</button>
	</li>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";
@Component({
	name: "MenuDropdownItem",
})
export default class MenuDropdownItem extends Vue {
	@Prop({
		type: String,
		required: true,
	})
	value;

	@Prop({
		type: String,
		required: true,
	})
	item;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isActive;

	emitClick() {
		this.$emit("click", this.value);
	}
}
</script>

<style scoped>
.MenuDropdownItem:hover > .MenuDropdownItem__container,
.MenuDropdownItem--active .MenuDropdownItem__container {
	border-color: transparent;
}
</style>
