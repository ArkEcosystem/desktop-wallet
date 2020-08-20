import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { AddressList } from "./AddressList";

export default {
	title: "Domains / Vote / Components / AddressList",
	decorators: [(storyFn: any) => <WalletsDecorator count={1}>{storyFn}</WalletsDecorator>],
};

export const Default = ({ wallets }: { wallets: Wallet[] }) => <AddressList wallets={wallets} />;
