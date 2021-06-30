import { Networks } from "@arkecosystem/platform-sdk";
import { NetworkIcon } from "domains/network/components/NetworkIcon";
import { getNetworkExtendedData } from "domains/network/helpers";
import React from "react";
import { useTranslation } from "react-i18next";

import { TransactionDetail, TransactionDetailProperties } from "../TransactionDetail";

type TransactionNetworkProperties = {
	network: Networks.Network;
} & TransactionDetailProperties;

export const TransactionNetwork = ({ network, ...properties }: TransactionNetworkProperties) => {
	const { t } = useTranslation();

	const networkExtendedData = getNetworkExtendedData(network.id());

	return (
		<TransactionDetail
			data-testid="TransactionNetwork"
			label={t("TRANSACTION.CRYPTOASSET")}
			extra={<NetworkIcon size="lg" coin={network.coin()} network={network.id()} />}
			{...properties}
		>
			{networkExtendedData?.displayName}
		</TransactionDetail>
	);
};

TransactionNetwork.defaultProps = {
	borderPosition: "top",
};
