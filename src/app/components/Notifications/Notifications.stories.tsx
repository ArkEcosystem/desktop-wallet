import { DateTime } from "@arkecosystem/platform-sdk-intl";
import { Profile } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import React from "react";

import { Notifications } from "./Notifications";

export default {
	title: "App / Components / Notifications",
};

export const Default = () => {
	const transactions = [
		{
			id: () => "ee4175091d9f4dacf5fed213711c3e0e4cc371e37afa7bce0429d09bcf3ecefe",
			blockId: () => "71fd1a494ded5430586f4dd1c79c3ac77bf38120e868c8f8980972b8075d67e9",
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
			isHtlcLock: () => false,
			isHtlcClaim: () => false,
			isHtlcRefund: () => false,
			isEntityRegistration: () => false,
			isEntityResignation: () => false,
			isEntityUpdate: () => false,
			isBusinessEntityRegistration: () => false,
			isBusinessEntityResignation: () => false,
			isBusinessEntityUpdate: () => false,
			isProductEntityRegistration: () => false,
			isProductEntityResignation: () => false,
			isProductEntityUpdate: () => false,
			isPluginEntityRegistration: () => false,
			isPluginEntityResignation: () => false,
			isPluginEntityUpdate: () => false,
			isDelegateEntityRegistration: () => false,
			isDelegateEntityResignation: () => false,
			isDelegateEntityUpdate: () => false,
			isLegacyBusinessRegistration: () => false,
			isLegacyBusinessResignation: () => false,
			isLegacyBusinessUpdate: () => false,
			isLegacyBridgechainRegistration: () => false,
			isLegacyBridgechainResignation: () => false,
			isLegacyBridgechainUpdate: () => false,
			toObject: () => ({ a: "b" }),
			hasPassed: () => true,
			hasFailed: () => false,
			getMeta: () => "",
			setMeta: () => "",
			explorerLink: () => "",
			total: () => BigNumber.make(121).times(1e8),
			convertedTotal: () => BigNumber.ZERO,
			wallet: () => undefined,
			coin: () => undefined,
			data: () => undefined,
		},
	];

	return (
		<div>
			<Notifications
				// @ts-ignore
				transactions={transactions}
				onNotificationAction={console.log}
			/>
		</div>
	);
};

export const Empty = () => <Notifications onNotificationAction={console.log} profile={{} as Profile} />;
