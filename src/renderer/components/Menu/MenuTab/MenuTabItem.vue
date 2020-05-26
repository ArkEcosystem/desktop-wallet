<template>
	<KeepAlive>
		<Transition name="MenuTabItem__transition">
			<div v-show="isActive" class="MenuTabItem">
				<slot :is-active="isActive" />
			</div>
		</Transition>
	</KeepAlive>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
@Component({
    name: "MenuTabItem"
})
export default class MenuTabItem extends Vue {
    // You can use the slot `header` to customize the label
    @Prop({
        type: String,
        required: true,
    })
    label;

    @Prop({
        type: [Number, String],
        default: null,
        required: false,
    })
    tab;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    isDisabled;

    @Prop({
        type: Function,
        default: null,
        required: false,
    })
    onClick;

    isActive = false;

    toggle(isActive) {
        this.isActive = isActive;
    }
}
</script>
