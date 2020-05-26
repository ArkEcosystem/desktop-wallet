<template>
	<div class="WalletButton__import">
		<RouterLink :to="{ name: 'wallet-import' }" class="font-bold text-center">
			<span
				v-tooltip="hideText ? $t('PAGES.WALLET_ALL.IMPORT_WALLET') : ''"
				:class="{ 'mb-3': !hideText }"
				class="rounded-full bg-theme-button h-8 w-8 mx-auto flex items-center justify-center"
			>
				<SvgIcon name="arrow-import" class="text-center" view-box="0 0 7 10" />
			</span>

			<span v-if="!hideText">
				{{ $t("PAGES.WALLET_ALL.IMPORT_WALLET") }}
			</span>
		</RouterLink>
	</div>
</template>

<script>
import { Vue, Component, Prop } from "vue-property-decorator";
import SvgIcon from "@/components/SvgIcon";

@Component({
    name: "WalletButtonImport",

    components: {
		SvgIcon,
	}
})
export default class WalletButtonImport extends Vue {
    @Prop({
        type: Boolean,
        default: false,
    })
    forceText;

    get hideText() {
        return !this.forceText && this.$store.getters["session/hideWalletButtonText"];
    }
}
</script>

<style lang="postcss" scoped>
.WalletButton__import {
	@apply .appearance-none .font-semibold .flex .flex-col .items-center;
}
.WalletButton__import > span {
	@apply .w-full .text-center;
}
.WalletButton__import > a > .rounded-full {
	@apply .cursor-pointer .fill-current .text-theme-option-button-text;
	transition: opacity 0.4s;
}
.WalletButton__import > a:hover > .rounded-full {
	opacity: 0.5;
}

.WalletButton__import > span {
	border-left: 0.04rem solid var(--theme-feature-item-alternative);
	align-self: center;
}
.WalletButton__import:hover > span {
	border-left: 0px;
}
</style>
