import { select, withKnobs } from "@storybook/addon-knobs";

import WalletCard from "./WalletCard.vue";

export default { title: "Wallet / Wallet Card", decorators: [withKnobs] };

export const Blank = () => ({
	components: { WalletCard },
	template: `
		<div class="p-5">
		        <div class="mb-5"></div>
			<WalletCard class="mr-4"></WalletCard>

		        <div class="mb-5"></div>
			<WalletCard class="mr-4"></WalletCard>
			<WalletCard class="mr-4"></WalletCard>
			<WalletCard class="mr-4"></WalletCard>
		</div>
	`,
});
