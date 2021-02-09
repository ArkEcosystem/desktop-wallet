import { ReadWriteWallet } from "@arkecosystem/platform-sdk-profiles";
import { Circle } from "app/components/Circle";
import { Icon } from "app/components/Icon";
import { TotalAmountBox } from "domains/transaction/components/TotalAmountBox";
import { TransactionDetail } from "domains/transaction/components/TransactionDetail";
import { evaluateFee } from "domains/transaction/utils";
import React from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

export const IpfsLedgerReview = ({ wallet }: { wallet: ReadWriteWallet }) => {
	const { getValues } = useFormContext();
	const { t } = useTranslation();

	const { fee, hash } = getValues();

	return (
		<>
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

			<div className="mt-2">
				<TotalAmountBox fee={evaluateFee(fee)} ticker={wallet.currency()} />
			</div>
		</>
	);
};
