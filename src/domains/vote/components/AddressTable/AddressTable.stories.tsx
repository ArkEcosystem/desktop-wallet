import { Wallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { AddressTable } from "./AddressTable";

export default {
	title: "Domains / Vote / Components / AddressTable",
	decorators: [(storyFn: any) => <WalletsDecorator count={1}>{storyFn}</WalletsDecorator>],
};

export const Default = ({ wallets }: { wallets: Wallet[] }) => <AddressTable wallets={wallets} />;
