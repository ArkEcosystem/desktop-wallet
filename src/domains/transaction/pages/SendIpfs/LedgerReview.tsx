import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { BigNumber } from "@arkecosystem/platform-sdk-support";
import { Circle } from "app/components/Circle";
import { Divider } from "app/components/Divider";
import { Icon } from "app/components/Icon";
import { TransactionDetail, TransactionFee } from "domains/transaction/components/TransactionDetail";
import React from "react";
import { useTranslation } from "react-i18next";

export const IpfsLedgerReview = ({ fee, hash, wallet }: { fee: BigNumber; hash: string; wallet: ReadWriteWallet }) => {
	const { t } = useTranslation();

	return (
		<>
			<Divider />
			<div className="flex flex-col space-y-2">
				<h2 className="text-2xl font-bold">{t("TRANSACTION.TRANSACTION_DETAILS")}</h2>

				<TransactionFee currency={wallet.currency()} value={BigNumber.make(fee)} borderPosition="bottom" />

				<TransactionDetail
					label={t("TRANSACTION.IPFS_HASH")}
					extra={
						<Circle className="border-theme-text" size="lg">
							<Icon name="Ipfs" width={21} height={23} />
						</Circle>
					}
					border={false}
				>
					<span className="break-all">{hash}</span>
				</TransactionDetail>
			</div>
		</>
	);
};
