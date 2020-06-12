import React from "react";
import { Slider } from "./Slider";
import { WalletCard } from "app/components/WalletCard";

export default {
	title: "Components / Slider",
};

export const Default = () => {
	const data = [
		{
			coinIcon: "Btc",
			coinClass: "text-theme-warning-400 border-theme-warning-200",
			avatarId: "test",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			walletName: "My Wallet",
			balance: "100 BTC",
			actions: [
				{
					label: "Action 1",
					value: "1",
				},
				{
					label: "Action 2",
					value: "2",
				},
				{
					label: "Action 3",
					value: "3",
				},
			],
		},
		{
			coinIcon: "Btc",
			coinClass: "text-theme-warning-400 border-theme-warning-200",
			avatarId: "test",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			walletName: "My Wallet",
			balance: "100 BTC",
			actions: [
				{
					label: "Action 1",
					value: "1",
				},
				{
					label: "Action 2",
					value: "2",
				},
				{
					label: "Action 3",
					value: "3",
				},
			],
		},
		{
			coinIcon: "Btc",
			coinClass: "text-theme-warning-400 border-theme-warning-200",
			avatarId: "test",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			walletName: "My Wallet",
			balance: "100 BTC",
			actions: [
				{
					label: "Action 1",
					value: "1",
				},
				{
					label: "Action 2",
					value: "2",
				},
				{
					label: "Action 3",
					value: "3",
				},
			],
		},
		{
			coinIcon: "Btc",
			coinClass: "text-theme-warning-400 border-theme-warning-200",
			avatarId: "test",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			walletName: "My Wallet",
			balance: "100 BTC",
			actions: [
				{
					label: "Action 1",
					value: "1",
				},
				{
					label: "Action 2",
					value: "2",
				},
				{
					label: "Action 3",
					value: "3",
				},
			],
		},
		{
			coinIcon: "Btc",
			coinClass: "text-theme-warning-400 border-theme-warning-200",
			avatarId: "test",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			walletName: "My Wallet",
			balance: "100 BTC",
			actions: [
				{
					label: "Action 1",
					value: "1",
				},
				{
					label: "Action 2",
					value: "2",
				},
				{
					label: "Action 3",
					value: "3",
				},
			],
		},
		{
			coinIcon: "Btc",
			coinClass: "text-theme-warning-400 border-theme-warning-200",
			avatarId: "test",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			walletName: "My Wallet",
			balance: "100 BTC",
			actions: [
				{
					label: "Action 1",
					value: "1",
				},
				{
					label: "Action 2",
					value: "2",
				},
				{
					label: "Action 3",
					value: "3",
				},
			],
		},
		{
			coinIcon: "Btc",
			coinClass: "text-theme-warning-400 border-theme-warning-200",
			avatarId: "test",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			walletName: "My Wallet",
			balance: "100 BTC",
			actions: [
				{
					label: "Action 1",
					value: "1",
				},
				{
					label: "Action 2",
					value: "2",
				},
				{
					label: "Action 3",
					value: "3",
				},
			],
		},
		{
			coinIcon: "Btc",
			coinClass: "text-theme-warning-400 border-theme-warning-200",
			avatarId: "test",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			walletName: "My Wallet",
			balance: "100 BTC",
			actions: [
				{
					label: "Action 1",
					value: "1",
				},
				{
					label: "Action 2",
					value: "2",
				},
				{
					label: "Action 3",
					value: "3",
				},
			],
		},
		{
			coinIcon: "Btc",
			coinClass: "text-theme-warning-400 border-theme-warning-200",
			avatarId: "test",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			walletName: "My Wallet",
			balance: "100 BTC",
			actions: [
				{
					label: "Action 1",
					value: "1",
				},
				{
					label: "Action 2",
					value: "2",
				},
				{
					label: "Action 3",
					value: "3",
				},
			],
		},
		{
			coinIcon: "Btc",
			coinClass: "text-theme-warning-400 border-theme-warning-200",
			avatarId: "test",
			address: "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			walletName: "My Wallet",
			balance: "100 BTC",
			actions: [
				{
					label: "Action 1",
					value: "1",
				},
				{
					label: "Action 2",
					value: "2",
				},
				{
					label: "Action 3",
					value: "3",
				},
			],
		},
	];

	return (
		<div>
			<div>
				<Slider data={data}>
					{(walletData: any) => (
						<WalletCard {...walletData} onSelect={(selected: any) => console.log(selected)} />
					)}
				</Slider>
			</div>
		</div>
	);
};
