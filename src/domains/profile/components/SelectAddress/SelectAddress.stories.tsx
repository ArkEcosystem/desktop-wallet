import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { SelectAddress } from "./SelectAddress";

export default {
	title: "Domains / Profile / Components / SelectAddress",
	decorators: [
		(storyFn: any) => (
			<WalletsDecorator count={1} withDelegates={true}>
				{storyFn}
			</WalletsDecorator>
		),
	],
};

export const Default = ({ wallets }: { wallets: ReadWriteWallet[] }) => (
	<div className="space-y-8 max-w-lg">
		<div>
			<SelectAddress wallets={wallets} />
		</div>
		<div>
			<SelectAddress wallets={wallets} isInvalid />
		</div>
		<div>
			<SelectAddress wallets={wallets} disabled />
		</div>
		<div>
			<div className="mb-3">Selected address (verified)</div>
			<SelectAddress wallets={wallets} address={wallets[0].address()} isVerified />
		</div>
		<div>
			<div className="mb-3">Selected address (disabled)</div>
			<SelectAddress disabled wallets={wallets} address={wallets[0].address()} />
		</div>
	</div>
);
