<template>
	<InputEditableList
		v-model="items"
		:title="title"
		:max-items="maxItems"
		:show-count="showCount"
		:readonly="readonly"
		:required="required"
		:helper-text="helperText"
		:is-invalid="isInvalid"
		:no-items-message="$t('TRANSACTION.BRIDGECHAIN.NO_SEED_NODES')"
		@remove="emitRemove"
	>
		<div slot-scope="{ item }" class="flex flex-1" :class="{ 'text-red': item.isInvalid }">
			{{ item.ip }}
		</div>
	</InputEditableList>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
import { InputEditableList } from "@/components/Input";

@Component({
    name: "TransactionPeerList",

    components: {
		InputEditableList,
	}
})
export default class TransactionPeerList extends Vue {
    @Prop({
        type: String,
        required: false,
        default: "Peers",
    })
    title;

    @Prop({
        type: Array,
        required: true,
    })
    items;

    @Prop({
        type: Number,
        required: false,
        default: null,
    })
    maxItems;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    showCount;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    readonly;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    required;

    @Prop({
        type: String,
        required: false,
        default: null,
    })
    helperText;

    @Prop({
        type: Boolean,
        required: false,
        default: false,
    })
    isInvalid;

    emitRemove(index) {
        this.$emit("remove", index);
    }
}
</script>
