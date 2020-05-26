<template>
	<li class="MenuDropdownItem">
		<button
			:class="
				isActive
					? 'MenuDropdownItem--active bg-theme-feature-item-hover text-theme-feature-item-selected-text'
					: 'text-grey-dark hover:bg-theme-feature-item-alternative border-grey-light'
			"
			class="MenuDropdownItem__button cursor-pointer bg-theme-feature w-full"
			@click.capture.stop="emitClick"
		>
			<div
				class="MenuDropdownItem__container mx-8 py-4 px-5 border-b border-theme-line-separator text-center transition break-words"
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
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({
    name: "MenuDropdownItem"
})
export default class MenuDropdownItem extends Vue {
    //*
             * The value of the item
             
    @Prop({
        type: String,
        required: true,
    })
    value;

    //*
             * The visible text of the item
             
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
