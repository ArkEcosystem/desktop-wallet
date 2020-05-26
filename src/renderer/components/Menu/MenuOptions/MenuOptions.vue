<template>
	<div>
		<ul :class="classes" class="MenuOptions relative bg-theme-settings flex rounded py-5">
			<slot />
		</ul>
	</div>
</template>

<script>
import { Component, Prop,Vue } from "vue-property-decorator";
@Component({
    name: "MenuOptions"
})
export default class MenuOptions extends Vue {
    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    isHorizontal;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    isSettings;

    @Prop({
        type: Boolean,
        required: false,
        default: true,
    })
    singleColumn;

    get classes() {
        const classes = [this.isHorizontal ? "MenuOptions--horizontal" : "MenuOptions--vertical"];
        if (!this.isHorizontal) {
            classes.push(this.isSettings ? "MenuOptions__settings--vertical" : "MenuOptions__default--vertical");
        }
        if (this.singleColumn) {
            classes.push("flex-col");
        }

        return classes.join(" ");
    }
}
</script>

<style lang="postcss">
.MenuOptions .MenuOptionsItem:last-child .MenuOptionsItem__container {
	border: none;
}
</style>
