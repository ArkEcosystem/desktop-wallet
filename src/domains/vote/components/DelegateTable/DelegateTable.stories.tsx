import { Coins } from "@arkecosystem/platform-sdk";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { DelegateTable } from "./DelegateTable";

export default {
	title: "Domains / Vote / Components / DelegateTable",
	decorators: [
		(storyFn: any) => (
			<WalletsDecorator count={1} withDelegates={true}>
				{storyFn}
			</WalletsDecorator>
		),
	],
};

export const Default = ({ delegates }: { delegates: Coins.WalletDataCollection }) => (
	<DelegateTable delegates={delegates.items().slice(0, 10)} />
);
