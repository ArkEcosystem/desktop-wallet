import { File } from "@arkecosystem/platform-sdk-ipfs";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { SignedTransactionData } from "@arkecosystem/platform-sdk/dist/contracts";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import { toasts } from "app/services";
import { httpClient } from "app/services";
import { TransactionDetail, TransactionFee } from "domains/transaction/components/TransactionDetail";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type SummaryStepProps = {
	transaction: SignedTransactionData;
	wallet: ReadWriteWallet;
};

export const SummaryStep = ({ transaction, wallet }: SummaryStepProps) => {
	const [ipfsData, setIpfsData] = useState<any>();
	const { t } = useTranslation();

	useEffect(() => {
		const fetchIpfs = async () => {
			try {
				const hash = transaction.data().asset.data.ipfsData;
				const ipfsData = await new File(httpClient).get(hash);
				setIpfsData(ipfsData);
			} catch (e) {
				toasts.error(`Unable to find ipfs data for transaction. Error [${String(e)}]`);
			}
		};

		fetchIpfs();
	}, [transaction]);

	const showMetaProperties = !!Object.keys(ipfsData?.meta || {}).length;

	return (
		<>
			{/* @TODO add TransactionType / TransactionEntityType component */}

			<TransactionDetail
				label={t("TRANSACTION.TRANSACTION_TYPE")}
				extra={
					<Circle className="border-black" size="lg">
						<Icon name="Business" width={20} height={20} />
					</Circle>
				}
			>
				{t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_ENTITY_REGISTRATION")}
			</TransactionDetail>

			{transaction.data()?.asset?.data?.name && (
				<TransactionDetail label={t("TRANSACTION.ENTITY.NAME")}>
					{transaction.data()?.asset?.data?.name}
				</TransactionDetail>
			)}

			<TransactionDetail label={t("TRANSACTION.IPFS_HASH")}>
				{transaction.data()?.asset?.data?.ipfsData}
			</TransactionDetail>

			{showMetaProperties && (
				<div data-testid="SummaryStep__ipfs-data">
					{ipfsData.meta.displayName && (
						<TransactionDetail label={t("TRANSACTION.DISPLAY_NAME")}>
							{ipfsData.meta.displayName}
						</TransactionDetail>
					)}

					{ipfsData.meta.description && (
						<TransactionDetail label={t("TRANSACTION.DESCRIPTION")}>
							{ipfsData.meta.description}
						</TransactionDetail>
					)}

					{ipfsData.meta.website && (
						<TransactionDetail label={t("TRANSACTION.WEBSITE")}>
							<Link to={ipfsData.meta.website} isExternal>
								{ipfsData.meta.website}
							</Link>
						</TransactionDetail>
					)}
				</div>
			)}

			<TransactionFee currency={wallet.currency()} value={transaction.fee()} paddingPosition="top" />
		</>
	);
};
