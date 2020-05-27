<template>
	<ModalConfirmation
		:title="$t('PAGES.PROFILE_EDITION.ADVANCED_MODE.TITLE')"
		:question="$t('PAGES.PROFILE_EDITION.ADVANCED_MODE.QUESTION')"
		:cancel-button="$t('PAGES.PROFILE_EDITION.ADVANCED_MODE.DECLINE')"
		:continue-button="$t('PAGES.PROFILE_EDITION.ADVANCED_MODE.ACCEPT')"
		container-classes="ProfileAdvancedModeConfirmation"
		@close="emitClose"
		@cancel="emitClose"
		@continue="emitSave"
	/>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";

import { ModalConfirmation } from "@/components/Modal";

@Component({
	name: "ProfileAdvancedModeConfirmation",

	components: {
		ModalConfirmation,
	},
})
export default class ProfileAdvancedModeConfirmation extends Vue {
	emitSave() {
		this.$emit("save");
	}

	emitClose() {
		this.$emit("close");
	}
}
</script>

<style>
.ProfileAdvancedModeConfirmation .ModalConfirmation__container {
	min-width: calc(var(--profile-avatar-xl) + 74px * 2 + 80px);
	max-width: calc(var(--profile-avatar-xl) + 74px * 2 + 120px);
}
.ProfileAdvancedModeConfirmation .ModalConfirmation__container > div:first-child {
	@apply .mb-0;
}
/*.ProfileAdvancedModeConfirmation__container__arrow {
  width: 74px;
  height: 75px;
  margin-top: calc(var(--profile-avatar-xl) - 75px + 2rem)
}
.ProfileAdvancedModeConfirmation__container__arrow--reverse {
  transform: scaleX(-1)
}*/
</style>
