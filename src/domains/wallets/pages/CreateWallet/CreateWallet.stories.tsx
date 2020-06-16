import { action } from "@storybook/addon-actions";
import React from "react";

import { CreateWallet } from "./CreateWallet";

export default { title: "Wallets / Pages / Create Wallet" };

const mnemonic = [
	"lorem",
	"ipsum",
	"dolor",
	"sit",
	"amet",
	"consectetur",
	"adipisicing",
	"elit",
	"nihil",
	"nisi",
	"natus",
	"adipisci",
];

const networks = [
	{ name: "ARK", icon: "Ark" },
	{ name: "Ethereum", icon: "Eth" },
	{ name: "Bitcoin", icon: "Btc" },
];

export const Default = () => (
	<div className="mt-15">
		<CreateWallet
			mnemonic={mnemonic}
			networks={networks}
			onCopy={action("onCopy")}
			onDownload={action("onDownload")}
			onSubmit={action("onSubmit")}
		/>
	</div>
);
