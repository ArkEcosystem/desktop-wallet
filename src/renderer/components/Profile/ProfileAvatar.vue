<template>
	<div class="ProfileAvatar" v-on="$listeners">
		<div v-if="pluginAvatar" class="ProfileAvatar__image border-none">
			<Component :is="pluginAvatar" class="ProfileAvatar__image__component" />
		</div>

		<div
			v-else-if="hasStandardAvatar"
			:style="profile.avatar ? `backgroundImage: url('${assets_loadImage(profile.avatar)}')` : ''"
			class="ProfileAvatar__image w-full h-full background-image bg-center bg-no-repeat border-none"
		>
			<slot />
		</div>

		<ButtonLetter
			v-else
			:value="profile.name"
			:has-custom-style="true"
			:size="letterSize"
			tag="div"
			class="ProfileAvatar__letter bg-theme-feature-item-selected text-theme-feature-item-selected-text select-none"
		>
			<slot />
		</ButtonLetter>
	</div>
</template>

<script>
import { Component, Prop, Vue } from "vue-property-decorator";

import { ButtonLetter } from "@/components/Button";

@Component({
	name: "ProfileAvatar",

	components: {
		ButtonLetter,
	},
})
export default class ProfileAvatar extends Vue {
	@Prop({
		type: Object,
		required: true,
	})
	profile;

	@Prop({
		type: String,
		required: true,
	})
	letterSize;

	get hasStandardAvatar() {
		return this.profile.avatar && typeof this.profile.avatar === "string";
	}

	get pluginAvatar() {
		if (this.profile.avatar && this.profile.avatar.pluginId) {
			return this.$store.getters["plugin/avatar"](this.profile);
		}

		return null;
	}
}
</script>

<style scoped>
.ProfileAvatar__image__component {
	@apply .w-full .h-full;
}
</style>
