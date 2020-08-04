import { Contracts } from "@arkecosystem/platform-sdk";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { WalletRegistrations } from "./WalletRegistrations";

export default { title: "Domains / Wallet / Components / WalletRegistrations" };

export const Default = () => (
	<WalletsDecorator count={1} withDelegate={true}>
		{({ delegate }: { delegate: Contracts.WalletData }) => (
			<WalletRegistrations
				address="abc"
				delegate={delegate}
				business={{ name: "ROBank Eco" }}
				hasSecondSignature
				hasBridgechains
				hasPlugins
				isMultisig
			/>
		)}
	</WalletsDecorator>
);

export const Empty = () => <WalletRegistrations address="abc" />;
