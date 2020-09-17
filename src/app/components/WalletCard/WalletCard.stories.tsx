import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import React from "react";
import { WalletsDecorator } from "utils/storybook";

import { WalletCard } from "./WalletCard";

export default { title: "App / Components / WalletCard" };

export const Default = () => (
	<WalletsDecorator count={3}>
		{({ wallets }: { wallets: ReadWriteWallet[] }) => (
			<div className="">
				<div className="mb-10">
					<WalletCard
						wallet={wallets[0]}
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
						wallet={wallets[1]}
						actions={[
							{ label: "Action 1", value: "1" },
							{ label: "Action 1", value: "1" },
						]}
					/>
					<WalletCard
						wallet={wallets[2]}
						actions={[
							{ label: "Action 1", value: "1" },
							{ label: "Action 1", value: "1" },
						]}
					/>
				</div>
			</div>
		)}
	</WalletsDecorator>
);

export const Blank = () => (
	<div className="">
		<div className="mb-5">
			<WalletCard className="mr-4" />
		</div>
		<div className="mb-10">
			<WalletCard className="mr-4" />
			<WalletCard />
		</div>
	</div>
);
