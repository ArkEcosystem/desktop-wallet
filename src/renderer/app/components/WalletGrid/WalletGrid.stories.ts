import { select, withKnobs } from "@storybook/addon-knobs";

import WalletGrid from "./WalletGrid.vue";

export default { title: "Wallets / Grid", decorators: [withKnobs] };

const wallets = [
	{
		options: [" Option 1", "Option 2", "Option 3"],
		data: {
			avatarId: "test",
			coinIcon: "₿",
			iconColor: "gray-200",
			walletName: "Satoshi",
			address: "Fa5eDSFDSF8DFaS3FJD",
			balance: "100,000,000",
			symbol: "BTC",
		},
	},
	{
		options: [" Option 1", "Option 2", "Option 3"],
		data: {
			avatarId: "test",
			coinIcon: "₿",
			iconColor: "yellow-200",
			walletName: "Satoshi",
			address: "Fa5eDSFDSF8DFaS3FJD",
			balance: "100,000,000",
			symbol: "BTC",
		},
	},
	{
		options: [" Option 1", "Option 2", "Option 3"],
		data: {
			avatarId: "test",
			coinIcon: "₿",
			iconColor: "yellow-200",
			walletName: "Satoshi",
			address: "Fa5eDSFDSF8DFaS3FJD",
			balance: "100,000,000",
			symbol: "BTC",
		},
	},
	{
		options: [" Option 1", "Option 2", "Option 3"],
		data: {
			avatarId: "test",
			coinIcon: "₿",
			iconColor: "yellow-200",
			walletName: "Satoshi",
			address: "Fa5eDSFDSF8DFaS3FJD",
			balance: "100,000,000",
			symbol: "BTC",
		},
	},
	{
		options: [" Option 1", "Option 2", "Option 3"],
		data: {
			avatarId: "test",
			coinIcon: "₿",
			iconColor: "yellow-200",
			walletName: "Satoshi",
			address: "Fa5eDSFDSF8DFaS3FJD",
			balance: "100,000,000",
			symbol: "BTC",
		},
	},
	{
		options: [" Option 1", "Option 2", "Option 3"],
		data: {
			avatarId: "test",
			coinIcon: "₿",
			iconColor: "yellow-200",
			walletName: "Satoshi",
			address: "Fa5eDSFDSF8DFaS3FJD",
			balance: "100,000,000",
			symbol: "BTC",
		},
	},
	{
		options: [" Option 1", "Option 2", "Option 3"],
		data: {
			avatarId: "test",
			coinIcon: "₿",
			iconColor: "yellow-200",
			walletName: "Satoshi",
			address: "Fa5eDSFDSF8DFaS3FJD",
			balance: "100,000,000",
			symbol: "BTC",
		},
	},
	{
		options: [" Option 1", "Option 2", "Option 3"],
		data: {
			avatarId: "test",
			coinIcon: "₿",
			iconColor: "yellow-200",
			walletName: "Satoshi",
			address: "Fa5eDSFDSF8DFaS3FJD",
			balance: "100,000,000",
			symbol: "BTC",
		},
	},
	{
		options: [" Option 1", "Option 2", "Option 3"],
		data: {
			avatarId: "test",
			coinIcon: "₿",
			iconColor: "yellow-200",
			walletName: "Satoshi",
			address: "Fa5eDSFDSF8DFaS3FJD",
			balance: "100,000,000",
			symbol: "BTC",
		},
	},
	{
		options: [" Option 1", "Option 2", "Option 3"],
		data: {
			avatarId: "test",
			coinIcon: "₿",
			iconColor: "yellow-200",
			walletName: "Satoshi",
			address: "Fa5eDSFDSF8DFaS3FJD",
			balance: "100,000,000",
			symbol: "BTC",
		},
	},
];

const blankWallets = [
	{
		isBlank: true,
	},
	{
		isBlank: true,
	},
	{
		isBlank: true,
	},
	{
		isBlank: true,
	}
];

const mixedWallets = [
	{
		options: [" Option 1", "Option 2", "Option 3"],
		data: {
			avatarId: "test",
			coinIcon: "₿",
			iconColor: "yellow-200",
			walletName: "Satoshi",
			address: "Fa5eDSFDSF8DFaS3FJD",
			balance: "100,000,000",
			symbol: "BTC",
		},
	},
	{
		options: [" Option 1", "Option 2", "Option 3"],
		data: {
			avatarId: "test",
			coinIcon: "₿",
			iconColor: "yellow-200",
			walletName: "Satoshi",
			address: "Fa5eDSFDSF8DFaS3FJD",
			balance: "100,000,000",
			symbol: "BTC",
		},
	},
	{
		isBlank: true,
	},
	{
		isBlank: true,
	},
];

export const Default = () => ({
	components: { WalletGrid },
	template: `
		<div class="p-5">
		   <div class="my-5">Empty list (1 row slider, no pagination)</div>
                  <WalletGrid :wallets="blankWallets"></WalletGrid>

		   <div class="my-5">Two wallets (1 row slider, no pagination)</div>
                  <WalletGrid :wallets="mixedWallets"></WalletGrid>

		   <div class="my-5">Full List (total {{ wallets.length }} wallets). 2 row slider, 2 pages</div>
                  <WalletGrid :wallets="wallets"></WalletGrid>
		</div>
	`,
	data() {
		return {
			wallets,
			blankWallets,
			mixedWallets,
		};
	},
});
