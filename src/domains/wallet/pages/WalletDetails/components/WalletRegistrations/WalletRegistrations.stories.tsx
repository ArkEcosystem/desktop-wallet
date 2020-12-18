import { Contracts } from "@arkecosystem/platform-sdk";
import { action } from "@storybook/addon-actions";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { WalletRegistrations } from "./WalletRegistrations";

export default { title: "Domains / Wallet / Components / WalletRegistrations" };

export const Default = () => (
	<WalletsDecorator count={1} withDelegate={true}>
		{({ delegate }: { delegate: Contracts.WalletData }) => (
			<WalletRegistrations onButtonClick={action("onButtonClick")} />
		)}
	</WalletsDecorator>
);

export const Empty = () => <WalletRegistrations onButtonClick={action("onButtonClick")} />;

export const Loading = () => <WalletRegistrations onButtonClick={action("onButtonClick")} />;
