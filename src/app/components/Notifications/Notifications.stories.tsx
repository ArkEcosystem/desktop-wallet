import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";

import { Notifications } from "./Notifications";

export default {
	title: "App / Components / Notifications",
};

export const Default = () => {
	const plugins = [
		{
			logoClassName: "w-8 h-8 p-2 mr-4 rounded-lg bg-logo",
			title: "ARK Explorer",
			description: "- update v2.5.6",
			action: {
				label: "Update now",
				value: "update",
			},
		},
	];

	const transactions = [
		{
			id: () => "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
			type: () => "transfer",
			timestamp: () => DateTime.fromUnix(1596213281),
			confirmations: () => BigNumber.make(10),
			votes: () => ["10"],
			unvotes: () => ["10"],
			sender: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			recipient: () => "ASuusXSW9kfWnicScSgUTjttP6T9GQ3kqT",
			recipients: () => [],
			amount: () => BigNumber.make(100).times(1e8),
			fee: () => BigNumber.make(21).times(1e8),
			memo: () => "Test",
			asset: () => ({ a: "b" }),
			isConfirmed: () => false,
			isSent: () => true,
			isReceived: () => false,
			isTransfer: () => true,
			isSecondSignature: () => false,
			isMultiSignature: () => false,
			isDelegateRegistration: () => false,
			isDelegateResignation: () => false,
			isVote: () => false,
			isUnvote: () => false,
			isIpfs: () => false,
			isMultiPayment: () => false,
			isBusinessRegistration: () => false,
			isBusinessResignation: () => false,
			isBusinessUpdate: () => false,
			isBridgechainRegistration: () => false,
			isBridgechainResignation: () => false,
			isBridgechainUpdate: () => false,
			isEntityRegistration: () => false,
			isEntityResignation: () => false,
			isEntityUpdate: () => false,
			isHtlcLock: () => false,
			isHtlcClaim: () => false,
			isHtlcRefund: () => false,
			toObject: () => ({ a: "b" }),
			hasPassed: () => true,
			hasFailed: () => false,
			getMeta: () => "",
			setMeta: () => "",
		},
	];

	return (
		<div>
			<Notifications
				pluginsHeader="Plugin 17 Feb, 2020"
				plugins={plugins}
				transactionsHeader="Transactions 17 Feb, 2020"
				transactions={transactions}
				onAction={console.log}
			/>
		</div>
	);
};

export const Empty = () => (
	<Notifications
		pluginsHeader="Plugin 17 Feb, 2020"
		transactionsHeader="Transactions 17 Feb, 2020"
		onAction={console.log}
	/>
);
