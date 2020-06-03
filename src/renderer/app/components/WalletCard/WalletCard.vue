<template>
	<div v-if="isBlank" class="WalletCard WalletCard--blank">
		<div>
			<XCircle class="border-gray-200 -mr-3"></XCircle>
			<XCircle class="border-gray-200"></XCircle>
		</div>
		<div class="WalletCard__address">
			{{ blankAddressLabel }}
		</div>

		<div class="WalletCard__balance">
			{{ blankBalanceLabel }}
		</div>
	</div>
</template>

<script lang="ts">
	import { Component, Prop, Vue } from "vue-property-decorator";

	import XCircle from "@/app/components/Circle/Circle.vue";
	import { mixins } from "@/support/mixins";

	@Component({
		mixins: [mixins],
		components: {
			XCircle,
		},
	})
	export default class WalletCard extends Vue {
		@Prop({ default: true }) public isBlank!: boolean;
		@Prop({ default: "New wallet" }) public blankAddressLabel!: string | number | null;
		@Prop({ default: "Balance" }) public blankBalanceLabel!: string | number | null;
	}
</script>

<style lang="postcss" scoped>
	.WalletCard {
		@apply inline-block w-64 align-middle rounded-xl border-2 border-gray-200 py-7 px-8;

		&--blank {
			@apply cursor-pointer;
		}

		&__address {
			@apply mt-4 text-gray-300 text-sm;
		}

		&__balance {
			@apply mt-1 text-gray-300 text-sm mb-3;
		}
	}
</style>
