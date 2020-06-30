import React from "react";

import { WalletRegistrations } from "./WalletRegistrations";

export default { title: "Domains / Wallet / Components / WalletRegistrations" };

export const Default = () => (
	<WalletRegistrations
		address="abc"
		delegate={{ username: "ROBank" }}
		business={{ name: "ROBank Eco" }}
		hasSecondSignature
		hasBridgechains
		hasPlugins
		isMultisig
	/>
);

export const Empty = () => <WalletRegistrations address="abc" />;
