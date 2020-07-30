import React from "react";

import { WalletCard } from "./WalletCard";

export default {
	title: "App / Components / WalletCard",
};

export const Default = () => (
	<div className="">
		<div className="mb-10">
			<WalletCard
				coinIcon="Ethereum"
				coinClass="border-theme-neutral-800"
				walletName="Primary"
				address="D61mfSggzbvQgTUe6JhYKH2doHaqJ3Dyib"
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
				coinIcon="Ethereum"
				coinClass="border-theme-neutral-800"
				walletName="Secondary"
				address="2ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT"
				balance="100,000 ETH"
				actions={[
					{ label: "Action 1", value: "1" },
					{ label: "Action 1", value: "1" },
				]}
			/>
			<WalletCard
				coinIcon="Ethereum"
				coinClass="border-theme-neutral-800"
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

export const Blank = () => (
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
