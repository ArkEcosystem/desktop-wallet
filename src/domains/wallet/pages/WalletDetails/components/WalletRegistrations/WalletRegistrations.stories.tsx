import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { WalletRegistrations } from "./WalletRegistrations";

export default {
	title: "Domains / Wallet / Components / WalletRegistrations",
	decorators: [(storyFn: any) => <WalletsDecorator count={1}>{storyFn}</WalletsDecorator>],
};

export const Default = ({ wallets }: { wallets: ReadWriteWallet[] }) => <WalletRegistrations wallet={wallets[0]} />;

export const Empty = ({ wallets }: { wallets: ReadWriteWallet[] }) => (
	<WalletRegistrations
		wallet={{
			...wallets[0],
			isDelegate: () => false,
			isMultiSignature: () => false,
			isSecondSignature: () => false,
		}}
	/>
);

export const Loading = ({ wallets }: { wallets: ReadWriteWallet[] }) => (
	<WalletRegistrations
		wallet={{
			...wallets[0],
			hasSyncedWithNetwork: () => false,
		}}
	/>
);
