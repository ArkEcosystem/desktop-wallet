import { File } from "@arkecosystem/platform-sdk-ipfs";
import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { SignedTransactionData } from "@arkecosystem/platform-sdk/dist/contracts";
import { Amount } from "app/components/Amount";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { Link } from "app/components/Link";
import { TransactionDetail } from "app/components/TransactionDetail";
import { toasts } from "app/services";
import { httpClient } from "app/services";
import { TransactionSuccessful } from "domains/transaction/components/TransactionSuccessful";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type SentStep = {
	transaction: SignedTransactionData;
	senderWallet: ReadWriteWallet;
};

export const SentStep = ({ transaction, senderWallet }: SentStep) => {
	const [ipfsData, setIpfsData] = useState<any>();
	const { t } = useTranslation();

	useEffect(() => {
		const fetchIpfs = async () => {
			try {
				const hash = transaction?.data().asset.data.ipfsData;
				const ipfsData = await new File(httpClient).get(hash);
				setIpfsData(ipfsData);
			} catch (e) {
				toasts.error(`Unable to find ipfs data for transaction. Error [${String(e)}]`);
			}
		};

		fetchIpfs();
	}, [transaction]);

	return (
		<TransactionSuccessful transaction={transaction} senderWallet={senderWallet}>
			<TransactionDetail
				label={t("TRANSACTION.TRANSACTION_TYPE")}
				extra={
					<Circle className="border-black" size="lg">
						<Icon name="Business" width={20} height={20} />
					</Circle>
				}
			>
				{t("TRANSACTION.TRANSACTION_TYPES.BUSINESS_REGISTRATION")}
			</TransactionDetail>

			{transaction.data()?.asset?.data?.name && (
				<TransactionDetail label={t("TRANSACTION.ENTITY.NAME")}>
					{transaction.data()?.asset?.data?.name}
				</TransactionDetail>
			)}

			{ipfsData && (
				<div data-testid="SentStep__ipfs-data">
					<TransactionDetail label={t("TRANSACTION.NAME")}>
						{ipfsData?.data?.meta?.displayName}
					</TransactionDetail>

					<TransactionDetail label={t("TRANSACTION.DESCRIPTION")}>
						{ipfsData?.data?.meta?.description}
					</TransactionDetail>

					<TransactionDetail label={t("TRANSACTION.WEBSITE")}>
						<Link to={ipfsData?.meta?.website} isExternal>
							{ipfsData?.data?.meta?.website}
						</Link>
					</TransactionDetail>
				</div>
			)}

			<TransactionDetail
				label={t("TRANSACTION.AMOUNT")}
				extra={
					<div className="ml-1 text-theme-danger">
						<Circle className="bg-theme-background border-theme-danger-light" size="lg">
							<Icon name="Sent" width={22} height={22} />
						</Circle>
					</div>
				}
			>
				<Amount ticker="ARK" value={transaction.fee()} />
			</TransactionDetail>
		</TransactionSuccessful>
	);
};
