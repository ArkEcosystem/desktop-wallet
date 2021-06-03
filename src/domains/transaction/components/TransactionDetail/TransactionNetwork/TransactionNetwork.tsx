import { Networks } from "@arkecosystem/platform-sdk";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { getNetworkExtendedData } from "domains/network/helpers";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail, TransactionDetailProps } from "../TransactionDetail";

type TransactionNetworkProps = {
	network: Networks.Network;
} & TransactionDetailProps;

export const TransactionNetwork = ({ network, ...props }: TransactionNetworkProps) => {
	const { t } = useTranslation();

	const networkExtendedData = getNetworkExtendedData(network.id());

	return (
		<TransactionDetail
			label={t("TRANSACTION.CRYPTOASSET")}
			extra={<NetworkIcon size="lg" coin={network.coin()} network={network.id()} />}
			{...props}
		>
			{networkExtendedData?.displayName}
		</TransactionDetail>
	);
};

TransactionNetwork.defaultProps = {
	borderPosition: "top",
};
