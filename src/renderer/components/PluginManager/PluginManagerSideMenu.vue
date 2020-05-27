<template>
	<div class="PluginManagerSideMenu">
		<PluginManagerButtonMenu class="mb-4" @click="emitToggle" />

		<div class="font-bold mb-4 select-none">
			{{ $t("PAGES.PLUGIN_MANAGER.HEADER") }}
		</div>
		<ul class="PluginManagerSideMenu__categories">
			<li
				v-for="category in pluginCategories"
				:key="category"
				class="transition"
				:class="{ active: category === activeCategory }"
				@click="emitCategory(category)"
			>
				<span>
					{{ $t(`PAGES.PLUGIN_MANAGER.CATEGORIES.${category.toUpperCase()}`) }}
				</span>
			</li>
		</ul>

		<ul class="PluginManagerSideMenu__other-categories">
			<li
				v-for="category in otherCategories"
				:key="category"
				class="transition"
				:class="{ active: category === activeCategory }"
				@click="emitCategory(category)"
			>
				<span>
					{{ $t(`PAGES.PLUGIN_MANAGER.CATEGORIES.${category.toUpperCase()}`) }}
				</span>
			</li>
		</ul>
	</div>
</template>

<script>
import { PLUGINS } from "@config";
import { Component, Prop, Vue } from "vue-property-decorator";

import { PluginManagerButtonMenu } from "@/components/PluginManager/PluginManagerButtons";

@Component({
	name: "PluginManagerSideMenu",

	components: {
		PluginManagerButtonMenu,
	},
})
export default class PluginManagerSideMenu extends Vue {
	@Prop({
		type: String,
		required: false,
		default: "all",
	})
	activeCategory;

	get pluginCategories() {
		return ["all"].concat(PLUGINS.categories.filter((category) => !["theme", "language"].includes(category)));
	}

	get otherCategories() {
		return ["theme", "language"];
	}

	emitToggle() {
		this.$emit("toggle");
	}

	emitCategory(category) {
		if (category !== this.activeCategory) {
			this.$emit("category-change", category);
		}
	}
}
</script>

<style lang="postcss" scoped>
.PluginManagerSideMenu {
	@apply .flex .flex-col .min-w-48 .px-10 .my-10 .border-r .border-theme-line-separator .overflow-y-auto;
}

.PluginManagerSideMenu__categories,
.PluginManagerSideMenu__other-categories {
	@apply .w-full .text-theme-page-text-light;
}
.PluginManagerSideMenu__other-categories {
	@apply .border-t .border-theme-line-separator;
}

.PluginManagerSideMenu__categories li,
.PluginManagerSideMenu__other-categories li {
	@apply .block .font-semibold .py-4 .px-10 .-mx-10 .border-l-3 .border-transparent .cursor-pointer;
}
.PluginManagerSideMenu__categories li {
	@apply .px-16;
}

.PluginManagerSideMenu__categories li:hover,
.PluginManagerSideMenu__categories li.active,
.PluginManagerSideMenu__other-categories li:hover,
.PluginManagerSideMenu__other-categories li.active {
	@apply .bg-theme-secondary-feature .text-theme-page-text .border-blue;
}
</style>
