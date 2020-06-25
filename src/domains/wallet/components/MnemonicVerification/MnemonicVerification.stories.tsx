import React from "react";

import { MnemonicVerification } from "./MnemonicVerification";

export default { title: "Wallets / Components / MnemonicVerification" };

export const Default = () => (
	<div className="max-w-lg">
		<MnemonicVerification
			handleComplete={() => console.log(true)}
			mnemonic={["ark", "btc", "usd", "bnb", "eth", "ltc", "etc", "lsk", "trx", "dash", "xtz", "eur"]}
			wordPositions={[3, 6, 9]}
			optionsLimit={6}
		/>
	</div>
);
