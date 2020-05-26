<template>
	<InputGrid
		:items="images"
		:modal-header-text="$t('SELECTION_BACKGROUND.MODAL_HEADER')"
		:selected="selectedItem"
		:auto-select-first="true"
		container-classes="SelectionBackground"
		class="SelectionBackgroundGrid"
		item-key="imagePath"
		@input="select"
	/>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";

import selectionMixin from "./mixin-selection";
import selectionImageMixin from "./mixin-selection-image";

@Component({
	name: "SelectionBackground",
	mixins: [selectionMixin, selectionImageMixin],
})
export default class SelectionBackground extends Vue {
	@Prop({
		type: Array,
		required: false,
		default: () => ["wallpapers", "textures"],
	})
	categories;
}
</script>
