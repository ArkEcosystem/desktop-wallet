import React from "react";
import { WalletCard } from "./WalletCard";

export default {
	title: "Components / Wallet Card",
};

export const Default = () => {
	return (
		<div className="">
			<div className="mb-10">
				<WalletCard
					coinIcon="Eth"
					coinIconClass="border-theme-neutral-800"
					avatarId="test"
					walletName="Primary"
					address="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
					balance="100,000 ETH"
					actions={[
						{ label: "Action 1", value: "1" },
						{ label: "Action 1", value: "1" },
					]}
					onSelect={(selected: any) => console.log(selected)}
				/>
			</div>
			<div className="mb-10">
				<WalletCard
					className="mr-5"
					coinIcon="Eth"
					coinIconClass="border-theme-neutral-800"
					avatarId="test"
					walletName="Secondary"
					address="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
					balance="100,000 ETH"
					actions={[
						{ label: "Action 1", value: "1" },
						{ label: "Action 1", value: "1" },
					]}
				/>
				<WalletCard
					coinIcon="Eth"
					coinIconClass="border-theme-neutral-800"
					avatarId="test"
					walletName="My wallet"
					address="ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
					balance="100,000 ETH"
					actions={[
						{ label: "Action 1", value: "1" },
						{ label: "Action 1", value: "1" },
					]}
				/>
			</div>
		</div>
	);
};

export const Blank = () => {
	return (
		<div className="">
			<div className="mb-5">
				<WalletCard isBlank={true} className="mr-4" />
			</div>
			<div className="mb-10">
				<WalletCard isBlank={true} className="mr-4" />
				<WalletCard isBlank={true} />
			</div>
		</div>
	);
};
