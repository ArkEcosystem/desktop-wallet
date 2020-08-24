import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { action } from "@storybook/addon-actions";
import { boolean, withKnobs } from "@storybook/addon-knobs";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { SearchAddress } from "./SearchAddress";

export default {
	title: "Domains / Profile / Components / SearchAddress",
	decorators: [
		withKnobs,
		(storyFn: any) => (
			<WalletsDecorator count={1} withDelegates={true}>
				{storyFn}
			</WalletsDecorator>
		),
	],
};

export const Default = ({ wallets }: { wallets: ReadWriteWallet[] }) => (
	<div>
		<SearchAddress
			isOpen={boolean("isOpen", true)}
			wallets={wallets}
			onClose={action("onClose")}
			onAction={console.log}
		/>
	</div>
);
