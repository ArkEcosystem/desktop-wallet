<template>
	<InputEditableList
		v-model="items"
		:title="title"
		:show-count="showCount"
		:readonly="readonly"
		:required="required"
		:helper-text="helperText"
		:is-invalid="isInvalid"
		:no-items-message="$t('TRANSACTION.MULTI_SIGNATURE.NO_SIGNATURES')"
		@remove="emitRemove"
	>
		<div slot-scope="{ item }" class="flex-1">
			<span>
				{{ formatItem(item.publicKey, 20) }}
			</span>

			<span v-if="item.address"> ({{ formatItem(item.address) }}) </span>
		</div>
	</InputEditableList>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
import { InputEditableList } from "@/components/Input";
import truncateMiddle from "@/filters/truncate-middle";

@Component({
    name: "TransactionMultiSignatureList",

    components: {
		InputEditableList,
	}
})
export default class TransactionMultiSignatureList extends Vue {
    @Prop({
        type: String,
        required: false,
        default: "Public Keys",
    })
    title;

    @Prop({
        type: Array,
        required: true,
    })
    items;

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

    formatItem(value, limit = 10) {
        return truncateMiddle(value, limit);
    }
}
</script>
