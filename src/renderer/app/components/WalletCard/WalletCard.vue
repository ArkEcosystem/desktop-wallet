<template>
	<div class="WalletCard WalletCard--blank">
		<!-- Blank card with placeholders -->
		<div v-if="isBlank">
			<div>
				<XCircle class="border-gray-200 -mr-3"></XCircle>
				<XCircle class="border-gray-200"></XCircle>
			</div>
			<div class="WalletCard__address text-gray-300">
				{{ blankAddressLabel }}
			</div>

			<div class="WalletCard__balance text-gray-300 text-sm">
				{{ blankBalanceLabel }}
			</div>
		</div>

		<!-- Filled card-->
		<div v-if="!isBlank && data">
			<div class="WalletCard__top">
				<Dropdown
					v-if="options.length > 0"
					:options="options"
					class="mr-4 inline-block align-right rounded-xl float-right"
					@select="(params) => $emit('action', params)"
				>
				</Dropdown>
			</div>

			<div>
				<XCircle class="border-gray-200 -mr-3" :class="[`border-${data.iconColor}`, `text-${data.iconColor}`]">
					{{ data.coinIcon }}
				</XCircle>
				<XCircle class="border-gray-200" :avatar-id="data.avatarId"></XCircle>
			</div>

			<div class="WalletCard__address truncate">
				<span v-if="data.walletName" class="text-gray-800 font-semibold max-w-24 flex-auto truncate">
					{{ data.walletName }}
				</span>
				<span v-if="data.address" class="text-gray-400 font-semibold">
					{{ truncateStringMiddle(data.address, 16) }}
				</span>
			</div>

			<div class="WalletCard__balance font-bold text-gray-800 text-md">
				<span>{{ data.balance }}</span>
				<span>{{ data.symbol }}</span>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	import XCircle from "@/app/components/Circle/Circle.vue";
	import Dropdown from "@/app/components/Dropdown/Dropdown.vue";
	import { mixins } from "@/support/mixins";

	import { WalletCardContext } from "./useWalletCard";

	@Component({
		mixins: [mixins],
		components: {
			XCircle,
			Dropdown,
		},
	})
	export default class WalletCard extends Vue {
		@Prop({ default: () => [] }) public options?: string[];
		@Prop({ default: null }) public data?: WalletCardContext;
		@Prop({ default: false }) public isBlank!: boolean;
		@Prop({ default: "New wallet" }) public blankAddressLabel!: string | number | null;
		@Prop({ default: "Balance" }) public blankBalanceLabel!: string | number | null;
	}
</script>

<style lang="postcss" scoped>
	.WalletCard {
		@apply relative inline-block w-64 align-middle rounded-xl border-2 border-gray-200 py-7 px-8;

		&--blank {
			@apply cursor-pointer;
		}

		&__top {
			@apply absolute -right-3 top-3;
		}

		&__address {
			@apply mt-4 text-sm;
		}

		&__balance {
			@apply mt-1 mb-3;
		}
	}
</style>
