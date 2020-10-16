import { Coins } from "@arkecosystem/platform-sdk";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail, TransactionDetailProps } from "../TransactionDetail";

type TransactionNetworkProps = {
	network: Coins.Network;
} & TransactionDetailProps;

export const TransactionNetwork = ({ network, ...props }: TransactionNetworkProps) => {
	const { t } = useTranslation();

	return (
		<TransactionDetail
			label={t("TRANSACTION.CRYPTOASSET")}
			extra={<NetworkIcon size="lg" coin={network.coin()} network={network.id()} />}
			{...props}
		>
			{network.name()}
		</TransactionDetail>
	);
};

TransactionNetwork.defaultProps = {
	borderPosition: "top",
};
