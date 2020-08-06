import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";

import { WalletHeader } from "./WalletHeader";

export default { title: "Domains / Wallet / Components / WalletHeader" };

export const Default = () => (
	<WalletHeader
		name="ARK Wallet 2"
		publicKey="028fe98e42e159f2450a52371dfb23ae69a39fc5fee6545690b7f51bfcee933357"
		address="AdzbhuDTyhnfAqepZzVcVsgd1Ym6FgETuW"
		balance={BigNumber.make("43250908920000")}
		ticker="ARK"
		currencyBalance={BigNumber.make("789008.45")}
		exchangeCurrency="USD"
		onVerifyMessage={console.log}
		onSignMessage={console.log}
		onUpdateWalletName={console.log}
		onDeleteWallet={console.log}
		coin="ARK"
		network="mainnet"
		isLedger
		isMultisig
	/>
);
