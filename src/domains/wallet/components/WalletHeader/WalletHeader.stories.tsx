import React from "react";

import { WalletHeader } from "./WalletHeader";

export default { title: "Domains / Wallet / Components / WalletHeader" };

export const Default = () => (
	<WalletHeader
		name="ARK Wallet 2"
		publicKey="028fe98e42e159f2450a52371dfb23ae69a39fc5fee6545690b7f51bfcee933357"
		address="AdzbhuDTyhnfAqepZzVcVsgd1Ym6FgETuW"
		balance="432,509.0892 ARK"
		currencyBalance="789,008.45 USD"
		onVerifyMessage={console.log}
		onSignMessage={console.log}
		onUpdateWalletName={console.log}
		onDeleteWallet={console.log}
		coin="Ark"
		network="Mainnet"
		isLedger
		isMultisig
	/>
);
