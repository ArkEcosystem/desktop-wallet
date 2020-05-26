<template>
	<InputSelect
		ref="dropdown"
		:items="options"
		:is-disabled="isDisabled"
		:label="inputLabel"
		:name="name"
		:value="value"
		class="InputLanguage"
		@input="select"
	>
		<div slot="input-item" slot-scope="itemScope" class="flex flex-row space-between">
			<img :src="flagImage(itemScope.value)" :title="itemScope.item" class="mr-2 InputLanguage__item__flag" />
			<span class="font-semibold">
				{{ itemScope.item }}
			</span>
		</div>

		<div slot="input-handler" slot-scope="handlerScope">
			<img :src="flagImage(selected)" :title="handlerScope.value" class="mr-1 InputLanguage__handler__flag" />
			{{ handlerScope.item }}
		</div>
	</InputSelect>
</template>

<script lang="ts">
import { I18N } from "@config";
import { Component, Prop, Vue } from "vue-property-decorator";

import InputSelect from "./InputSelect";

@Component({
	name: "InputLanguage",

	components: {
		InputSelect,
	},

	model: {
		prop: "value",
		event: "input",
	},

	watch: {
		value(value) {
			// @ts-ignore
			this.selected = value;
		},
	},
})
export default class InputLanguage extends Vue {
	@Prop({
		type: Array,
		required: false,
		default: () => I18N.enabledLocales,
	})
	languages;

	@Prop({
		type: String,
		required: false,
		default: "",
	})
	label;

	@Prop({
		type: String,
		required: false,
		default: "language",
	})
	name;

	@Prop({
		type: Boolean,
		required: false,
		default: false,
	})
	isDisabled;

	@Prop({
		type: String,
		required: false,
		default: undefined,
	})
	value;

	inputLabel = null;
	isFocused = false;
	selected = null;

	data(vm) {
		return {
			inputLabel: vm.label,
			selected: vm.value,
		};
	}

	// These are the options that are visible on the dropdown
	get options() {
		return (this.languages || I18N.enabledLocales).reduce((all, locale) => {
			all[locale] = this.$t(`LANGUAGES.${locale}`);
			return all;
		}, {});
	}

	mounted() {
		if (!this.inputLabel) {
			// @ts-ignore
			this.inputLabel = this.$t("COMMON.LANGUAGE");
		}
	}

	flagImage(language) {
		// @ts-ignore
		return this.assets_loadImage(`flags/${language}.svg`);
	}

	select(language) {
		this.selected = language;
		this.emitInput();
	}

	emitInput() {
		this.$emit("input", this.selected);
	}
}
</script>

<style scoped>
.InputLanguage__item__flag {
	height: 18px;
}
.InputLanguage__handler__flag {
	height: 12px;
}
</style>

<style>
.InputLanguage .MenuDropdownItem__container {
	@apply .mx-0 .px-2;
}
</style>
