import { wallets } from "domains/wallet/data";
import React from "react";

import { SelectAddress } from "./SelectAddress";

export default { title: "Domains / Profile / Components / SelectAddress" };

export const Default = () => (
	<div className="max-w-lg space-y-8">
		<div>
			<SelectAddress wallets={wallets} />
		</div>
		<div>
			<SelectAddress wallets={wallets} isInvalid />
		</div>
		<div>
			<SelectAddress wallets={wallets} disabled />
		</div>
		<div>
			<div className="mb-3">Selected address (verified)</div>
			<SelectAddress wallets={wallets} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" isVerified />
		</div>
		<div>
			<div className="mb-3">Selected address (disabled)</div>
			<SelectAddress disabled wallets={wallets} address="bP6T9GQ3kqP6T9GQ3kqP6T9GQ3kqTTTP6T9GQ3kqT" />
		</div>
	</div>
);
