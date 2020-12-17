import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { Wallets } from "./Wallets";

export default {
	title: "Domains / Dashboard / Components / Wallets",
	decorators: [(storyFn: any) => <WalletsDecorator count={1}>{storyFn}</WalletsDecorator>],
};

export const Default = ({ wallets }: { wallets: ReadWriteWallet[] }) => (
	<div className="px-40">
		<Wallets title="Wallets" wallets={wallets} />
	</div>
);
